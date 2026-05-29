import { AdminShell } from '@/components/admin/AdminShell';
import { PagesPageClient } from '@/components/admin/PagesPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listPages } from '@/lib/api/admin/pages';

export default async function AdminPagesPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const pages = await listPages(100);

  return (
    <AdminShell user={user}>
      <PagesPageClient pages={pages.data} />
    </AdminShell>
  );
}
