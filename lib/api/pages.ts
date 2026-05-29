import type { Page } from '@/types/database';
import { createClient } from '@/utils/supabase/server';
import { queryErrorMessage, selectRows, type QueryResult } from './shared';

export async function getPages(limit = 100): Promise<QueryResult<Page[]>> {
  return selectRows<Page>('pages', { ascending: true, limit, orderBy: 'order' });
}

export async function getPageBySlug(slug: string): Promise<QueryResult<Page | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).maybeSingle();

  if (error) {
    console.error(queryErrorMessage('pages', error), error);
    return { data: null, error: queryErrorMessage('pages', error), details: error };
  }

  return { data: (data as Page | null) ?? null, error: null };
}
