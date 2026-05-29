import type { Media } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getMedia(limit = 60): Promise<QueryResult<Media[]>> {
  return selectRows<Media>('media', { limit, orderBy: 'created_at' });
}
