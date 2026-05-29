import type { Post } from '@/types/database';
import { createClient } from '@/utils/supabase/server';
import { queryErrorMessage, type QueryResult } from './shared';

type MediaRow = Record<string, unknown> & { id: string | number };

function getFeaturedImageId(post: Post) {
  const value = post.featured_image_id ?? post.featuredImage;

  if (typeof value === 'number') return String(value);
  if (typeof value === 'string' && /^\d+$/.test(value)) return value;

  return null;
}

async function attachFeaturedMedia(posts: Post[]) {
  const supabase = await createClient();
  const ids = Array.from(new Set(posts.map(getFeaturedImageId).filter(Boolean))) as string[];

  if (!ids.length) return posts;

  const { data, error } = await supabase.from('media').select('*').in('id', ids);

  if (error) {
    console.error(queryErrorMessage('media', error), error);
    return posts;
  }

  const mediaById = new Map((data ?? []).map((item: MediaRow) => [String(item.id), item]));

  return posts.map((post) => {
    const featuredImageId = getFeaturedImageId(post);
    const media = featuredImageId ? mediaById.get(featuredImageId) : null;

    if (!media) return post;

    return {
      ...post,
      featuredImage: {
        ...media,
        thumbnailURL: media.thumbnailURL ?? media.thumbnail_url ?? media.thumbnail_u_r_l ?? media.sizes_card_url ?? media.sizes_thumbnail_url,
        url: media.url ?? media.sizes_card_url ?? media.sizes_thumbnail_url,
      },
    };
  });
}

export async function getPosts(limit = 20): Promise<QueryResult<Post[]>> {
  const supabase = await createClient();

  // TODO: Replace select('*') with explicit fields after confirming the Supabase posts schema.
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(queryErrorMessage('posts', error), error);
    return { data: [], error: queryErrorMessage('posts', error), details: error };
  }

  return { data: await attachFeaturedMedia((data ?? []) as Post[]), error: null };
}

export async function getPostBySlug(slug: string): Promise<QueryResult<Post | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error(queryErrorMessage('posts', error), error);
    return { data: null, error: queryErrorMessage('posts', error), details: error };
  }

  const posts = data ? await attachFeaturedMedia([data as Post]) : [];

  return { data: posts[0] ?? null, error: null };
}
