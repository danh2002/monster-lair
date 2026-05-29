'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { AdminButton } from './AdminButton';
import { FilterTabs } from './FilterTabs';
import { Modal } from './Modal';
import { Select } from './Select';
import { showAdminToast } from './Toast';
import { adminTheme } from '@/styles/adminTheme';

type CommentDoc = Record<string, any>;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  overflow: hidden;
  border-collapse: collapse;
  border-radius: ${adminTheme.radius};
  background: ${adminTheme.card};
`;

const Cell = styled.td`
  padding: 14px;
  border-bottom: 1px solid ${adminTheme.border};
  color: ${adminTheme.textMuted};
  vertical-align: top;

  strong {
    color: ${adminTheme.text};
  }
`;

const Badge = styled.span<{ $status?: string }>`
  display: inline-flex;
  padding: 5px 8px;
  border-radius: 999px;
  background: ${({ $status }) =>
    $status === 'approved' ? 'rgba(16,185,129,0.16)' : $status === 'spam' || $status === 'rejected' ? 'rgba(239,68,68,0.16)' : 'rgba(245,158,11,0.16)'};
  color: ${({ $status }) => ($status === 'approved' ? '#6ee7b7' : $status === 'spam' || $status === 'rejected' ? '#fca5a5' : '#fcd34d')};
  font-size: 12px;
  font-weight: 900;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radiusSm};
  background: #0f0f13;
  color: ${adminTheme.text};
`;

function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function postTitle(value: unknown) {
  if (value && typeof value === 'object') return (value as any).title ?? `#${(value as any).id}`;
  return value ? `#${value}` : '-';
}

function postId(value: unknown) {
  if (value && typeof value === 'object') return (value as any).id;
  return value;
}

export function CommentsPageClient({ comments }: { comments: CommentDoc[] }) {
  const [items, setItems] = useState(comments);
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(new Set<string>());
  const [bulkAction, setBulkAction] = useState('approve');
  const [replyingTo, setReplyingTo] = useState<CommentDoc | null>(null);
  const [reply, setReply] = useState('');
  const counts = useMemo(
    () => ({
      all: items.length,
      approved: items.filter((item) => item.status === 'approved').length,
      pending: items.filter((item) => item.status === 'pending').length,
      spam: items.filter((item) => item.status === 'spam').length,
    }),
    [items],
  );
  const filtered = status === 'all' ? items : items.filter((item) => item.status === status);

  function toggle(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function updateStatus(ids: string[], nextStatus: string) {
    const token = getCookie('payload-token');
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/comments/${id}`, {
          body: JSON.stringify({ status: nextStatus }),
          credentials: 'include',
          headers: {
            ...(token ? { Authorization: `JWT ${token}` } : {}),
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        }),
      ),
    );
    setItems((current) => current.map((item) => (ids.includes(String(item.id)) ? { ...item, status: nextStatus } : item)));
    setSelected(new Set());
    showAdminToast('success', 'Comments updated');
  }

  async function deleteComments(ids: string[]) {
    const token = getCookie('payload-token');
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/comments/${id}`, {
          credentials: 'include',
          headers: token ? { Authorization: `JWT ${token}` } : undefined,
          method: 'DELETE',
        }),
      ),
    );
    setItems((current) => current.filter((item) => !ids.includes(String(item.id))));
    setSelected(new Set());
    showAdminToast('success', 'Comments deleted');
  }

  function applyBulk() {
    const ids = Array.from(selected);
    if (!ids.length) return;

    if (bulkAction === 'delete') deleteComments(ids);
    else updateStatus(ids, bulkAction === 'approve' ? 'approved' : bulkAction === 'reject' ? 'rejected' : 'spam');
  }

  async function submitReply() {
    if (!replyingTo || !reply.trim()) return;
    const token = getCookie('payload-token');
    const res = await fetch('/api/comments', {
      body: JSON.stringify({
        author: 'Admin',
        content: reply,
        parentComment: replyingTo.id,
        post: postId(replyingTo.post),
        status: 'approved',
      }),
      credentials: 'include',
      headers: {
        ...(token ? { Authorization: `JWT ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      showAdminToast('error', 'Reply failed');
      return;
    }

    const data = await res.json();
    setItems((current) => [data.doc ?? data, ...current]);
    setReply('');
    setReplyingTo(null);
    showAdminToast('success', 'Reply posted');
  }

  return (
    <>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Comments</h1>
      <FilterTabs
        active={status}
        onChange={setStatus}
        tabs={[
          { count: counts.all, label: 'All', value: 'all' },
          { count: counts.pending, label: 'Pending', value: 'pending' },
          { count: counts.approved, label: 'Approved', value: 'approved' },
          { count: counts.spam, label: 'Spam', value: 'spam' },
        ]}
      />
      <Toolbar>
        <strong>{selected.size} selected</strong>
        <Select onChange={(event) => setBulkAction(event.target.value)} value={bulkAction}>
          <option value="approve">Approve</option>
          <option value="reject">Reject</option>
          <option value="spam">Spam</option>
          <option value="delete">Delete</option>
        </Select>
        <AdminButton disabled={!selected.size} onClick={applyBulk}>Apply</AdminButton>
      </Toolbar>
      <Table>
        <thead>
          <tr>
            <Cell as="th">Select</Cell>
            <Cell as="th">Comment</Cell>
            <Cell as="th">Author</Cell>
            <Cell as="th">Post</Cell>
            <Cell as="th">Status</Cell>
            <Cell as="th">Actions</Cell>
          </tr>
        </thead>
        <tbody>
          {filtered.map((comment) => (
            <tr key={comment.id}>
              <Cell><input checked={selected.has(String(comment.id))} onChange={(event) => toggle(String(comment.id), event.target.checked)} type="checkbox" /></Cell>
              <Cell><strong>{comment.content}</strong><div style={{ fontSize: 12 }}>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</div></Cell>
              <Cell>{comment.author}<div style={{ fontSize: 12 }}>{comment.email}</div></Cell>
              <Cell>{postTitle(comment.post)}</Cell>
              <Cell><Badge $status={comment.status}>{comment.status}</Badge></Cell>
              <Cell style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <AdminButton onClick={() => updateStatus([String(comment.id)], 'approved')}>Approve</AdminButton>
                <AdminButton onClick={() => setReplyingTo(comment)}>Reply</AdminButton>
              </Cell>
            </tr>
          ))}
          {!filtered.length ? <tr><Cell colSpan={6}>No comments found.</Cell></tr> : null}
        </tbody>
      </Table>
      {replyingTo ? (
        <Modal onClose={() => setReplyingTo(null)} title="Reply to comment">
          <div style={{ display: 'grid', gap: 14, padding: 18 }}>
            <div style={{ color: adminTheme.textMuted }}>{replyingTo.content}</div>
            <Textarea onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." value={reply} />
            <AdminButton onClick={submitReply} variant="primary">Send Reply</AdminButton>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
