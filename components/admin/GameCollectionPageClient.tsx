'use client';

import styled from 'styled-components';
import { AdminButton } from './AdminButton';
import { StatusBadge } from './StatusBadge';
import { adminTheme } from '@/styles/adminTheme';

type Column = {
  key: string;
  label: string;
};

type Props = {
  collectionSlug: string;
  columns: Column[];
  docs: Array<Record<string, any>>;
  title: string;
};

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
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

  strong {
    color: ${adminTheme.text};
  }
`;

function getValue(doc: Record<string, any>, key: string) {
  const value = key.split('.').reduce<any>((current, part) => current?.[part], doc);

  if (key === 'status' && typeof value === 'string') return <StatusBadge status={value} />;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object' && value?.name) return value.name;
  if (typeof value === 'object' && value?.title) return value.title;
  if (Array.isArray(value)) return `${value.length} items`;
  if (value && key.toLowerCase().includes('date')) return new Date(value).toLocaleString();

  return value ?? '-';
}

export function GameCollectionPageClient({ collectionSlug, columns, docs, title }: Props) {
  return (
    <>
      <Header>
        <h1 style={{ fontSize: 34, margin: 0 }}>{title}</h1>
        <AdminButton href={`/cms/collections/${collectionSlug}/create`} variant="primary">Create in Payload</AdminButton>
      </Header>
      <Table>
        <thead>
          <tr>
            {columns.map((column) => <Cell as="th" key={column.key}>{column.label}</Cell>)}
            <Cell as="th">Actions</Cell>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id}>
              {columns.map((column, index) => (
                <Cell key={column.key}>{index === 0 ? <strong>{getValue(doc, column.key)}</strong> : getValue(doc, column.key)}</Cell>
              ))}
              <Cell><AdminButton href={`/cms/collections/${collectionSlug}/${doc.id}`}>Edit</AdminButton></Cell>
            </tr>
          ))}
          {!docs.length ? (
            <tr>
              <Cell colSpan={columns.length + 1}>No records found.</Cell>
            </tr>
          ) : null}
        </tbody>
      </Table>
    </>
  );
}
