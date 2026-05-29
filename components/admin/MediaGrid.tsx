'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { AdminButton } from './AdminButton';

type MediaItem = {
  filesize?: number | null;
  filename?: string | null;
  id: string | number;
  mimeType?: string | null;
  thumbnailURL?: string | null;
  url?: string | null;
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Card = styled.div`
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
`;

const Preview = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  background: #0f0f13;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.72));
  opacity: 0;
  transition: opacity 160ms ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const Meta = styled.div`
  padding: 12px;
`;

const Name = styled.div`
  overflow: hidden;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Size = styled.div`
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
`;

function formatSize(size?: number | null) {
  if (!size) return 'Unknown size';
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaGrid({ items }: { items: MediaItem[] }) {
  return (
    <Grid>
      {items.map((item) => {
        const src = item.thumbnailURL || item.url || '';
        return (
          <Card key={item.id}>
            <Preview>
              {src && item.mimeType?.startsWith('image/') ? <Image alt={item.filename || 'Media'} fill src={src} style={{ objectFit: 'cover' }} /> : null}
              <Overlay>
                <AdminButton>Copy URL</AdminButton>
                <AdminButton variant="danger">Delete</AdminButton>
              </Overlay>
            </Preview>
            <Meta>
              <Name>{item.filename || 'Untitled file'}</Name>
              <Size>{formatSize(item.filesize)}</Size>
            </Meta>
          </Card>
        );
      })}
    </Grid>
  );
}
