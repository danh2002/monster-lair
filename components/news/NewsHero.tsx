'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { theme } from '@/styles/theme';

const Hero = styled.section`
  position: relative;
  min-height: 430px;
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
    background-position: center 42%;
    transform: scale(1.08);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.24), rgba(8, 7, 11, 0.96)),
      radial-gradient(circle at 50% 32%, rgba(255, 106, 0, 0.08), rgba(0, 0, 0, 0.74));
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

const Content = styled.div`
  width: min(100%, 960px);
  padding: 6rem 1.25rem 3rem;
  text-align: center;
`;

const Breadcrumb = styled.nav`
  display: inline-flex;
  gap: 0.55rem;
  align-items: center;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;

  a {
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
  }
`;

const Title = styled(motion.h1)`
  margin: 0;
  color: #fff;
  font-size: clamp(3rem, 8vw, 6.8rem);
  font-style: italic;
  font-weight: 900;
  line-height: 0.95;
  text-transform: uppercase;

  span {
    color: ${theme.colors.primary.main};
  }
`;

const Subtitle = styled(motion.p)`
  margin: 1rem auto 0;
  max-width: 620px;
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 700;
`;

export function NewsHero({ title, subtitle }: { title: string; subtitle: string }) {
  const split = title.lastIndexOf(' ');
  const lead = split > -1 ? title.slice(0, split) : title;
  const emphasis = split > -1 ? title.slice(split + 1) : '';

  return (
    <Hero>
      <HeroCorner>
        <span />
      </HeroCorner>
      <Content>
        <Breadcrumb>
          <Link href="/">Trang chủ</Link>
          <span>&gt;</span>
          <span>Tin Tức</span>
        </Breadcrumb>
        <Title initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
          {lead} {emphasis && <span>{emphasis}</span>}
        </Title>
        <Subtitle initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0.14 }}>
          {subtitle}
        </Subtitle>
      </Content>
    </Hero>
  );
}
