import type { CollectionConfig } from 'payload';

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'documentTitle',
    defaultColumns: ['action', 'collection', 'documentTitle', 'performedBy', 'timestamp'],
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      options: [
        { label: 'Created', value: 'created' },
        { label: 'Updated', value: 'updated' },
        { label: 'Published', value: 'published' },
        { label: 'Deleted', value: 'deleted' },
        { label: 'Uploaded', value: 'uploaded' },
        { label: 'SEO Updated', value: 'seo_updated' },
      ],
    },
    {
      name: 'collection',
      type: 'text',
    },
    {
      name: 'documentId',
      type: 'text',
    },
    {
      name: 'documentTitle',
      type: 'text',
    },
    {
      name: 'performedBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'timestamp',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'changes',
      type: 'json',
    },
  ],
};
