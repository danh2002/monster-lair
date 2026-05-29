'use client';

import { useMemo, useState } from 'react';
import { SearchInput } from './SearchInput';
import { Select } from './Select';
import { adminTheme } from '@/styles/adminTheme';

const colors: Record<string, string> = {
  created: adminTheme.accentGreen,
  deleted: adminTheme.accentRed,
  published: adminTheme.accent,
  updated: adminTheme.accentBlue,
  uploaded: adminTheme.accentOrange,
};

export function AuditLogsPageClient({ logs }: { logs: Array<Record<string, any>> }) {
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('all');
  const [collection, setCollection] = useState('all');
  const filtered = useMemo(
    () =>
      logs.filter((log) => {
        const text = `${log.documentTitle ?? ''} ${log.performedBy?.email ?? ''}`.toLowerCase();
        return (action === 'all' || log.action === action) && (collection === 'all' || log.collection === collection) && text.includes(query.toLowerCase());
      }),
    [action, collection, logs, query],
  );

  return (
    <>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Audit Logs</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <SearchInput onChange={(event) => setQuery(event.target.value)} placeholder="Search user or document..." value={query} />
        <Select onChange={(event) => setAction(event.target.value)} value={action}><option value="all">All actions</option><option value="created">Created</option><option value="updated">Updated</option><option value="published">Published</option><option value="deleted">Deleted</option><option value="uploaded">Uploaded</option></Select>
        <Select onChange={(event) => setCollection(event.target.value)} value={collection}><option value="all">All collections</option><option value="posts">Posts</option><option value="events">Events</option><option value="media">Media</option></Select>
        <input type="date" style={fieldStyle} />
      </div>
      <table style={{ background: adminTheme.card, borderCollapse: 'collapse', borderRadius: 12, overflow: 'hidden', width: '100%' }}>
        <tbody>{filtered.map((log) => <tr key={log.id}><td style={cell}><Badge color={colors[log.action] ?? adminTheme.textMuted}>{log.action}</Badge></td><td style={cell}>{log.collection}</td><td style={cell}>{log.documentTitle}</td><td style={cell}>{log.performedBy?.email ?? 'System'}</td><td style={cell}>{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</td></tr>)}</tbody>
      </table>
    </>
  );
}

function Badge({ children, color }: { children: string; color: string }) {
  return <span style={{ background: `${color}22`, border: `1px solid ${color}55`, borderRadius: 999, color, fontSize: 12, fontWeight: 800, padding: '5px 9px' }}>{children}</span>;
}

const cell = { borderBottom: `1px solid ${adminTheme.border}`, padding: 14 };
const fieldStyle = { background: adminTheme.card, border: `1px solid ${adminTheme.border}`, borderRadius: 8, color: '#fff', minHeight: 42, padding: '0 12px' };
