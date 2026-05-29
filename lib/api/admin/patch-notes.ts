import type { PatchNote } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listPatchNotes = (limit = 100) => listRows<PatchNote>('patch_notes', { limit, orderBy: 'published_at' });
export const getPatchNoteById = (id: string | number) => getRowById<PatchNote>('patch_notes', id);
export const createPatchNote = (values: Record<string, unknown>) => createRow<PatchNote>('patch_notes', values);
export const updatePatchNote = (id: string | number, values: Record<string, unknown>) => updateRow<PatchNote>('patch_notes', id, values);
export const deletePatchNote = (id: string | number) => deleteRow('patch_notes', id);
