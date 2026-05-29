import type { CollectionConfig } from 'payload';
import { createAuditLog } from './hooks/auditLog.ts';

export const Popups: CollectionConfig = {
  slug: 'popups',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['title', 'trigger', 'active', 'startDate', 'endDate'],
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [createAuditLog('popups')],
  },
  fields: [
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ctaText',
      type: 'text',
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
    {
      name: 'trigger',
      type: 'select',
      defaultValue: 'onLoad',
      options: [
        { label: 'On Load', value: 'onLoad' },
        { label: 'On Exit', value: 'onExit' },
        { label: 'After Seconds', value: 'afterSeconds' },
      ],
    },
    {
      name: 'delay',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'showOnce',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
};
