import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/api/categories';
import { getPosts } from '@/lib/api/posts';

export async function GET() {
  try {
    const [categories, posts] = await Promise.all([getCategories(), getPosts(500)]);
    const withCounts = categories.data.map((category) => ({
      ...category,
      postCount: posts.data.filter((post) => String(post.category_id ?? post.category ?? '') === String(category.id)).length,
    }));

    return NextResponse.json({ categories: withCounts });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
