import { AdminShell } from '@/components/admin/AdminShell';
import { EventEditor } from '@/components/admin/EventEditor';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';

export default async function AdminNewEventPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);

  return <AdminShell user={user}><h1 style={{ fontSize: 34, margin: '0 0 22px' }}>New Event</h1><EventEditor /></AdminShell>;
}
