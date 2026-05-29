import { AdminShell } from '@/components/admin/AdminShell';
import { PostEditor } from '@/components/admin/PostEditor';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { getPostById } from '@/lib/api/admin/posts';

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const post = await getPostById(id);

  return (
    <AdminShell user={user}>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Edit Post</h1>
      <PostEditor post={post.data ?? {}} />
    </AdminShell>
  );
}
