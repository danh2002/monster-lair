'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaTrophy } from '@react-icons/all-files/fa/FaTrophy';
import { HallOfFameItem } from './types';

interface HallOfFameProps {
  items: HallOfFameItem[];
}

const Wrap = styled(motion.section)`
  position: relative;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 150, 60, 0.3);
  background:
    linear-gradient(180deg, rgba(255, 140, 46, 0.1), rgba(8, 10, 14, 0.92) 24%),
    rgba(8, 10, 14, 0.92);
  padding: 1.4rem;
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
  margin: 0 0 1.2rem;
  text-align: center;
  color: #ff8c2c;
  font-size: clamp(1.15rem, 1.35vw, 1.55rem);
  line-height: 1.15;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  max-width: 100%;
  overflow-wrap: normal;
  text-wrap: balance;
  text-shadow: 0 0 14px rgba(255, 140, 46, 0.24);

  @media (max-width: 1280px) {
    font-size: clamp(1rem, 1.6vw, 1.35rem);
  }
`;

const List = styled.div`
  display: grid;
  gap: 0.35rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 34px 54px minmax(0, 1fr) max-content;
  gap: 0.85rem;
  align-items: center;
  min-height: 104px;
  padding: 0.75rem 0.55rem;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  &:hover {
    transform: translateX(2px);
    border-color: rgba(255, 150, 60, 0.45);
    box-shadow: 0 0 18px rgba(255, 140, 46, 0.2);
  }
`;

const Avatar = styled.div`
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.35);
`;

const RankIcon = styled.div<{ $rank: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  color: ${(props) => (props.$rank === 1 ? '#f7bb2f' : props.$rank === 2 ? '#c0c0c0' : '#cd7f32')};
  font-size: 1.2rem;
  font-weight: 900;
`;

const TextCol = styled.div`
  min-width: 0;
`;

const User = styled.div`
  color: #fff;
  font-weight: 900;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  margin-top: 0.18rem;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.74rem;
  line-height: 1.45;
`;

const Value = styled.div`
  color: #ff9f3c;
  font-weight: 900;
  font-size: 1.1rem;
  white-space: nowrap;
  text-align: right;
  text-shadow: 0 0 10px rgba(255, 150, 60, 0.22);
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
    border-color: rgba(255, 170, 88, 0.7);
    background: linear-gradient(120deg, rgba(255, 122, 20, 0.35), rgba(9, 10, 12, 0.96));
    transform: translateY(-2px);
    box-shadow: 0 0 24px rgba(255, 130, 30, 0.24);
  }
`;

function formatCompactXu(value: number) {
  return Math.floor(value / 1000).toLocaleString('vi-VN');
}

export function HallOfFame({ items }: HallOfFameProps) {
  const t = useTranslations('ranking');

  return (
    <Wrap initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Title>{t('hallOfFame.title')}</Title>

      <List>
        {items.slice(0, 3).map((item, index) => (
          <Row key={`${item.username}-${item.season}`}>
            <RankIcon $rank={index + 1}>
              <span>{index + 1}</span>
              <FaTrophy />
            </RankIcon>
            <Avatar>
              <Image src={item.avatar} alt={item.username} fill sizes="52px" style={{ objectFit: 'cover' }} />
            </Avatar>
            <TextCol>
              <User>{item.username}</User>
              <Meta>
                {item.season}
                <br />• {item.achievement}
              </Meta>
            </TextCol>
            <Value>
              {formatCompactXu(item.value)} Xu
            </Value>
          </Row>
        ))}
      </List>

      <ViewAllButton type="button">XEM TẤT CẢ</ViewAllButton>
    </Wrap>
  );
}
