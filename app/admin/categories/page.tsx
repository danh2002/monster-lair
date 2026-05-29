import { AdminButton } from '@/components/admin/AdminButton';
import { AdminShell } from '@/components/admin/AdminShell';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listCategories } from '@/lib/api/admin/categories';

const cell = { borderBottom: '1px solid rgba(255,255,255,0.05)', padding: 14 };

export default async function AdminCategoriesPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);
  const categories = await listCategories(50);

  return (
    <AdminShell user={user}>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Categories</h1>
      <table style={{ background: '#1a1a24', borderCollapse: 'collapse', borderRadius: 12, overflow: 'hidden', width: '100%' }}>
        <tbody>{categories.data.map((item) => <tr key={item.id}><td style={cell}>{item.name}</td><td style={cell}>{item.slug}</td><td style={cell}>{item.type}</td><td style={cell}><AdminButton>Edit</AdminButton></td></tr>)}</tbody>
      </table>
    </AdminShell>
  );
}
