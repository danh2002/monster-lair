import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { RichText } from '@payloadcms/richtext-lexical/react';
import styled from 'styled-components';
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt';
import { FaClock } from '@react-icons/all-files/fa/FaClock';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { ArticleJsonLd } from '@/components/JsonLd';
import { Link } from '@/i18n/navigation';
import { CommentSection } from '@/components/news/CommentSection';
import { ShareButtons } from '@/components/news/ShareButtons';
import { getEvents } from '@/lib/api/events';
import { getPostBySlug, getPosts } from '@/lib/api/posts';
import {
  formatDate,
  getEventStatus,
  getImageURL,
  getRelationshipTitle,
  type NewsEvent,
  type NewsPost,
  type NewsType,
} from '@/lib/news';

export const revalidate = 0;

const Page = styled.main`
  background: #08070b;
  color: #fff;
`;

const Inner = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
`;

const Back = styled(Link)`
  display: inline-flex;
  margin-bottom: 1.2rem;
  color: #ff8b3d;
  font-size: 0.82rem;
  font-weight: 900;
  text-decoration: none;
  text-transform: uppercase;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroImage = styled.div`
  position: relative;
  aspect-ratio: 16 / 8;
  overflow: hidden;
  border: 1px solid rgba(255, 106, 0, 0.32);
  border-radius: 8px;
  background: #120b08;
`;

const Header = styled.header`
  padding: 1.4rem 0 1rem;
`;

const Badge = styled.span`
  display: inline-flex;
  margin-right: 0.85rem;
  padding: 0.32rem 0.64rem;
  background: #ff6a00;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  align-items: center;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.82rem;
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

const Title = styled.h1`
  margin: 0;
  color: #fff;
  font-size: clamp(2.4rem, 5vw, 4.8rem);
  font-style: italic;
  font-weight: 900;
  line-height: 1;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.2rem;
  color: rgba(255, 255, 255, 0.74);
  font-weight: 800;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 106, 0, 0.5);
  border-radius: 50%;
  background: rgba(255, 106, 0, 0.14);
  color: #fff;
  font-weight: 900;
`;

const Content = styled.article`
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.05rem;
  line-height: 1.85;

  h2,
  h3 {
    color: #fff;
    font-style: italic;
  }

  a {
    color: #ff8b3d;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 1.2rem 0;
    border-radius: 8px;
  }

  iframe {
    width: 100%;
    max-width: 760px;
    aspect-ratio: 16 / 9;
    height: auto;
    border: 0;
    border-radius: 8px;
  }

  table {
    width: 100%;
    margin: 1.2rem 0;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  blockquote {
    margin: 1.2rem 0;
    padding-left: 1rem;
    border-left: 3px solid #ff6a00;
    color: rgba(255, 255, 255, 0.68);
  }
`;

const FallbackContent = styled.div`
  p {
    margin: 0 0 1.1rem;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 2rem 0 1.5rem;

  a {
    padding: 0.34rem 0.7rem;
    border: 1px solid rgba(255, 106, 0, 0.32);
    border-radius: 999px;
    color: #ffb37a;
    font-size: 0.78rem;
    font-weight: 800;
    text-decoration: none;
  }
`;

const Sidebar = styled.aside`
  display: grid;
  align-content: start;
  gap: 1rem;
`;

const Panel = styled.section`
  padding: 1rem;
  border: 1px solid rgba(255, 106, 0, 0.24);
  border-radius: 8px;
  background: rgba(20, 12, 8, 0.85);

  h2 {
    margin: 0 0 1rem;
    color: #fff;
    font-size: 1.1rem;
    font-style: italic;
    font-weight: 900;
    text-transform: uppercase;
  }
`;

const SmallPost = styled(Link)`
  display: grid;
  grid-template-columns: 78px 1fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.7rem 0;
  color: #fff;
  text-decoration: none;

  + a {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  strong {
    display: -webkit-box;
    overflow: hidden;
    font-size: 0.86rem;
    line-height: 1.28;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const SmallThumb = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 5px;
  background: #120b08;
`;

const CategoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.55rem 0;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 800;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

type PayloadDoc = Record<string, any>;

function getUploadUrl(value: unknown) {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'url' in value && typeof value.url === 'string') return value.url;
  return undefined;
}

function getAuthorName(value: unknown) {
  if (typeof value === 'object' && value) {
    if ('displayName' in value && typeof value.displayName === 'string') return value.displayName;
    if ('name' in value && typeof value.name === 'string') return value.name;
    if ('email' in value && typeof value.email === 'string') return value.email;
  }

  return 'Admin';
}

function isHtmlContent(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return Boolean(trimmed) && !trimmed.startsWith('{');
}

function parseLegacyLexicalContent(value: unknown) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();

  if (!trimmed.startsWith('{')) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function getFirstHtmlImage(...values: unknown[]) {
  for (const value of values) {
    if (typeof value !== 'string') continue;

    const match = value.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
  }

  return undefined;
}

function mapPayloadPost(post: PayloadDoc): NewsPost {
  const categoryType = typeof post.category === 'object' && post.category?.type ? post.category.type : (post.type ?? 'news');
  const contentImage = getFirstHtmlImage(post.htmlContent ?? post.html_content, post.content);

  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    category: getRelationshipTitle(post.category, 'Tin Tức'),
    type: categoryType as NewsType,
    thumbnail: getImageURL(post.featuredImage ?? post.featured_image ?? post.thumbnail ?? contentImage),
    date: post.publishedAt ?? post.published_at ?? post.createdAt ?? post.created_at,
    author: getRelationshipTitle(post.author, 'Admin'),
    readTime: post.readingTime ? `${post.readingTime} phút đọc` : (post.readTime ?? '3 phút đọc'),
    featured: Boolean(post.pinned ?? post.featured),
    tags: Array.isArray(post.tags) ? post.tags.map((item: any) => item?.slug ?? item?.name ?? item?.tag).filter(Boolean) : [],
    content: post.content,
    htmlContent: post.htmlContent ?? post.html_content,
    meta: post.meta,
    updatedAt: post.updatedAt ?? post.updated_at,
    viewCount: post.viewCount ?? post.view_count,
  };
}

async function fetchPosts() {
  try {
    const [postsData, eventsData] = await Promise.all([getPosts(20), getEvents(4)]);

    const posts = postsData.data.map((post: PayloadDoc): NewsPost => mapPayloadPost(post));

    const events = eventsData.data.map((event: PayloadDoc): NewsEvent => ({
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

    return { posts, events };
  } catch {
    return { posts: [], events: [] };
  }
}

async function fetchPostBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  try {
    const result = await getPostBySlug(decodedSlug);
    const post = result.data;

    return post ? mapPayloadPost(post) : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts(100);

    return posts.data.map((post: any) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const result = await getPostBySlug(decodedSlug);
    const post = result.data as any;

    if (!post) return { title: 'Post Not Found' };

    const seoTitle = post.meta?.seoTitle || post.meta_seo_title || post.title;
    const seoDesc = post.meta?.metaDescription || post.meta_meta_description || post.excerpt || '';
    const ogImage = getUploadUrl(post.meta?.ogImage) || getUploadUrl(post.featuredImage ?? post.featured_image);
    const twitterImage = getUploadUrl(post.meta?.twitterImage);

    return {
      alternates: {
        canonical: post.meta?.canonicalUrl || post.meta_canonical_url || `/${locale}/news/${decodedSlug}`,
        languages: {
          en: `/en/news/${decodedSlug}`,
          vi: `/vi/news/${decodedSlug}`,
          zh: `/zh/news/${decodedSlug}`,
        },
      },
      description: seoDesc,
      keywords: post.meta?.focusKeyword,
      openGraph: {
        authors: [getAuthorName(post.author)],
        description: post.meta?.ogDescription || seoDesc,
        images: ogImage ? [{ url: ogImage }] : [],
        publishedTime: post.publishedAt ?? post.published_at,
        title: post.meta?.ogTitle || seoTitle,
        type: 'article',
      },
      robots: {
        follow: post.meta?.robotsFollow !== 'nofollow',
        index: post.meta?.robotsIndex !== 'noindex',
      },
      title: seoTitle,
      twitter: {
        card: 'summary_large_image',
        description: post.meta?.twitterDescription || seoDesc,
        images: twitterImage ? [twitterImage] : [],
        title: post.meta?.twitterTitle || seoTitle,
      },
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const t = await getTranslations('news');
  const { posts, events } = await fetchPosts();
  const post = (await fetchPostBySlug(decodedSlug)) ?? posts.find((item) => item.slug === decodedSlug);

  if (!post) notFound();

  const htmlContent = post.htmlContent || (isHtmlContent(post.content) ? post.content : '');
  const legacyLexicalContent = parseLegacyLexicalContent(post.content);
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 4);
  const categories = posts.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://dinoisland.com';
  const postUrl = `${baseUrl}/${locale}/news/${post.slug}`;

  return (
    <Page>
      <ArticleJsonLd
        authorName={post.author}
        dateModified={post.updatedAt ?? post.date}
        datePublished={post.date}
        description={post.meta?.metaDescription ?? post.meta?.description ?? post.excerpt}
        image={post.meta?.image ?? post.thumbnail}
        title={post.meta?.seoTitle ?? post.meta?.title ?? post.title}
        url={postUrl}
      />
      <Inner>
        <Back href="/news">{t('back_to_news')}</Back>
        <Layout>
          <div>
            <HeroImage>
              <Image src={post.thumbnail} alt={post.title} fill sizes="(max-width: 900px) 100vw, 70vw" style={{ objectFit: 'cover' }} priority />
            </HeroImage>
            <Header>
              <Meta>
                <Badge>{post.category}</Badge>
                <span>
                  <FaCalendarAlt />
                  {formatDate(post.date)}
                </span>
                <span>
                  <FaClock />
                  {post.readTime}
                </span>
                <span>
                  <FaEye />
                  {post.viewCount ?? 0} views
                </span>
              </Meta>
              <Title>{post.title}</Title>
              <Author>
                <Avatar>{post.author.slice(0, 1)}</Avatar>
                <span>
                  {post.author} · {formatDate(post.date)}
                </span>
              </Author>
            </Header>
            <Content>
              {htmlContent ? (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              ) : legacyLexicalContent ? (
                <RichText data={legacyLexicalContent as any} />
              ) : post.content ? (
                <RichText data={post.content as any} />
              ) : (
                <FallbackContent>
                  <p>{post.excerpt}</p>
                  <p>
                    Đảo Khủng Long tiếp tục mở rộng với những nội dung mới, hoạt động cộng đồng và các bản cập nhật gameplay được tối ưu cho mọi chiến binh.
                  </p>
                  <p>Hãy theo dõi trang tin tức để không bỏ lỡ các sự kiện, phần thưởng giới hạn và thông báo quan trọng trong thời gian tới.</p>
                </FallbackContent>
              )}
            </Content>
            <TagList>{post.tags.map((tag) => <Link href={`/news?tag=${tag}`} key={tag}>#{tag}</Link>)}</TagList>
            <ShareButtons title={post.title} shareLabel={t('share')} />
            <CommentSection postId={post.id} />
          </div>

          <Sidebar>
            <Panel>
              <h2>{t('related_posts')}</h2>
              {related.map((item) => (
                <SmallPost key={item.id} href={`/news/${item.slug}`}>
                  <SmallThumb>
                    <Image src={item.thumbnail} alt={item.title} fill sizes="78px" style={{ objectFit: 'cover' }} />
                  </SmallThumb>
                  <strong>{item.title}</strong>
                </SmallPost>
              ))}
            </Panel>
            <Panel>
              <h2>{t('categories')}</h2>
              {Object.entries(categories).map(([name, count]) => (
                <CategoryRow key={name}>
                  <span>{name}</span>
                  <span>{count}</span>
                </CategoryRow>
              ))}
            </Panel>
            <Panel>
              <h2>{t('upcoming')}</h2>
              {events.slice(0, 2).map((event) => (
                <SmallPost key={event.id} href="/news">
                  <SmallThumb>
                    <Image src={event.thumbnail} alt={event.title} fill sizes="78px" style={{ objectFit: 'cover' }} />
                  </SmallThumb>
                  <strong>{event.title}</strong>
                </SmallPost>
              ))}
            </Panel>
          </Sidebar>
        </Layout>
      </Inner>
    </Page>
  );
}
