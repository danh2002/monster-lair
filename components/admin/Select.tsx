'use client';

import type { ChangeEvent, ReactNode } from 'react';
import styled from 'styled-components';
import { adminTheme } from '@/styles/adminTheme';

const StyledSelect = styled.select`
  height: 42px;
  min-width: 150px;
  padding: 0 12px;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radiusSm};
  background: ${adminTheme.card};
  color: ${adminTheme.text};
  outline: 0;
`;

export function Select({
  children,
  onChange,
  value,
}: {
  children: ReactNode;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}) {
  return (
    <StyledSelect onChange={onChange} value={value}>
      {children}
    </StyledSelect>
  );
}
