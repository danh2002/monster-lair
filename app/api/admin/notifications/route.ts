import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  await requireAdminAuth();

  try {
    const payload = await getPayload({ config });
    const [pendingComments, scheduledPosts, draftPosts] = await Promise.all([
      payload.find({
        collection: 'comments' as any,
        depth: 1,
        limit: 5,
        sort: '-createdAt',
        where: { status: { equals: 'pending' } } as any,
      }),
      payload.find({
        collection: 'posts',
        depth: 0,
        limit: 5,
        sort: 'scheduledAt',
        where: { status: { equals: 'scheduled' } } as any,
      }),
      payload.find({
        collection: 'posts',
        depth: 0,
        limit: 5,
        sort: '-updatedAt',
        where: { status: { equals: 'draft' } } as any,
      }),
    ]);

    return NextResponse.json({
      count: pendingComments.totalDocs + scheduledPosts.totalDocs + draftPosts.totalDocs,
      items: [
        ...pendingComments.docs.map((comment: any) => ({
          href: '/admin/comments',
          label: `Pending comment from ${comment.author ?? 'Anonymous'}`,
          type: 'comment',
        })),
        ...scheduledPosts.docs.map((post: any) => ({
          href: `/admin/posts/${post.id}`,
          label: `Scheduled post: ${post.title ?? 'Untitled'}`,
          type: 'scheduled',
        })),
        ...draftPosts.docs.map((post: any) => ({
          href: `/admin/posts/${post.id}`,
          label: `Draft post: ${post.title ?? 'Untitled'}`,
          type: 'draft',
        })),
      ],
      totals: {
        draftPosts: draftPosts.totalDocs,
        pendingComments: pendingComments.totalDocs,
        scheduledPosts: scheduledPosts.totalDocs,
      },
    });
  } catch {
    return NextResponse.json({ count: 0, items: [], totals: { draftPosts: 0, pendingComments: 0, scheduledPosts: 0 } });
  }
}
