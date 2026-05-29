'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { FaNewspaper } from '@react-icons/all-files/fa/FaNewspaper';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { AdminButton } from './AdminButton';
import { BulkActions } from './BulkActions';
import { EmptyState } from './EmptyState';
import { FilterTabs } from './FilterTabs';
import { Pagination } from './Pagination';
import { PostsTable, type AdminPost } from './PostsTable';
import { SearchInput } from './SearchInput';
import { Select } from './Select';
import { showAdminToast } from './Toast';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

export function PostsPageClient({ posts }: { posts: AdminPost[] }) {
  const router = useRouter();
  const [items, setItems] = useState(posts);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(new Set<string>());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const counts = useMemo(
    () => ({
      all: items.length,
      draft: items.filter((post) => post.status === 'draft').length,
      pending: items.filter((post) => post.status === 'pending').length,
      published: items.filter((post) => post.status === 'published').length,
      scheduled: items.filter((post) => post.status === 'scheduled').length,
    }),
    [items],
  );
  const filtered = useMemo(
    () =>
      items.filter((post) => {
        const matchesStatus = status === 'all' || post.status === status;
        const matchesQuery = `${post.title ?? ''} ${post.excerpt ?? ''}`.toLowerCase().includes(query.toLowerCase());
        return matchesStatus && matchesQuery;
      }),
    [items, query, status],
  );

  useEffect(() => {
    console.log('Post IDs:', posts.map((post) => ({ id: post.id, type: typeof post.id })));
  }, [posts]);

  function toggleSelected(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function getCookie(name: string) {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];
  }

  async function handleDelete(postId: string | number) {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;

    const id = String(postId);
    setDeletingId(id);

    try {
      const token = getCookie('payload-token');
      const res = await fetch(`/api/admin/supabase/posts/${postId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        method: 'DELETE',
      });

      console.log('Delete response:', res.status, postId);

      if (!res.ok) {
        const text = await res.text();
        console.error('Delete failed:', res.status, text);
        showAdminToast('error', `Xóa thất bại: ${res.status}`);
        return;
      }

      setItems((current) => current.filter((post) => String(post.id) !== id));
      setSelected((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      showAdminToast('success', 'Đã xóa bài viết');
      router.refresh();
    } catch (error) {
      console.error('Delete post failed:', error);
      showAdminToast('error', 'Có lỗi khi xóa bài viết');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Header>
        <h1 style={{ fontSize: 34, margin: 0 }}>Posts</h1>
        <AdminButton href="/admin/posts/new" variant="primary"><FaPlus /> New Post</AdminButton>
      </Header>
      <FilterTabs
        active={status}
        onChange={setStatus}
        tabs={[
          { count: counts.all, label: 'All', value: 'all' },
          { count: counts.published, label: 'Published', value: 'published' },
          { count: counts.draft, label: 'Draft', value: 'draft' },
          { count: counts.pending, label: 'Pending', value: 'pending' },
          { count: counts.scheduled, label: 'Scheduled', value: 'scheduled' },
        ]}
      />
      <FilterBar>
        <SearchInput onChange={(event) => setQuery(event.target.value)} placeholder="Search posts..." value={query} />
        <Select><option>All Categories</option></Select>
        <Select><option>All Authors</option></Select>
        <Select><option>All Dates</option></Select>
        <Select><option>Bulk Actions</option><option>Publish</option><option>Move to Trash</option></Select>
        <AdminButton>Apply</AdminButton>
      </FilterBar>
      <BulkActions selected={selected.size} />
      {filtered.length ? (
        <>
          <PostsTable deletingId={deletingId} onDelete={handleDelete} onSelect={toggleSelected} posts={filtered} selected={selected} />
          <Pagination total={filtered.length} />
        </>
      ) : (
        <EmptyState
          action={<AdminButton href="/admin/posts/new" variant="primary">Add New Post</AdminButton>}
          description="Start writing your first post"
          icon={FaNewspaper}
          title="No posts found"
        />
      )}
    </>
  );
}
