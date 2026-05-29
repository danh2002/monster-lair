import type { CollectionConfig } from 'payload';
import { createAuditLog } from './hooks/auditLog.ts';

export const PatchNotes: CollectionConfig = {
  slug: 'patch-notes',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['version', 'title', 'gameMode', 'status', 'publishedAt'],
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [createAuditLog('patch-notes')],
  },
  fields: [
    {
      name: 'version',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'changes',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: 'Buff', value: 'buff' },
            { label: 'Nerf', value: 'nerf' },
            { label: 'New', value: 'new' },
            { label: 'Fix', value: 'fix' },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'gameMode',
      type: 'text',
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
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
};
