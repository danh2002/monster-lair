import type { Dinosaur } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listDinosaurs = (limit = 100) => listRows<Dinosaur>('dinosaurs', { ascending: true, limit, orderBy: 'name' });
export const getDinosaurById = (id: string | number) => getRowById<Dinosaur>('dinosaurs', id);
export const createDinosaur = (values: Record<string, unknown>) => createRow<Dinosaur>('dinosaurs', values);
export const updateDinosaur = (id: string | number, values: Record<string, unknown>) => updateRow<Dinosaur>('dinosaurs', id, values);
export const deleteDinosaur = (id: string | number) => deleteRow('dinosaurs', id);
