export type NewsType = 'news' | 'event' | 'update';

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  type: NewsType;
  thumbnail: string;
  date: string;
  author: string;
  authorAvatar?: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  content?: unknown;
  htmlContent?: string;
  eventDate?: string;
  location?: string;
  updatedAt?: string;
  viewCount?: number;
  meta?: {
    canonicalUrl?: string;
    title?: string;
    description?: string;
    focusKeyword?: string;
    image?: string;
    metaDescription?: string;
    ogDescription?: string;
    ogImage?: { url?: string } | string;
    ogTitle?: string;
    robotsFollow?: string;
    robotsIndex?: string;
    seoTitle?: string;
    twitterDescription?: string;
    twitterImage?: { url?: string } | string;
    twitterTitle?: string;
  };
};

export type NewsEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  eventStartDate: string;
  eventEndDate?: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'ended';
  reward?: string;
};

export function getEventStatus(start: string, end?: string): NewsEvent['status'] {
  const now = Date.now();
  const startTime = new Date(start).getTime();
  const endTime = end ? new Date(end).getTime() : startTime + 24 * 60 * 60 * 1000;

  if (now < startTime) return 'upcoming';
  if (now <= endTime) return 'ongoing';
  return 'ended';
}

export function formatDate(value: string, locale = 'vi') {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function getImageURL(image: unknown, fallback = '/images/feature-war.jpg') {
  if (!image) return fallback;
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && 'url' in image && typeof image.url === 'string') return image.url;
  return fallback;
}

export function getRelationshipTitle(value: unknown, fallback: string) {
  if (typeof value === 'object' && value && 'name' in value && typeof value.name === 'string') return value.name;
  if (typeof value === 'object' && value && 'title' in value && typeof value.title === 'string') return value.title;
  if (typeof value === 'object' && value && 'username' in value && typeof value.username === 'string') return value.username;
  return fallback;
}
