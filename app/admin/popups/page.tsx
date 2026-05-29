import { AdminShell } from '@/components/admin/AdminShell';
import { PopupsPageClient } from '@/components/admin/PopupsPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listPopups } from '@/lib/api/admin/popups';

export default async function AdminPopupsPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const popups = await listPopups(50);

  return (
    <AdminShell user={user}>
      <PopupsPageClient popups={popups.data} />
    </AdminShell>
  );
}
