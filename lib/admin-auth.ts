import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const getServerUrl = () => process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

export async function getAdminUser(cookieHeader: string) {
  const res = await fetch(`${getServerUrl()}/api/users/me`, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user ?? null;
}

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('payload-token') ?? cookieStore.get('users-token');

  if (!token) {
    redirect('/admin/login');
  }

  return token;
}

export async function getAdminCookieHeader() {
  const headerStore = await headers();
  return headerStore.get('cookie') ?? '';
}
