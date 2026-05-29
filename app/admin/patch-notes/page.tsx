import { AdminShell } from '@/components/admin/AdminShell';
import { GameCollectionPageClient } from '@/components/admin/GameCollectionPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listPatchNotes } from '@/lib/api/admin/patch-notes';

export default async function AdminPatchNotesPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const result = await listPatchNotes(50);

  return (
    <AdminShell user={user}>
      <GameCollectionPageClient
        collectionSlug="patch-notes"
        columns={[
          { key: 'version', label: 'Version' },
          { key: 'title', label: 'Title' },
          { key: 'gameMode', label: 'Game Mode' },
          { key: 'publishedAt', label: 'Published' },
          { key: 'status', label: 'Status' },
        ]}
        docs={result.data}
        title="Patch Notes"
      />
    </AdminShell>
  );
}
