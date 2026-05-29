import { AdminShell } from '@/components/admin/AdminShell';
import { AuditLogsPageClient } from '@/components/admin/AuditLogsPageClient';
import { adminFetch, emptyList, type PayloadList } from '@/lib/admin-api';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';

export default async function AdminAuditLogsPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const logs = await adminFetch<PayloadList<any>>('/api/audit-logs?limit=50&sort=-timestamp&depth=1', emptyList());

  return <AdminShell user={user}><AuditLogsPageClient logs={logs.docs} /></AdminShell>;
}
