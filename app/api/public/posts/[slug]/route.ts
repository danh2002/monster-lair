import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/api/posts';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const result = await getPostBySlug(slug);
    const post = result.data;

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
}
