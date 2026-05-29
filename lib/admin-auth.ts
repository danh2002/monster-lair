import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from './admin-session';

const getServerUrl = () => process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

export async function getAdminUser(cookieHeader: string) {
  const usersToken = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('users-token='))
    ?.split('=')[1];
  const session = verifyAdminSession(usersToken ? decodeURIComponent(usersToken) : null);

  if (session) {
    return {
      email: session.email,
      id: session.id,
      name: session.name ?? session.email ?? 'Admin',
    };
  }

  const res = await fetch(`${getServerUrl()}/api/users/me`, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  }).catch(() => null);

  if (!res?.ok) return null;

  const data = await res.json();
  return data.user ?? null;
}

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const payloadToken = cookieStore.get('payload-token');
  const usersToken = cookieStore.get('users-token');
  const session = verifyAdminSession(usersToken?.value);

  if (!payloadToken && !session) {
    redirect('/admin/login');
  }

  return payloadToken ?? usersToken;
}

export async function getAdminCookieHeader() {
  const headerStore = await headers();
  return headerStore.get('cookie') ?? '';
}
