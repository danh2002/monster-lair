'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt';
import { FaClock } from '@react-icons/all-files/fa/FaClock';
import { Link } from '@/i18n/navigation';
import { theme } from '@/styles/theme';
import type { NewsEvent, NewsPost, NewsType } from '@/lib/news';
import { formatDate } from '@/lib/news';
import { NewsCard } from './NewsCard';
import { EventCard } from './EventCard';

type TabKey = 'all' | NewsType;

const Section = styled.section`
  background: #08070b;
`;

const Inner = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem);
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2.5rem;
`;

const Tab = styled.button<{ $active?: boolean }>`
  min-width: 118px;
  height: 42px;
  border: 1px solid ${(props) => (props.$active ? '#ff6a00' : 'rgba(255, 106, 0, 0.35)')};
  background: ${(props) => (props.$active ? '#ff6a00' : 'rgba(20, 12, 8, 0.85)')};
  color: #fff;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  cursor: pointer;
`;

const Featured = styled(motion.article)`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.9fr);
  overflow: hidden;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 106, 0, 0.28);
  border-left: 5px solid #ff6a00;
  border-radius: 8px;
  background: rgba(20, 12, 8, 0.85);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.34);

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedImage = styled(Link)`
  position: relative;
  min-height: 390px;
  display: block;

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 260px;
  }
`;

const FeaturedBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1.4rem, 4vw, 2.4rem);
`;

const Badge = styled.span`
  width: fit-content;
  margin-bottom: 0.9rem;
  padding: 0.34rem 0.72rem;
  background: #ff6a00;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
`;

const FeaturedTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: clamp(1.8rem, 3.4vw, 3rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1.05;
`;

const Excerpt = styled.p`
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin: 0.4rem 0 1.2rem;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.78rem;
  font-weight: 800;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  svg {
    color: #ff6a00;
  }
`;

const ReadMore = styled(Link)`
  width: fit-content;
  padding: 0.8rem 1.2rem;
  background: #ff6a00;
  color: #fff;
  text-decoration: none;
  font-size: 0.8rem;
  font-style: italic;
  font-weight: 900;
  text-transform: uppercase;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const EventsHead = styled.div`
  margin: 4rem 0 1.25rem;

  h2 {
    margin: 0;
    color: #fff;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-style: italic;
    font-weight: 900;
    text-transform: uppercase;
  }

  span {
    color: #ff6a00;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.1rem;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.85rem;
  font-weight: 800;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 40px;
  height: 38px;
  border: 1px solid ${(props) => (props.$active ? '#ff6a00' : 'rgba(255,255,255,0.14)')};
  border-radius: 999px;
  background: ${(props) => (props.$active ? '#ff6a00' : 'rgba(20, 12, 8, 0.85)')};
  color: #fff;
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export function NewsGrid({
  posts,
  events,
  labels,
}: {
  posts: NewsPost[];
  events: NewsEvent[];
  labels: {
    tabs: Record<TabKey, string>;
    readMore: string;
    eventsTitle: string;
    showing: string;
    prev: string;
    next: string;
    status: Record<NewsEvent['status'], string>;
  };
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const featured = posts.find((post) => post.featured) ?? posts[0];

  const filtered = useMemo(() => {
    return posts.filter((post) => post.id !== featured?.id).filter((post) => activeTab === 'all' || post.type === activeTab);
  }, [activeTab, featured?.id, posts]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <Section>
      <Inner>
        <Tabs>
          {(Object.keys(labels.tabs) as TabKey[]).map((tab) => (
            <Tab key={tab} type="button" $active={activeTab === tab} onClick={() => switchTab(tab)}>
              {labels.tabs[tab]}
            </Tab>
          ))}
        </Tabs>

        {featured && (
          <Featured initial={{ opacity: 0, x: -42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: 'easeOut' }}>
            <FeaturedImage href={`/news/${featured.slug}`}>
              <Image src={featured.thumbnail} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 60vw" style={{ objectFit: 'cover' }} priority />
            </FeaturedImage>
            <FeaturedBody>
              <Badge>{featured.category}</Badge>
              <FeaturedTitle>{featured.title}</FeaturedTitle>
              <Excerpt>{featured.excerpt}</Excerpt>
              <Meta>
                <span>
                  <FaCalendarAlt />
                  {formatDate(featured.date)}
                </span>
                <span>
                  <FaClock />
                  {featured.readTime}
                </span>
                <span>{featured.author}</span>
              </Meta>
              <ReadMore href={`/news/${featured.slug}`}>{labels.readMore}</ReadMore>
            </FeaturedBody>
          </Featured>
        )}

        <Grid>
          {visible.map((post, index) => (
            <NewsCard key={post.id} post={post} index={index} />
          ))}
        </Grid>

        <EventsHead>
          <h2>
            {labels.eventsTitle.split(' ')[0]} <span>{labels.eventsTitle.split(' ').slice(1).join(' ')}</span>
          </h2>
        </EventsHead>
        <EventsGrid>
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} labels={labels.status} />
          ))}
        </EventsGrid>

        <Pagination>
          <PageButton type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            {labels.prev}
          </PageButton>
          {Array.from({ length: pageCount }, (_, index) => (
            <PageButton key={index + 1} type="button" $active={page === index + 1} onClick={() => setPage(index + 1)}>
              {index + 1}
            </PageButton>
          ))}
          <PageButton type="button" disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>
            {labels.next}
          </PageButton>
          <span>
            {labels.showing} {visible.length} of {filtered.length} articles
          </span>
        </Pagination>
      </Inner>
    </Section>
  );
}
