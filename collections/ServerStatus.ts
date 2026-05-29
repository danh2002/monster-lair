import type { CollectionConfig } from 'payload';
import { createAuditLog } from './hooks/auditLog.ts';

export const ServerStatus: CollectionConfig = {
  slug: 'server-status',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: ['status', 'message', 'maintenanceStart', 'maintenanceEnd'],
    useAsTitle: 'status',
  },
  hooks: {
    afterChange: [createAuditLog('server-status')],
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'online',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Offline', value: 'offline' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'maintenanceStart',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'maintenanceEnd',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'affectedServers',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
