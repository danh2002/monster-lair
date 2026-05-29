import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_COOKIE_NAMES = ['payload-token', 'users-token'];

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return AUTH_COOKIE_NAMES.some((name) => Boolean(cookieStore.get(name)?.value));
}

export async function requireAdminAuth() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }
}
