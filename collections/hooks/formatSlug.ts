import type { FieldHook } from 'payload';

const format = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, value }) => {
    if (typeof value === 'string' && value.length > 0) return format(value);
    const fallbackValue = data?.[fallback];
    return typeof fallbackValue === 'string' ? format(fallbackValue) : value;
  };
