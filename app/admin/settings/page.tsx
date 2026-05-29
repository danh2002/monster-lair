import { AdminShell } from '@/components/admin/AdminShell';
import { SettingsPageClient } from '@/components/admin/SettingsPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listSiteSettings } from '@/lib/api/admin/site-settings';

export default async function AdminSettingsPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const settings = await listSiteSettings(1);

  return <AdminShell user={user}><SettingsPageClient settings={settings.data[0] ?? {}} /></AdminShell>;
}
