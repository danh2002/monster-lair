import type { ServerStatus } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listServerStatus = (limit = 50) => listRows<ServerStatus>('server_status', { limit, orderBy: 'created_at' });
export const getServerStatusById = (id: string | number) => getRowById<ServerStatus>('server_status', id);
export const createServerStatus = (values: Record<string, unknown>) => createRow<ServerStatus>('server_status', values);
export const updateServerStatus = (id: string | number, values: Record<string, unknown>) => updateRow<ServerStatus>('server_status', id, values);
export const deleteServerStatus = (id: string | number) => deleteRow('server_status', id);
