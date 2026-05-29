import type { CollectionConfig } from 'payload';
import { createAuditLog } from './hooks/auditLog.ts';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 250, crop: 'center' },
      { name: 'card', width: 800, height: 500, crop: 'center' },
      { name: 'hero', width: 1920, height: 1080, crop: 'center' },
      { name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
    mimeTypes: ['image/*', 'application/pdf'],
  },
  admin: {
    useAsTitle: 'alt',
  },
  hooks: {
    afterChange: [createAuditLog('media')],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
