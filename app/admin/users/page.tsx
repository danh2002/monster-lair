import { AdminShell } from '@/components/admin/AdminShell';
import { UsersPageClient } from '@/components/admin/UsersPageClient';
import { adminFetch, emptyList, type PayloadList } from '@/lib/admin-api';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';

export default async function AdminUsersPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const users = await adminFetch<PayloadList<any>>('/api/users?limit=50', emptyList());

  return <AdminShell user={user}><UsersPageClient users={users.docs} /></AdminShell>;
}
