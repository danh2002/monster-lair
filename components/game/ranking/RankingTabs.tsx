'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';
import { RankingCategory } from './types';

interface RankingTabsProps {
  active: RankingCategory;
  onChange: (value: RankingCategory) => void;
  labels: Record<RankingCategory, string>;
}

const TabsWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(100%, 860px);
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(6, 8, 10, 0.72);

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    border-radius: 10px;
  }
`;

const TabButton = styled(motion.button)<{ $active: boolean }>`
  height: 66px;
  padding: 0 1rem;
  border: 0;
  color: ${(props) => (props.$active ? '#fff' : 'rgba(255, 255, 255, 0.82)')};
  font-size: 1.08rem;
  font-weight: 900;
  text-transform: uppercase;
  background: ${(props) => (props.$active ? 'linear-gradient(120deg, #e76800, #ff7b12)' : 'transparent')};
  letter-spacing: 0.03em;
  cursor: pointer;
  position: relative;
  min-width: 180px;

  &:hover {
    background: ${(props) => (props.$active ? 'linear-gradient(120deg, #f07100, #ff8a2a)' : 'rgba(255, 255, 255, 0.05)')};
  }

  ${(props) =>
    props.$active
      ? `
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.2), 0 0 22px rgba(255,106,0,.45);
  `
      : ''}

  & + & {
    border-left: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

const categories: RankingCategory[] = ['topup', 'arena', 'daily', 'weekly'];

export function RankingTabs({ active, onChange, labels }: RankingTabsProps) {
  return (
    <TabsWrap>
      {categories.map((category) => (
        <TabButton
          key={category}
          type="button"
          $active={active === category}
          onClick={() => onChange(category)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {labels[category]}
        </TabButton>
      ))}
    </TabsWrap>
  );
}
