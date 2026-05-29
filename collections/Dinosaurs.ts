import type { CollectionConfig } from 'payload';
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

export const Dinosaurs: CollectionConfig = {
  slug: 'dinosaurs',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['name', 'type', 'rarity', 'status'],
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [createAuditLog('dinosaurs')],
    beforeChange: [
      ({ data }) => ({
        ...data,
        slug:
          typeof data.slug === 'string' && data.slug
            ? generateSlug(data.slug)
            : typeof data.name === 'string'
              ? generateSlug(data.name)
              : data.slug,
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
      name: 'type',
      type: 'text',
    },
    {
      name: 'rarity',
      type: 'select',
      defaultValue: 'common',
      options: [
        { label: 'Common', value: 'common' },
        { label: 'Rare', value: 'rare' },
        { label: 'Epic', value: 'epic' },
        { label: 'Legendary', value: 'legendary' },
        { label: 'Mythic', value: 'mythic' },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        { name: 'hp', type: 'number', defaultValue: 0 },
        { name: 'damage', type: 'number', defaultValue: 0 },
        { name: 'speed', type: 'number', defaultValue: 0 },
        { name: 'defense', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'skills',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'cooldown',
          type: 'number',
        },
      ],
    },
    {
      name: 'evolution',
      type: 'relationship',
      relationTo: 'dinosaurs' as any,
    },
    {
      name: 'skins',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
};
