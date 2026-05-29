'use client';

import styled from 'styled-components';

const colors: Record<string, string> = {
  archived: '#ef4444',
  cancelled: '#ef4444',
  draft: '#6b7280',
  ended: '#6b7280',
  ongoing: '#3b82f6',
  pending: '#f59e0b',
  published: '#10b981',
  scheduled: '#3b82f6',
  upcoming: '#10b981',
};

const Badge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border: 1px solid ${({ $color }) => `${$color}55`};
  border-radius: 999px;
  background: ${({ $color }) => `${$color}22`};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 800;
  text-transform: capitalize;
`;

export function StatusBadge({ status }: { status?: string | null }) {
  const label = status || 'draft';
  return <Badge $color={colors[label] ?? '#6b7280'}>{label}</Badge>;
}
