import type { CollectionConfig } from 'payload';
import { seoFields } from '../fields/seoFields.ts';
import { createAuditLog } from './hooks/auditLog.ts';

const generateSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\u0111/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'status', 'order'],
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [createAuditLog('pages')],
    beforeChange: [
      ({ data }) => ({
        ...data,
        slug:
          typeof data.slug === 'string' && data.slug
            ? generateSlug(data.slug)
            : typeof data.title === 'string'
              ? generateSlug(data.title)
              : data.slug,
      }),
    ],
  },
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
      name: 'template',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Landing', value: 'landing' },
        { label: 'Full Width', value: 'full-width' },
        { label: 'Sidebar', value: 'sidebar' },
      ],
    },
    {
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages' as any,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'meta',
      type: 'group',
      fields: seoFields,
    },
    {
      name: 'showInMenu',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'menuLabel',
      type: 'text',
    },
  ],
};
