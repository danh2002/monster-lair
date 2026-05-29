import type { Media } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listMedia = (limit = 100) => listRows<Media>('media', { limit, orderBy: 'created_at' });
export const getMediaById = (id: string | number) => getRowById<Media>('media', id);
export const createMedia = (values: Record<string, unknown>) => createRow<Media>('media', values);
export const updateMedia = (id: string | number, values: Record<string, unknown>) => updateRow<Media>('media', id, values);
export const deleteMedia = (id: string | number) => deleteRow('media', id);
