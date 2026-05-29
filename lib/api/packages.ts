import type { Package } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getPackages(limit = 50): Promise<QueryResult<Package[]>> {
  return selectRows<Package>('packages', { ascending: true, limit, orderBy: 'order' });
}
