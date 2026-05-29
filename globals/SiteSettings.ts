import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
    },
    {
      name: 'siteLogo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'defaultSeoTitle',
      type: 'text',
    },
    {
      name: 'defaultMetaDescription',
      type: 'textarea',
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'googleAnalyticsId',
      type: 'text',
    },
    {
      name: 'googleSearchConsoleVerification',
      type: 'text',
    },
    {
      name: 'robotsTxt',
      type: 'textarea',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Discord', value: 'discord' },
            { label: 'Twitter', value: 'twitter' },
          ],
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
};
