import { AdminShell } from '@/components/admin/AdminShell';
import { CommentsPageClient } from '@/components/admin/CommentsPageClient';
import { adminFetch, emptyList, type PayloadList } from '@/lib/admin-api';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';

export default async function AdminCommentsPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const comments = await adminFetch<PayloadList<any>>('/api/comments?limit=100&depth=1&sort=-createdAt', emptyList());

  return (
    <AdminShell user={user}>
      <CommentsPageClient comments={comments.docs} />
    </AdminShell>
  );
}
