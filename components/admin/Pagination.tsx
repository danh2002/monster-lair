'use client';

import styled from 'styled-components';
import { adminTheme } from '@/styles/adminTheme';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  color: ${adminTheme.textMuted};
  font-size: 13px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  border: 1px solid ${({ $active }) => ($active ? adminTheme.accent : adminTheme.border)};
  border-radius: ${adminTheme.radiusSm};
  background: ${({ $active }) => ($active ? 'rgba(99,102,241,0.16)' : adminTheme.card)};
  color: ${adminTheme.text};
`;

export function Pagination({ total }: { total: number }) {
  const end = Math.min(10, total);
  return (
    <Wrap>
      <span>Showing {total ? `1-${end}` : '0'} of {total} items</span>
      <Buttons>
        <Button>Prev</Button>
        <Button $active>1</Button>
        <Button>2</Button>
        <Button>3</Button>
        <Button>Next</Button>
      </Buttons>
    </Wrap>
  );
}
