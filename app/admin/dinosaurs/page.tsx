import { AdminShell } from '@/components/admin/AdminShell';
import { GameCollectionPageClient } from '@/components/admin/GameCollectionPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listDinosaurs } from '@/lib/api/admin/dinosaurs';

export default async function AdminDinosaursPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const result = await listDinosaurs(50);

  return (
    <AdminShell user={user}>
      <GameCollectionPageClient
        collectionSlug="dinosaurs"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'rarity', label: 'Rarity' },
          { key: 'stats.hp', label: 'HP' },
          { key: 'status', label: 'Status' },
        ]}
        docs={result.data}
        title="Dinosaurs"
      />
    </AdminShell>
  );
}
