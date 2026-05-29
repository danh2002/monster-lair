'use client';

import styled from 'styled-components';

const Card = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
`;

export function GooglePreview({ description, slug, title }: { description: string; slug: string; title: string }) {
  return (
    <Card>
      <div style={{ color: '#1a0dab', fontSize: 20 }}>{title || 'SEO title preview'}</div>
      <div style={{ color: '#006621', fontSize: 14, marginTop: 4 }}>dinoisland.com/news/{slug || 'post-slug'}</div>
      <div style={{ color: '#545454', fontSize: 14, marginTop: 8 }}>{description || 'Meta description preview'}</div>
    </Card>
  );
}
