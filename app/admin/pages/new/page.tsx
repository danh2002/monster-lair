import { AdminShell } from '@/components/admin/AdminShell';
import { PageEditor } from '@/components/admin/PageEditor';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listPages } from '@/lib/api/admin/pages';

export default async function AdminNewPagePage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const pages = await listPages(100);

  return (
    <AdminShell user={user}>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>New Page</h1>
      <PageEditor pages={pages.data} />
    </AdminShell>
  );
}
