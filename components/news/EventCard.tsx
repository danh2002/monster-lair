'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from '@react-icons/all-files/fa/FaMapMarkerAlt';
import type { NewsEvent } from '@/lib/news';

const Card = styled(motion.article)`
  position: relative;
  overflow: hidden;
  min-height: 250px;
  border: 1px solid rgba(255, 106, 0, 0.28);
  border-radius: 8px;
  background: #100b08;
`;

const ImageWrap = styled.div`
  position: absolute;
  inset: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(8, 7, 11, 0.96), rgba(8, 7, 11, 0.62), rgba(8, 7, 11, 0.12));
  }
`;

const Body = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 74px 1fr;
  gap: 1rem;
  min-height: 250px;
  align-items: end;
  padding: 1.2rem;
`;

const DateBadge = styled.div`
  align-self: start;
  width: 68px;
  overflow: hidden;
  border: 1px solid rgba(255, 106, 0, 0.6);
  background: #ff6a00;
  color: #fff;
  text-align: center;
  box-shadow: 0 12px 24px rgba(255, 106, 0, 0.25);

  strong {
    display: block;
    font-size: 1.8rem;
    font-weight: 900;
    line-height: 1.1;
  }

  span {
    display: block;
    padding: 0.22rem 0;
    background: #170a03;
    font-size: 0.68rem;
    font-weight: 900;
    text-transform: uppercase;
  }
`;

const Status = styled.span<{ $status: NewsEvent['status'] }>`
  display: inline-flex;
  width: fit-content;
  margin-bottom: 0.6rem;
  padding: 0.28rem 0.58rem;
  border: 1px solid
    ${(props) => (props.$status === 'upcoming' ? '#ff6a00' : props.$status === 'ongoing' ? '#20c767' : 'rgba(255,255,255,0.28)')};
  color: ${(props) => (props.$status === 'upcoming' ? '#ffb37a' : props.$status === 'ongoing' ? '#70ffa8' : 'rgba(255,255,255,0.66)')};
  background: rgba(0, 0, 0, 0.45);
  font-size: 0.66rem;
  font-weight: 900;
  text-transform: uppercase;
`;

const Title = styled.h3`
  margin: 0 0 0.55rem;
  color: #fff;
  font-size: 1.25rem;
  font-style: italic;
  font-weight: 900;
  line-height: 1.15;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.82rem;
  font-weight: 700;

  svg {
    color: #ff6a00;
  }
`;

const Timer = styled.div`
  margin-top: 0.75rem;
  color: #ffb37a;
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0.03em;
`;

function useCountdown(date: string) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(date).getTime() - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [date]);

  const days = Math.floor(left / 86400000);
  const hours = Math.floor((left % 86400000) / 3600000);
  const minutes = Math.floor((left % 3600000) / 60000);
  return { days, hours, minutes };
}

export function EventCard({
  event,
  index,
  labels,
}: {
  event: NewsEvent;
  index: number;
  labels: Record<NewsEvent['status'], string>;
}) {
  const start = new Date(event.eventStartDate);
  const countdown = useCountdown(event.eventStartDate);

  return (
    <Card
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
      layout={false}
    >
      <ImageWrap>
        <Image src={event.thumbnail} alt={event.title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
      </ImageWrap>
      <Body>
        <DateBadge>
          <strong>{String(start.getDate()).padStart(2, '0')}</strong>
          <span>{start.toLocaleString('vi', { month: 'short' })}</span>
        </DateBadge>
        <div>
          <Status $status={event.status}>{labels[event.status]}</Status>
          <Title>{event.title}</Title>
          <Meta>
            <FaMapMarkerAlt />
            {event.location}
          </Meta>
          {event.status === 'upcoming' && (
            <Timer>
              {countdown.days}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m
            </Timer>
          )}
        </div>
      </Body>
    </Card>
  );
}
