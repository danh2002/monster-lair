import type { PatchNote } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getPatchNotes(limit = 50): Promise<QueryResult<PatchNote[]>> {
  return selectRows<PatchNote>('patch_notes', { limit, orderBy: 'published_at' });
}
