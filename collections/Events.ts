import type { CollectionConfig } from 'payload';
import { galleryField } from '../fields/galleryField.ts';
import { seoFields } from '../fields/seoFields.ts';
import { createAuditLog } from './hooks/auditLog.ts';

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

const calculateStatus = (start?: string, end?: string) => {
  const now = Date.now();
  const startTime = start ? new Date(start).getTime() : now;
  const endTime = end ? new Date(end).getTime() : startTime;

  if (now < startTime) return 'upcoming';
  if (now <= endTime) return 'ongoing';

  return 'ended';
};

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventStartDate', 'locationName', 'status'],
  },
  hooks: {
    afterChange: [createAuditLog('events')],
    beforeChange: [
      ({ data }) => ({
        ...data,
        slug: data.slug || (typeof data.title === 'string' ? slugify(data.title) : data.slug),
        status: calculateStatus(data.eventStartDate, data.eventEndDate),
      }),
    ],
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
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            galleryField,
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Event Details',
          fields: [
            {
              name: 'eventStartDate',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'eventEndDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'startTime',
              type: 'text',
            },
            {
              name: 'endTime',
              type: 'text',
            },
            {
              name: 'allDay',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'locationName',
              type: 'text',
            },
            {
              name: 'address',
              type: 'text',
            },
            {
              name: 'googleMapUrl',
              type: 'text',
            },
            {
              name: 'registrationLink',
              type: 'text',
            },
            {
              name: 'maxParticipants',
              type: 'number',
            },
            {
              name: 'rewards',
              type: 'textarea',
            },
            {
              name: 'organizer',
              type: 'text',
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'eventType',
              type: 'select',
              options: [
                { label: 'Tournament', value: 'tournament' },
                { label: 'Special', value: 'special' },
                { label: 'Reward', value: 'reward' },
                { label: 'Maintenance', value: 'maintenance' },
                { label: 'Community', value: 'community' },
              ],
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'upcoming',
              admin: {
                readOnly: true,
              },
              options: [
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Ongoing', value: 'ongoing' },
                { label: 'Ended', value: 'ended' },
                { label: 'Cancelled', value: 'cancelled' },
              ],
            },
            {
              name: 'featured',
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
              fields: seoFields,
            },
          ],
        },
      ],
    },
  ],
};
