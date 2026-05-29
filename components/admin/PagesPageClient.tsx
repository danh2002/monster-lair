'use client';

import styled from 'styled-components';
import { FaFileAlt } from '@react-icons/all-files/fa/FaFileAlt';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { AdminButton } from './AdminButton';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';
import { adminTheme } from '@/styles/adminTheme';

type PageDoc = Record<string, any>;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;

const Tree = styled.div`
  overflow: hidden;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radius};
  background: ${adminTheme.card};
`;

const Row = styled.div<{ $depth: number }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 130px 110px 90px 120px;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 0 14px 0 ${({ $depth }) => 14 + $depth * 26}px;
  border-bottom: 1px solid ${adminTheme.border};

  &:last-child {
    border-bottom: 0;
  }
`;

const Title = styled.div`
  min-width: 0;

  strong {
    display: block;
    overflow: hidden;
    color: ${adminTheme.text};
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: ${adminTheme.textMuted};
    font-size: 12px;
  }
`;

function getParentId(page: PageDoc) {
  return typeof page.parent === 'object' ? String(page.parent?.id ?? '') : String(page.parent ?? '');
}

function buildTree(items: PageDoc[], parentId = '', depth = 0): Array<PageDoc & { depth: number }> {
  return items
    .filter((item) => getParentId(item) === parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.title).localeCompare(String(b.title)))
    .flatMap((item) => [{ ...item, depth }, ...buildTree(items, String(item.id), depth + 1)]);
}

export function PagesPageClient({ pages }: { pages: PageDoc[] }) {
  const tree = buildTree(pages);

  return (
    <>
      <Header>
        <h1 style={{ fontSize: 34, margin: 0 }}>Pages</h1>
        <AdminButton href="/admin/pages/new" variant="primary"><FaPlus /> New Page</AdminButton>
      </Header>
      {tree.length ? (
        <Tree>
          {tree.map((page) => (
            <Row $depth={page.depth} key={page.id}>
              <Title>
                <strong>{page.depth ? '- ' : ''}{page.title}</strong>
                <span>/{page.slug}</span>
              </Title>
              <span>{page.template ?? 'default'}</span>
              <StatusBadge status={page.status ?? 'draft'} />
              <span>{page.order ?? 0}</span>
              <AdminButton href={`/admin/pages/${page.id}`}>Edit</AdminButton>
            </Row>
          ))}
        </Tree>
      ) : (
        <EmptyState
          action={<AdminButton href="/admin/pages/new" variant="primary">Add New Page</AdminButton>}
          description="Create static pages for your site"
          icon={FaFileAlt}
          title="No pages found"
        />
      )}
    </>
  );
}
