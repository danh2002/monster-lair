import { AdminShell } from '@/components/admin/AdminShell';
import { PostsPageClient } from '@/components/admin/PostsPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listPosts } from '@/lib/api/admin/posts';

export default async function AdminPostsPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const posts = await listPosts(25);
  console.log('Post IDs:', posts.data.map((post) => ({ id: post.id, type: typeof post.id })));

  return (
    <AdminShell user={user}>
      <PostsPageClient posts={posts.data} />
    </AdminShell>
  );
}
