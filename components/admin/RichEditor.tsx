'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import StarterKit from '@tiptap/starter-kit';
import { all, createLowlight } from 'lowlight';
import styled from 'styled-components';
import { FaImage } from '@react-icons/all-files/fa/FaImage';
import { FaLink } from '@react-icons/all-files/fa/FaLink';
import { FaRedo } from '@react-icons/all-files/fa/FaRedo';
import { FaTable } from '@react-icons/all-files/fa/FaTable';
import { FaUndo } from '@react-icons/all-files/fa/FaUndo';
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube';
import { showAdminToast } from './Toast';

type RichEditorProps = {
  onChange: (html: string) => void;
  value: string;
};

const lowlight = createLowlight(all);

const Shell = styled.div`
  position: relative;
`;

const ToolbarStack = styled.div`
  position: sticky;
  top: 76px;
  z-index: 10;
  background: #1a1a24;
  border: 1px solid rgba(255,255,255,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  padding: 8px 12px;
`;

const ToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const ToolButton = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.12);
    color: white;
  }

  &.is-active {
    background: rgba(99,102,241,0.25);
    border-color: rgba(99,102,241,0.5);
    color: #a5b4fc;
  }

  &:active {
    transform: scale(0.95);
    background: rgba(99,102,241,0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  &.format-bold {
    font-size: 14px;
    font-weight: 900;
  }

  &.format-italic {
    font-style: italic;
  }

  &.format-underline {
    text-decoration: underline;
  }

  &.format-strike {
    text-decoration: line-through;
  }

  &.heading-1 {
    color: rgba(255,255,255,0.78);
    font-size: 14px;
  }

  &.heading-2 {
    font-size: 13px;
  }

  &.heading-3 {
    font-size: 12px;
  }

  &.heading-4 {
    font-size: 11px;
  }

  &.insert-button {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
  }

  &.youtube-button:hover {
    color: #ff0000;
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.1);
  margin: 0 4px;
  align-self: center;
`;

const EditorFrame = styled.div`
  .tiptap-editor {
    background: #0d0d14;
    border: 1px solid rgba(255,255,255,0.08);
    border-top: none;
    border-radius: 0 0 8px 8px;
    color: white;
    min-height: 400px;
    padding: 24px;
    outline: none;
    font-size: 15px;
    line-height: 1.8;
  }

  .tiptap-editor h1 { font-size: 2rem; font-weight: 900; margin: 1rem 0; }
  .tiptap-editor h2 { font-size: 1.6rem; font-weight: 800; margin: 0.8rem 0; }
  .tiptap-editor h3 { font-size: 1.3rem; font-weight: 700; margin: 0.6rem 0; }
  .tiptap-editor h4 { font-size: 1.1rem; font-weight: 700; margin: 0.6rem 0; }
  .tiptap-editor img { max-width: 100%; border-radius: 8px; margin: 8px 0; }
  .tiptap-editor blockquote {
    border-left: 4px solid #6366f1;
    padding-left: 16px;
    color: rgba(255,255,255,0.6);
    margin: 16px 0;
  }
  .tiptap-editor pre {
    background: #1a1a2e;
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
  }
  .tiptap-editor table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }
  .tiptap-editor td,
  .tiptap-editor th {
    border: 1px solid rgba(255,255,255,0.1);
    padding: 8px 12px;
  }
  .tiptap-editor th { background: rgba(99,102,241,0.15); font-weight: 700; }
  .tiptap-editor a { color: #6366f1; text-decoration: underline; }
  .tiptap-editor p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: rgba(255,255,255,0.3);
    pointer-events: none;
    float: left;
    height: 0;
  }
  .tiptap-editor .youtube-video,
  .tiptap-editor iframe {
    aspect-ratio: 16/9;
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 16px 0;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,0.58);
`;

const MiniModal = styled.div`
  width: min(420px, calc(100vw - 32px));
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  background: #15151d;
  color: white;
  box-shadow: 0 18px 60px rgba(0,0,0,0.45);
`;

const Popover = styled.div`
  position: absolute;
  z-index: 30;
  top: 78px;
  left: 12px;
  width: min(360px, calc(100% - 24px));
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  background: #15151d;
  color: white;
  box-shadow: 0 14px 42px rgba(0,0,0,0.35);
`;

const Input = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 10px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  background: #0d0d14;
  color: white;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ActionButton = styled.button`
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  background: rgba(255,255,255,0.06);
  color: white;
  cursor: pointer;
  font-weight: 800;
`;

function getImageAltText(file: File) {
  return file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
}

async function uploadImage(file: File): Promise<string> {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('payload-token='))
    ?.split('=')[1];
  const altText = getImageAltText(file);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('_payload', JSON.stringify({ alt: altText }));

  const res = await fetch('/api/media', {
    method: 'POST',
    headers: token ? { Authorization: `JWT ${token}` } : {},
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Media upload failed:', res.status, errorText);
    throw new Error(`Upload failed: ${res.status}`);
  }

  const data = await res.json();
  const url = data.doc?.url || data.url || data.doc?.sizes?.card?.url;
  if (!url) throw new Error('No URL in response');
  return url;
}

export function RichEditor({ onChange, value }: RichEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    content: value || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Youtube.configure({ width: '100%' as any, height: 480 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder: 'Start writing your post...' }),
    ],
    immediatelyRender: false,
    onUpdate: ({ editor: activeEditor }) => onChange(activeEditor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  function insertImage(src: string, alt?: string) {
    if (!editor || !src) return;
    editor.chain().focus().setImage({ src, alt }).run();
    setImageUrl('');
    setImageModalOpen(false);
  }

  async function handleFile(file?: File) {
    if (!file) return;

    try {
      setUploading(true);
      const altText = getImageAltText(file);
      const url = await uploadImage(file);
      editor?.chain().focus().setImage({ src: url, alt: altText }).run();
      setImageModalOpen(false);
      showAdminToast('success', 'Image inserted');
    } catch (error) {
      console.error(error);
      showAdminToast('error', 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  function openLinkPopover() {
    if (!editor) return;
    const attrs = editor.getAttributes('link');
    setLinkUrl(attrs.href ?? '');
    setLinkNewTab(attrs.target === '_blank' || !attrs.target);
    setLinkPopoverOpen(true);
  }

  function applyLink() {
    if (!editor) return;

    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl, target: linkNewTab ? '_blank' : null }).run();
    }

    setLinkPopoverOpen(false);
  }

  function addYoutube() {
    const url = window.prompt('Paste YouTube URL:');
    if (!url) return;
    editor?.commands.setYoutubeVideo({ src: url });
  }

  function activeClass(isActive: boolean, className = '') {
    return [isActive ? 'is-active' : '', className].filter(Boolean).join(' ');
  }

  if (!editor) {
    return (
      <Shell>
        <ToolbarStack />
        <EditorFrame><div className="tiptap-editor">Loading editor...</div></EditorFrame>
      </Shell>
    );
  }

  return (
    <Shell>
      <ToolbarStack>
        <ToolbarRow>
          <ToolbarGroup>
            {[1, 2, 3, 4].map((level) => (
              <ToolButton
                className={activeClass(editor.isActive('heading', { level }), `heading-${level}`)}
                key={level}
                onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run()}
                title={`Heading ${level}`}
                type="button"
              >
                H{level}
              </ToolButton>
            ))}
          </ToolbarGroup>
          <Divider />
          <ToolbarGroup>
            <ToolButton className={activeClass(editor.isActive('bold'), 'format-bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)" type="button">B</ToolButton>
            <ToolButton className={activeClass(editor.isActive('italic'), 'format-italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)" type="button">I</ToolButton>
            <ToolButton className={activeClass(editor.isActive('underline'), 'format-underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)" type="button">U</ToolButton>
            <ToolButton className={activeClass(editor.isActive('strike'), 'format-strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough" type="button">S</ToolButton>
          </ToolbarGroup>
          <Divider />
          <ToolbarGroup>
            <ToolButton className={activeClass(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block" type="button">Code</ToolButton>
            <ToolButton className={activeClass(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote" type="button">Quote</ToolButton>
            <ToolButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule" type="button">HR</ToolButton>
          </ToolbarGroup>
          <Divider />
          <ToolbarGroup>
            <ToolButton className={activeClass(editor.isActive({ textAlign: 'left' }))} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align left" type="button">L</ToolButton>
            <ToolButton className={activeClass(editor.isActive({ textAlign: 'center' }))} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align center" type="button">C</ToolButton>
            <ToolButton className={activeClass(editor.isActive({ textAlign: 'right' }))} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align right" type="button">R</ToolButton>
          </ToolbarGroup>
          <Divider />
          <ToolbarGroup>
            <ToolButton className={activeClass(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list" type="button">UL</ToolButton>
            <ToolButton className={activeClass(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered list" type="button">OL</ToolButton>
          </ToolbarGroup>
          <Divider />
          <ToolbarGroup>
            <ToolButton className="insert-button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert table" type="button"><FaTable /></ToolButton>
            <ToolButton className={activeClass(editor.isActive('link'), 'insert-button')} onClick={openLinkPopover} title="Insert Link" type="button"><FaLink /></ToolButton>
            <ToolButton className="insert-button" onClick={() => setImageModalOpen(true)} title="Insert Image" type="button"><FaImage /></ToolButton>
            <ToolButton className="insert-button youtube-button" onClick={addYoutube} title="Embed YouTube" type="button"><FaYoutube /></ToolButton>
          </ToolbarGroup>
          <Divider />
          <ToolbarGroup>
            <ToolButton disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} title="Undo" type="button"><FaUndo /></ToolButton>
            <ToolButton disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} title="Redo" type="button"><FaRedo /></ToolButton>
          </ToolbarGroup>
        </ToolbarRow>
      </ToolbarStack>

      {linkPopoverOpen ? (
        <Popover>
          <Input autoFocus onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://example.com" value={linkUrl} />
          <label>
            <input checked={linkNewTab} onChange={(event) => setLinkNewTab(event.target.checked)} type="checkbox" /> Open in new tab
          </label>
          <ActionRow>
            <ActionButton onClick={() => setLinkPopoverOpen(false)} type="button">Cancel</ActionButton>
            <ActionButton onClick={applyLink} type="button">Apply</ActionButton>
          </ActionRow>
        </Popover>
      ) : null}

      <EditorFrame>
        <EditorContent editor={editor} />
      </EditorFrame>

      {imageModalOpen ? (
        <Overlay onMouseDown={() => setImageModalOpen(false)}>
          <MiniModal onMouseDown={(event) => event.stopPropagation()}>
            <strong>Insert image</strong>
            <Input
              accept="image/*"
              disabled={uploading}
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.currentTarget.value = '';
              }}
              type="file"
            />
            <Input onChange={(event) => setImageUrl(event.target.value)} placeholder="Paste image URL" value={imageUrl} />
            <ActionRow>
              <ActionButton onClick={() => setImageModalOpen(false)} type="button">Cancel</ActionButton>
              <ActionButton disabled={uploading || !imageUrl} onClick={() => insertImage(imageUrl)} type="button">
                {uploading ? 'Uploading...' : 'Insert URL'}
              </ActionButton>
            </ActionRow>
          </MiniModal>
        </Overlay>
      ) : null}
    </Shell>
  );
}
