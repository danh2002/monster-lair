import type { Category } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getCategories(limit = 100): Promise<QueryResult<Category[]>> {
  return selectRows<Category>('categories', { ascending: true, limit, orderBy: 'name' });
}
