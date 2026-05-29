import type { Event } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listEvents = (limit = 100) => listRows<Event>('events', { limit, orderBy: 'event_start_date' });
export const getEventById = (id: string | number) => getRowById<Event>('events', id);
export const createEvent = (values: Record<string, unknown>) => createRow<Event>('events', values);
export const updateEvent = (id: string | number, values: Record<string, unknown>) => updateRow<Event>('events', id, values);
export const deleteEvent = (id: string | number) => deleteRow('events', id);
