import type { SiteSettings } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listSiteSettings = (limit = 20) => listRows<SiteSettings>('site_settings', { limit, orderBy: 'updated_at' });
export const getSiteSettingsById = (id: string | number) => getRowById<SiteSettings>('site_settings', id);
export const createSiteSettings = (values: Record<string, unknown>) => createRow<SiteSettings>('site_settings', values);
export const updateSiteSettings = (id: string | number, values: Record<string, unknown>) => updateRow<SiteSettings>('site_settings', id, values);
export const deleteSiteSettings = (id: string | number) => deleteRow('site_settings', id);
