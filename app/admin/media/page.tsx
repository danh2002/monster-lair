import { AdminShell } from '@/components/admin/AdminShell';
import { MediaPageClient } from '@/components/admin/MediaPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listMedia } from '@/lib/api/admin/media';

export default async function AdminMediaPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const media = await listMedia(60);

  return <AdminShell user={user}><MediaPageClient items={media.data} /></AdminShell>;
}
