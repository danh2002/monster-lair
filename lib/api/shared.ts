import { createClient } from '@/utils/supabase/server';

export type QueryResult<T> = {
  data: T;
  error: string | null;
  details?: unknown;
};

export function queryErrorMessage(table: string, error: unknown) {
  const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : String(error);
  return `${table}: ${message}. If this is a permission error, create a public SELECT RLS policy for the ${table} table.`;
}

export async function selectRows<T>(table: string, options: { limit?: number; orderBy?: string; ascending?: boolean } = {}): Promise<QueryResult<T[]>> {
  const supabase = await createClient();
  let query = supabase.from(table).select('*').limit(options.limit ?? 50);

  // TODO: Replace select('*') with explicit field lists after the Supabase schema is finalized.
  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }

  const { data, error } = await query;

  if (error) {
    if (options.orderBy) {
      const fallback = await supabase.from(table).select('*').limit(options.limit ?? 50);

      if (!fallback.error) {
        return { data: (fallback.data ?? []) as T[], error: null };
      }
    }

    console.error(queryErrorMessage(table, error), error);
    return { data: [], error: queryErrorMessage(table, error), details: error };
  }

  return { data: (data ?? []) as T[], error: null };
}
