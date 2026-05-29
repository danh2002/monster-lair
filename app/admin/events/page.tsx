import { AdminShell } from '@/components/admin/AdminShell';
import { EventsPageClient } from '@/components/admin/EventsPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listEvents } from '@/lib/api/admin/events';

export default async function AdminEventsPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const events = await listEvents(25);

  return (
    <AdminShell user={user}>
      <EventsPageClient events={events.data} />
    </AdminShell>
  );
}
