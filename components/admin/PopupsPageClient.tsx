'use client';

import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import { AdminButton } from './AdminButton';
import { FileUpload, type UploadedMedia } from './FileUpload';
import { Select } from './Select';
import { showAdminToast } from './Toast';
import { adminTheme } from '@/styles/adminTheme';

type PopupDoc = Record<string, any>;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 380px) minmax(0, 1fr);
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

const Textarea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px;
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
  grid-template-columns: 84px minmax(0, 1fr) 120px 90px 140px;
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
  aspect-ratio: 1 / 1;
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

function toLexicalContent(value: string) {
  return {
    root: {
      children: [
        {
          children: [{ text: value || '', type: 'text', version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  };
}

export function PopupsPageClient({ popups }: { popups: PopupDoc[] }) {
  const [items, setItems] = useState(popups);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<UploadedMedia | string | number | null>(null);
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [trigger, setTrigger] = useState('onLoad');
  const [delay, setDelay] = useState('0');
  const [showOnce, setShowOnce] = useState(true);
  const [active, setActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);

  async function createPopup() {
    if (!title) {
      showAdminToast('error', 'Title is required');
      return;
    }

    setSaving(true);

    try {
      const token = getCookie('payload-token');
      const res = await fetch('/api/admin/supabase/popups', {
        body: JSON.stringify({
          active,
          content: toLexicalContent(content),
          ctaLink,
          ctaText,
          delay: Number(delay) || 0,
          endDate: endDate || null,
          image: mediaId(image),
          showOnce,
          startDate: startDate || null,
          title,
          trigger,
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
      setContent('');
      setImage(null);
      showAdminToast('success', 'Popup created');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: PopupDoc) {
    const token = getCookie('payload-token');
    const res = await fetch(`/api/admin/supabase/popups/${item.id}`, {
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

    setItems((current) => current.map((popup) => (popup.id === item.id ? { ...popup, active: !popup.active } : popup)));
  }

  return (
    <>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Popups</h1>
      <Grid>
        <Panel>
          <strong>Create Popup</strong>
          <Label>Title<Input onChange={(event) => setTitle(event.target.value)} value={title} /></Label>
          <Label>Content<Textarea onChange={(event) => setContent(event.target.value)} value={content} /></Label>
          <Label>Image<FileUpload accept="image/*" compact onChange={setImage} value={image} /></Label>
          <Label>CTA Text<Input onChange={(event) => setCtaText(event.target.value)} value={ctaText} /></Label>
          <Label>CTA Link<Input onChange={(event) => setCtaLink(event.target.value)} value={ctaLink} /></Label>
          <Label>Trigger<Select onChange={(event) => setTrigger(event.target.value)} value={trigger}><option value="onLoad">onLoad</option><option value="onExit">onExit</option><option value="afterSeconds">afterSeconds</option></Select></Label>
          <Label>Delay<Input onChange={(event) => setDelay(event.target.value)} type="number" value={delay} /></Label>
          <Label>Start Date<Input onChange={(event) => setStartDate(event.target.value)} type="datetime-local" value={startDate} /></Label>
          <Label>End Date<Input onChange={(event) => setEndDate(event.target.value)} type="datetime-local" value={endDate} /></Label>
          <label style={{ color: adminTheme.textMuted, fontWeight: 800 }}><input checked={showOnce} onChange={(event) => setShowOnce(event.target.checked)} type="checkbox" /> Show once</label>
          <label style={{ color: adminTheme.textMuted, fontWeight: 800 }}><input checked={active} onChange={(event) => setActive(event.target.checked)} type="checkbox" /> Active</label>
          <AdminButton disabled={saving} onClick={createPopup} variant="primary">{saving ? 'Saving...' : 'Create Popup'}</AdminButton>
        </Panel>
        <Panel>
          <strong>Popup List</strong>
          {items.map((item) => {
            const src = mediaUrl(item.image);
            return (
              <Row key={item.id}>
                <Thumb>{src ? <Image alt={item.title ?? 'Popup'} fill src={src} style={{ objectFit: 'cover' }} /> : null}</Thumb>
                <div><strong>{item.title}</strong><div style={{ color: adminTheme.textMuted, fontSize: 12 }}>{item.ctaText || 'No CTA'}</div></div>
                <span>{item.trigger}</span>
                <span>{item.delay ?? 0}s</span>
                <AdminButton onClick={() => toggleActive(item)} variant={item.active ? 'primary' : 'secondary'}>{item.active ? 'Active' : 'Inactive'}</AdminButton>
              </Row>
            );
          })}
        </Panel>
      </Grid>
    </>
  );
}
