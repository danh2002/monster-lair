import type { ServerStatus } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getServerStatus(limit = 20): Promise<QueryResult<ServerStatus[]>> {
  return selectRows<ServerStatus>('server_status', { limit, orderBy: 'created_at' });
}
