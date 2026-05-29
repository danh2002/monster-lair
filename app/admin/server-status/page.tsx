import { AdminShell } from '@/components/admin/AdminShell';
import { GameCollectionPageClient } from '@/components/admin/GameCollectionPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listServerStatus } from '@/lib/api/admin/server-status';

export default async function AdminServerStatusPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const result = await listServerStatus(20);

  return (
    <AdminShell user={user}>
      <GameCollectionPageClient
        collectionSlug="server-status"
        columns={[
          { key: 'status', label: 'Status' },
          { key: 'message', label: 'Message' },
          { key: 'maintenanceStart', label: 'Start' },
          { key: 'maintenanceEnd', label: 'End' },
          { key: 'affectedServers', label: 'Affected Servers' },
        ]}
        docs={result.data}
        title="Server Status"
      />
    </AdminShell>
  );
}
