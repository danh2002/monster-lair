import type { Page } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listPages = (limit = 100) => listRows<Page>('pages', { ascending: true, limit, orderBy: 'order' });
export const getPageById = (id: string | number) => getRowById<Page>('pages', id);
export const createPage = (values: Record<string, unknown>) => createRow<Page>('pages', values);
export const updatePage = (id: string | number, values: Record<string, unknown>) => updateRow<Page>('pages', id, values);
export const deletePage = (id: string | number) => deleteRow('pages', id);
