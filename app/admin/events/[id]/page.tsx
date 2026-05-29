import { AdminShell } from '@/components/admin/AdminShell';
import { EventEditor } from '@/components/admin/EventEditor';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { getEventById } from '@/lib/api/admin/events';

export default async function AdminEditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const event = await getEventById(id);

  return <AdminShell user={user}><h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Edit Event</h1><EventEditor event={event.data ?? {}} /></AdminShell>;
}
