import { AdminShell } from '@/components/admin/AdminShell';
import { PostEditor } from '@/components/admin/PostEditor';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';

export default async function AdminNewPostPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);

  return (
    <AdminShell user={user}>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>New Post</h1>
      <PostEditor />
    </AdminShell>
  );
}
