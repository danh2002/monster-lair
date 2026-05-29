import { createClient } from '@/utils/supabase/server';

export const adminSupabaseTables: Record<string, string> = {
  banners: 'banners',
  pages: 'pages',
  popups: 'popups',
  posts: 'posts',
};

const aliasKeys = new Set([
  'allowComments',
  'ctaLink',
  'ctaText',
  'endDate',
  'eventEndDate',
  'eventStartDate',
  'eventType',
  'featuredImage',
  'featuredImageMeta',
  'htmlContent',
  'image',
  'menuLabel',
  'meta',
  'parent',
  'publishedAt',
  'scheduledAt',
  'showInMenu',
  'showOnce',
  'startDate',
]);

const foreignKeys = ['featured_image_id', 'category_id', 'author_id', 'parent_id'];

function isBlank(value: unknown) {
  return value === '' || value === undefined || (typeof value === 'number' && Number.isNaN(value));
}

function toValidId(value: unknown) {
  if (value === null) return null;
  if (isBlank(value)) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') return /^\d+$/.test(value.trim()) ? value.trim() : undefined;

  return undefined;
}

function hasOwn(values: Record<string, any>, key: string) {
  return Object.prototype.hasOwnProperty.call(values, key);
}

function normalizeForeignKeys(body: Record<string, unknown>) {
  for (const key of foreignKeys) {
    if (!(key in body)) continue;

    if (body[key] === undefined) {
      delete body[key];
      continue;
    }

    if (body[key] === '' || (typeof body[key] === 'number' && Number.isNaN(body[key]))) {
      body[key] = null;
      continue;
    }

    const value = toValidId(body[key]);

    if (value === undefined) {
      delete body[key];
    } else {
      body[key] = value;
    }
  }
}

async function ensureMediaRow(mediaId: string | number, meta: unknown) {
  if (!meta || typeof meta !== 'object') return false;

  const media = meta as Record<string, unknown>;
  const url = typeof media.url === 'string' ? media.url : null;
  const thumbnailURL = typeof media.thumbnailURL === 'string' ? media.thumbnailURL : null;

  if (!url && !thumbnailURL) return false;

  const supabase = await createClient();
  const { error } = await supabase.from('media').upsert({
    alt: typeof media.alt === 'string' ? media.alt : null,
    filename: typeof media.filename === 'string' ? media.filename : `media-${mediaId}`,
    id: mediaId,
    mime_type: typeof media.mimeType === 'string' ? media.mimeType : null,
    thumbnail_u_r_l: thumbnailURL,
    url: url ?? thumbnailURL,
  });

  if (error) {
    console.error('[sanitize posts] media upsert failed', error);
    return false;
  }

  return true;
}

async function validatePostForeignKeys(body: Record<string, unknown>, values: Record<string, any>, shouldValidateImage: boolean, mode: 'create' | 'update') {
  if (!shouldValidateImage) {
    delete body.featured_image_id;
    return null;
  }

  if (!hasOwn(body, 'featured_image_id')) return null;

  if (body.featured_image_id === null) return null;

  const mediaId = toValidId(body.featured_image_id);

  if (mediaId === undefined) {
    delete body.featured_image_id;
    return null;
  }

  if (mediaId === null) return null;

  const supabase = await createClient();
  let { data, error } = await supabase.from('media').select('id').eq('id', mediaId).maybeSingle();

  if (error) {
    return `Could not validate featured image in media table: ${error.message}`;
  }

  if (!data) {
    const created = await ensureMediaRow(mediaId, values.featuredImageMeta);

    if (created) {
      const retry = await supabase.from('media').select('id').eq('id', mediaId).maybeSingle();
      data = retry.data;
      error = retry.error;
    }
  }

  if (error) {
    return `Could not validate featured image in media table: ${error.message}`;
  }

  if (!data) {
    if (mode === 'update') {
      delete body.featured_image_id;
      return null;
    }

    return 'Featured image does not exist in media table. Please choose an existing media item or remove the image.';
  }

  body.featured_image_id = mediaId;
  return null;
}

function toSnakePayload(collection: string, values: Record<string, any>) {
  const hasFeaturedImage = hasOwn(values, 'featuredImage');
  const hasFeaturedImageId = hasOwn(values, 'featured_image_id');
  const body: Record<string, unknown> = {
    ...values,
  };

  const assignAlias = (from: string, to: string) => {
    if (from in values) body[to] = values[from];
  };

  assignAlias('allowComments', 'allow_comments');
  assignAlias('ctaLink', 'cta_link');
  assignAlias('ctaText', 'cta_text');
  assignAlias('endDate', 'end_date');
  assignAlias('eventEndDate', 'event_end_date');
  assignAlias('eventStartDate', 'event_start_date');
  assignAlias('eventType', 'event_type');
  assignAlias('featuredImage', 'featured_image_id');
  assignAlias('htmlContent', 'html_content');
  assignAlias('image', 'image_id');
  assignAlias('menuLabel', 'menu_label');
  assignAlias('parent', 'parent_id');
  assignAlias('publishedAt', 'published_at');
  assignAlias('scheduledAt', 'scheduled_at');
  assignAlias('showInMenu', 'show_in_menu');
  assignAlias('showOnce', 'show_once');
  assignAlias('startDate', 'start_date');

  if (values.meta && typeof values.meta === 'object') {
    body.meta_seo_title = values.meta.seoTitle;
    body.meta_meta_description = values.meta.metaDescription;
    body.meta_focus_keyword = values.meta.focusKeyword;
  }

  if (collection !== 'posts' && body.featured_image_id === undefined) {
    delete body.featured_image_id;
  }

  if (collection === 'posts') {
    delete body.image;
    delete body.image_id;

    if (!hasFeaturedImage && !hasFeaturedImageId) {
      delete body.featured_image_id;
    }
  }

  for (const key of Object.keys(body)) {
    if (body[key] === undefined || aliasKeys.has(key)) {
      delete body[key];
    }
  }

  normalizeForeignKeys(body);

  return body;
}

export async function sanitizeAdminPayload(collection: string, values: Record<string, any>, mode: 'create' | 'update' = 'create') {
  const shouldValidatePostImage = hasOwn(values, 'featuredImage') || hasOwn(values, 'featured_image_id');

  if (collection === 'posts' && process.env.NODE_ENV === 'development') {
    console.log('[sanitize posts] incoming keys', Object.keys(values));
  }

  const body = toSnakePayload(collection, values);

  if (collection === 'posts') {
    const error = await validatePostForeignKeys(body, values, shouldValidatePostImage, mode);

    if (process.env.NODE_ENV === 'development') {
      console.log('[sanitize posts] sanitized payload', body);
    }

    if (error) {
      return { body: null, error };
    }
  }

  return { body, error: null };
}
