import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function GET() {
  const now = new Date().toISOString();

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 100,
      where: {
        and: [
          { status: { equals: 'scheduled' } },
          { scheduledAt: { less_than_equal: now } },
        ],
      } as any,
    });

    const published = await Promise.all(
      result.docs.map((post: any) =>
        payload.update({
          collection: 'posts',
          data: {
            _status: 'published',
            publishedAt: post.publishedAt || now,
            status: 'published',
          },
          id: post.id,
          overrideAccess: true,
        }),
      ),
    );

    return NextResponse.json({ checkedAt: now, published: published.length });
  } catch (error) {
    console.error('[Cron] publish scheduled failed', error);
    return NextResponse.json({ error: 'Failed to publish scheduled posts' }, { status: 500 });
  }
}
