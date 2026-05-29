import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { signAdminSession, verifyPayloadPassword } from '@/lib/admin-session';

export const runtime = 'nodejs';

type LoginBody = {
  email?: string;
  password?: string;
};

async function findSupabaseUser(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('id,name,email,role,salt,hash')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Admin Supabase login query failed:', error);
    return null;
  }

  return data as null | {
    email?: string;
    hash?: string;
    id?: string | number;
    name?: string;
    role?: string;
    salt?: string;
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LoginBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? '';

  if (!email || !password) {
    return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
  }

  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envEmail && envPassword && email === envEmail && password === envPassword) {
    const token = signAdminSession({ email, name: 'Admin' });
    const response = NextResponse.json({ ok: true, user: { email, name: 'Admin' } });

    response.cookies.set('users-token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  }

  const user = await findSupabaseUser(email);

  if (!user?.salt || !user.hash || !verifyPayloadPassword(password, user.salt, user.hash)) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  const token = signAdminSession({ email: user.email ?? email, id: user.id, name: user.name ?? 'Admin' });
  const response = NextResponse.json({ ok: true, user: { email: user.email, id: user.id, name: user.name } });

  response.cookies.set('users-token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
