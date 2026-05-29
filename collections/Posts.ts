import type { CollectionConfig } from 'payload';
import { galleryField } from '../fields/galleryField.ts';
import { seoFields } from '../fields/seoFields.ts';
import { sendNewPostNotification } from '../lib/email.ts';
import { createAuditLog } from './hooks/auditLog.ts';

const generateSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\u0111/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const calculateReadingTime = (content: unknown) => {
  const words = String(content ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .split(' ')
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
};

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  hooks: {
    afterChange: [
      createAuditLog('posts'),
      async ({ doc, previousDoc }) => {
        if (previousDoc?.status !== 'published' && doc.status === 'published') {
          await sendNewPostNotification({ id: doc.id, slug: doc.slug, title: doc.title });
        }

        return doc;
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (typeof data.slug === 'string' && data.slug) {
          data.slug = generateSlug(data.slug);
        } else if (typeof data.title === 'string' && data.title) {
          data.slug = generateSlug(data.title);
        }

        return {
          ...data,
          readingTime: calculateReadingTime(data.htmlContent ?? data.content),
        };
      },
    ],
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
            },
            {
              name: 'content',
              type: 'textarea',
            },
            {
              name: 'htmlContent',
              type: 'textarea',
              admin: { hidden: true },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
              admin: { hidden: true },
            },
            {
              name: 'featured',
              type: 'checkbox',
              admin: { hidden: true },
            },
            {
              name: 'readTime',
              type: 'text',
              admin: { hidden: true },
            },
            galleryField,
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags' as any,
              hasMany: true,
            },
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
            },
            {
              name: 'allowComments',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'pinned',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                ...seoFields,
                {
                  name: 'title',
                  type: 'text',
                  admin: { hidden: true },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: { hidden: true },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { hidden: true },
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Pending', value: 'pending' },
                { label: 'Published', value: 'published' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'scheduledAt',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'viewCount',
              type: 'number',
              admin: {
                readOnly: true,
              },
              defaultValue: 0,
            },
            {
              name: 'readingTime',
              type: 'number',
              admin: {
                readOnly: true,
              },
              defaultValue: 0,
            },
          ],
        },
      ],
    },
  ],
};
