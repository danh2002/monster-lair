import type { Dinosaur } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getDinosaurs(limit = 50): Promise<QueryResult<Dinosaur[]>> {
  return selectRows<Dinosaur>('dinosaurs', { ascending: true, limit, orderBy: 'name' });
}
