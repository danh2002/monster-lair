'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { FaEdit } from '@react-icons/all-files/fa/FaEdit';
import { FaTrash } from '@react-icons/all-files/fa/FaTrash';
import { StatusBadge } from './StatusBadge';
import { adminTheme } from '@/styles/adminTheme';

export type AdminPost = {
  author?: { email?: string; name?: string } | string | null;
  category?: { email?: string; name?: string } | string | null;
  excerpt?: string | null;
  id: string | number;
  publishedAt?: string | null;
  slug?: string | null;
  status?: string | null;
  title?: string | null;
  updatedAt?: string | null;
  viewCount?: number | null;
};

const TableWrap = styled.div`
  overflow: hidden;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radius};
  background: ${adminTheme.card};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px 16px;
  border-bottom: 1px solid ${adminTheme.border};
  color: ${adminTheme.textDim};
  font-size: 12px;
  text-align: left;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  color: ${adminTheme.textMuted};
  font-size: 14px;
  vertical-align: middle;
`;

const Row = styled.tr`
  &:hover .quick-actions {
    opacity: 1;
  }
`;

const Title = styled(Link)`
  display: block;
  color: ${adminTheme.text};
  font-size: 15px;
  font-weight: 850;
  text-decoration: none;
`;

const Excerpt = styled.div`
  max-width: 420px;
  margin-top: 4px;
  overflow: hidden;
  color: rgba(255,255,255,0.42);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 160ms ease;

  a,
  button {
    border: 0;
    background: transparent;
    color: ${adminTheme.accent};
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
    padding: 0;
    text-decoration: none;

    &:disabled {
      cursor: wait;
      opacity: 0.55;
    }
  }
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

const Avatar = styled.div`
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  background: ${adminTheme.accent};
  color: #fff;
  font-size: 12px;
  font-weight: 900;
`;

const IconLink = styled(Link)`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radiusSm};
  color: ${adminTheme.textMuted};
  text-decoration: none;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(239,68,68,0.35);
  border-radius: ${adminTheme.radiusSm};
  background: rgba(239,68,68,0.08);
  color: ${adminTheme.accentRed};
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }
`;

function relationLabel(value: AdminPost['category'], fallback: string) {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.name ?? value.email ?? fallback;
}

function formatDate(value?: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

function modifiedAgo(value?: string | null) {
  if (!value) return 'Never modified';
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `Last Modified ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Last Modified ${hours} hours ago`;
  return `Last Modified ${Math.round(hours / 24)} days ago`;
}

export function PostsTable({
  deletingId,
  onDelete,
  onSelect,
  posts,
  selected,
}: {
  deletingId?: string | null;
  onDelete?: (id: string | number) => void;
  onSelect?: (id: string, checked: boolean) => void;
  posts: AdminPost[];
  selected?: Set<string>;
}) {
  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <Th>□</Th>
            <Th>Title</Th>
            <Th>Status</Th>
            <Th>Category</Th>
            <Th>Author</Th>
            <Th>Date</Th>
            <Th>Views</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const id = String(post.id);
            const author = relationLabel(post.author, 'Unknown');
            return (
              <Row key={id}>
                <Td>
                  <input checked={selected?.has(id) ?? false} onChange={(event) => onSelect?.(id, event.target.checked)} type="checkbox" />
                </Td>
                <Td>
                  <Title href={`/admin/posts/${id}`}>{post.title || 'Untitled'}</Title>
                  <Excerpt>{post.excerpt || 'No excerpt'}</Excerpt>
                  <QuickActions className="quick-actions">
                    <Link href={`/admin/posts/${id}`}>Edit</Link>
                    <Link href={`/news/${post.slug || id}`}>Preview</Link>
                    <button disabled={deletingId === id} onClick={() => onDelete?.(post.id)} type="button">
                      {deletingId === id ? 'Deleting...' : 'Trash'}
                    </button>
                  </QuickActions>
                </Td>
                <Td><StatusBadge status={post.status} /></Td>
                <Td>{relationLabel(post.category, 'Uncategorized')}</Td>
                <Td>
                  <Author><Avatar>{author.charAt(0).toUpperCase()}</Avatar>{author}</Author>
                </Td>
                <Td>
                  <div>{formatDate(post.publishedAt)}</div>
                  <div style={{ color: adminTheme.textDim, fontSize: 12, marginTop: 4 }}>— {modifiedAgo(post.updatedAt)}</div>
                </Td>
                <Td>{post.viewCount ?? 0}</Td>
                <Td>
                  <Actions>
                    <IconLink href={`/admin/posts/${id}`}><FaEdit /></IconLink>
                    <IconButton aria-label="Delete post" disabled={deletingId === id} onClick={() => onDelete?.(post.id)} type="button">
                      <FaTrash />
                    </IconButton>
                  </Actions>
                </Td>
              </Row>
            );
          })}
        </tbody>
      </Table>
    </TableWrap>
  );
}
