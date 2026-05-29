import { AdminShell } from '@/components/admin/AdminShell';
import { PageEditor } from '@/components/admin/PageEditor';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { getPageById, listPages } from '@/lib/api/admin/pages';

export default async function AdminEditPagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const [page, pages] = await Promise.all([
    getPageById(id),
    listPages(100),
  ]);

  return (
    <AdminShell user={user}>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Edit Page</h1>
      <PageEditor page={page.data ?? {}} pages={pages.data} />
    </AdminShell>
  );
}
