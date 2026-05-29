import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/api/posts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 9;
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const status = searchParams.get('status') || 'published';

  try {
    const posts = await getPosts(100);
    const filtered = posts.data.filter((post) => {
      const categoryMatch = !category || String(post.category_id ?? post.category ?? '').toLowerCase() === category.toLowerCase();
      const tagMatch = !tag || String(post.tags ?? '').includes(tag);
      const statusMatch = !status || String(post.status ?? 'published') === status;
      return categoryMatch && tagMatch && statusMatch;
    });
    const start = (page - 1) * limit;
    const docs = filtered.slice(start, start + limit);

    return NextResponse.json({
      hasNextPage: start + limit < filtered.length,
      page,
      pages: Math.ceil(filtered.length / limit),
      posts: docs,
      total: filtered.length,
    });
  } catch {
    return NextResponse.json({
      hasNextPage: false,
      page,
      pages: 0,
      posts: [],
      total: 0,
    });
  }
}
