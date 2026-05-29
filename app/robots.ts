import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://dinoisland.com';

  return {
    host: baseUrl,
    rules: [
      {
        allow: '/',
        disallow: ['/admin', '/cms', '/api/'],
        userAgent: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
