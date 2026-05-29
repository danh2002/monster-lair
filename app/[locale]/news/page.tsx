import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsHero } from '@/components/news/NewsHero';
import { getEvents } from '@/lib/api/events';
import { getPosts } from '@/lib/api/posts';
import {
  getEventStatus,
  getImageURL,
  getRelationshipTitle,
  type NewsEvent,
  type NewsPost,
  type NewsType,
} from '@/lib/news';

export const revalidate = 0;

type PayloadPost = Record<string, any>;

function getFirstHtmlImage(...values: unknown[]) {
  for (const value of values) {
    if (typeof value !== 'string') continue;

    const match = value.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
  }

  return undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });

  return {
    description: t('subtitle'),
    openGraph: {
      description: t('subtitle'),
      title: `${t('page_title')} | Dino Island`,
      type: 'website',
    },
    title: `${t('page_title')} | Dino Island`,
  };
}

async function getNewsData() {
  let posts: NewsPost[] = [];
  let events: NewsEvent[] = [];

  try {
    const [postsData, eventsData] = await Promise.all([getPosts(9), getEvents(4)]);

    posts = postsData.data.map((post: PayloadPost) => {
      const categoryType = typeof post.category === 'object' && post.category?.type ? post.category.type : (post.type ?? 'news');
      const contentImage = getFirstHtmlImage(post.htmlContent ?? post.html_content, post.content);

      return {
        id: String(post.id),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? '',
        category: getRelationshipTitle(post.category, String(post.category_id ?? 'News')),
        type: categoryType as NewsType,
        thumbnail: getImageURL(post.featuredImage ?? post.featured_image ?? post.thumbnail ?? contentImage),
        date: post.publishedAt ?? post.published_at ?? post.createdAt ?? post.created_at,
        author: getRelationshipTitle(post.author, 'Admin'),
        readTime: post.readingTime || post.reading_time ? `${post.readingTime ?? post.reading_time} min read` : (post.readTime ?? '3 min read'),
        featured: Boolean(post.pinned ?? post.featured),
        tags: Array.isArray(post.tags)
          ? post.tags.map((item: any) => item?.slug ?? item?.name ?? item?.tag).filter(Boolean)
          : [],
        content: post.content,
        htmlContent: post.htmlContent ?? post.html_content,
        meta: post.meta,
      };
    });

    events = eventsData.data.map((event: PayloadPost) => ({
      id: String(event.id),
      slug: event.slug,
      title: event.title,
      description: event.description,
      thumbnail: getImageURL(event.featuredImage ?? event.featured_image ?? event.thumbnail),
      eventStartDate: event.eventStartDate ?? event.event_start_date,
      eventEndDate: event.eventEndDate ?? event.event_end_date,
      location: event.locationName ?? event.location_name ?? event.location,
      status: event.status ?? getEventStatus(event.eventStartDate ?? event.event_start_date, event.eventEndDate ?? event.event_end_date),
      reward: event.reward,
    }));
  } catch (error) {
    console.warn('Supabase unavailable, returning empty news data:', error);
  }

  return { events, posts };
}

export default async function NewsPage() {
  const t = await getTranslations('news');
  const { posts, events } = await getNewsData();

  return (
    <>
      <NewsHero title={t('page_title')} subtitle={t('subtitle')} />
      <NewsGrid
        posts={posts}
        events={events}
        labels={{
          tabs: {
            all: t('tab_all'),
            news: t('tab_news'),
            event: t('tab_events'),
            update: t('tab_updates'),
          },
          readMore: t('read_more'),
          eventsTitle: t('tab_events'),
          showing: 'Showing',
          prev: 'Previous',
          next: 'Next',
          status: {
            upcoming: t('upcoming'),
            ongoing: t('ongoing'),
            ended: t('ended'),
          },
        }}
      />
    </>
  );
}
