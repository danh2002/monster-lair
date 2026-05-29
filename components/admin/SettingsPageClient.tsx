'use client';

import { useState } from 'react';
import { AdminButton } from './AdminButton';
import { FileUpload } from './FileUpload';
import { Toggle } from './Toggle';
import { adminTheme } from '@/styles/adminTheme';

const tabs = ['General', 'SEO', 'Social', 'Advanced'] as const;

export function SettingsPageClient({ settings }: { settings: Record<string, any> }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('General');
  const [sitemap, setSitemap] = useState(true);

  return (
    <>
      <h1 style={{ fontSize: 34, margin: '0 0 22px' }}>Settings</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {tabs.map((item) => <button key={item} onClick={() => setTab(item)} style={{ ...tabStyle, borderColor: tab === item ? adminTheme.accent : adminTheme.border }} type="button">{item}</button>)}
      </div>
      <section style={{ background: adminTheme.card, border: `1px solid ${adminTheme.border}`, borderRadius: 12, display: 'grid', gap: 14, padding: 18 }}>
        {tab === 'General' ? <><input defaultValue={settings.siteName ?? ''} placeholder="Site Name" style={fieldStyle} /><textarea defaultValue={settings.siteDescription ?? ''} placeholder="Site Description" style={textareaStyle} /><FileUpload compact /><FileUpload compact /></> : null}
        {tab === 'SEO' ? <><input defaultValue={settings.defaultSeoTitle ?? ''} placeholder="Default SEO Title" style={fieldStyle} /><textarea defaultValue={settings.defaultMetaDescription ?? ''} placeholder="Default Meta Description" style={textareaStyle} /><FileUpload compact /><input defaultValue={settings.googleAnalyticsId ?? ''} placeholder="Google Analytics ID" style={fieldStyle} /><input defaultValue={settings.googleSearchConsoleVerification ?? ''} placeholder="Search Console Verification" style={fieldStyle} /></> : null}
        {tab === 'Social' ? <><input placeholder="Facebook URL" style={fieldStyle} /><input placeholder="YouTube URL" style={fieldStyle} /><input placeholder="Discord URL" style={fieldStyle} /><input placeholder="Twitter/X URL" style={fieldStyle} /></> : null}
        {tab === 'Advanced' ? <><textarea defaultValue={settings.robotsTxt ?? ''} placeholder="Robots.txt" style={{ ...textareaStyle, minHeight: 220 }} /><label style={{ alignItems: 'center', display: 'flex', gap: 10 }}>Include sitemap <Toggle checked={sitemap} onChange={setSitemap} /></label></> : null}
        <AdminButton variant="primary">Save Settings</AdminButton>
      </section>
    </>
  );
}

const tabStyle = { background: adminTheme.card, border: `1px solid ${adminTheme.border}`, borderRadius: 8, color: '#fff', cursor: 'pointer', minHeight: 38, padding: '0 12px' };
const fieldStyle = { background: '#0f0f13', border: `1px solid ${adminTheme.border}`, borderRadius: 8, color: '#fff', minHeight: 42, padding: '0 12px' };
const textareaStyle = { ...fieldStyle, minHeight: 100, padding: 12 };
