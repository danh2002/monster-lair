'use client';

import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import styled from 'styled-components';
import { FaCloudUploadAlt } from '@react-icons/all-files/fa/FaCloudUploadAlt';
import { adminTheme } from '@/styles/adminTheme';

export type UploadedMedia = {
  alt?: string | null;
  filename?: string | null;
  id: string | number;
  mimeType?: string | null;
  thumbnailURL?: string | null;
  url?: string | null;
};

const Zone = styled.button<{ $dragging?: boolean }>`
  position: relative;
  overflow: hidden;
  display: grid;
  width: 100%;
  min-height: 156px;
  place-items: center;
  padding: 22px;
  border: 1px dashed ${({ $dragging }) => ($dragging ? adminTheme.accent : 'rgba(99,102,241,0.5)')};
  border-radius: ${adminTheme.radius};
  background: ${({ $dragging }) => ($dragging ? 'rgba(99,102,241,0.16)' : 'rgba(99,102,241,0.08)')};
  color: ${adminTheme.textMuted};
  cursor: pointer;
  text-align: center;
`;

const PreviewImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 12px;
  border-radius: ${adminTheme.radiusSm};
  background: rgba(15, 15, 19, 0.72);
`;

const FileName = styled.div`
  overflow: hidden;
  margin-top: 8px;
  color: ${adminTheme.text};
  font-size: 13px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ErrorText = styled.div`
  margin-top: 8px;
  color: #fca5a5;
  font-size: 12px;
  font-weight: 800;
`;

function getCookie(name: string) {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return value ? decodeURIComponent(value) : '';
}

function getMediaDoc(value?: UploadedMedia | string | number | null) {
  return value && typeof value === 'object' ? value : null;
}

type FileUploadProps = {
  accept?: string;
  compact?: boolean;
  disabled?: boolean;
  onChange?: (media: UploadedMedia) => void;
  supportsText?: string;
  value?: UploadedMedia | string | number | null;
};

export function FileUpload({
  accept = 'image/*,application/pdf',
  compact = false,
  disabled = false,
  onChange,
  supportsText = 'Supports: JPG, PNG, GIF, WebP, PDF',
  value,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const media = getMediaDoc(value);
  const previewSrc = media?.thumbnailURL || media?.url || '';
  const showPreview = previewSrc && media?.mimeType?.startsWith('image/');

  async function uploadFile(file?: File) {
    if (!file || disabled) return;

    setError('');
    setUploading(true);

    try {
      const token = getCookie('payload-token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        '_payload',
        JSON.stringify({
          alt: file.name.replace(/\.[^/.]+$/, '') || file.name,
        }),
      );

      const res = await fetch('/api/media', {
        body: formData,
        credentials: 'include',
        headers: token ? { Authorization: `JWT ${token}` } : undefined,
        method: 'POST',
      });
      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(responseText || `Upload failed with status ${res.status}`);
      }

      const data = JSON.parse(responseText);
      onChange?.(data.doc ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message.slice(0, 120) : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    uploadFile(event.dataTransfer.files[0]);
  }

  return (
    <>
      <Zone
        $dragging={dragging}
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        style={{ minHeight: compact ? 110 : 156 }}
        type="button"
      >
        {showPreview ? <PreviewImage alt={media?.alt || media?.filename || 'Uploaded media'} src={previewSrc} /> : null}
        <Overlay>
          <FaCloudUploadAlt color={adminTheme.textDim} size={compact ? 28 : 42} />
          <div style={{ marginTop: 10, fontWeight: 800 }}>
            {uploading ? 'Uploading...' : media ? 'Change uploaded file' : 'Drag & drop files here, or click to browse'}
          </div>
          {media?.filename ? <FileName>{media.filename}</FileName> : null}
          <div style={{ fontSize: 12, marginTop: 5 }}>{supportsText}</div>
          {error ? <ErrorText>{error}</ErrorText> : null}
        </Overlay>
      </Zone>
      <input accept={accept} hidden onChange={(event) => uploadFile(event.target.files?.[0])} ref={inputRef} type="file" />
    </>
  );
}
