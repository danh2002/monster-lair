'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { AdminButton } from './AdminButton';
import { FileUpload } from './FileUpload';
import type { UploadedMedia } from './FileUpload';
import { GooglePreview } from './GooglePreview';
import { RichEditor } from './RichEditor';
import { Select } from './Select';
import { SeoScore } from './SeoScore';
import { StatusBadge } from './StatusBadge';
import { showAdminToast } from './Toast';
import { Toggle } from './Toggle';
import { adminTheme } from '@/styles/adminTheme';

type PostDoc = Record<string, any>;
type SaveAction = 'draft' | 'publish' | 'schedule' | 'pending' | 'archive';

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

const TitleInput = styled.input`
  width: 100%;
  height: 62px;
  border: 0;
  border-bottom: 1px solid ${adminTheme.border};
  outline: 0;
  background: transparent;
  color: ${adminTheme.text};
  font-size: 28px;
  font-weight: 900;
`;

const SlugRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${adminTheme.textMuted};
  font-size: 13px;
`;

const SlugInput = styled.input`
  min-width: 180px;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radiusSm};
  background: #0f0f13;
  color: ${adminTheme.text};
  padding: 7px 9px;
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
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radiusSm};
  background: #0f0f13;
  color: ${adminTheme.text};
  resize: vertical;
`;

const Label = styled.label`
  display: grid;
  gap: 8px;
  color: ${adminTheme.textMuted};
  font-size: 13px;
  font-weight: 800;
`;

const Card = styled.div`
  display: grid;
  gap: 14px;
  padding: 16px;
  border-bottom: 1px solid ${adminTheme.border};

  &:last-child {
    border-bottom: 0;
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span`
  padding: 6px 9px;
  border-radius: 999px;
  background: rgba(99,102,241,0.15);
  color: ${adminTheme.text};
  font-size: 12px;
  font-weight: 800;
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: admin-spin 700ms linear infinite;

  @keyframes admin-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const HelperText = styled.p`
  margin: 0;
  color: ${adminTheme.textMuted};
  font-size: 12px;
  line-height: 1.6;
`;

const TextButton = styled.button`
  border: 0;
  background: none;
  color: ${adminTheme.textMuted};
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
`;

function getCookie(name: string) {
  const value = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return value ? decodeURIComponent(value) : '';
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/gi, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
}

function getInitialContent(content: unknown) {
  if (typeof content === 'string') {
    const trimmed = content.trim();

    if (trimmed.startsWith('{')) {
      try {
        return getInitialContent(JSON.parse(trimmed));
      } catch {
        return content;
      }
    }

    return content;
  }

  const children = (content as any)?.root?.children;
  if (!Array.isArray(children)) return '';

  return children
    .map((node: any) => {
      const text = Array.isArray(node.children)
        ? node.children.map((child: any) => child.text ?? '').join('')
        : '';

      return text ? `<p>${text}</p>` : '';
    })
    .join('');
}

function getMediaId(value: UploadedMedia | string | number | null) {
  if (value === null) return null;

  const rawId = typeof value === 'object' ? value.id : value;

  if (typeof rawId === 'number') return Number.isFinite(rawId) ? rawId : undefined;
  if (typeof rawId === 'string') {
    const trimmed = rawId.trim();
    return /^\d+$/.test(trimmed) ? trimmed : undefined;
  }

  return undefined;
}

function getInitialFeaturedImageId(post: PostDoc) {
  const featuredImageId = getMediaId(post.featuredImage ?? null);
  if (featuredImageId !== undefined && featuredImageId !== null) return featuredImageId;

  const snakeCaseId = getMediaId(post.featured_image_id ?? null);
  if (snakeCaseId !== undefined && snakeCaseId !== null) return snakeCaseId;

  return null;
}

function getInitialFeaturedImagePreviewUrl(post: PostDoc) {
  const image = post.featuredImage ?? post.featured_image ?? null;

  if (image && typeof image === 'object') {
    return image.thumbnailURL ?? image.thumbnail_url ?? image.url ?? null;
  }

  if (typeof image === 'string' && image.startsWith('/api/media/file/')) {
    return image;
  }

  return post.featured_image_url ?? post.thumbnail_url ?? null;
}

function createPreviewMedia(previewUrl: string | null, id: string | number | null): UploadedMedia | null {
  if (!previewUrl) return null;

  return {
    id: id ?? '',
    mimeType: 'image/jpeg',
    thumbnailURL: previewUrl,
    url: previewUrl,
  };
}

export function PostEditor({ post = {} }: { post?: PostDoc }) {
  const router = useRouter();
  const [tab, setTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [title, setTitle] = useState(post.title ?? '');
  const [slug, setSlug] = useState(post.slug ?? '');
  const [excerpt, setExcerpt] = useState(post.excerpt ?? '');
  const [content, setContent] = useState(getInitialContent(post.htmlContent ?? post.content));
  const [seoTitle, setSeoTitle] = useState(post.meta?.seoTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(post.meta?.metaDescription ?? '');
  const [focusKeyword, setFocusKeyword] = useState(post.meta?.focusKeyword ?? '');
  const [featuredImageId, setFeaturedImageId] = useState<string | number | null>(() => getInitialFeaturedImageId(post));
  const [featuredImageMedia, setFeaturedImageMedia] = useState<UploadedMedia | null>(null);
  const [featuredImagePreviewUrl, setFeaturedImagePreviewUrl] = useState<string | null>(() => getInitialFeaturedImagePreviewUrl(post));
  const [featuredImageChanged, setFeaturedImageChanged] = useState(false);
  const [featuredImageRemoved, setFeaturedImageRemoved] = useState(false);
  const [pinned, setPinned] = useState(Boolean(post.pinned));
  const [comments, setComments] = useState(post.allowComments ?? true);
  const [postStatus, setPostStatus] = useState(post.status ?? 'draft');
  const [savedStatus, setSavedStatus] = useState(post.status ?? 'draft');
  const [scheduledAt, setScheduledAt] = useState(toDateTimeLocal(post.scheduledAt));
  const [savingAction, setSavingAction] = useState<SaveAction | null>(null);
  const wordCount = stripHtml(content).split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const postId = post.id ? String(post.id) : null;
  const checks = useMemo(
    () => [
      { label: 'SEO Title set', ok: Boolean(seoTitle) },
      { label: 'Meta Description set', ok: Boolean(metaDescription) },
      { label: 'Focus Keyword set', ok: Boolean(focusKeyword) },
      { label: 'Featured Image set', ok: Boolean(featuredImageId || featuredImagePreviewUrl) },
      { label: 'Content > 300 words', ok: wordCount > 300 },
      { label: 'Title length 50-60 chars', ok: title.length >= 50 && title.length <= 60 },
      { label: 'Description length 120-160 chars', ok: metaDescription.length >= 120 && metaDescription.length <= 160 },
    ],
    [featuredImageId, featuredImagePreviewUrl, focusKeyword, metaDescription, title.length, wordCount, seoTitle],
  );
  const featuredImageValue = createPreviewMedia(featuredImagePreviewUrl, featuredImageId);

  async function savePost(action: SaveAction) {
    let newStatus: string;
    let payloadStatus: 'draft' | 'published';
    let newPublishedAt = post.publishedAt;

    switch (action) {
      case 'publish':
        newStatus = 'published';
        payloadStatus = 'published';
        newPublishedAt = new Date().toISOString();
        break;
      case 'schedule':
        if (!scheduledAt) {
          showAdminToast('error', 'Vui lòng chọn ngày đăng');
          return;
        }
        newStatus = 'scheduled';
        payloadStatus = 'draft';
        break;
      case 'pending':
        newStatus = 'pending';
        payloadStatus = 'draft';
        break;
      case 'archive':
        newStatus = 'archived';
        payloadStatus = 'draft';
        break;
      case 'draft':
      default:
        newStatus = 'draft';
        payloadStatus = 'draft';
        break;
    }

    setSavingAction(action);

    try {
      const token = getCookie('payload-token');
      const safeTitle = title || 'Untitled';
      const safeSlug = generateSlug(slug || title || '') || 'untitled';
      const safeFeaturedImageId = getMediaId(featuredImageId);
      const body: Record<string, unknown> = {
        _status: payloadStatus,
        allowComments: comments,
        content,
        excerpt: excerpt || '',
        htmlContent: content,
        meta: {
          focusKeyword,
          metaDescription,
          seoTitle,
        },
        pinned,
        publishedAt: newPublishedAt,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        slug: safeSlug,
        status: newStatus,
        title: safeTitle,
      };

      if (featuredImageRemoved) {
        body.featuredImage = null;
      } else if (featuredImageChanged && safeFeaturedImageId !== undefined && safeFeaturedImageId !== null) {
        body.featuredImage = safeFeaturedImageId;

        if (featuredImageMedia) {
          body.featuredImageMeta = {
            alt: featuredImageMedia.alt ?? featuredImageMedia.filename ?? null,
            filename: featuredImageMedia.filename ?? null,
            id: safeFeaturedImageId,
            mimeType: featuredImageMedia.mimeType ?? null,
            thumbnailURL: featuredImageMedia.thumbnailURL ?? null,
            url: featuredImageMedia.url ?? featuredImagePreviewUrl ?? null,
          };
        }
      }

      const cleanBody = { ...body };
      const rawFeaturedImage = cleanBody.featuredImage ?? cleanBody.featured_image_id;
      const isValidMediaId =
        typeof rawFeaturedImage === 'number' ||
        (typeof rawFeaturedImage === 'string' && /^\d+$/.test(rawFeaturedImage));
      const imageAliases = ['featured_image_id', 'featuredImageId', 'image_id', 'image'] as const;

      if (featuredImageRemoved) {
        cleanBody.featuredImage = null;
        for (const key of imageAliases) {
          delete cleanBody[key];
        }
      } else if (!isValidMediaId) {
        delete cleanBody.featuredImage;
        for (const key of imageAliases) {
          delete cleanBody[key];
        }
      } else {
        cleanBody.featuredImage = rawFeaturedImage;
        for (const key of imageAliases) {
          delete cleanBody[key];
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('post update payload', cleanBody);
      }

      const res = await fetch(postId ? `/api/admin/supabase/posts/${postId}` : '/api/admin/supabase/posts', {
        body: JSON.stringify(cleanBody),
        credentials: 'include',
        headers: {
          ...(token ? { Authorization: `JWT ${token}` } : {}),
          'Content-Type': 'application/json',
        },
        method: postId ? 'PATCH' : 'POST',
      });
      const responseText = await res.text();

      if (!res.ok) {
        console.error('Full error response:', responseText);
        showAdminToast('error', `Failed ${res.status}: ${responseText.slice(0, 200)}`);
        return;
      }

      const data = JSON.parse(responseText);
      const savedPost = data.doc ?? data;
      setPostStatus(newStatus);
      setSavedStatus(newStatus);
      setFeaturedImageChanged(false);
      setFeaturedImageRemoved(false);
      showAdminToast(
        'success',
        action === 'publish'
          ? 'Post published!'
          : action === 'schedule'
            ? 'Post scheduled successfully!'
            : action === 'pending'
              ? 'Post submitted for review!'
              : action === 'archive'
                ? 'Post archived!'
                : 'Draft saved successfully!',
      );

      if (!postId && savedPost?.id) {
        router.push(`/admin/posts/${savedPost.id}`);
      } else {
        router.refresh();
      }
    } catch {
      showAdminToast('error', 'Something went wrong');
    } finally {
      setSavingAction(null);
    }
  }

  function previewPost() {
    if (!slug) {
      showAdminToast('error', 'Add a slug before previewing');
      return;
    }

    window.open(`/news/${generateSlug(slug)}`, '_blank', 'noopener,noreferrer');
  }

  function renderPublishCard() {
    if (postStatus === 'published') {
      return (
        <>
          <div><StatusBadge status="published" /></div>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <AdminButton disabled={savingAction !== null} onClick={() => savePost('publish')}>
              {savingAction === 'publish' ? <Spinner /> : null}
              Save Changes
            </AdminButton>
            <AdminButton disabled={savingAction !== null} onClick={previewPost}>Preview</AdminButton>
          </div>
          <AdminButton disabled={savingAction !== null} onClick={() => savePost('publish')} style={{ background: '#2563eb', borderColor: '#2563eb' }} variant="primary">
            {savingAction === 'publish' ? <Spinner /> : null}
            Update Post
          </AdminButton>
          <TextButton disabled={savingAction !== null} onClick={() => savePost('draft')} type="button">
            Unpublish → Move to Draft
          </TextButton>
        </>
      );
    }

    if (postStatus === 'scheduled') {
      return (
        <>
          <div><StatusBadge status="scheduled" /></div>
          <Label>
            Publish date (required)
            <Input onChange={(event) => setScheduledAt(event.target.value)} type="datetime-local" value={scheduledAt} />
          </Label>
          {scheduledAt ? <div style={{ color: '#f59e0b', fontSize: 12 }}>Will publish: {new Date(scheduledAt).toLocaleString('vi-VN')}</div> : null}
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <AdminButton disabled={savingAction !== null} onClick={() => savePost('draft')}>
              {savingAction === 'draft' ? <Spinner /> : null}
              Save Draft
            </AdminButton>
            <AdminButton disabled={savingAction !== null} onClick={previewPost}>Preview</AdminButton>
          </div>
          <AdminButton
            disabled={savingAction !== null}
            onClick={() => savePost('schedule')}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderColor: '#d97706' }}
            variant="primary"
          >
            {savingAction === 'schedule' ? <Spinner /> : null}
            Schedule Post
          </AdminButton>
        </>
      );
    }

    if (postStatus === 'pending') {
      return (
        <>
          <div><StatusBadge status="pending" /></div>
          <HelperText>Post awaiting editorial review</HelperText>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <AdminButton disabled={savingAction !== null} onClick={() => savePost('draft')}>
              {savingAction === 'draft' ? <Spinner /> : null}
              Save Draft
            </AdminButton>
            <AdminButton disabled={savingAction !== null} onClick={previewPost}>Preview</AdminButton>
          </div>
          <AdminButton
            disabled={savingAction !== null}
            onClick={() => savePost('pending')}
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderColor: '#d97706' }}
          >
            {savingAction === 'pending' ? <Spinner /> : null}
            Submit for Review
          </AdminButton>
        </>
      );
    }

    if (postStatus === 'archived') {
      if (savedStatus !== 'archived') {
        return (
          <>
            <div><StatusBadge status="archived" /></div>
            <HelperText>This post will be archived and hidden from readers.</HelperText>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <AdminButton disabled={savingAction !== null} onClick={() => savePost('draft')}>
                {savingAction === 'draft' ? <Spinner /> : null}
                Save Draft
              </AdminButton>
              <AdminButton disabled={savingAction !== null} onClick={previewPost}>Preview</AdminButton>
            </div>
            <AdminButton disabled={savingAction !== null} onClick={() => savePost('archive')} variant="danger">
              {savingAction === 'archive' ? <Spinner /> : null}
              Archive Post
            </AdminButton>
          </>
        );
      }

      return (
        <>
          <div><StatusBadge status="archived" /></div>
          <HelperText>This post is archived and not visible to readers.</HelperText>
          <AdminButton disabled={savingAction !== null} onClick={() => savePost('draft')}>
            {savingAction === 'draft' ? <Spinner /> : null}
            Restore to Draft
          </AdminButton>
        </>
      );
    }

    return (
      <>
        <div><StatusBadge status={postStatus || 'draft'} /></div>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
          <AdminButton disabled={savingAction !== null} onClick={() => savePost('draft')}>
            {savingAction === 'draft' ? <Spinner /> : null}
            Save Draft
          </AdminButton>
          <AdminButton disabled={savingAction !== null} onClick={previewPost}>Preview</AdminButton>
        </div>
        <AdminButton disabled={savingAction !== null} onClick={() => savePost('publish')} variant="primary">
          {savingAction === 'publish' ? <Spinner /> : null}
          Publish
        </AdminButton>
      </>
    );
  }

  return (
    <Layout>
      <div>
        <TitleInput onChange={(event) => setTitle(event.target.value)} placeholder="Post title..." value={title} />
        <SlugRow>
          <span>Permalink: dinoisland.com/news/</span>
          <SlugInput onChange={(event) => setSlug(event.target.value)} value={slug} />
          <AdminButton>Edit</AdminButton>
          <AdminButton>View</AdminButton>
        </SlugRow>
        <Panel style={{ marginTop: 18 }}>
          <Tabs>
            <Tab $active={tab === 'content'} onClick={() => setTab('content')} type="button">Content</Tab>
            <Tab $active={tab === 'seo'} onClick={() => setTab('seo')} type="button">SEO</Tab>
            <Tab $active={tab === 'settings'} onClick={() => setTab('settings')} type="button">Settings</Tab>
          </Tabs>
          <Body>
            {tab === 'content' ? (
              <>
                <Textarea onChange={(event) => setExcerpt(event.target.value)} placeholder="Write a short excerpt..." value={excerpt} />
                <RichEditor onChange={setContent} value={content} />
              </>
            ) : null}
            {tab === 'seo' ? (
              <>
                <GooglePreview description={metaDescription || excerpt} slug={slug} title={seoTitle || title} />
                <SeoScore checks={checks} />
                <Label>SEO Title<Input onChange={(event) => setSeoTitle(event.target.value)} value={seoTitle} /></Label>
                <Label>Meta Description<Textarea onChange={(event) => setMetaDescription(event.target.value)} value={metaDescription} /></Label>
                <Label>Focus Keyword<Input onChange={(event) => setFocusKeyword(event.target.value)} value={focusKeyword} /></Label>
                <Label>OG Title<Input defaultValue={post.meta?.ogTitle ?? ''} /></Label>
                <Label>OG Description<Textarea defaultValue={post.meta?.ogDescription ?? ''} /></Label>
                <Label>OG Image<FileUpload compact /></Label>
                <div style={{ display: 'flex', gap: 18 }}>
                  <Label>Robots Index<Toggle checked onChange={() => undefined} /></Label>
                  <Label>Robots Follow<Toggle checked onChange={() => undefined} /></Label>
                </div>
              </>
            ) : null}
            {tab === 'settings' ? (
              <>
                <Label>
                  Status
                  <Select onChange={(event) => setPostStatus(event.target.value)} value={postStatus}>
                    <option>draft</option>
                    <option>pending</option>
                    <option>published</option>
                    <option>scheduled</option>
                    <option>archived</option>
                  </Select>
                  <HelperText>Use the Publish card buttons to save.</HelperText>
                </Label>
                <Label>Scheduled Date<Input onChange={(event) => setScheduledAt(event.target.value)} type="datetime-local" value={scheduledAt} /></Label>
                <Label>
                  Featured Image
                  <FileUpload
                    accept="image/*"
                    compact
                    onChange={(media) => {
                      const id = getMediaId(media);
                      if (id === undefined) {
                        showAdminToast('error', 'Please choose an image from Media Library with a valid media id.');
                        return;
                      }

                      setFeaturedImageRemoved(false);
                      setFeaturedImageChanged(true);
                      setFeaturedImageId(id);
                      setFeaturedImageMedia(media);
                      setFeaturedImagePreviewUrl(media.thumbnailURL ?? media.url ?? null);
                    }}
                    supportsText="Supports: JPG, PNG, GIF, WebP"
                    value={featuredImageValue}
                  />
                </Label>
                <Label>Category<Select><option>News</option><option>Events</option><option>Update</option></Select></Label>
                <Label>Tags<Chips><Chip>news</Chip><Chip>update</Chip><Chip>event</Chip></Chips></Label>
                <Label>Author<Select><option>Admin</option></Select></Label>
                <Label>Pin Post<Toggle checked={pinned} onChange={setPinned} /></Label>
                <Label>Allow Comments<Toggle checked={comments} onChange={setComments} /></Label>
              </>
            ) : null}
          </Body>
        </Panel>
      </div>
      <Panel>
        <Card>
          <strong>Publish</strong>
          {renderPublishCard()}
          <div style={{ borderTop: `1px solid ${adminTheme.border}`, paddingTop: 12, color: adminTheme.textMuted, lineHeight: 1.8 }}>
            <div>Word count: {wordCount} words</div>
            <div>Reading time: {readingTime} min read</div>
            <div>Last saved: 1 min ago</div>
          </div>
        </Card>
        <Card>
          <strong>Featured Image</strong>
          <FileUpload
            accept="image/*"
            compact
            onChange={(media) => {
              const id = getMediaId(media);
              if (id === undefined) {
                showAdminToast('error', 'Please choose an image from Media Library with a valid media id.');
                return;
              }

              setFeaturedImageRemoved(false);
              setFeaturedImageChanged(true);
              setFeaturedImageId(id);
              setFeaturedImageMedia(media);
              setFeaturedImagePreviewUrl(media.thumbnailURL ?? media.url ?? null);
            }}
            supportsText="Supports: JPG, PNG, GIF, WebP"
            value={featuredImageValue}
          />
          <AdminButton
            disabled={(!featuredImageId && !featuredImagePreviewUrl) || savingAction !== null}
            onClick={() => {
              setFeaturedImageId(null);
              setFeaturedImageMedia(null);
              setFeaturedImagePreviewUrl(null);
              setFeaturedImageChanged(true);
              setFeaturedImageRemoved(true);
            }}
            variant="danger"
          >
            Remove
          </AdminButton>
        </Card>
        <Card>
          <strong>Categories</strong>
          {['News', 'Events', 'Updates'].map((item) => <label key={item}><input type="checkbox" /> {item}</label>)}
          <button style={{ background: 'transparent', border: 0, color: adminTheme.accent, padding: 0, textAlign: 'left' }} type="button">+ Add New Category</button>
        </Card>
        <Card>
          <strong>Tags</strong>
          <Input placeholder="Add tag" />
          <Chips><Chip>dinosaur</Chip><Chip>arena</Chip><Chip>reward</Chip></Chips>
        </Card>
      </Panel>
    </Layout>
  );
}
