'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaCoins } from '@react-icons/all-files/fa/FaCoins';
import { FaUsers } from '@react-icons/all-files/fa/FaUsers';

const Card = styled(motion.section)`
  position: relative;
  min-height: 600px;
  min-width: 0;
  border-radius: 14px;
  border: 1px solid rgba(255, 150, 60, 0.3);
  background:
    linear-gradient(180deg, rgba(255, 140, 46, 0.1), rgba(8, 10, 14, 0.92) 28%),
    rgba(8, 10, 14, 0.92);
  padding: 1.55rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
    inset: 0;
    background:
      linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.82)),
      radial-gradient(circle at 52% 20%, rgba(255, 138, 42, 0.22), transparent 48%),
      url('/images/feature-war.jpg') center/cover no-repeat;
    opacity: 0.22;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    width: 16px;
    height: 16px;
    border-top: 2px solid rgba(255, 140, 46, 0.7);
    border-left: 2px solid rgba(255, 140, 46, 0.7);
    z-index: 1;
  }
`;

const CornerBR = styled.span`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 16px;
  height: 16px;
  border-right: 2px solid rgba(255, 140, 46, 0.7);
  border-bottom: 2px solid rgba(255, 140, 46, 0.7);
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
`;

const Label = styled.div`
  color: #ff933a;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const SeasonName = styled.h3`
  margin: 0.35rem 0 1.05rem;
  color: #fff;
  font-size: clamp(2rem, 2.8vw, 2.7rem);
  font-style: italic;
  font-weight: 900;
  text-transform: uppercase;
  line-height: 1.03;
  text-shadow: 0 0 24px rgba(255, 154, 58, 0.32);

  span {
    color: #ff933a;
    text-shadow: 0 0 24px rgba(255, 154, 58, 0.4);
  }
`;

const EndLabel = styled.div`
  text-align: center;
  color: #ff933a;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0.4rem 0 0.75rem;
`;

const CountdownRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.35rem, 0.7vw, 0.65rem);
`;

const TimeBox = styled.div`
  min-width: 0;
  min-height: 72px;
  border-radius: 10px;
  padding: 0.45rem 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(4, 6, 9, 0.86);
  box-shadow: inset 0 0 0 1px rgba(255, 160, 70, 0.1), inset 0 -8px 14px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    border-color: rgba(255, 170, 88, 0.5);
    box-shadow: 0 0 18px rgba(255, 140, 46, 0.2), inset 0 -8px 14px rgba(0, 0, 0, 0.35);
  }

  strong {
    color: #ff9b34;
    font-size: clamp(1.45rem, 2vw, 2rem);
    font-weight: 900;
    line-height: 1;
    white-space: nowrap;
    text-shadow: 0 0 8px rgba(255, 155, 52, 0.25);
  }

  span {
    margin-top: 0.24rem;
    color: rgba(255, 255, 255, 0.72);
    font-size: clamp(0.52rem, 0.65vw, 0.62rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    white-space: nowrap;
  }
`;

const StatGrid = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
`;

const Stat = styled.div`
  min-width: 0;
  min-height: 72px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  padding: 0.7rem 0.85rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.32rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: clamp(0.55rem, 0.7vw, 0.66rem);
    line-height: 1.25;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;

    svg {
      color: #ffb764;
      font-size: 0.72rem;
    }
  }

  strong {
    margin-top: 0.38rem;
    display: block;
    color: #ff9b34;
    font-size: clamp(1.2rem, 1.6vw, 1.55rem);
    line-height: 1.05;
    word-break: keep-all;
    font-weight: 900;
  }
`;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function SeasonCountdown() {
  const t = useTranslations('ranking');
  const target = useMemo(() => Date.now() + 10 * 24 * 60 * 60 * 1000, []);
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()));
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <Card initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <CornerBR />
      <Content>
        <Label>{t('season.currentLabel')}</Label>
        <SeasonName>
          <span>{t('season.name')}</span>
        </SeasonName>
        <EndLabel>KẾT THÚC SAU</EndLabel>

        <CountdownRow>
          <TimeBox>
            <strong>{pad(days)}</strong>
            <span>NGÀY</span>
          </TimeBox>
          <TimeBox>
            <strong>{pad(hours)}</strong>
            <span>GIỜ</span>
          </TimeBox>
          <TimeBox>
            <strong>{pad(minutes)}</strong>
            <span>PHÚT</span>
          </TimeBox>
          <TimeBox>
            <strong>{pad(seconds)}</strong>
            <span>GIÂY</span>
          </TimeBox>
        </CountdownRow>

        <StatGrid>
          <Stat>
            <span>
              <FaCoins /> {t('season.totalRewardLabel')}
            </span>
            <strong>{t('season.totalReward')}</strong>
          </Stat>
          <Stat>
            <span>
              <FaUsers /> {t('season.participantsLabel')}
            </span>
            <strong>{t('season.participants')}</strong>
          </Stat>
        </StatGrid>
      </Content>
    </Card>
  );
}
