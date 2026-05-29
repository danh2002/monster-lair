import type { CollectionConfig } from 'payload';
import { seoFields } from '../fields/seoFields.ts';

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ä‘/g, 'd')
    .replace(/Ä/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeChange: [
      ({ data }) => ({
        ...data,
        slug: data.slug || (typeof data.name === 'string' ? slugify(data.name) : data.slug),
      }),
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'news',
      options: [
        { label: 'News', value: 'news' },
        { label: 'Event', value: 'event' },
        { label: 'Update', value: 'update' },
      ],
    },
    {
      name: 'meta',
      type: 'group',
      fields: seoFields,
    },
  ],
};
