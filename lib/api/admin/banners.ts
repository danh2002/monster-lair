import type { Banner } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listBanners = (limit = 100) => listRows<Banner>('banners', { ascending: true, limit, orderBy: 'order' });
export const getBannerById = (id: string | number) => getRowById<Banner>('banners', id);
export const createBanner = (values: Record<string, unknown>) => createRow<Banner>('banners', values);
export const updateBanner = (id: string | number, values: Record<string, unknown>) => updateRow<Banner>('banners', id, values);
export const deleteBanner = (id: string | number) => deleteRow('banners', id);
