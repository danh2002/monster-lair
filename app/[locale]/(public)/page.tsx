'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, animate, useInView, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { FaDownload } from '@react-icons/all-files/fa/FaDownload';
import { FaFire } from '@react-icons/all-files/fa/FaFire';
import { FaPlayCircle } from '@react-icons/all-files/fa/FaPlayCircle';
import { FaShareAlt } from '@react-icons/all-files/fa/FaShareAlt';
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube';
import { theme } from '@/styles/theme';
import { useTranslations } from 'next-intl';
import { BannerSlider } from '@/components/marketing/BannerSlider';

const rankers = [
  { name: 'Cody Fisher', rank: 1, points: 1500 },
  { name: 'Kathryn Murphy', rank: 2, points: 1200 },
  { name: 'Kristin Watson', rank: 3, points: 500 },
  { name: 'Jerome Bell', rank: 4, points: 300 },
  { name: 'Annette Black', rank: 5, points: 200 },
];

const podium = [
  { name: 'Robert', place: '2nd', points: 1200, height: 74 },
  { name: 'Brook', place: '1st', points: 1500, height: 94 },
  { name: 'Darrell', place: '3rd', points: 500, height: 60 },
];

const featureCards = [
  {
    icon: '☠',
    title: 'feature1Title',
    image: '/images/hero-dinosaur.png',
    description: 'feature1Description',
    tags: ['feature1Tag1', 'feature1Tag2', 'feature1Tag3'],
  },
  {
    icon: '●',
    title: 'feature2Title',
    image: '/images/feature-herd.webp',
    badge: 'feature2Badge',
    description: 'feature2Description',
    tags: ['feature2Tag1', 'feature2Tag2', 'feature2Tag3'],
  },
  {
    icon: '♘',
    title: 'feature3Title',
    image: '/images/feature-war.jpg',
    description: 'feature3Description',
    tags: ['feature3Tag1', 'feature3Tag2', 'feature3Tag3'],
  },
];

const stats = [
  { value: '2M+', label: 'statsPlayer' },
  { value: '50+', label: 'statsSpecies' },
  { value: '100v100', label: 'statsPvp' },
  { value: '4.8★', label: 'statsRating' },
];

const HomeShell = styled.section`
  position: relative;
  min-height: calc(100vh - 58px);
  overflow: hidden;
  background: #0d1110;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: url('/images/hero-dinosaur.png');
    background-size: cover;
    background-position: 62% 46%;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.5) 34%, rgba(0, 0, 0, 0.16) 62%, rgba(0, 0, 0, 0.62) 100%),
      linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(18, 7, 1, 0.9) 100%);
  }
`;

const ContentGrid = styled.div`
  width: min(100%, 1180px);
  min-height: calc(100vh - 58px);
  margin: 0 auto;
  padding: clamp(2.7rem, 7.5vh, 5.6rem) clamp(1rem, 3vw, 2rem) 2.5rem;
  display: grid;
  grid-template-columns: minmax(540px, 1fr) minmax(330px, 390px);
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    align-items: start;
    padding-top: 3rem;
  }
`;

const HeroCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: min(100%, 560px);
  transform: translateY(0.35rem);

  @media (max-width: ${theme.breakpoints.lg}) {
    transform: none;
  }
`;

const Eyebrow = styled.div`
  width: min(100%, 438px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.9rem;
  color: ${theme.colors.primary.main};
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.48rem;
  margin: 0 0 1.1rem;

  &::before,
  &::after {
    content: '';
    height: 1px;
    background: rgba(255, 106, 0, 0.5);
  }
`;

const LogoWrap = styled.div`
  position: relative;
  width: min(100%, 520px);
  aspect-ratio: 560 / 170;
  margin: 0 0 1.25rem -0.7rem;
  filter: drop-shadow(0 12px 10px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 10px rgba(255, 106, 0, 0.34));

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-left: -0.35rem;
  }
`;

const Tagline = styled.h1`
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(1.1rem, 1.75vw, 1.36rem);
  font-weight: 800;
  letter-spacing: 0.34rem;
  line-height: 1.3;
  text-transform: uppercase;
`;

const Description = styled.p`
  margin-top: 1.65rem;
  max-width: 500px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.96rem;
  line-height: 1.8;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-top: 2.45rem;

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
    flex-direction: column;
  }
`;

const HeroButton = styled.button<{ $primary?: boolean }>`
  min-width: ${(props) => (props.$primary ? '238px' : '274px')};
  height: 74px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: ${(props) => (props.$primary ? '0' : '1px solid rgba(255, 255, 255, 0.28)')};
  background: ${(props) => (props.$primary ? '#e85d00' : 'rgba(14, 15, 17, 0.45)')};
  color: #fff;
  font-size: 1.45rem;
  font-style: italic;
  font-weight: 900;
  text-transform: uppercase;
  clip-path: ${(props) =>
    props.$primary ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)' : 'none'};
  transition:
    transform ${theme.transitions.fast},
    background ${theme.transitions.fast},
    border-color ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    background: ${(props) => (props.$primary ? '#ff6a00' : 'rgba(255, 255, 255, 0.08)')};
    border-color: rgba(255, 255, 255, 0.48);
  }

  svg {
    font-size: 1.25rem;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const ScrollHint = styled.div`
  position: absolute;
  left: 50%;
  bottom: 3.1rem;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.13rem;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const RankingPanel = styled.aside`
  align-self: center;
  width: 100%;
  color: #fff;

  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 430px;
    justify-self: center;
  }
`;

const RankingTitle = styled.h2`
  text-align: center;
  margin-bottom: 1.35rem;
  color: #fff;
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;

  span {
    color: ${theme.colors.primary.light};
  }
`;

const Podium = styled.div`
  height: 154px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: 0.32rem;
  padding: 0 3.1rem;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 1rem;
  }
`;

const PodiumSlot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.div<{ $size?: number }>`
  position: relative;
  width: ${(props) => props.$size ?? 48}px;
  height: ${(props) => props.$size ?? 48}px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.35);
  flex: 0 0 auto;
`;

const PodiumName = styled.div`
  margin: 0.25rem 0 0.35rem;
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.75rem;
  font-weight: 800;
`;

const PodiumBlock = styled.div<{ $height: number; $first?: boolean }>`
  width: 74px;
  height: ${(props) => props.$height - 15}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px 10px 0 0;
  background: ${(props) =>
    props.$first
      ? 'linear-gradient(180deg, #f47912 0%, rgba(244, 121, 18, 0.42) 100%)'
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.28) 100%)'};
  color: ${(props) => (props.$first ? '#fff' : '#4e4e4e')};
  font-size: 0.76rem;
  font-weight: 900;
  line-height: 1.05;

  span {
    margin-top: 0.25rem;
    padding: 0.12rem 0.46rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.35);
    font-size: 0.65rem;
    
  }
`;

const RankingTable = styled.div`
  overflow: hidden;
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(33, 30, 28, 0.58) 0%, rgba(31, 29, 28, 0.8) 100%);
  backdrop-filter: blur(3px);
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 86px 72px;
  align-items: center;
  height: 42px;
  padding: 0 1rem 0 1.35rem;
  background: rgba(160, 92, 39, 0.86);
  color: #fff;
  font-size: 0.86rem;
  font-weight: 700;
`;

const RankingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 86px 72px;
  align-items: center;
  min-height: 66px;
  padding: 0 1rem 0 1.35rem;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.86rem;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.02);
  }
`;

const Player = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const LandingSection = styled.section<{ $background?: string }>`
  position: relative;
  overflow: hidden;
  background: #070707;
  border-top: 1px solid rgba(255, 106, 0, 0.22);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -3;
    background-image: ${(props) => (props.$background ? `url('${props.$background}')` : "url('/images/hero-dinosaur.png')")};
    background-size: cover;
    background-position: center;
    opacity: 0.55;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(circle at 50% 0%, rgba(255, 106, 0, 0.18), transparent 34%),
      linear-gradient(180deg, rgba(6, 6, 6, 0.76), rgba(7, 7, 7, 0.92));
  }
`;

const SectionInner = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(4rem, 8vw, 6.4rem) clamp(1rem, 3vw, 2rem);
`;

const SectionHeading = styled.div`
  text-align: center;
  margin-bottom: clamp(2.5rem, 5vw, 4.4rem);
`;

const MiniLabel = styled.div`
  display: inline-grid;
  grid-template-columns: 72px auto 72px;
  align-items: center;
  gap: 0.75rem;
  color: ${theme.colors.primary.main};
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.24rem;
  text-transform: uppercase;
  margin-bottom: 0.7rem;

  &::before,
  &::after {
    content: '';
    height: 1px;
    background: rgba(255, 106, 0, 0.58);
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: clamp(2.4rem, 5.4vw, 4.6rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1.12;
  text-transform: uppercase;

  span {
    display: block;
    color: ${theme.colors.primary.light};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.45rem;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 560px;
    margin: 0 auto;
  }
`;

const FeatureCard = styled.article`
  position: relative;
  min-height: 394px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.92);
  border: 1px solid rgba(255, 106, 0, 0.16);
  box-shadow: 0 20px 46px rgba(0, 0, 0, 0.45);
`;

const FeatureImage = styled.div`
  position: absolute;
  inset: 0 0 auto;
  height: 52%;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(10, 10, 10, 0.92));
  }
`;

const FeatureIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: ${theme.colors.primary.main};
  color: #fff;
  font-size: 0.85rem;
  font-weight: 900;
`;

const FeatureBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 2;
  padding: 0.25rem 0.55rem;
  background: ${theme.colors.primary.main};
  color: #fff;
  font-size: 0.5rem;
  font-weight: 900;
  text-transform: uppercase;
`;

const FeatureBody = styled.div`
  position: relative;
  z-index: 1;
  padding: 0 1.5rem 1.25rem;
`;

const FeatureTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 0 0 0.85rem;
  color: #fff;
  font-size: 1.35rem;
  font-weight: 900;
  text-transform: uppercase;

  &::before {
    content: '';
    width: 3px;
    height: 28px;
    background: ${theme.colors.primary.main};
  }
`;

const FeatureText = styled.p`
  margin: 0 0 1.1rem;
  color: rgba(255, 255, 255, 0.56);
  font-size: 0.78rem;
  line-height: 1.7;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1.15rem;
  color: rgba(255, 255, 255, 0.42);
  font-size: 0.58rem;
`;

const FeatureLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: ${theme.colors.primary.main};
  font-size: 0.62rem;
  font-weight: 900;
  text-decoration: none;
  text-transform: uppercase;
`;

const TrailerSection = styled(LandingSection)`
  &::before {
    opacity: 0.4;
    filter: saturate(0.7);
  }

  &::after {
    background:
      radial-gradient(ellipse at 50% 42%, rgba(255, 106, 0, 0.3), transparent 44%),
      radial-gradient(ellipse at 50% 42%, transparent 0 37%, rgba(0, 0, 0, 0.94) 72%),
      linear-gradient(180deg, rgba(8, 8, 8, 0.78), rgba(8, 8, 8, 0.96));
  }
`;

const VideoFrame = styled.div`
  position: relative;
  width: min(100%, 930px);
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.65);

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: 2;
    width: 42px;
    height: 42px;
    border-color: ${theme.colors.primary.main};
    border-style: solid;
  }

  &::before {
    top: 12px;
    left: 12px;
    border-width: 2px 0 0 2px;
  }

  &::after {
    right: 12px;
    bottom: 12px;
    border-width: 0 2px 2px 0;
  }
`;

const PlayButton = styled.button`
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: ${theme.colors.primary.main};
  color: #fff;
  font-size: 1.45rem;
  box-shadow: 0 0 0 16px rgba(255, 106, 0, 0.18);
`;

const TrailerCaption = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% + 52px);
  z-index: 3;
  text-align: center;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.18rem;
  text-transform: uppercase;

  span {
    display: block;
    margin-top: 0.35rem;
    color: rgba(255, 255, 255, 0.66);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.08rem;
    text-transform: none;
  }
`;

const VideoMeta = styled.div`
  width: min(100%, 930px);
  margin: 1.05rem auto 0;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.64rem;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const MetaGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.3rem;
`;

const MetaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  height: 28px;
  padding: 0 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
`;

const CtaSection = styled.section`
  position: relative;
  overflow: hidden;
  background: #080808;
  border-top: 1px solid rgba(255, 106, 0, 0.18);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background-image: url('/images/cta-dinosaur.jpg');
    background-size: cover;
    background-position: center 45%;
    opacity: 0.5;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(90deg, rgba(7, 7, 7, 0.94), rgba(7, 7, 7, 0.74) 48%, rgba(7, 7, 7, 0.5));
  }
`;

const CtaInner = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(3.5rem, 7vw, 5.4rem) clamp(1rem, 3vw, 2rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const CtaTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: clamp(2.2rem, 5vw, 4.3rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1.06;
  text-transform: uppercase;

  span {
    display: block;
    color: ${theme.colors.primary.light};
  }
`;

const CtaText = styled.p`
  max-width: 455px;
  margin: 1.3rem 0 1.8rem;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.82rem;
  line-height: 1.7;
`;

const DownloadButton = styled(HeroButton)`
  min-width: 214px;
  height: 52px;
  gap: 0.75rem;
  font-size: 0.82rem;
  letter-spacing: 0.08rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 1.3rem 3.4rem;
  justify-self: end;
  width: min(100%, 390px);

  @media (max-width: ${theme.breakpoints.md}) {
    justify-self: start;
  }
`;

const StatItem = styled.div`
  color: ${theme.colors.primary.main};
  font-size: clamp(1.6rem, 3.4vw, 2.35rem);
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  text-shadow: 0 0 18px rgba(255, 106, 0, 0.32);

  span {
    display: block;
    margin-top: 0.45rem;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08rem;
  }
`;

const MotionEyebrow = m.create(Eyebrow);
const MotionLogoWrap = m.create(LogoWrap);
const MotionTagline = m.create(Tagline);
const MotionDescription = m.create(Description);
const MotionButtonRow = m.create(ButtonRow);
const MotionHeroButton = m.create(HeroButton);
const MotionScrollHint = m.create(ScrollHint);
const MotionRankingPanel = m.create(RankingPanel);
const MotionRankingRow = m.create(RankingRow);
const MotionPodiumBlock = m.create(PodiumBlock);
const MotionSectionHeading = m.create(SectionHeading);
const MotionMiniLabel = m.create(MiniLabel);
const MotionFeatureCard = m.create(FeatureCard);
const MotionVideoFrame = m.create(VideoFrame);
const MotionPlayButton = m.create(PlayButton);
const MotionVideoMeta = m.create(VideoMeta);
const MotionCtaTitle = m.create(CtaTitle);
const MotionCtaText = m.create(CtaText);
const MotionDownloadButton = m.create(DownloadButton);
const MotionStatItem = m.create(StatItem);

const smoothEase = [0.25, 0.1, 0.25, 1] as const;
const scrollViewport = { once: true, margin: '-60px' as const };
const motionStyle = { willChange: 'transform' };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase } },
};

const titleLine = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase } },
};

function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, scrollViewport);
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(value === '100v100' ? value : '0');
  const formattedValue = useTransform(count, (latest) => {
    if (value === '2M+') return `${Math.round(latest)}M+`;
    if (value === '50+') return `${Math.round(latest)}+`;
    if (value.includes('4.8')) return `${latest.toFixed(1)}★`;
    return value;
  });

  useMotionValueEvent(formattedValue, 'change', setDisplayValue);

  useEffect(() => {
    if (!inView || value === '100v100') return;

    const target = value === '2M+' ? 2 : value === '50+' ? 50 : 4.8;
    const controls = animate(count, target, { duration: 1.5, ease: 'easeOut' });

    return () => controls.stop();
  }, [count, inView, value]);

  return <div ref={ref}>{value === '100v100' ? value : displayValue}</div>;
}

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <LazyMotion features={domAnimation}>
      <HomeShell>
        <ContentGrid>
          <HeroCopy>
            <MotionEyebrow initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }} style={motionStyle}>
              {t('eyebrow')}
            </MotionEyebrow>
            <MotionLogoWrap
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
              style={motionStyle}
            >
              <Image src="/images/dao-khung-long-logo.png" alt={t('logoAlt')} fill sizes="430px" style={{ objectFit: 'contain' }} priority />
            </MotionLogoWrap>
            <MotionTagline
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: smoothEase }}
              style={motionStyle}
            >
              {t('tagline')}
            </MotionTagline>
            <MotionDescription
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: smoothEase }}
              style={motionStyle}
            >
              {t('description')}
            </MotionDescription>
            <MotionButtonRow
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: smoothEase }}
              style={motionStyle}
            >
              <MotionHeroButton type="button" $primary whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: smoothEase }} style={motionStyle}>
                <FaFire />
                {t('loadGame')}
              </MotionHeroButton>
              <MotionHeroButton type="button" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2, ease: smoothEase }} style={motionStyle}>
                <FaPlayCircle />
                {t('watchTrailer')}
              </MotionHeroButton>
            </MotionButtonRow>
          </HeroCopy>

          <MotionRankingPanel
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
            style={motionStyle}
          >
            <RankingTitle>
              {t('rankingTitlePrefix')} <span>{t('rankingTitleHighlight')}</span>
            </RankingTitle>
            <Podium>
              {podium.map((item, index) => (
                <PodiumSlot key={item.name}>
                  <Avatar $size={50}>
                    <Image src="/images/rank-avatar.webp" alt="" fill sizes="50px" style={{ objectFit: 'cover' }} />
                  </Avatar>
                  <PodiumName>{item.name}</PodiumName>
                  <MotionPodiumBlock
                    $height={item.height}
                    $first={item.place === '1st'}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: item.height - 15, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                    style={motionStyle}
                  >
                    {item.place}
                    <span>{item.points}</span>
                  </MotionPodiumBlock>
                </PodiumSlot>
              ))}
            </Podium>

            <RankingTable>
              <TableHead>
                <div>{t('tableName')}</div>
                <div>{t('tableRank')}</div>
                <div>{t('tablePoints')}</div>
              </TableHead>
              {rankers.map((player, index) => (
                <MotionRankingRow
                  key={player.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.65 + index * 0.08, ease: smoothEase }}
                  style={motionStyle}
                >
                  <Player>
                    <Avatar $size={42}>
                      <Image src="/images/rank-avatar.webp" alt="" fill sizes="42px" style={{ objectFit: 'cover' }} />
                    </Avatar>
                    <span>{player.name}</span>
                  </Player>
                  <div>{player.rank}</div>
                  <div>{player.points}</div>
                </MotionRankingRow>
              ))}
            </RankingTable>
          </MotionRankingPanel>
        </ContentGrid>
        <MotionScrollHint
          animate={{ x: '-50%', y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={motionStyle}
        >
          {t('scrollDown')}
        </MotionScrollHint>
      </HomeShell>

      <BannerSlider position="home" />

      <LandingSection>
        <SectionInner>
          <MotionSectionHeading
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase, staggerChildren: 0.12 } },
            }}
            initial="hidden"
            whileInView="show"
            viewport={scrollViewport}
            style={motionStyle}
          >
            <MotionMiniLabel variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, delay: 0.1, ease: smoothEase } } }} style={motionStyle}>
              {t('featuresMiniLabel')}
            </MotionMiniLabel>
            <SectionTitle>
              <m.span variants={titleLine} style={{ ...motionStyle, display: 'block', color: '#fff' }}>
                {t('featuresSectionTitleTop')}
              </m.span>
              <m.span variants={titleLine} style={motionStyle}>
                {t('featuresSectionTitleBottom')}
              </m.span>
            </SectionTitle>
          </MotionSectionHeading>

          <FeatureGrid>
            {featureCards.map((card, index) => (
              <MotionFeatureCard
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={scrollViewport}
                transition={{ duration: 0.5, delay: index * 0.12, ease: smoothEase }}
                whileHover={{ y: -6, scale: 1.01 }}
                style={motionStyle}
              >
                <FeatureImage>
                  <Image src={card.image} alt="" fill sizes="(max-width: 1024px) 100vw, 370px" style={{ objectFit: 'cover' }} />
                </FeatureImage>
                <FeatureIcon>{card.icon}</FeatureIcon>
                {card.badge && <FeatureBadge>{t(card.badge)}</FeatureBadge>}
                <FeatureBody>
                  <FeatureTitle>{t(card.title)}</FeatureTitle>
                  <FeatureText>{t(card.description)}</FeatureText>
                  <TagRow>
                    {card.tags.map((tag) => (
                      <span key={tag}>◆ {t(tag)}</span>
                    ))}
                  </TagRow>
                  <FeatureLink href="#feature">{t('learnMore')}</FeatureLink>
                </FeatureBody>
              </MotionFeatureCard>
            ))}
          </FeatureGrid>
        </SectionInner>
      </LandingSection>

      <TrailerSection $background="/images/feature-war.jpg">
        <SectionInner>
          <MotionSectionHeading
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={scrollViewport}
            style={motionStyle}
          >
            <MiniLabel>{t('officialTrailerMiniLabel')}</MiniLabel>
            <SectionTitle>
              {t('watchOfficialTrailer')}
              <span>{t('official')}</span>
            </SectionTitle>
          </MotionSectionHeading>

          <MotionVideoFrame
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={scrollViewport}
            transition={{ duration: 0.6, ease: smoothEase }}
            style={motionStyle}
          >
            <Image src="/images/trailer-dinosaur.webp" alt={t('trailerCaptionTitle')} fill sizes="930px" style={{ objectFit: 'cover' }} />
            <MotionPlayButton
              type="button"
              aria-label={t('playTrailerAriaLabel')}
              animate={{ x: '-50%', y: '-50%', scale: [1, 1.08, 1] }}
              whileHover={{ x: '-50%', y: '-50%', scale: 1.15 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={motionStyle}
            >
              <FaPlayCircle />
            </MotionPlayButton>
            <TrailerCaption>
              {t('trailerCaptionTitle')}
              <span>{t('trailerCaptionMeta')}</span>
            </TrailerCaption>
          </MotionVideoFrame>
          <MotionVideoMeta
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={scrollViewport}
            transition={{ duration: 0.5, delay: 0.3, ease: smoothEase }}
            style={motionStyle}
          >
            <MetaGroup>
              <span>{t('trailerViews')}</span>
              <span>{t('trailerLikes')}</span>
            </MetaGroup>
            <MetaGroup>
              <span>
                <FaShareAlt /> {t('share')}
              </span>
              <MetaButton type="button">
                <FaYoutube /> {t('watchOnYoutube')}
              </MetaButton>
            </MetaGroup>
          </MotionVideoMeta>
        </SectionInner>
      </TrailerSection>

      <CtaSection>
        <CtaInner>
          <div>
            <MotionCtaTitle
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={scrollViewport}
              transition={{ duration: 0.5, ease: smoothEase }}
              style={motionStyle}
            >
              {t('readyTitleLine1')}
              <br />
              {t('readyTitleLine2')}
              <span>{t('readyTitleEmphasis')}</span>
            </MotionCtaTitle>
            <MotionCtaText
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={scrollViewport}
              transition={{ duration: 0.5, delay: 0.15, ease: smoothEase }}
              style={motionStyle}
            >
              {t('ctaText')}
            </MotionCtaText>
            <MotionDownloadButton
              type="button"
              $primary
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }}
              viewport={scrollViewport}
              transition={{ duration: 0.2, delay: 0.25, ease: smoothEase }}
              style={motionStyle}
            >
              <FaDownload />
              {t('downloadFree')}
            </MotionDownloadButton>
          </div>

          <StatGrid>
            {stats.map((stat, index) => (
              <MotionStatItem
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={scrollViewport}
                transition={{ duration: 0.5, delay: index * 0.1, ease: smoothEase }}
                style={motionStyle}
              >
                <AnimatedStatValue value={stat.value} />
                <span>{t(stat.label)}</span>
              </MotionStatItem>
            ))}
          </StatGrid>
        </CtaInner>
      </CtaSection>
    </LazyMotion>
  );
}
