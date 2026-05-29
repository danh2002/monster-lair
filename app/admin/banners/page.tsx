import { AdminShell } from '@/components/admin/AdminShell';
import { BannersPageClient } from '@/components/admin/BannersPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listBanners } from '@/lib/api/admin/banners';

export default async function AdminBannersPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const banners = await listBanners(50);

  return (
    <AdminShell user={user}>
      <BannersPageClient banners={banners.data} />
    </AdminShell>
  );
}
