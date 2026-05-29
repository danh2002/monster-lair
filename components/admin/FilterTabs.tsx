'use client';

import styled from 'styled-components';
import { adminTheme } from '@/styles/adminTheme';

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin: 0 0 18px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0 0 8px;
  border: 0;
  border-bottom: 2px solid ${({ $active }) => ($active ? adminTheme.accent : 'transparent')};
  background: transparent;
  color: ${({ $active }) => ($active ? adminTheme.text : adminTheme.textMuted)};
  cursor: pointer;
  font-weight: 800;
`;

export function FilterTabs({
  active,
  onChange,
  tabs,
}: {
  active: string;
  onChange: (value: string) => void;
  tabs: Array<{ count: number; label: string; value: string }>;
}) {
  return (
    <Wrap>
      {tabs.map((tab) => (
        <Tab $active={active === tab.value} key={tab.value} onClick={() => onChange(tab.value)} type="button">
          {tab.label} ({tab.count})
        </Tab>
      ))}
    </Wrap>
  );
}
