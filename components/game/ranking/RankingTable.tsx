'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RankingEntry } from './types';
import { RankingRow } from './RankingRow';

interface RankingTableProps {
  rows: RankingEntry[];
  headers: string[];
}

const TableWrap = styled(motion.section)`
  width: 100%;
  margin-top: 1.3rem;
  border-radius: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(4, 7, 10, 0.74);
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 120px 1.6fr 1.4fr 1fr 1.1fr 1fr;
  align-items: center;
  min-width: 1000px;
  min-height: 58px;
  padding: 0 1rem;
  background: linear-gradient(180deg, rgba(255, 121, 20, 0.24), rgba(255, 121, 20, 0.08));

  span {
    color: rgba(255, 255, 255, 0.86);
    font-size: 0.76rem;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
  }
`;

const MobileNote = styled.div`
  display: none;
  padding: 0.75rem 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 1024px) {
    display: block;
  }
`;

const Rows = styled.div`
  min-width: 1000px;
`;

export function RankingTable({ rows, headers }: RankingTableProps) {
  const t = useTranslations('ranking');

  return (
    <TableWrap
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <Header>
        {headers.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </Header>
      <MobileNote>{t('mobileNote')}</MobileNote>
      <Rows>
        {rows.map((row) => (
          <RankingRow key={row.rank} row={row} />
        ))}
      </Rows>
    </TableWrap>
  );
}
