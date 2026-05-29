'use client';

import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import { AdminButton } from './AdminButton';
import { FileUpload, type UploadedMedia } from './FileUpload';
import { Select } from './Select';
import { showAdminToast } from './Toast';
import { adminTheme } from '@/styles/adminTheme';

type BannerDoc = Record<string, any>;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  gap: 20px;
`;

const Panel = styled.section`
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radius};
  background: ${adminTheme.card};
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radiusSm};
  background: #0f0f13;
  color: ${adminTheme.text};
`;

const Label = styled.label`
  display: grid;
  gap: 8px;
  color: ${adminTheme.textMuted};
  font-size: 13px;
  font-weight: 800;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) 100px 80px 150px;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${adminTheme.border};

  &:last-child {
    border-bottom: 0;
  }
`;

const Thumb = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: ${adminTheme.radiusSm};
  background: #0f0f13;
`;

function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function mediaId(value: UploadedMedia | string | number | null) {
  return value && typeof value === 'object' ? value.id : value;
}

function mediaUrl(value: unknown) {
  if (!value || typeof value !== 'object') return '';
  return ((value as any).thumbnailURL || (value as any).url || '') as string;
}

export function BannersPageClient({ banners }: { banners: BannerDoc[] }) {
  const [items, setItems] = useState(banners);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<UploadedMedia | string | number | null>(null);
  const [link, setLink] = useState('');
  const [position, setPosition] = useState('home');
  const [order, setOrder] = useState('0');
  const [active, setActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);

  async function createBanner() {
    if (!title || !image) {
      showAdminToast('error', 'Title and image are required');
      return;
    }

    setSaving(true);

    try {
      const token = getCookie('payload-token');
      const res = await fetch('/api/admin/supabase/banners', {
        body: JSON.stringify({
          active,
          endDate: endDate || null,
          image: mediaId(image),
          link,
          order: Number(order) || 0,
          position,
          startDate: startDate || null,
          title,
        }),
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `JWT ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const text = await res.text();

      if (!res.ok) {
        showAdminToast('error', `Create failed: ${res.status} - ${text.slice(0, 100)}`);
        return;
      }

      const data = JSON.parse(text);
      setItems((current) => [data.doc ?? data, ...current]);
      setTitle('');
      setImage(null);
      setLink('');
      setOrder('0');
      showAdminToast('success', 'Banner created');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: BannerDoc) {
    const token = getCookie('payload-token');
    const res = await fetch(`/api/admin/supabase/banners/${item.id}`, {
      body: JSON.stringify({ active: !item.active }),
      credentials: 'include',
      headers: {
        ...(token ? { Authorization: `JWT ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });

    if (!res.ok) {
      showAdminToast('error', 'Update failed');
      return;
    }

    setItems((current) => current.map((banner) => (banner.id === item.id ? { ...banner, active: !banner.active } : banner)));
  }

  return (
    <>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Banners</h1>
      <Grid>
        <Panel>
          <strong>Create Banner</strong>
          <Label>Title<Input onChange={(event) => setTitle(event.target.value)} value={title} /></Label>
          <Label>Image<FileUpload accept="image/*" compact onChange={setImage} value={image} /></Label>
          <Label>Link<Input onChange={(event) => setLink(event.target.value)} value={link} /></Label>
          <Label>Position<Select onChange={(event) => setPosition(event.target.value)} value={position}><option value="home">home</option><option value="news">news</option><option value="ranking">ranking</option><option value="all">all</option></Select></Label>
          <Label>Order<Input onChange={(event) => setOrder(event.target.value)} type="number" value={order} /></Label>
          <Label>Start Date<Input onChange={(event) => setStartDate(event.target.value)} type="datetime-local" value={startDate} /></Label>
          <Label>End Date<Input onChange={(event) => setEndDate(event.target.value)} type="datetime-local" value={endDate} /></Label>
          <label style={{ color: adminTheme.textMuted, fontWeight: 800 }}><input checked={active} onChange={(event) => setActive(event.target.checked)} type="checkbox" /> Active</label>
          <AdminButton disabled={saving} onClick={createBanner} variant="primary">{saving ? 'Saving...' : 'Create Banner'}</AdminButton>
        </Panel>
        <Panel>
          <strong>Banner List</strong>
          {items.map((item) => {
            const src = mediaUrl(item.image);
            return (
              <Row key={item.id}>
                <Thumb>{src ? <Image alt={item.title ?? 'Banner'} fill src={src} style={{ objectFit: 'cover' }} /> : null}</Thumb>
                <div><strong>{item.title}</strong><div style={{ color: adminTheme.textMuted, fontSize: 12 }}>{item.link || 'No link'}</div></div>
                <span>{item.position}</span>
                <span>#{item.order ?? 0}</span>
                <AdminButton onClick={() => toggleActive(item)} variant={item.active ? 'primary' : 'secondary'}>{item.active ? 'Active' : 'Inactive'}</AdminButton>
              </Row>
            );
          })}
        </Panel>
      </Grid>
    </>
  );
}
