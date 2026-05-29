import { NextResponse } from 'next/server';
import { getBanners } from '@/lib/api/banners';
import { getCategories } from '@/lib/api/categories';
import { getDinosaurs } from '@/lib/api/dinosaurs';
import { getEvents } from '@/lib/api/events';
import { getMedia } from '@/lib/api/media';
import { getPages } from '@/lib/api/pages';
import { getPackages } from '@/lib/api/packages';
import { getPatchNotes } from '@/lib/api/patch-notes';
import { getPopups } from '@/lib/api/popups';
import { getPosts } from '@/lib/api/posts';
import { getServerStatus } from '@/lib/api/server-status';
import { getSiteSettings } from '@/lib/api/site-settings';

export async function GET() {
  const checks = {
    banners: () => getBanners(3),
    categories: () => getCategories(3),
    dinosaurs: () => getDinosaurs(3),
    events: () => getEvents(3),
    media: () => getMedia(3),
    pages: () => getPages(3),
    packages: () => getPackages(3),
    patchNotes: () => getPatchNotes(3),
    popups: () => getPopups(3),
    posts: () => getPosts(3),
    serverStatus: () => getServerStatus(3),
    siteSettings: () => getSiteSettings(),
  };

  const entries = await Promise.allSettled(
    Object.entries(checks).map(async ([name, run]) => {
      const result = await run();
      const rows = Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];

      return [
        name,
        {
          count: rows.length,
          data: rows.slice(0, 3),
          error: result.error,
        },
      ] as const;
    }),
  );

  const tables = Object.fromEntries(
    entries.map((entry, index) => {
      const name = Object.keys(checks)[index];

      if (entry.status === 'rejected') {
        return [name, { count: 0, data: [], error: String(entry.reason) }];
      }

      return entry.value;
    }),
  );

  const errors = Object.fromEntries(Object.entries(tables).filter(([, value]) => value.error).map(([name, value]) => [name, value.error]));
  const counts = Object.fromEntries(Object.entries(tables).map(([name, value]) => [name, value.count]));
  const samples = Object.fromEntries(Object.entries(tables).map(([name, value]) => [name, value.data]));

  return NextResponse.json({
    success: Object.keys(errors).length === 0,
    counts,
    samples,
    tables,
    errors,
  });
}
