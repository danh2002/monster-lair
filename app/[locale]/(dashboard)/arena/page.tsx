'use client';

import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FaClock } from '@react-icons/all-files/fa/FaClock';
import { FaGem } from '@react-icons/all-files/fa/FaGem';
import { FaTrophy } from '@react-icons/all-files/fa/FaTrophy';
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
  { name: 'Brian Ngo', reward: '50,000', score: '2,000 điểm', place: 2, height: 178 },
  { name: 'Jolie Joie', reward: '100,000', score: '2,000 điểm', place: 1, height: 210 },
  { name: 'David Do', reward: '20,000', score: '2,000 điểm', place: 3, height: 178 },
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
  background-attachment: fixed;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: url('/images/hero-dinosaur.png');
    background-size: cover;
    background-position: center 35%;
    opacity: 0.7;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(135deg, rgba(60, 20, 10, 0.75), rgba(30, 15, 40, 0.75)),
      linear-gradient(180deg, rgba(20, 10, 15, 0.8), rgba(25, 15, 35, 0.9));
  }
`;

const PodiumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: clamp(1.5rem, 3vw, 3rem);
  width: min(100%, 1100px);
  margin: 0 auto 4rem;
  padding: 2rem 1rem 0;
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-width: 380px;
    margin-inline: auto;
    gap: 2.5rem;
  }
`;

const WinnerCard = styled.div<{ $height: number; $first?: boolean }>`
  position: relative;
  min-height: ${(props) => props.$height - 40}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2.5rem 1.8rem 2.2rem;
  padding-top: ${(props) => (props.$first ? '3.5rem' : '2.5rem')};
  background:
    linear-gradient(135deg, rgba(200, 90, 30, 0.35) 0%, rgba(180, 70, 20, 0.3) 100%),
    linear-gradient(180deg, rgba(255, 140, 40, 0.15), rgba(200, 80, 20, 0.1));
  border: 1.5px solid rgba(255, 160, 60, 0.45);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 200, 100, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  transform: ${(props) => (props.$first ? 'translateY(-15px) scale(1.05)' : 'none')};
  transition: all 0.3s ease;

  @media (max-width: ${theme.breakpoints.md}) {
    transform: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 35%;
    left: 15%;
    right: 15%;
    height: 1px;
    background: rgba(255, 200, 100, 0.15);
  }
`;

const WinnerAvatar = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  width: 85px;
  height: 85px;
  transform: translateX(-50%);
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 200, 100, 0.5);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(255, 140, 40, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, rgba(200, 100, 40, 0.4), rgba(150, 80, 30, 0.3));
  backdrop-filter: blur(8px);
  z-index: 2;
`;

const WinnerName = styled.h3`
  margin: 0 0 1.4rem;
  color: #fff;
  font-size: 1.32rem;
  font-weight: 900;
  text-shadow: 0 3px 5px rgba(0, 0, 0, 0.36);
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
  font-size: 0.75rem;
  margin-bottom: 1.4rem;
`;

const Reward = styled.div`
  color: #fff;
  font-size: 1.58rem;
  font-weight: 900;

  svg {
    color: #ffcf24;
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
  margin: 0 auto 3rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 600;

  svg {
    display: inline-block;
    margin: 0 0.6rem 0.2rem 0;
    color: #ff3333;
    font-size: 1.2rem;
    animation: pulse 2s infinite;
  }

  strong {
    display: block;
    margin-top: 0.4rem;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 900;
    letter-spacing: 0.05em;
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
  margin-top: 2rem;
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 1.8rem;
  background:
    linear-gradient(135deg, rgba(150, 70, 30, 0.25) 0%, rgba(120, 60, 25, 0.2) 100%);
  border: 1px solid rgba(255, 160, 60, 0.35);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 200, 100, 0.15);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 2.5fr 1.2fr 150px;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  background: rgba(255, 160, 60, 0.2);
  border-bottom: 2px solid rgba(255, 160, 60, 0.4);
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: capitalize;
  letter-spacing: 0.02em;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    padding: 1rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2.5fr 1.2fr 150px;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem 1.5rem;
  margin-bottom: 0.6rem;
  background: rgba(120, 50, 20, 0.2);
  border-left: 3px solid ${theme.colors.primary.main};
  border-radius: 10px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 160, 60, 0.2);

  &:hover {
    background: rgba(150, 70, 30, 0.3);
    border-left-color: ${theme.colors.primary.light};
    box-shadow: 0 4px 12px rgba(255, 140, 40, 0.2);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    padding: 1rem;
  }
`;

const RankCell = styled.div`
  font-weight: 900;
  font-size: 1.3rem;
  color: ${theme.colors.primary.main};
  text-align: left;
  text-shadow: 0 2px 8px rgba(255, 140, 40, 0.3);
`;

const NameCell = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
  letter-spacing: 0.005em;
`;

const PointsCell = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
  text-align: left;
  font-family: var(--font-inter), monospace;

  @media (max-width: ${theme.breakpoints.md}) {
    text-align: left;
  }
`;

const RewardCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${theme.colors.primary.main};

  svg {
    color: #ffcf24;
    font-size: 1.1rem;
    filter: drop-shadow(0 0 3px rgba(255, 207, 36, 0.5));
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
          <SectionTitle>
            {t('leaderboardSectionTitleTop')} <span>{t('leaderboardSectionTitleEmphasis')}</span>
          </SectionTitle>

          <PodiumGrid>
            {podiumPlayers.map((player) => (
              <WinnerCard key={player.name} $height={player.height} $first={player.place === 1}>
                <WinnerAvatar>
                  <Image src="/images/rank-avatar.webp" alt={player.name} fill sizes="90px" style={{ objectFit: 'cover' }} />
                </WinnerAvatar>
                <WinnerName>{player.name}</WinnerName>
                <TrophyBox>
                  <FaTrophy />
                </TrophyBox>
                <WinnerScore>{player.score}</WinnerScore>
                <Reward>
                  <FaGem />
                  {player.reward}
                  <span>{t('rewardSuffix')}</span>
                </Reward>
              </WinnerCard>
            ))}
          </PodiumGrid>

          <Countdown>
            <FaClock />
            {done ? t('countdownDone') : t('countdownLabel')}
            <strong>
              {!mounted ? '...' : done ? '---' : `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`}
            </strong>
          </Countdown>

          <LeaderboardTable>
            <TableHeader>
              <div>{t('tableRank')}</div>
              <div>{t('tablePlayers')}</div>
              <div>{t('tablePoints')}</div>
              <div>{t('tableReward')}</div>
            </TableHeader>
            {rankingRows.map((row) => (
              <TableRow key={row.rank}>
                <RankCell>{row.rank}</RankCell>
                <NameCell>{row.name}</NameCell>
                <PointsCell>{row.points}</PointsCell>
                <RewardCell>
                  <FaGem />
                  {row.reward}
                </RewardCell>
              </TableRow>
            ))}
          </LeaderboardTable>
        </SectionInner>
      </LeaderboardSection>
    </Page>
  );
}
