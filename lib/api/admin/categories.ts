import type { Category } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listCategories = (limit = 100) => listRows<Category>('categories', { ascending: true, limit, orderBy: 'name' });
export const getCategoryById = (id: string | number) => getRowById<Category>('categories', id);
export const createCategory = (values: Record<string, unknown>) => createRow<Category>('categories', values);
export const updateCategory = (id: string | number, values: Record<string, unknown>) => updateRow<Category>('categories', id, values);
export const deleteCategory = (id: string | number) => deleteRow('categories', id);
