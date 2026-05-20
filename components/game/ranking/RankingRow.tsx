'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import { FaArrowDown } from '@react-icons/all-files/fa/FaArrowDown';
import { FaArrowUp } from '@react-icons/all-files/fa/FaArrowUp';
import { FaCoins } from '@react-icons/all-files/fa/FaCoins';
import { theme } from '@/styles/theme';
import { RankingEntry } from './types';
import { formatRewardAmount } from './formatters';

interface RankingRowProps {
  row: RankingEntry;
}

const Row = styled.article`
  display: grid;
  grid-template-columns: 120px 1.6fr 1.4fr 1fr 1.1fr 1fr;
  align-items: center;
  min-height: 78px;
  padding: 0 1rem;
  background: rgba(5, 8, 11, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform ${theme.transitions.fast}, border-color ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};

  &:nth-child(even) {
    background: rgba(12, 16, 20, 0.72);
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 118, 26, 0.42);
    box-shadow: 0 10px 22px rgba(255, 106, 0, 0.18);
  }
`;

const Cell = styled.div`
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.86rem;
  white-space: nowrap;
`;

const RankCell = styled(Cell)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 1rem;
  font-weight: 900;
  color: #fff;
`;

const Trend = styled.span<{ $trend: 'up' | 'down' | 'same' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.86rem;
  font-weight: 700;
  color: ${(props) => (props.$trend === 'up' ? '#9cff4a' : props.$trend === 'down' ? '#ff5f5f' : '#a6b2c0')};
`;

const PlayerCell = styled(Cell)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  overflow: hidden;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Avatar = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.4);
  flex: 0 0 auto;
`;

const OrangeCell = styled(Cell)`
  color: #ff9d37;
  font-weight: 800;
`;

const Badge = styled.span`
  display: inline-flex;
  width: 100px;
  align-items: center;
  justify-content: center;
  min-height: 26px;
  padding: 0 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(72, 99, 132, 0.35);
  border: 1px solid rgba(132, 176, 230, 0.35);
  color: #d4ebff;
  white-space: nowrap;
`;

export function RankingRow({ row }: RankingRowProps) {
  const t = useTranslations('ranking');

  return (
    <Row>
      <RankCell>
        {row.rank}
        <Trend $trend={row.trend}>
          {row.trend === 'up' && <FaArrowUp />}
          {row.trend === 'down' && <FaArrowDown />}
          {row.trend === 'same' ? t('trend.stable') : row.trendValue}
        </Trend>
      </RankCell>

      <PlayerCell>
        <Avatar>
          <Image src={row.avatar} alt={row.username} fill sizes="36px" style={{ objectFit: 'cover' }} />
        </Avatar>
        <span>{row.username}</span>
      </PlayerCell>

      <Cell>{row.clan}</Cell>
      <OrangeCell>{row.value.toLocaleString()}</OrangeCell>
      <Badge>{t(row.titleKey)}</Badge>
      <Cell>
        <FaCoins /> x{formatRewardAmount(row.reward)}
      </Cell>
    </Row>
  );
}
