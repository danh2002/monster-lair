import type { Banner } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getBanners(limit = 50): Promise<QueryResult<Banner[]>> {
  return selectRows<Banner>('banners', { ascending: true, limit, orderBy: 'order' });
}
