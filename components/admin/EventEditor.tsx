'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { AdminButton } from './AdminButton';
import { FileUpload } from './FileUpload';
import { GooglePreview } from './GooglePreview';
import { Select } from './Select';
import { SeoScore } from './SeoScore';
import { StatusBadge } from './StatusBadge';
import { Toggle } from './Toggle';
import { adminTheme } from '@/styles/adminTheme';

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(300px, 3fr);
  gap: 24px;
`;

const Panel = styled.section`
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radius};
  background: ${adminTheme.card};
`;

const Body = styled.div`
  display: grid;
  gap: 16px;
  padding: 18px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid ${adminTheme.border};
`;

const Tab = styled.button<{ $active?: boolean }>`
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(99,102,241,0.45)' : adminTheme.border)};
  border-radius: ${adminTheme.radiusSm};
  background: ${({ $active }) => ($active ? 'rgba(99,102,241,0.16)' : 'transparent')};
  color: ${adminTheme.text};
  cursor: pointer;
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
  min-height: 160px;
  padding: 12px;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radiusSm};
  background: #0f0f13;
  color: ${adminTheme.text};
`;

export function EventEditor({ event = {} }: { event?: Record<string, any> }) {
  const [tab, setTab] = useState<'details' | 'location' | 'seo' | 'settings'>('details');
  const [allDay, setAllDay] = useState(Boolean(event.allDay));
  const [title, setTitle] = useState(event.title ?? '');
  const [slug, setSlug] = useState(event.slug ?? '');
  const [mapUrl, setMapUrl] = useState(event.googleMapUrl ?? '');
  const checks = useMemo(
    () => [
      { label: 'SEO Title set', ok: Boolean(title) },
      { label: 'Meta Description set', ok: Boolean(event.meta?.metaDescription) },
      { label: 'Focus Keyword set', ok: Boolean(event.meta?.focusKeyword) },
      { label: 'Featured Image set', ok: Boolean(event.featuredImage) },
    ],
    [event.featuredImage, event.meta?.focusKeyword, event.meta?.metaDescription, title],
  );

  return (
    <Layout>
      <Panel>
        <Tabs>
          {(['details', 'location', 'seo', 'settings'] as const).map((item) => <Tab $active={tab === item} key={item} onClick={() => setTab(item)} type="button">{item.charAt(0).toUpperCase() + item.slice(1)}</Tab>)}
        </Tabs>
        <Body>
          {tab === 'details' ? (
            <>
              <Input onChange={(event) => setTitle(event.target.value)} placeholder="Event title" style={{ fontSize: 24, fontWeight: 850, height: 56 }} value={title} />
              <Input onChange={(event) => setSlug(event.target.value)} placeholder="event-slug" value={slug} />
              <Textarea defaultValue={event.description ? JSON.stringify(event.description, null, 2) : ''} placeholder="Description" />
              <FileUpload compact />
              <FileUpload compact />
              <Textarea defaultValue={event.rewards ?? ''} placeholder="Rewards" />
            </>
          ) : null}
          {tab === 'location' ? (
            <>
              <Input defaultValue={event.locationName ?? ''} placeholder="Location Name" />
              <Input defaultValue={event.address ?? ''} placeholder="Address" />
              <Input onChange={(event) => setMapUrl(event.target.value)} placeholder="Google Map URL" value={mapUrl} />
              {mapUrl ? <iframe src={mapUrl} style={{ border: 0, borderRadius: 12, height: 260, width: '100%' }} title="Map preview" /> : <div style={{ color: adminTheme.textMuted }}>Map preview appears after adding a URL.</div>}
            </>
          ) : null}
          {tab === 'seo' ? (
            <>
              <GooglePreview description={event.meta?.metaDescription ?? ''} slug={slug} title={event.meta?.seoTitle ?? title} />
              <SeoScore checks={checks} />
              <Input placeholder="SEO Title" />
              <Textarea placeholder="Meta Description" />
            </>
          ) : null}
          {tab === 'settings' ? (
            <>
              <Select><option>tournament</option><option>special</option><option>reward</option><option>maintenance</option><option>community</option></Select>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}><Input type="date" /><Input placeholder="Start Time" /></div>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}><Input type="date" /><Input placeholder="End Time" /></div>
              <label style={{ alignItems: 'center', display: 'flex', gap: 10 }}>All Day <Toggle checked={allDay} onChange={setAllDay} /></label>
              <Input placeholder="Max Participants" type="number" />
              <Input placeholder="Registration Link" />
              <Input placeholder="Organizer" />
              <Select><option>Auto status</option><option>upcoming</option><option>ongoing</option><option>ended</option><option>cancelled</option></Select>
            </>
          ) : null}
        </Body>
      </Panel>
      <Panel>
        <Body>
          <AdminButton variant="primary">Publish Event</AdminButton>
          <AdminButton>Save</AdminButton>
          <div style={{ borderTop: `1px solid ${adminTheme.border}`, paddingTop: 14 }}>
            <strong>Event Status</strong>
            <div style={{ marginTop: 10 }}><StatusBadge status={event.status ?? 'upcoming'} /></div>
            <div style={{ color: adminTheme.textMuted, marginTop: 10 }}>Countdown: 12 days</div>
          </div>
          <div style={{ borderTop: `1px solid ${adminTheme.border}`, paddingTop: 14 }}>
            <strong>Related Posts</strong>
            <Select><option>Select related posts</option></Select>
          </div>
        </Body>
      </Panel>
    </Layout>
  );
}
