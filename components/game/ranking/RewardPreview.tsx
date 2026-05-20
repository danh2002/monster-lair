'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaGem } from '@react-icons/all-files/fa/FaGem';
import { FaCoins } from '@react-icons/all-files/fa/FaCoins';
import { FaTrophy } from '@react-icons/all-files/fa/FaTrophy';
import { FaRegSquare } from '@react-icons/all-files/fa/FaRegSquare';
import { FaCrown } from '@react-icons/all-files/fa/FaCrown';
import { RewardCardItem } from './types';
import { formatRewardAmount } from './formatters';

interface RewardPreviewProps {
  items: RewardCardItem[];
}

type TierTone = 'gold' | 'silver' | 'bronze';

const TOP_IMAGES = ['/images/top1.png', '/images/top2.png', '/images/top3.png'] as const;

const Wrap = styled(motion.section)`
  position: relative;
  min-height: 600px;
  border-radius: 14px;
  border: 1px solid rgba(255, 150, 60, 0.3);
  background:
    linear-gradient(180deg, rgba(255, 140, 46, 0.12), rgba(8, 10, 14, 0.94) 20%),
    rgba(8, 10, 14, 0.92);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 170, 88, 0.7);
    box-shadow: 0 0 26px rgba(255, 140, 46, 0.22);
  }

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    width: 16px;
    height: 16px;
    border-top: 2px solid rgba(255, 140, 46, 0.7);
    border-left: 2px solid rgba(255, 140, 46, 0.7);
  }

  &::after {
    content: '';
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 16px;
    height: 16px;
    border-right: 2px solid rgba(255, 140, 46, 0.7);
    border-bottom: 2px solid rgba(255, 140, 46, 0.7);
  }
`;

const Title = styled.h3`
  margin: 0 0 1rem;
  text-align: center;
  color: #ff8c2c;
  font-size: clamp(1.35rem, 2vw, 1.85rem);
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: 0 0 18px rgba(255, 136, 34, 0.28);
`;

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 0.92fr 1.08fr 0.92fr;
  gap: 1rem;
  align-items: end;
  margin-top: 1.5rem;
  margin-bottom: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const Card = styled.article<{ $tone: TierTone; $featured?: boolean; $orderDesktop: number; $orderMobile: number }>`
  position: relative;
  min-width: 0;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  order: ${(props) => props.$orderDesktop};
  border: ${(props) => {
    switch (props.$tone) {
      case 'gold':
        return '1px solid rgba(255,180,50,0.7)';
      case 'silver':
        return '1px solid rgba(180,200,230,0.55)';
      default:
        return '1px solid rgba(200,120,60,0.55)';
    }
  }};
  transform: ${(props) => (props.$featured ? 'translateY(-24px)' : 'translateY(12px)')};
  box-shadow: ${(props) =>
    props.$featured
      ? '0 0 45px rgba(255,170,60,0.38), 0 0 120px rgba(255,120,20,0.22), inset 0 1px 0 rgba(255,255,255,0.12)'
      : '0 0 18px rgba(255, 140, 46, 0.14)'};

  &::before {
    content: '';
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: -22px;
    height: 46px;
    border-radius: 999px;
    background: radial-gradient(ellipse at center, rgba(255, 165, 60, 0.34), transparent 72%);
    opacity: ${(props) => (props.$featured ? 0.28 : 0)};
    pointer-events: none;
  }

  &:hover {
    transform: ${(props) => (props.$featured ? 'translateY(-28px)' : 'translateY(6px)')};
    box-shadow: ${(props) =>
      props.$featured
        ? '0 0 60px rgba(255, 185, 66, 0.58), 0 0 130px rgba(255, 140, 46, 0.32)'
        : '0 0 28px rgba(255, 140, 46, 0.24)'};
  }

  &:hover::after {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    background: linear-gradient(120deg, transparent 10%, rgba(255, 255, 255, 0.16) 45%, transparent 62%);
    transition: opacity 0.2s ease;
  }

  @media (max-width: 720px) {
    order: ${(props) => props.$orderMobile};
    transform: none;

    &:hover {
      transform: translateY(-4px);
    }
  }
`;

const RankBadge = styled.div<{ $tone: TierTone }>`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  min-width: 62px;
  height: 31px;
  padding: 0 0.55rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: #1b0f03;
  font-size: 0.76rem;
  font-weight: 900;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: ${(props) => {
    switch (props.$tone) {
      case 'gold':
        return 'linear-gradient(180deg, #ffd26a, #bf7400)';
      case 'silver':
        return 'linear-gradient(180deg, #dbe8f7, #738aa3)';
      default:
        return 'linear-gradient(180deg, #e8b08a, #95502a)';
    }
  }};

  svg {
    font-size: 0.75rem;
  }
`;

const Thumb = styled.div<{ $featured?: boolean }>`
  position: relative;
  height: ${(props) => (props.$featured ? '280px' : '240px')};
  border-radius: 11px 11px 0 0;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 42%, rgba(0, 0, 0, 0.55) 100%);
  }
`;

const Body = styled.div`
  padding: 1rem;
  color: rgba(255, 255, 255, 0.9);
`;

const RewardLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.95rem;
  line-height: 1.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    color: #ffb356;
    font-size: 0.78rem;
    flex: 0 0 auto;
  }
`;

const ViewAllButton = styled.button`
  width: 100%;
  margin-top: auto;
  height: 48px;
  border-radius: 8px;
  border: 1px solid rgba(255, 150, 60, 0.55);
  background: linear-gradient(180deg, rgba(255, 140, 40, 0.14), rgba(8, 10, 14, 0.92));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  color: #ffb356;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(255, 170, 88, 0.78);
    background: linear-gradient(120deg, rgba(255, 122, 20, 0.35), rgba(9, 10, 12, 0.96));
    transform: translateY(-2px);
    box-shadow: 0 0 24px rgba(255, 130, 30, 0.24);
  }
`;

function getTone(index: number): TierTone {
  if (index === 0) return 'gold';
  if (index === 1) return 'silver';
  return 'bronze';
}

function getBadgeLabel(index: number) {
  if (index === 0) return '1';
  if (index === 1) return '2';
  return '3';
}

export function RewardPreview({ items }: RewardPreviewProps) {
  const t = useTranslations('ranking');
  const topThree = items.slice(0, 3);

  return (
    <Wrap initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Title>{t('ranking_rewards')}</Title>
      <Grid>
        {topThree.map((item, index) => {
          const tone = getTone(index);
          const badgeLabel = getBadgeLabel(index);
          const isTop1 = index === 0;
          const rankImage = TOP_IMAGES[index] ?? item.image;
          const orderDesktop = index === 0 ? 2 : index === 1 ? 1 : 3;
          const orderMobile = index + 1;

          return (
            <Card
              key={item.tier}
              $tone={tone}
              $featured={isTop1}
              $orderDesktop={orderDesktop}
              $orderMobile={orderMobile}
            >
              <RankBadge $tone={tone}>
                <FaCrown /> {badgeLabel}
              </RankBadge>
              <Thumb $featured={isTop1}>
                <Image src={rankImage} alt={item.tier} fill sizes="420px" style={{ objectFit: 'cover' }} />
              </Thumb>
              <Body>
                <RewardLine>
                  <FaGem /> {formatRewardAmount(item.coin)} {t('gold_coins')}
                </RewardLine>
                <RewardLine>
                  <FaCoins /> {t(item.skinKey)}
                </RewardLine>
                <RewardLine>
                  <FaTrophy /> {t(item.badgeKey)}
                </RewardLine>
                <RewardLine>
                  <FaRegSquare /> {t(item.frameKey)}
                </RewardLine>
              </Body>
            </Card>
          );
        })}
      </Grid>
      <ViewAllButton type="button">{t('view_all_rewards')}</ViewAllButton>
    </Wrap>
  );
}
