'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaCheck } from '@react-icons/all-files/fa/FaCheck';
import { FaCloudUploadAlt } from '@react-icons/all-files/fa/FaCloudUploadAlt';
import { AdminButton } from './AdminButton';
import { FileUpload } from './FileUpload';
import type { UploadedMedia } from './FileUpload';
import { Modal } from './Modal';
import { SearchInput } from './SearchInput';
import { Select } from './Select';
import { showAdminToast } from './Toast';
import { adminTheme } from '@/styles/adminTheme';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
`;

const Card = styled.div<{ $selected?: boolean }>`
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ $selected }) => ($selected ? adminTheme.accent : adminTheme.border)};
  border-radius: ${adminTheme.radius};
  background: ${adminTheme.card};
  color: ${adminTheme.text};
  cursor: pointer;
  padding: 0;
  text-align: left;
`;

const Preview = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  background: #0f0f13;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0,0,0,0.7);
  opacity: 0;
  transition: opacity 160ms ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const Meta = styled.div`
  padding: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: ${adminTheme.radius};
  background: ${adminTheme.card};
`;

const Cell = styled.td`
  padding: 14px;
  border-bottom: 1px solid ${adminTheme.border};
`;

function size(value?: number) {
  if (!value) return 'Unknown';
  return value > 1024 * 1024 ? `${(value / 1024 / 1024).toFixed(1)} MB` : `${Math.round(value / 1024)} KB`;
}

function getCookie(name: string) {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return value ? decodeURIComponent(value) : '';
}

function absoluteUrl(value?: string | null) {
  if (!value) return '';
  return new URL(value, window.location.origin).toString();
}

export function MediaPageClient({ items }: { items: any[] }) {
  const [mediaItems, setMediaItems] = useState(items);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<any | null>(null);
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const filtered = useMemo(
    () =>
      mediaItems.filter((item) => {
        const matchesQuery = (item.filename ?? '').toLowerCase().includes(query.toLowerCase());
        const matchesType = type === 'all' || (type === 'images' ? item.mimeType?.startsWith('image/') : type === 'documents' ? item.mimeType?.includes('pdf') : item.mimeType?.startsWith('video/'));
        return matchesQuery && matchesType;
      }),
    [mediaItems, query, type],
  );

  function openEditor(item: any) {
    setSelected(item);
    setAlt(item.alt ?? '');
    setCaption(item.caption ?? '');
    setDescription(item.description ?? '');
  }

  async function copyUrl(item: any) {
    const url = absoluteUrl(item.url);

    if (!url) {
      showAdminToast('error', 'Media này chưa có URL');
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }

      showAdminToast('success', 'Đã copy URL');
    } catch (error) {
      console.error('Copy media URL failed:', error);
      showAdminToast('error', 'Không copy được URL');
    }
  }

  async function updateMedia() {
    if (!selected?.id) return;

    setSaving(true);

    try {
      const token = getCookie('payload-token');
      const res = await fetch(`/api/media/${selected.id}`, {
        body: JSON.stringify({ alt, caption, description }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        method: 'PATCH',
      });
      const text = await res.text();

      if (!res.ok) {
        console.error('Update media failed:', res.status, text);
        showAdminToast('error', `Cập nhật thất bại: ${res.status}`);
        return;
      }

      const data = JSON.parse(text);
      const updated = data.doc ?? data;
      setMediaItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelected(updated);
      showAdminToast('success', 'Đã cập nhật media');
    } catch (error) {
      console.error('Update media failed:', error);
      showAdminToast('error', 'Có lỗi khi cập nhật media');
    } finally {
      setSaving(false);
    }
  }

  async function deleteMedia(item: any) {
    if (!item?.id || !confirm('Bạn có chắc muốn xóa media này?')) return;

    setDeletingId(item.id);

    try {
      const token = getCookie('payload-token');
      const res = await fetch(`/api/media/${item.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        method: 'DELETE',
      });
      const text = await res.text();

      if (!res.ok) {
        console.error('Delete media failed:', res.status, text);
        showAdminToast('error', `Xóa thất bại: ${res.status}`);
        return;
      }

      setMediaItems((current) => current.filter((media) => media.id !== item.id));
      if (selected?.id === item.id) setSelected(null);
      showAdminToast('success', 'Đã xóa media');
    } catch (error) {
      console.error('Delete media failed:', error);
      showAdminToast('error', 'Có lỗi khi xóa media');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Media Library</h1>
        <AdminButton variant="primary"><FaCloudUploadAlt /> Upload Files</AdminButton>
      </div>
      <FileUpload onChange={(media: UploadedMedia) => setMediaItems((current) => [media, ...current])} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '18px 0' }}>
        <AdminButton onClick={() => setView('grid')}>Grid</AdminButton>
        <AdminButton onClick={() => setView('list')}>List</AdminButton>
        <SearchInput onChange={(event) => setQuery(event.target.value)} placeholder="Search media..." value={query} />
        <Select onChange={(event) => setType(event.target.value)} value={type}><option value="all">All</option><option value="images">Images</option><option value="videos">Videos</option><option value="documents">Documents</option></Select>
      </div>
      {view === 'grid' ? (
        <Grid>
          {filtered.map((item) => {
            const src = item.thumbnailURL || item.url || '';
            const isImage = item.mimeType?.startsWith('image/');
            return (
              <Card $selected={selected?.id === item.id} key={item.id} onClick={() => openEditor(item)}>
                <Preview>
                  {src && isImage ? <Image alt={item.alt || item.filename || 'Media'} fill src={src} style={{ objectFit: 'cover' }} /> : null}
                  {selected?.id === item.id ? <div style={{ background: adminTheme.accent, borderRadius: '50%', display: 'grid', height: 26, placeItems: 'center', position: 'absolute', right: 10, top: 10, width: 26 }}><FaCheck size={12} /></div> : null}
                  <Overlay onClick={(event) => event.stopPropagation()}>
                    <AdminButton onClick={() => copyUrl(item)}>Copy URL</AdminButton>
                    <AdminButton onClick={() => openEditor(item)}>Edit</AdminButton>
                    <AdminButton disabled={deletingId === item.id} onClick={() => deleteMedia(item)} variant="danger">
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </AdminButton>
                  </Overlay>
                </Preview>
                <Meta>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename ?? 'Untitled'}</div>
                  <div style={{ color: adminTheme.textMuted, fontSize: 12, marginTop: 4 }}>{size(item.filesize)}</div>
                </Meta>
              </Card>
            );
          })}
        </Grid>
      ) : (
        <Table>
          <tbody>{filtered.map((item) => <tr key={item.id}><Cell>Preview</Cell><Cell>{item.filename}</Cell><Cell>{item.mimeType}</Cell><Cell>{size(item.filesize)}</Cell><Cell>{item.width}x{item.height}</Cell><Cell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Cell><Cell><AdminButton onClick={() => openEditor(item)}>Edit</AdminButton></Cell></tr>)}</tbody>
        </Table>
      )}
      {selected ? (
        <Modal onClose={() => setSelected(null)} title="Media Details">
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr 360px', padding: 18 }}>
            <div style={{ background: '#0f0f13', borderRadius: 12, minHeight: 420, position: 'relative' }}>
              {selected.url && selected.mimeType?.startsWith('image/') ? <Image alt={selected.alt || selected.filename} fill src={selected.url} style={{ objectFit: 'contain' }} /> : null}
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <input readOnly value={selected.filename ?? ''} style={fieldStyle} />
              <input onChange={(event) => setAlt(event.target.value)} placeholder="Alt Text" style={fieldStyle} value={alt} />
              <textarea onChange={(event) => setCaption(event.target.value)} placeholder="Caption" style={{ ...fieldStyle, minHeight: 90, padding: 12 }} value={caption} />
              <textarea onChange={(event) => setDescription(event.target.value)} placeholder="Description" style={{ ...fieldStyle, minHeight: 90, padding: 12 }} value={description} />
              <input readOnly value={selected.url ?? ''} style={fieldStyle} />
              <div style={{ color: adminTheme.textMuted }}>{selected.width}x{selected.height} · {size(selected.filesize)}</div>
              <div style={{ color: adminTheme.textMuted }}>Uploaded {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'unknown'}</div>
              <AdminButton onClick={() => copyUrl(selected)}>Copy URL</AdminButton>
              <AdminButton disabled={saving} onClick={updateMedia} variant="primary">{saving ? 'Updating...' : 'Update'}</AdminButton>
              <AdminButton disabled={deletingId === selected.id} onClick={() => deleteMedia(selected)} variant="danger">
                {deletingId === selected.id ? 'Deleting...' : 'Delete'}
              </AdminButton>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

const fieldStyle = {
  background: '#0f0f13',
  border: `1px solid ${adminTheme.border}`,
  borderRadius: 8,
  color: '#fff',
  minHeight: 42,
  padding: '0 12px',
};
