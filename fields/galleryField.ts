import type { Field } from 'payload';

export const galleryField: Field = {
  name: 'gallery',
  type: 'array',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
};
