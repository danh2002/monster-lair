import type { CollectionConfig } from 'payload';
import { sendNewCommentNotification } from '../lib/email.ts';
import { createAuditLog } from './hooks/auditLog.ts';

function getHeader(req: any, name: string) {
  if (typeof req?.headers?.get === 'function') return req.headers.get(name);
  return req?.headers?.[name] ?? req?.headers?.[name.toLowerCase()];
}

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['post', 'author', 'status', 'createdAt'],
    useAsTitle: 'author',
  },
  hooks: {
    afterChange: [
      createAuditLog('comments'),
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          console.log(`[Comments] New comment pending moderation from ${doc.author ?? 'Anonymous'} on post ${doc.post}`);
          const postId = typeof doc.post === 'object' ? doc.post?.id : doc.post;
          let post = typeof doc.post === 'object' ? doc.post : null;

          if (!post && postId) {
            try {
              post = await req.payload.findByID({ collection: 'posts', id: postId, depth: 0 });
            } catch {
              post = null;
            }
          }

          await sendNewCommentNotification({ author: doc.author, content: doc.content, email: doc.email, id: doc.id }, post);
        }

        return doc;
      },
    ],
    beforeChange: [
      ({ data, req }) => ({
        ...data,
        ipAddress: data.ipAddress || getHeader(req, 'x-forwarded-for')?.split(',')[0]?.trim() || getHeader(req, 'x-real-ip') || '',
        userAgent: data.userAgent || getHeader(req, 'user-agent') || '',
      }),
    ],
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Spam', value: 'spam' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments' as any,
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
};
