'use client';

import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FaClock } from '@react-icons/all-files/fa/FaClock';
import { FaGem } from '@react-icons/all-files/fa/FaGem';
import { FaTrophy } from '@react-icons/all-files/fa/FaTrophy';
import { FaCrown } from '@react-icons/all-files/fa/FaCrown';
import { useTranslations } from 'next-intl';
import { theme } from '@/styles/theme';

// ============================================================
// ⚙️ CẤU HÌNH ĐẾM NGƯỢC — chỉnh ở đây
// ============================================================
const CYCLE_DAYS = 10; // Số ngày mỗi chu kỳ reset
const EPOCH = new Date('2025-01-01T00:00:00'); // Mốc gốc để tính chu kỳ
// ============================================================

function getNextResetDate(cycleDays: number): Date {
  const now = new Date();
  const cycleMs = cycleDays * 24 * 60 * 60 * 1000;
  const elapsed = now.getTime() - EPOCH.getTime();
  const cyclesPassed = Math.floor(elapsed / cycleMs);
  return new Date(EPOCH.getTime() + (cyclesPassed + 1) * cycleMs);
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    setTimeLeft(Math.max(0, targetDate.getTime() - Date.now()));

    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, targetDate.getTime() - Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: false, mounted: false };
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, done: timeLeft === 0, mounted: true };
}

// ============================================================

const podiumPlayers = [
  { name: 'Brian Ngo', reward: '50,000', score: '2,000', place: 2, height: 178, avatar: '/images/top2loidai.png' },
  { name: 'Jolie Joie', reward: '100,000', score: '2,000', place: 1, height: 210, avatar: '/images/top1loidai.png' },
  { name: 'David Do', reward: '20,000', score: '2,000', place: 3, height: 178, avatar: '/images/top3loidai.png' },
];

const rankingRows = [
  { rank: 4, name: 'Henrietta OConnell', handle: '@HenriettaOC37', points: '2,114,424', reward: 1000, avatar: '👤' },
  { rank: 5, name: 'Darrell Bins', handle: '@DarrellBins38', points: '2,114,424', reward: 1000, avatar: '👤' },
  { rank: 6, name: 'Sally Kovacek', handle: '@5TXbahjZN1soYtdC', points: '2,114,424', reward: 1000, avatar: '👤' },
  { rank: 7, name: 'Jose Gulgowski', handle: '@c6axRRB2Neqsb6G', points: '2,114,424', reward: 1000, avatar: '👤' },
  { rank: 8, name: 'Ada Leannon', handle: '@T9RKwtVJ3rawKn_', points: '2,114,424', reward: 1000, avatar: '👤' },
  { rank: 9, name: 'Mona Bechtelar II', handle: '@Y1BVJiw09oLr', points: '2,114,424', reward: 1000, avatar: '👤' },
  { rank: 10, name: 'Elmer Rau', handle: '@0jIRhxwSES2oOKI', points: '2,114,424', reward: 1000, avatar: '👤' },
  { rank: 11, name: 'Terrence Sipes', handle: '@bezpvNnuiRFR3zO', points: '2,114,424', reward: 1000, avatar: '👤' },
];

const battles = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  redProgress: 70,
  blueProgress: 70,
}));

const Page = styled.div`
  background: #08070b;
  color: #fff;
`;

const ArenaHero = styled.section`
  position: relative;
  min-height: 438px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid rgba(255, 106, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: url('/images/feature-war.jpg');
    background-size: cover;
    background-position: center 44%;
    transform: scale(1.08);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.28), rgba(35, 11, 1, 0.86)),
      radial-gradient(circle at 50% 42%, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.72));
  }
`;

const HeroCorner = styled.div`
  position: absolute;
  inset: 28px 34px;
  pointer-events: none;

  &::before,
  &::after,
  span::before,
  span::after {
    content: '';
    position: absolute;
    width: 34px;
    height: 34px;
    border-color: ${theme.colors.primary.main};
    border-style: solid;
    opacity: 0.82;
  }

  &::before {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
  }

  &::after {
    top: 0;
    right: 0;
    border-width: 2px 2px 0 0;
  }

  span::before {
    bottom: 0;
    left: 0;
    border-width: 0 0 2px 2px;
  }

  span::after {
    right: 0;
    bottom: 0;
    border-width: 0 2px 2px 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 900px);
  padding: 2rem;
  text-align: center;
  transform: translateY(0.35rem);
`;

const HeroLogo = styled.div`
  position: relative;
  width: min(100%, 300px);
  aspect-ratio: 560 / 170;
  margin: 0 auto 1.35rem;
  filter: drop-shadow(0 14px 12px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 12px rgba(255, 106, 0, 0.45));
`;

const HeroTitle = styled.h1`
  margin: 0;
  color: ${theme.colors.primary.main};
  font-size: clamp(4.2rem, 7.2vw, 7rem);
  font-style: italic;
  font-weight: 900;
  letter-spacing: 0.02em;
  line-height: 0.95;
  text-transform: uppercase;

  span {
    display: block;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: clamp(3rem, 15vw, 4.4rem);
  }
`;

const DownMark = styled.div`
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  color: ${theme.colors.primary.main};
  font-size: 1rem;
`;

const SectionInner = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(3.5rem, 7vw, 5.5rem) clamp(1rem, 3vw, 2rem);
`;

const SectionTitle = styled.h2`
  margin: 0 0 clamp(3.2rem, 6vw, 5rem);
  text-align: center;
  color: #fff;
  font-size: clamp(2.6rem, 5vw, 4.3rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  text-shadow: 0 8px 12px rgba(0, 0, 0, 0.38);

  span {
    color: ${theme.colors.primary.light};
  }
`;

const BattleSection = styled.section`
  position: relative;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: url('/images/feature-herd.webp');
    background-size: cover;
    background-position: center;
    transform: scale(1.08);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(105, 15, 8, 0.68), rgba(14, 18, 58, 0.76)),
      rgba(0, 0, 0, 0.38);
  }
`;

const BattleList = styled.div`
  display: grid;
  gap: 3rem;
`;

const BattleCard = styled.article`
  position: relative;
  min-height: 132px;
  display: grid;
  grid-template-columns: 1fr 130px 1fr;
  align-items: center;
  gap: 1.2rem;
  padding: 2rem 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Faction = styled.div<{ $side: 'red' | 'blue' }>`
  text-align: ${(props) => (props.$side === 'red' ? 'right' : 'left')};

  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
  }
`;

const FactionName = styled.h3<{ $side: 'red' | 'blue' }>`
  margin: 0;
  color: ${(props) => (props.$side === 'red' ? '#ff2b21' : '#0d28ff')};
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  text-shadow: ${(props) => (props.$side === 'red' ? '0 0 10px rgba(255, 43, 33, 0.4)' : '0 0 10px rgba(13, 40, 255, 0.4)')};
`;

const PlayerCount = styled.div`
  margin-top: 0.35rem;
  color: #fff;
  font-size: 1.08rem;
  font-weight: 700;
`;

const ProgressLine = styled.div<{ $side: 'red' | 'blue'; $value: number }>`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1.15rem;
  color: #fff;
  font-size: 0.78rem;

  flex-direction: ${(props) => (props.$side === 'red' ? 'row-reverse' : 'row')};
  justify-content: flex-start;

  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: center;
  }

  .bar {
    position: relative;
    width: min(100%, 200px);
    height: 12px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .bar::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: ${(props) => props.$value}%;
    border-radius: inherit;
    background: ${(props) => (props.$side === 'red' ? '#ff2b21' : '#0d28ff')};
    box-shadow: ${(props) =>
      props.$side === 'red'
        ? '0 0 10px rgba(255, 43, 33, 0.6)'
        : '0 0 10px rgba(13, 40, 255, 0.6)'};
  }
`;

const Vs = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary.light};
  font-size: clamp(3.6rem, 7vw, 5.8rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1;

  &::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 150px;
    background: ${theme.colors.primary.main};
    transform: rotate(15deg);
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

const LeaderboardSection = styled.section`
  position: relative;
  overflow: hidden;
  isolation: isolate;
  min-height: 900px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: url('/images/backgroundloidai.png');
    background-size: cover;
    background-position: center 30%;
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(180deg,
        rgba(0,0,0,0.55) 0%,
        rgba(10,4,2,0.38) 40%,
        rgba(10,4,2,0.72) 100%
      );
  }
`;

const LeaderboardHeading = styled.div`
  text-align: center;
  margin: 0 0 clamp(2.2rem, 4vw, 3rem);
`;

const LeaderboardTitle = styled.h2`
  margin: 0;
  font-size: clamp(2.6rem, 5vw, 4.3rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  text-shadow: 0 8px 12px rgba(0, 0, 0, 0.38);
  color: #fff;

  span {
    color: #ff6a00;
  }
`;

const HeadingGem = styled(FaGem)`
  margin: 0.8rem auto 0.7rem;
  display: block;
  color: #ff6a00;
  font-size: 0.95rem;
`;

const LeaderboardSubtitle = styled.p`
  margin: 0;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const PodiumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: clamp(1.5rem, 3vw, 3rem);
  width: min(100%, 1100px);
  margin: 0 auto 4rem;
  padding: 60px 1rem 0;
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-width: 380px;
    margin-inline: auto;
    gap: 2.5rem;
  }
`;

const WinnerCard = styled.div<{ $height: number; $place: 1 | 2 | 3 }>`
  ${(props) => {
    const borderColor = props.$place === 1 ? '#C8960C' : props.$place === 2 ? '#4A6FA5' : '#8B5E3C';
    const bg =
      props.$place === 1
        ? 'linear-gradient(160deg, #1A1200 0%, #2C1E00 40%, #1A1200 100%)'
        : props.$place === 2
          ? 'linear-gradient(160deg, #060D1F 0%, #0D1A35 40%, #060D1F 100%)'
          : 'linear-gradient(160deg, #150C04 0%, #221408 40%, #150C04 100%)';
    const glow =
      props.$place === 1
        ? '0 0 0 1px #C8960C, 0 0 40px rgba(255,200,50,0.6), 0 20px 60px rgba(0,0,0,0.8)'
        : props.$place === 2
          ? '0 0 20px rgba(74,111,165,0.4), 0 16px 40px rgba(0,0,0,0.7)'
          : '0 0 20px rgba(139,94,60,0.4), 0 16px 40px rgba(0,0,0,0.7)';
    return `
      --winner-border: ${borderColor};
      --winner-bg: ${bg};
      --winner-glow: ${glow};
    `;
  }}
  position: relative;
  min-height: ${(props) => (props.$place === 1 ? '560px' : '460px')};
  padding: 0;
  background: linear-gradient(180deg, rgba(255, 180, 0, 0.12), rgba(0, 0, 0, 0.92));
  border: 2px solid var(--winner-border);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  box-shadow: var(--winner-glow), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transform: ${(props) => (props.$place === 1 ? 'translateY(-40px)' : 'none')};
  transition: all 0.3s ease;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    transform: none;
  }

  &::before {
    content: ${(props) => (props.$place === 1 ? "''" : 'none')};
    position: absolute;
    inset: 0;
    z-index: 1;
    background: radial-gradient(
      ellipse at 50% 0%,
      rgba(200, 150, 12, 0.18) 0%,
      transparent 65%
    );
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--winner-border), transparent);
    opacity: 0.5;
  }
`;

const WinnerPortrait = styled.div<{ $place: 1 | 2 | 3 }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border-radius: 0;
`;

const CardInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.25rem 1.5rem;
  gap: 0.3rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.97) 0%,
    rgba(0, 0, 0, 0.92) 40%,
    rgba(0, 0, 0, 0.7) 70%,
    transparent 100%
  );
`;

const CrownIcon = styled(FaCrown)`
  position: absolute;
  left: 50%;
  top: -28px;
  transform: translateX(-50%);
  color: #ffd700;
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.9));
  z-index: 10;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0 auto 0.95rem;
  position: relative;
`;

const WingDecor = styled.svg<{ $color: string; $mirror?: boolean }>`
  width: 28px;
  height: 20px;
  transform: ${(props) => (props.$mirror ? 'scaleX(-1)' : 'none')};
`;

const LaurelWreath = styled.svg`
  width: 120px;
  height: 44px;
  margin: -0.25rem auto 0.65rem;
  display: block;
`;

const RankBadge = styled.div<{ $place: 1 | 2 | 3 }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 0.95rem;
  border-radius: 999px;
  border: ${(props) => (props.$place === 1 ? '3px solid #FFD700' : props.$place === 2 ? '2px solid #AEBBCB' : '2px solid #8B5E3C')};
  background: ${(props) =>
    props.$place === 1
      ? 'radial-gradient(circle at 30% 30%, #ffd76a 0%, #c8960c 68%, #7f5c00 100%)'
      : props.$place === 2
        ? 'rgba(174, 187, 203, 0.16)'
        : 'rgba(139, 94, 60, 0.18)'};
  color: #fff;
  font-weight: 900;
  font-size: 1.08rem;
  position: relative;
  box-shadow: ${(props) => (props.$place === 1 ? '0 0 12px rgba(255,215,0,0.7)' : 'none')};
`;

const WinnerName = styled.h3<{ $place: 1 | 2 | 3 }>`
  margin: 0 0 1.2rem;
  color: #fff;
  font-size: ${(props) => (props.$place === 1 ? '1.5rem' : '1.25rem')};
  font-weight: 900;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
  text-align: center;
`;

const TrophyBox = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  background: rgba(255, 237, 224, 0.88);
  color: #7e7e7e;
`;

const WinnerScore = styled.div`
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 1.1rem;
`;

const Reward = styled.div<{ $place: 1 | 2 | 3 }>`
  color: #fff;
  font-size: ${(props) => (props.$place === 1 ? '1.9rem' : '1.6rem')};
  font-weight: 900;

  svg {
    color: ${(props) => (props.$place === 1 ? '#FF8C00' : props.$place === 2 ? '#4BA3FF' : '#E53935')};
    margin-right: 0.4rem;
  }

  span {
    display: flex;
    margin-top: 0.2rem;
    font-size: 0.75rem;
    font-weight: 500;
    justify-content: center;
  }
`;

const Countdown = styled.div`
  position: relative;
  z-index: 1;
  width: auto;
  margin: 0 auto 2.5rem;
  text-align: center;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;

  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .label::before,
  .label::after {
    content: '';
    width: clamp(48px, 10vw, 96px);
    height: 1px;
    background: linear-gradient(90deg, rgba(200, 150, 60, 0), rgba(200, 150, 60, 0.9), rgba(200, 150, 60, 0));
  }

  svg {
    display: inline-block;
    color: #ff3333;
    font-size: 1.2rem;
    animation: pulse 2s infinite;
  }

  strong {
    display: block;
    margin-top: 0.4rem;
    color: #ff6a00;
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: 0.03em;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

const LeaderboardTable = styled.div`
  width: 100%;
  margin-top: 1.8rem;
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  background: rgba(20, 12, 8, 0.85);
  border: 1px solid rgba(200, 150, 60, 0.45);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 200, 100, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns:
    90px
    minmax(280px, 1.8fr)
    minmax(180px, 1fr)
    160px;
  align-items: center;
  gap: 0;
  padding: 1rem 1.8rem;
  border-bottom: 1px solid rgba(200, 150, 60, 0.4);
  font-weight: 700;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.08em;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    padding: 1rem;
  }

  > div:nth-child(1) {
    text-align: center;
  }

  > div:nth-child(2) {
    text-align: left;
    padding-left: 0.5rem;
  }

  > div:nth-child(3),
  > div:nth-child(4) {
    text-align: center;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns:
    90px
    minmax(280px, 1.8fr)
    minmax(180px, 1fr)
    160px;
  align-items: center;
  gap: 0;
  padding: 1.3rem 1.8rem;
  transition: background 0.2s ease;
  border-bottom: 1px solid rgba(200, 150, 60, 0.18);

  &:nth-child(odd) {
    background: rgba(255, 255, 255, 0.02);
  }

  &:nth-child(even) {
    background: transparent;
  }

  &:hover {
    background: rgba(255, 150, 30, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    padding: 1rem;
  }
`;

const RankCell = styled.div`
  font-weight: 900;
  font-size: 1.2rem;
  color: #ff6a00;
  text-align: center;
`;

const NameCell = styled.div`
  font-weight: 700;
  font-size: 0.96rem;
  color: #fff;
  letter-spacing: 0.005em;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  padding-left: 0.5rem;
`;

const PointsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.96rem;
  color: #fff;
  font-family: var(--font-inter), monospace;

  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
  }
`;

const RewardCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: #ff6a00;

  svg {
    color: #ff6a00;
    font-size: 1rem;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    justify-content: flex-start;
  }
`;

export default function ArenaPage() {
  const t = useTranslations('arena');
  const targetDate = useMemo(() => getNextResetDate(CYCLE_DAYS), []);
  const { days, hours, minutes, seconds, done, mounted } = useCountdown(targetDate);

  const pad = (n: number) => String(n).padStart(2, '0');
  const pageTitle = t('page_title');
  const [pageTitleLead, pageTitleEmphasis] = useMemo(() => {
    const lastSpace = pageTitle.lastIndexOf(' ');
    return lastSpace === -1
      ? ['', pageTitle]
      : [pageTitle.slice(0, lastSpace), pageTitle.slice(lastSpace + 1)];
  }, [pageTitle]);

  return (
    <Page>
      <ArenaHero>
        <HeroCorner>
          <span />
        </HeroCorner>
        <HeroContent>
          <HeroLogo>
            <Image src="/images/dao-khung-long-logo.png" alt={t('logoAlt')} fill sizes="300px" style={{ objectFit: 'contain' }} priority />
          </HeroLogo>
          <HeroTitle>
            <span>{t('heroTitleLine1')}</span>
            <span>{t('heroTitleLine2')}</span>
          </HeroTitle>
        </HeroContent>
        <DownMark>{t('downMark')}</DownMark>
      </ArenaHero>

      <BattleSection>
        <SectionInner>
          <SectionTitle>
            {t('battleSectionTitleTop')} <span>{t('battleSectionTitleEmphasis')}</span>
          </SectionTitle>

          <BattleList>
            {battles.map((battle) => (
              <BattleCard key={battle.id}>
                <Faction $side="red">
                  <FactionName $side="red">{t('factionHoaLong')}</FactionName>
                  <PlayerCount>{t('playerCount')}</PlayerCount>
                  <ProgressLine $side="red" $value={battle.redProgress}>
                    <span>{t('progressLabel')}</span>
                    <span className="bar" />
                    <span>{battle.redProgress}%</span>
                  </ProgressLine>
                </Faction>

                <Vs>
                  <span>{t('vs')}</span>
                </Vs>

                <Faction $side="blue">
                  <FactionName $side="blue">{t('factionTuTien')}</FactionName>
                  <PlayerCount>{t('playerCount')}</PlayerCount>
                  <ProgressLine $side="blue" $value={battle.blueProgress}>
                    <span>{t('progressLabel')}</span>
                    <span className="bar" />
                    <span>{battle.blueProgress}%</span>
                  </ProgressLine>
                </Faction>
              </BattleCard>
            ))}
          </BattleList>
        </SectionInner>
      </BattleSection>

      <LeaderboardSection>
        <SectionInner>
          <LeaderboardHeading>
            <LeaderboardTitle>
              {pageTitleLead && `${pageTitleLead} `}
              <span>{pageTitleEmphasis}</span>
            </LeaderboardTitle>
            <HeadingGem />
            <LeaderboardSubtitle>{t('subtitle')}</LeaderboardSubtitle>
          </LeaderboardHeading>

          <PodiumGrid>
            {podiumPlayers.map((player) => (
              <WinnerCard key={player.name} $height={player.height} $place={player.place as 1 | 2 | 3}>
                <WinnerPortrait $place={player.place as 1 | 2 | 3}>
                  <Image
                    src={player.avatar}
                    alt={player.name}
                    fill
                    priority={player.place === 1}
                    sizes="(max-width:768px) 100vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      transform:
                        player.place === 1
                          ? 'scale(1.12)'
                          : 'scale(1.08)',
                    }}
                  />
                </WinnerPortrait>
                <CardInfo>
                  {player.place === 1 && <CrownIcon />}
                  <BadgeRow>
                    {player.place !== 1 && (
                      <WingDecor
                        $color={player.place === 2 ? '#AEBBCB' : '#8B5E3C'}
                        viewBox="0 0 28 20"
                        fill="none"
                      >
                        <ellipse cx="20" cy="14" rx="6" ry="3" fill={player.place === 2 ? '#AEBBCB' : '#8B5E3C'} opacity="0.85" transform="rotate(-30 20 14)" />
                        <ellipse cx="13" cy="9" rx="5" ry="2.5" fill={player.place === 2 ? '#AEBBCB' : '#8B5E3C'} opacity="0.7" transform="rotate(-50 13 9)" />
                        <ellipse cx="8" cy="5" rx="4" ry="2" fill={player.place === 2 ? '#AEBBCB' : '#8B5E3C'} opacity="0.55" transform="rotate(-65 8 5)" />
                        <line x1="24" y1="16" x2="6" y2="4" stroke={player.place === 2 ? '#AEBBCB' : '#8B5E3C'} strokeWidth="1" opacity="0.5" />
                      </WingDecor>
                    )}
                    <RankBadge $place={player.place as 1 | 2 | 3}>{player.place}</RankBadge>
                    {player.place !== 1 && (
                      <WingDecor
                        $color={player.place === 2 ? '#AEBBCB' : '#8B5E3C'}
                        $mirror
                        viewBox="0 0 28 20"
                        fill="none"
                      >
                        <ellipse cx="20" cy="14" rx="6" ry="3" fill={player.place === 2 ? '#AEBBCB' : '#8B5E3C'} opacity="0.85" transform="rotate(-30 20 14)" />
                        <ellipse cx="13" cy="9" rx="5" ry="2.5" fill={player.place === 2 ? '#AEBBCB' : '#8B5E3C'} opacity="0.7" transform="rotate(-50 13 9)" />
                        <ellipse cx="8" cy="5" rx="4" ry="2" fill={player.place === 2 ? '#AEBBCB' : '#8B5E3C'} opacity="0.55" transform="rotate(-65 8 5)" />
                        <line x1="24" y1="16" x2="6" y2="4" stroke={player.place === 2 ? '#AEBBCB' : '#8B5E3C'} strokeWidth="1" opacity="0.5" />
                      </WingDecor>
                    )}
                  </BadgeRow>
                  {player.place === 1 && (
                    <LaurelWreath viewBox="0 0 120 44" fill="none">
                      <ellipse cx="18" cy="28" rx="7" ry="4" fill="#C8960C" opacity="0.9" transform="rotate(-35 18 28)" />
                      <ellipse cx="10" cy="22" rx="6" ry="3.5" fill="#C8960C" opacity="0.85" transform="rotate(-55 10 22)" />
                      <ellipse cx="6" cy="14" rx="5.5" ry="3" fill="#C8960C" opacity="0.75" transform="rotate(-70 6 14)" />
                      <ellipse cx="8" cy="6" rx="5" ry="2.5" fill="#C8960C" opacity="0.6" transform="rotate(-80 8 6)" />
                      <line x1="60" y1="38" x2="8" y2="8" stroke="#8B6914" strokeWidth="1.2" opacity="0.6" />
                      <ellipse cx="102" cy="28" rx="7" ry="4" fill="#C8960C" opacity="0.9" transform="rotate(35 102 28)" />
                      <ellipse cx="110" cy="22" rx="6" ry="3.5" fill="#C8960C" opacity="0.85" transform="rotate(55 110 22)" />
                      <ellipse cx="114" cy="14" rx="5.5" ry="3" fill="#C8960C" opacity="0.75" transform="rotate(70 114 14)" />
                      <ellipse cx="112" cy="6" rx="5" ry="2.5" fill="#C8960C" opacity="0.6" transform="rotate(80 112 6)" />
                      <line x1="60" y1="38" x2="112" y2="8" stroke="#8B6914" strokeWidth="1.2" opacity="0.6" />
                      <polygon points="60,30 56,38 60,36 64,38" fill="#FFD700" opacity="0.9" />
                    </LaurelWreath>
                  )}
                  <WinnerName $place={player.place as 1 | 2 | 3}>{player.name}</WinnerName>
                  <TrophyBox>
                    <FaTrophy />
                  </TrophyBox>
                  <WinnerScore>
                    {player.score} {t('points_label')}
                  </WinnerScore>
                  <Reward $place={player.place as 1 | 2 | 3}>
                    <FaGem />
                    {player.reward}
                    <span>{t('currency_label')}</span>
                  </Reward>
                </CardInfo>
              </WinnerCard>
            ))}
          </PodiumGrid>

          <Countdown>
            <div className="label">
              <FaClock />
              {t('ends_in')}
            </div>
            <strong>
              {!mounted ? '...' : done ? '---' : `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`}
            </strong>
          </Countdown>

          <LeaderboardTable>
            <TableHeader>
              <div>{t('col_rank')}</div>
              <div>{t('col_player')}</div>
              <div>{t('col_points')}</div>
              <div>{t('col_reward')}</div>
            </TableHeader>
            {rankingRows.map((row) => (
              <TableRow key={row.rank}>
                <RankCell>{row.rank}</RankCell>
                <NameCell>{row.name}</NameCell>
                <PointsCell>
                  {row.points} {t('points_label')}
                </PointsCell>
                <RewardCell>
                  <FaGem />
                  {row.reward} {t('currency_label')}
                </RewardCell>
              </TableRow>
            ))}
          </LeaderboardTable>
        </SectionInner>
      </LeaderboardSection>
    </Page>
  );
}
