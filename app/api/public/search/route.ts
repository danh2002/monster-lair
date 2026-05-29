import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/api/events';
import { getPosts } from '@/lib/api/posts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';

  if (!q) return NextResponse.json({ results: [] });

  try {
    const [posts, events] = await Promise.all([getPosts(50), getEvents(50)]);
    const needle = q.toLowerCase();

    return NextResponse.json({
      results: [
        ...posts.data
          .filter((post) => `${post.title ?? ''} ${post.excerpt ?? ''}`.toLowerCase().includes(needle))
          .slice(0, 10)
          .map((post) => ({ ...post, type: 'post' })),
        ...events.data
          .filter((event) => `${event.title ?? ''} ${event.description ?? ''}`.toLowerCase().includes(needle))
          .slice(0, 10)
          .map((event) => ({ ...event, type: 'event' })),
      ],
    });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
