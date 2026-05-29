import type { Package } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listPackages = (limit = 100) => listRows<Package>('packages', { ascending: true, limit, orderBy: 'order' });
export const getPackageById = (id: string | number) => getRowById<Package>('packages', id);
export const createPackage = (values: Record<string, unknown>) => createRow<Package>('packages', values);
export const updatePackage = (id: string | number, values: Record<string, unknown>) => updateRow<Package>('packages', id, values);
export const deletePackage = (id: string | number) => deleteRow('packages', id);
