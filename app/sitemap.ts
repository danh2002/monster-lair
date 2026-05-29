import type { MetadataRoute } from 'next';
import { getEvents } from '@/lib/api/events';
import { getPosts } from '@/lib/api/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://dinoisland.com';
  const locales = ['vi', 'en', 'zh'];

  const staticPages: MetadataRoute.Sitemap = ['', '/arena', '/ranking', '/news'].flatMap((path) =>
    locales.map((locale) => ({
      changeFrequency: 'weekly' as const,
      lastModified: new Date(),
      priority: path === '' ? 1.0 : 0.8,
      url: `${baseUrl}/${locale}${path}`,
    })),
  );

  let postPages: MetadataRoute.Sitemap = [];
  let eventPages: MetadataRoute.Sitemap = [];

  try {
    const posts = await getPosts(1000);

    postPages = posts.data.flatMap((post: any) =>
      locales.map((locale) => ({
        changeFrequency: 'monthly' as const,
        lastModified: new Date(post.updatedAt ?? post.updated_at ?? Date.now()),
        priority: 0.6,
        url: `${baseUrl}/${locale}/news/${post.slug}`,
      })),
    );

    const events = await getEvents(1000);

    eventPages = events.data.flatMap((event: any) =>
      locales.map((locale) => ({
        changeFrequency: 'weekly' as const,
        lastModified: new Date(event.updatedAt ?? event.updated_at ?? Date.now()),
        priority: 0.7,
        url: `${baseUrl}/${locale}/events/${event.slug}`,
      })),
    );
  } catch {
    // DB not available, return static only.
  }

  return [...staticPages, ...postPages, ...eventPages];
}
