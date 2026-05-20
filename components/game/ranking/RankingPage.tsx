'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { theme } from '@/styles/theme';
import { HallOfFame } from './HallOfFame';
import { rankingByCategory, rewardCards, hallOfFameData } from './mockData';
import { RankingTable } from './RankingTable';
import { RankingTabs } from './RankingTabs';
import { RewardPreview } from './RewardPreview';
import { SeasonCountdown } from './SeasonCountdown';
import { TopThreeShowcase } from './TopThreeShowcase';
import { RankingCategory } from './types';

const Page = styled.div`
  background: #050608;
  color: #fff;
  overflow-x: clip;
`;

const Hero = styled.section`
  min-height: 500px;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background: url('/images/hero-dinosaur.png') center 35% / cover no-repeat;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(circle at 15% 10%, rgba(255, 120, 20, 0.22), transparent 42%),
      radial-gradient(circle at 75% 18%, rgba(255, 120, 20, 0.15), transparent 36%),
      linear-gradient(180deg, rgba(5, 7, 11, 0.52), rgba(8, 7, 6, 0.9));
  }
`;

const Corner = styled.div`
  position: absolute;
  inset: 24px;
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
    opacity: 0.78;
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
    left: 0;
    bottom: 0;
    border-width: 0 0 2px 2px;
  }

  span::after {
    right: 0;
    bottom: 0;
    border-width: 0 2px 2px 0;
  }
`;

const HeroContent = styled(motion.div)`
  text-align: center;
  width: min(100%, 980px);
  padding: 2rem;
`;

const HeroLogo = styled.div`
  position: relative;
  width: min(100%, 280px);
  aspect-ratio: 560 / 170;
  margin: 0 auto 1rem;
  filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.7));
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(3rem, 9vw, 7rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  color: #ffd6ae;
  text-shadow: 0 0 20px rgba(255, 120, 22, 0.6), 0 12px 14px rgba(0, 0, 0, 0.7);
`;

const HeroSubtitle = styled.p`
  margin: 0.95rem auto 0;
  width: min(100%, 760px);
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.16rem;
`;

const Section = styled.section`
  width: min(100%, 1320px);
  margin: 0 auto;
  padding: 0 1rem 3.2rem;
  padding-top: 2rem;
`;

const Divider = styled.div`
  height: 1px;
  margin-top: 1.2rem;
  background: linear-gradient(90deg, transparent, rgba(255, 132, 32, 0.55), transparent);
`;

const LowerGrid = styled.div`
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr) minmax(0, 1.05fr);
  gap: 32px;
  align-items: stretch;

  > * {
    min-height: 600px;
    height: 100%;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > :nth-child(2) {
      grid-column: 1 / -1;
      order: -1;
    }
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;

    > * {
      min-height: auto;
    }

    > :nth-child(2) {
      grid-column: auto;
      order: -1;
    }
  }
`;

export function RankingPage() {
  const t = useTranslations('ranking');
  const [activeCategory, setActiveCategory] = useState<RankingCategory>('topup');

  const data = useMemo(() => rankingByCategory[activeCategory], [activeCategory]);

  return (
    <Page>
      <Hero>
        <Corner>
          <span />
        </Corner>
        <HeroContent initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <HeroLogo>
            <Image src="/images/dao-khung-long-logo.png" alt={t('logoAlt')} fill sizes="280px" style={{ objectFit: 'contain' }} />
          </HeroLogo>
          <HeroTitle>{t('page_title')}</HeroTitle>
          <HeroSubtitle>{t('page_subtitle')}</HeroSubtitle>
        </HeroContent>
      </Hero>

      <Section>
        <RankingTabs
          active={activeCategory}
          onChange={setActiveCategory}
          labels={{
            topup: t('tab_topup'),
            arena: t('tab_arena'),
            daily: t('tab_daily'),
            weekly: t('tab_weekly'),
          }}
        />

        <TopThreeShowcase players={data.topPlayers} />
        <Divider />
        <RankingTable
          rows={data.entries}
          headers={[
            t('col_ranking'),
            t('col_players'),
            t('col_guild'),
            t('col_score'),
            t('col_title'),
            t('col_award'),
          ]}
        />

        <LowerGrid>
          <SeasonCountdown />
          <RewardPreview items={rewardCards} />
          <HallOfFame items={hallOfFameData} />
        </LowerGrid>
      </Section>
    </Page>
  );
}
