'use client';

import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaCrown } from '@react-icons/all-files/fa/FaCrown';
import { FaGem } from '@react-icons/all-files/fa/FaGem';
import { FaCoins } from '@react-icons/all-files/fa/FaCoins';
import { TopPlayer } from './types';
import { formatRewardAmount } from './formatters';

interface TopPlayerCardProps {
  player: TopPlayer;
}

const crownFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const shine = keyframes`
  0% { transform: translateX(-140%); }
  100% { transform: translateX(140%); }
`;

const Card = styled(motion.article)<{ $rank: number }>`
  position: relative;
  min-height: ${(props) => (props.$rank === 1 ? '440px' : '360px')};
  padding: ${(props) =>
    props.$rank === 1 ? '3.5rem 1.4rem 1.4rem' : '2.8rem 1.2rem 1.2rem'};
  border-radius: 20px;
  border: 1px solid
    ${(props) =>
      props.$rank === 1
        ? 'rgba(255, 186, 56, .7)'
        : props.$rank === 2
          ? 'rgba(173, 204, 255, .58)'
          : 'rgba(255, 163, 96, .58)'};
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 136, 34, 0.32), transparent 54%),
    linear-gradient(180deg, rgba(8, 12, 18, 0.92), rgba(12, 10, 9, 0.95));
  box-shadow: ${(props) =>
      props.$rank === 1
        ? '0 0 60px rgba(255,160,42,0.55), 0 0 120px rgba(255,120,0,0.25)'
        : '0 0 20px rgba(255, 140, 80, 0.28)'},
    inset 0 1px 0 rgba(255, 255, 255, 0.14);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: url('/images/feature-war.jpg') center/cover no-repeat;
    opacity: ${(props) => (props.$rank === 1 ? 0.22 : 0.15)};
    z-index: -2;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background:
      linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.16) 48%, transparent 56%);
    opacity: ${(props) => (props.$rank === 1 ? 1 : 0)};
    animation: ${shine} 2.8s linear infinite;
    pointer-events: none;
  }
`;

const RankBadge = styled.div<{ $rank: number }>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100px;
  height: 58px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 12px;
  background: ${(props) =>
    props.$rank === 1
      ? 'linear-gradient(180deg, #ffd15f, #bf7400)'
      : props.$rank === 2
        ? 'linear-gradient(180deg, #d4e7ff, #5f7da2)'
        : 'linear-gradient(180deg, #ffc59f, #9b4b22)'};
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #1b0f03;
  font-size: 1.35rem;
  font-weight: 900;
  z-index: 3;

  svg {
    font-size: 1rem;
    animation: ${(props) => (props.$rank === 1 ? crownFloat : 'none')} 2.2s ease-in-out infinite;
  }
`;

const AvatarWrap = styled.div<{ $rank: number }>`
  width: ${(props) => (props.$rank === 1 ? '106px' : '92px')};
  height: ${(props) => (props.$rank === 1 ? '106px' : '92px')};
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
  border: 2px solid ${(props) => (props.$rank === 1 ? '#ffcc62' : 'rgba(255, 255, 255, 0.72)')};
  box-shadow: 0 0 20px rgba(255, 145, 35, 0.45);
  position: relative;
`;

const Name = styled.h3`
  margin: 0;
  color: #fff;
  text-align: center;
  font-size: 1.9rem;
  font-style: italic;
  font-weight: 900;
`;

const Clan = styled.div`
  margin-top: 0.45rem;
  text-align: center;
  color: #ffb35a;
  font-size: 1rem;
  font-weight: 700;
`;

const Value = styled.div`
  margin-top: 0.7rem;
  text-align: center;
  color: #fff;
  font-size: 2rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
`;

const RewardGrid = styled.div`
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
`;

const RewardItem = styled.div`
  min-height: 62px;
  border-radius: 8px;
  background: rgba(5, 8, 10, 0.72);
  border: 1px solid rgba(255, 169, 83, 0.35);
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
`;

export function TopPlayerCard({ player }: TopPlayerCardProps) {
  const t = useTranslations('ranking');

  return (
    <Card
      $rank={player.rank}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <RankBadge $rank={player.rank}>
        <FaCrown />
        {player.rank}
      </RankBadge>
      <AvatarWrap $rank={player.rank}>
        <Image src={player.avatar} alt={player.username} fill sizes="120px" style={{ objectFit: 'cover' }} />
      </AvatarWrap>
      <Name>{player.username}</Name>
      <Clan>{player.clan}</Clan>
      <Value>
        <FaGem /> {formatRewardAmount(player.value)} {t('gold_coins')}
      </Value>
      <RewardGrid>
        <RewardItem>
          <FaCoins /> x{formatRewardAmount(player.rewardPreview.coin)}
        </RewardItem>
        <RewardItem>
          <FaGem /> x{player.rewardPreview.ruby}
        </RewardItem>
        <RewardItem>x{player.rewardPreview.fang}</RewardItem>
      </RewardGrid>
    </Card>
  );
}
