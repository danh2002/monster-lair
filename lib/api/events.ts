import type { Event } from '@/types/database';
import { selectRows, type QueryResult } from './shared';

export async function getEvents(limit = 25): Promise<QueryResult<Event[]>> {
  return selectRows<Event>('events', { limit, orderBy: 'event_start_date' });
}
