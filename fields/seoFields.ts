import type { Field } from 'payload';

export const seoFields: Field[] = [
  {
    name: 'seoTitle',
    type: 'text',
    maxLength: 60,
  },
  {
    name: 'metaDescription',
    type: 'textarea',
    maxLength: 160,
  },
  {
    name: 'focusKeyword',
    type: 'text',
  },
  {
    name: 'canonicalUrl',
    type: 'text',
  },
  {
    name: 'ogTitle',
    type: 'text',
  },
  {
    name: 'ogDescription',
    type: 'textarea',
  },
  {
    name: 'ogImage',
    type: 'upload',
    relationTo: 'media',
  },
  {
    name: 'twitterTitle',
    type: 'text',
  },
  {
    name: 'twitterDescription',
    type: 'textarea',
  },
  {
    name: 'twitterImage',
    type: 'upload',
    relationTo: 'media',
  },
  {
    name: 'robotsIndex',
    type: 'radio',
    defaultValue: 'index',
    options: [
      { label: 'Index', value: 'index' },
      { label: 'No Index', value: 'noindex' },
    ],
  },
  {
    name: 'robotsFollow',
    type: 'radio',
    defaultValue: 'follow',
    options: [
      { label: 'Follow', value: 'follow' },
      { label: 'No Follow', value: 'nofollow' },
    ],
  },
  {
    name: 'sitemapInclude',
    type: 'checkbox',
    defaultValue: true,
  },
  {
    name: 'schemaType',
    type: 'select',
    options: [
      { label: 'Article', value: 'Article' },
      { label: 'News Article', value: 'NewsArticle' },
      { label: 'Blog Posting', value: 'BlogPosting' },
      { label: 'Event', value: 'Event' },
    ],
  },
];
