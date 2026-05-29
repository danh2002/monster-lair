'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { AdminButton } from './AdminButton';
import { RichEditor } from './RichEditor';
import { Select } from './Select';
import { showAdminToast } from './Toast';
import { adminTheme } from '@/styles/adminTheme';

type PageDoc = Record<string, any>;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
`;

const Panel = styled.section`
  display: grid;
  gap: 16px;
  padding: 18px;
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${adminTheme.textMuted};
  font-size: 13px;
  font-weight: 800;
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: admin-spin 700ms linear infinite;

  @keyframes admin-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/\u0111/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function PageEditor({ page = {}, pages = [] }: { page?: PageDoc; pages?: PageDoc[] }) {
  const router = useRouter();
  const pageId = page.id ? String(page.id) : null;
  const [title, setTitle] = useState(page.title ?? '');
  const [slug, setSlug] = useState(page.slug ?? '');
  const [template, setTemplate] = useState(page.template ?? 'default');
  const [content, setContent] = useState(typeof page.content === 'string' ? page.content : '');
  const [parent, setParent] = useState(typeof page.parent === 'object' ? String(page.parent.id) : (page.parent ? String(page.parent) : ''));
  const [status, setStatus] = useState(page.status ?? 'draft');
  const [order, setOrder] = useState(String(page.order ?? 0));
  const [showInMenu, setShowInMenu] = useState(Boolean(page.showInMenu));
  const [menuLabel, setMenuLabel] = useState(page.menuLabel ?? '');
  const [seoTitle, setSeoTitle] = useState(page.meta?.seoTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(page.meta?.metaDescription ?? '');
  const [saving, setSaving] = useState(false);

  async function savePage() {
    setSaving(true);

    try {
      const token = getCookie('payload-token');
      const body = {
        content,
        menuLabel,
        meta: { metaDescription, seoTitle },
        order: Number(order) || 0,
        parent: parent || null,
        showInMenu,
        slug: generateSlug(slug || title || '') || 'untitled',
        status,
        template,
        title: title || 'Untitled',
      };
      const res = await fetch(pageId ? `/api/admin/supabase/pages/${pageId}` : '/api/admin/supabase/pages', {
        body: JSON.stringify(body),
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `JWT ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        method: pageId ? 'PATCH' : 'POST',
      });
      const text = await res.text();

      if (!res.ok) {
        showAdminToast('error', `Save failed: ${res.status} - ${text.slice(0, 100)}`);
        return;
      }

      const data = JSON.parse(text);
      const savedPage = data.doc ?? data;
      showAdminToast('success', 'Page saved');

      if (!pageId && savedPage?.id) router.push(`/admin/pages/${savedPage.id}`);
      else router.refresh();
    } catch {
      showAdminToast('error', 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <Panel>
        <Label>Title<Input onChange={(event) => setTitle(event.target.value)} value={title} /></Label>
        <Label>Slug<Input onChange={(event) => setSlug(event.target.value)} value={slug} /></Label>
        <RichEditor onChange={setContent} value={content} />
      </Panel>
      <Panel>
        <strong>Page Settings</strong>
        <Label>Template<Select onChange={(event) => setTemplate(event.target.value)} value={template}><option value="default">default</option><option value="landing">landing</option><option value="full-width">full-width</option><option value="sidebar">sidebar</option></Select></Label>
        <Label>Status<Select onChange={(event) => setStatus(event.target.value)} value={status}><option value="draft">draft</option><option value="published">published</option></Select></Label>
        <Label>Parent<Select onChange={(event) => setParent(event.target.value)} value={parent}><option value="">None</option>{pages.filter((item) => String(item.id) !== pageId).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</Select></Label>
        <Label>Order<Input onChange={(event) => setOrder(event.target.value)} type="number" value={order} /></Label>
        <CheckboxLabel><input checked={showInMenu} onChange={(event) => setShowInMenu(event.target.checked)} type="checkbox" /> Show in menu</CheckboxLabel>
        <Label>Menu Label<Input onChange={(event) => setMenuLabel(event.target.value)} value={menuLabel} /></Label>
        <Label>SEO Title<Input onChange={(event) => setSeoTitle(event.target.value)} value={seoTitle} /></Label>
        <Label>Meta Description<Input onChange={(event) => setMetaDescription(event.target.value)} value={metaDescription} /></Label>
        <AdminButton disabled={saving} onClick={savePage} variant="primary">{saving ? <Spinner /> : null} Save Page</AdminButton>
      </Panel>
    </Layout>
  );
}
