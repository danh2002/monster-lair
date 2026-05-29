'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import type { AdminCollection } from '@/lib/admin/data';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.46);
  font-size: 13px;
  text-decoration: none;
`;

const Title = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: 32px;
`;

const Description = styled.p`
  max-width: 660px;
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  line-height: 1.6;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  background: #6366f1;
  color: #ffffff;
  font-weight: 800;
`;

const TablePanel = styled.section`
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px 18px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-align: left;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 16px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
`;

const Primary = styled.span`
  color: #ffffff;
  font-weight: 800;
`;

const Empty = styled.div`
  padding: 54px 18px;
  color: rgba(255, 255, 255, 0.46);
  text-align: center;
`;

function getTitle(entry: Record<string, unknown>) {
  return String(entry.title ?? entry.name ?? entry.email ?? entry.filename ?? entry.id ?? 'Untitled');
}

function formatDate(value: unknown) {
  if (typeof value !== 'string') {
    return '-';
  }

  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function CollectionEntriesView({
  collection,
  entries,
  totalDocs,
}: {
  collection: AdminCollection;
  entries: Array<Record<string, unknown>>;
  totalDocs: number;
}) {
  return (
    <>
      <Header>
        <div>
          <BackLink href="/admin/collections">Collections</BackLink>
          <Title>{collection.name}</Title>
          <Description>{collection.description}</Description>
        </div>
        <Button type="button">
          <FaPlus />
          New Entry
        </Button>
      </Header>
      <TablePanel>
        <TableHeader>
          <span>{totalDocs} total entries</span>
          <span>Status: Active</span>
        </TableHeader>
        {entries.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Entry</Th>
                <Th>ID</Th>
                <Th>Updated</Th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={String(entry.id)}>
                  <Td>
                    <Primary>{getTitle(entry)}</Primary>
                  </Td>
                  <Td>{String(entry.id ?? '-')}</Td>
                  <Td>{formatDate(entry.updatedAt)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Empty>No entries found in this collection.</Empty>
        )}
      </TablePanel>
    </>
  );
}
