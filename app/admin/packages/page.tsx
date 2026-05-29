import { AdminShell } from '@/components/admin/AdminShell';
import { GameCollectionPageClient } from '@/components/admin/GameCollectionPageClient';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listPackages } from '@/lib/api/admin/packages';

export default async function AdminPackagesPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const result = await listPackages(50);

  return (
    <AdminShell user={user}>
      <GameCollectionPageClient
        collectionSlug="packages"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'price', label: 'Price' },
          { key: 'currency', label: 'Currency' },
          { key: 'popular', label: 'Popular' },
          { key: 'active', label: 'Active' },
        ]}
        docs={result.data}
        title="Packages"
      />
    </AdminShell>
  );
}
