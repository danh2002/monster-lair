import type { Popup } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getPopups(limit = 10): Promise<QueryResult<Popup[]>> {
  return selectRows<Popup>('popups', { limit, orderBy: 'created_at' });
}
