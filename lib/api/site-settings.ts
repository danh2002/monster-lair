import type { SiteSettings } from '@/types/database';
import { createClient } from '@/utils/supabase/server';
import { queryErrorMessage, type QueryResult } from './shared';

export async function getSiteSettings(): Promise<QueryResult<SiteSettings | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();

  if (error) {
    console.error(queryErrorMessage('site_settings', error), error);
    return { data: null, error: queryErrorMessage('site_settings', error), details: error };
  }

  return { data: (data as SiteSettings | null) ?? null, error: null };
}
