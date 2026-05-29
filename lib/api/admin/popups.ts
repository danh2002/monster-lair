import type { Popup } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listPopups = (limit = 100) => listRows<Popup>('popups', { limit, orderBy: 'created_at' });
export const getPopupById = (id: string | number) => getRowById<Popup>('popups', id);
export const createPopup = (values: Record<string, unknown>) => createRow<Popup>('popups', values);
export const updatePopup = (id: string | number, values: Record<string, unknown>) => updateRow<Popup>('popups', id, values);
export const deletePopup = (id: string | number) => deleteRow('popups', id);
