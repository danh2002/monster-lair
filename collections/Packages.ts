import type { CollectionConfig } from 'payload';
import { createAuditLog } from './hooks/auditLog.ts';

export const Packages: CollectionConfig = {
  slug: 'packages',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['name', 'price', 'currency', 'popular', 'active', 'order'],
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [createAuditLog('packages')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'VND',
      options: [
        { label: 'VND', value: 'VND' },
        { label: 'USD', value: 'USD' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'itemType',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'bonus',
      type: 'textarea',
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
