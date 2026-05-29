'use client';

import styled from 'styled-components';
import { AdminButton } from './AdminButton';
import { Select } from './Select';
import { adminTheme } from '@/styles/adminTheme';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: ${adminTheme.radius};
  background: rgba(99,102,241,0.1);
`;

export function BulkActions({ selected }: { selected: number }) {
  if (!selected) return null;

  return (
    <Wrap>
      <strong>{selected} selected</strong>
      <Select>
        <option>Bulk Actions</option>
        <option>Publish</option>
        <option>Draft</option>
        <option>Archive</option>
        <option>Delete</option>
      </Select>
      <AdminButton>Apply</AdminButton>
    </Wrap>
  );
}
