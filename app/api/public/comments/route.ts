import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

function getIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const post = searchParams.get('post');

  if (!post) {
    return NextResponse.json({ comments: [], total: 0 });
  }

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'comments' as any,
      depth: 1,
      limit: 100,
      sort: 'createdAt',
      where: {
        and: [
          { post: { equals: post } },
          { status: { equals: 'approved' } },
        ],
      } as any,
    });

    return NextResponse.json({ comments: result.docs, total: result.totalDocs });
  } catch {
    return NextResponse.json({ comments: [], total: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = await getPayload({ config });
    const post = String(body.post ?? '');
    const author = String(body.author ?? '').trim();
    const email = String(body.email ?? '').trim();
    const content = String(body.content ?? '').trim();
    const parentComment = body.parentComment ? String(body.parentComment) : '';

    if (!post || !author || !content) {
      return NextResponse.json({ error: 'Post, author, and content are required' }, { status: 400 });
    }

    const data: Record<string, unknown> = {
      author,
      content,
      email,
      ipAddress: getIp(request),
      post: Number.isNaN(Number(post)) ? post : Number(post),
      status: 'pending',
      userAgent: request.headers.get('user-agent') || '',
    };

    if (parentComment) {
      data.parentComment = Number.isNaN(Number(parentComment)) ? parentComment : Number(parentComment);
    }

    await payload.create({
      collection: 'comments' as any,
      data,
      overrideAccess: true,
    });

    return NextResponse.json({ ok: true, message: 'Comment submitted for moderation' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not submit comment' }, { status: 500 });
  }
}
