import { createClient } from '@/utils/supabase/server';

export type AdminResult<T> = {
  data: T | null;
  error: string | null;
};

export type AdminListResult<T> = {
  data: T[];
  error: string | null;
  totalDocs: number;
};

type ListOptions = {
  limit?: number;
  orderBy?: string;
  ascending?: boolean;
};

function formatAdminError(table: string, action: string, error: unknown) {
  const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : String(error);

  return `${action} ${table} failed: ${message}. If this is an RLS error, create the matching SELECT/INSERT/UPDATE/DELETE policy in Supabase instead of using a service role in frontend code.`;
}

export function normalizeRow<T extends Record<string, any>>(row: T): T {
  return {
    ...row,
    _status: row._status ?? row.version__status,
    allowComments: row.allowComments ?? row.allow_comments,
    createdAt: row.createdAt ?? row.created_at,
    eventEndDate: row.eventEndDate ?? row.event_end_date,
    eventStartDate: row.eventStartDate ?? row.event_start_date,
    eventType: row.eventType ?? row.event_type,
    featuredImage: row.featuredImage ?? row.featured_image ?? row.featured_image_id,
    filesize: row.filesize ?? row.file_size,
    htmlContent: row.htmlContent ?? row.html_content,
    locationName: row.locationName ?? row.location_name,
    mimeType: row.mimeType ?? row.mime_type,
    publishedAt: row.publishedAt ?? row.published_at,
    readingTime: row.readingTime ?? row.reading_time,
    defaultMetaDescription: row.defaultMetaDescription ?? row.default_meta_description,
    defaultSeoTitle: row.defaultSeoTitle ?? row.default_seo_title,
    googleAnalyticsId: row.googleAnalyticsId ?? row.google_analytics_id,
    googleSearchConsoleVerification: row.googleSearchConsoleVerification ?? row.google_search_console_verification,
    robotsTxt: row.robotsTxt ?? row.robots_txt,
    scheduledAt: row.scheduledAt ?? row.scheduled_at,
    siteDescription: row.siteDescription ?? row.site_description,
    siteName: row.siteName ?? row.site_name ?? row.game_name,
    thumbnailURL: row.thumbnailURL ?? row.thumbnail_url,
    updatedAt: row.updatedAt ?? row.updated_at,
    viewCount: row.viewCount ?? row.view_count,
  };
}

function normalizeRows<T extends Record<string, any>>(rows: T[] | null) {
  return (rows ?? []).map((row) => normalizeRow(row));
}

export async function listRows<T extends Record<string, any>>(table: string, options: ListOptions = {}): Promise<AdminListResult<T>> {
  const supabase = await createClient();
  const limit = options.limit ?? 100;
  let query = supabase.from(table).select('*', { count: 'exact' }).limit(limit);

  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }

  let { data, error, count } = await query;

  if (error && options.orderBy) {
    const retry = await supabase.from(table).select('*', { count: 'exact' }).limit(limit);
    data = retry.data;
    error = retry.error;
    count = retry.count;
  }

  if (error) {
    console.error(formatAdminError(table, 'List', error));
    return { data: [], error: formatAdminError(table, 'List', error), totalDocs: 0 };
  }

  return { data: normalizeRows(data) as T[], error: null, totalDocs: count ?? data?.length ?? 0 };
}

export async function getRowById<T extends Record<string, any>>(table: string, id: string | number): Promise<AdminResult<T>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error(formatAdminError(table, 'Read', error));
    return { data: null, error: formatAdminError(table, 'Read', error) };
  }

  return { data: data ? (normalizeRow(data) as T) : null, error: null };
}

export async function createRow<T extends Record<string, any>>(table: string, values: Record<string, unknown>): Promise<AdminResult<T>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).insert(values).select('*').single();

  if (error) {
    console.error(formatAdminError(table, 'Create', error));
    return { data: null, error: formatAdminError(table, 'Create', error) };
  }

  return { data: normalizeRow(data) as T, error: null };
}

export async function updateRow<T extends Record<string, any>>(table: string, id: string | number, values: Record<string, unknown>): Promise<AdminResult<T>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).update(values).eq('id', id).select('*').single();

  if (error) {
    console.error(formatAdminError(table, 'Update', error));
    return { data: null, error: formatAdminError(table, 'Update', error) };
  }

  return { data: normalizeRow(data) as T, error: null };
}

export async function deleteRow(table: string, id: string | number): Promise<AdminResult<{ id: string | number }>> {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    console.error(formatAdminError(table, 'Delete', error));
    return { data: null, error: formatAdminError(table, 'Delete', error) };
  }

  return { data: { id }, error: null };
}
