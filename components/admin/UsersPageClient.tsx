'use client';

import { useState } from 'react';
import { AdminButton } from './AdminButton';
import { Modal } from './Modal';
import { Select } from './Select';
import { adminTheme } from '@/styles/adminTheme';

const roleColors: Record<string, string> = {
  admin: adminTheme.accent,
  author: adminTheme.accentGreen,
  editor: adminTheme.accentBlue,
  seo_manager: adminTheme.accentOrange,
};

export function UsersPageClient({ users }: { users: Array<Record<string, any>> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Users</h1>
        <AdminButton onClick={() => setOpen(true)} variant="primary">New User</AdminButton>
      </div>
      <table style={tableStyle}>
        <tbody>
          {users.map((user) => {
            const role = user.role ?? 'author';
            return (
              <tr key={user.id}>
                <td style={cell}><Avatar>{(user.name || user.email || 'U').charAt(0).toUpperCase()}</Avatar></td>
                <td style={cell}>{user.name ?? 'Unnamed'}</td>
                <td style={cell}>{user.email}</td>
                <td style={cell}><Badge color={roleColors[role] ?? adminTheme.textMuted}>{role}</Badge></td>
                <td style={cell}><Badge color={adminTheme.accentGreen}>active</Badge></td>
                <td style={cell}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
                <td style={cell}><AdminButton>Edit</AdminButton> <AdminButton variant="danger">Delete</AdminButton></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {open ? (
        <Modal onClose={() => setOpen(false)} title="New User">
          <form action="/api/users" method="post" style={{ display: 'grid', gap: 12, padding: 18 }}>
            <input name="email" placeholder="Email" style={fieldStyle} />
            <input name="password" placeholder="Password" style={fieldStyle} type="password" />
            <input name="name" placeholder="Display Name" style={fieldStyle} />
            <Select><option>admin</option><option>editor</option><option>author</option><option>seo_manager</option></Select>
            <AdminButton variant="primary">Create User</AdminButton>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

function Avatar({ children }: { children: string }) {
  return <span style={{ background: adminTheme.accent, borderRadius: '50%', display: 'grid', height: 36, placeItems: 'center', width: 36 }}>{children}</span>;
}

function Badge({ children, color }: { children: string; color: string }) {
  return <span style={{ background: `${color}22`, border: `1px solid ${color}55`, borderRadius: 999, color, fontSize: 12, fontWeight: 800, padding: '5px 9px' }}>{children}</span>;
}

const tableStyle = { background: adminTheme.card, borderCollapse: 'collapse' as const, borderRadius: 12, overflow: 'hidden', width: '100%' };
const cell = { borderBottom: `1px solid ${adminTheme.border}`, padding: 14 };
const fieldStyle = { background: '#0f0f13', border: `1px solid ${adminTheme.border}`, borderRadius: 8, color: '#fff', minHeight: 42, padding: '0 12px' };
