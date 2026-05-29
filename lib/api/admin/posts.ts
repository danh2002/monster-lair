import type { Post } from '@/types/database';
import { createRow, deleteRow, getRowById, listRows, updateRow } from './shared';

export const listPosts = (limit = 100) => listRows<Post>('posts', { limit, orderBy: 'published_at' });
export const getPostById = (id: string | number) => getRowById<Post>('posts', id);
export const createPost = (values: Record<string, unknown>) => createRow<Post>('posts', values);
export const updatePost = (id: string | number, values: Record<string, unknown>) => updateRow<Post>('posts', id, values);
export const deletePost = (id: string | number) => deleteRow('posts', id);
