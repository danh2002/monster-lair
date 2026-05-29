'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaClock } from '@react-icons/all-files/fa/FaClock';
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt';
import { Link } from '@/i18n/navigation';
import { theme } from '@/styles/theme';
import type { NewsPost } from '@/lib/news';
import { formatDate } from '@/lib/news';

const typeColors = {
  news: '#ff6a00',
  event: '#20c767',
  update: '#3d8cff',
};

const Card = styled(motion.article)`
  height: 100%;
  overflow: hidden;
  background: rgba(20, 12, 8, 0.85);
  border: 1px solid rgba(255, 106, 0, 0.22);
  border-radius: 8px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    border-color: rgba(255, 106, 0, 0.72);
    box-shadow: 0 18px 45px rgba(255, 106, 0, 0.18);
    transform: translateY(-6px);
  }
`;

const Thumb = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #120b08;
`;

const Content = styled.div`
  display: flex;
  min-height: 260px;
  flex-direction: column;
  padding: 1.1rem;
`;

const Badge = styled.span<{ $type: NewsPost['type'] }>`
  align-self: flex-start;
  margin-bottom: 0.75rem;
  padding: 0.32rem 0.64rem;
  background: ${(props) => typeColors[props.$type]};
  color: #fff;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
`;

const Title = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 1.16rem;
  font-style: italic;
  font-weight: 900;
  line-height: 1.18;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Clamp = styled.span<{ $lines: number }>`
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: ${(props) => props.$lines};
  -webkit-box-orient: vertical;
`;

const Excerpt = styled.p`
  margin: 0.75rem 0 1rem;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.92rem;
  line-height: 1.6;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  color: rgba(255, 255, 255, 0.54);
  font-size: 0.75rem;
  font-weight: 700;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  svg {
    color: ${theme.colors.primary.main};
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  border: 1px solid rgba(255, 106, 0, 0.4);
  border-radius: 50%;
  background: rgba(255, 106, 0, 0.14);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 900;
`;

export function NewsCard({ post, index }: { post: NewsPost; index: number }) {
  return (
    <Card
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.06 }}
      layout={false}
    >
      <Thumb href={`/news/${post.slug}`} aria-label={post.title}>
        <Image src={post.thumbnail} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
      </Thumb>
      <Content>
        <Badge $type={post.type}>{post.category}</Badge>
        <Title>
          <Link href={`/news/${post.slug}`}>
            <Clamp $lines={2}>{post.title}</Clamp>
          </Link>
        </Title>
        <Excerpt>
          <Clamp $lines={3}>{post.excerpt}</Clamp>
        </Excerpt>
        <Meta>
          <span>
            <FaCalendarAlt />
            {formatDate(post.date)}
          </span>
          <span>
            <FaClock />
            {post.readTime}
          </span>
          <Avatar title={post.author}>{post.author.slice(0, 1)}</Avatar>
        </Meta>
      </Content>
    </Card>
  );
}
