import { FaCalendar } from '@react-icons/all-files/fa/FaCalendar';
import { FaCheckCircle } from '@react-icons/all-files/fa/FaCheckCircle';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import { FaEdit } from '@react-icons/all-files/fa/FaEdit';
import { FaImage } from '@react-icons/all-files/fa/FaImage';
import { FaNewspaper } from '@react-icons/all-files/fa/FaNewspaper';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { FaUpload } from '@react-icons/all-files/fa/FaUpload';
import { FaUsers } from '@react-icons/all-files/fa/FaUsers';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminShell } from '@/components/admin/AdminShell';
import { CollectionCard } from '@/components/admin/CollectionCard';
import { StatsCard } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { adminFetch, emptyList, type PayloadList } from '@/lib/admin-api';
import { getAdminCookieHeader, getAdminUser, requireAdminAuth } from '@/lib/admin-auth';
import { listCategories } from '@/lib/api/admin/categories';
import { listEvents } from '@/lib/api/admin/events';
import { listMedia } from '@/lib/api/admin/media';
import { listPosts } from '@/lib/api/admin/posts';

type Doc = Record<string, any>;

const collections = [
  { color: '#3b82f6', description: 'Editorial posts, announcements, and long-form content.', href: '/admin/posts', icon: FaNewspaper, title: 'Posts' },
  { color: '#10b981', description: 'Tournament schedules, special events, and rewards.', href: '/admin/events', icon: FaCalendar, title: 'Events' },
  { color: '#f59e0b', description: 'Reusable taxonomy for news, events, and updates.', href: '/admin/categories', icon: FaNewspaper, title: 'Categories' },
  { color: '#ec4899', description: 'Images and uploaded files for every content surface.', href: '/admin/media', icon: FaImage, title: 'Media Library' },
  { color: '#f97316', description: 'CMS operators and publishing accounts.', href: '/admin/users', icon: FaUsers, title: 'Users' },
  { color: '#6366f1', description: 'Global site metadata, social links, and SEO defaults.', href: '/admin/settings', icon: FaCog, title: 'Settings' },
];

const gridStyle = { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', marginBottom: 26 };
const panelStyle = { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginTop: 26, overflow: 'hidden' };
const tableStyle = { borderCollapse: 'collapse' as const, width: '100%' };
const thStyle = { borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', fontSize: 12, padding: 14, textAlign: 'left' as const, textTransform: 'uppercase' as const };
const tdStyle = { borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.72)', fontSize: 14, padding: 14 };

function titleOf(value: any, fallback = 'Unknown') {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.name ?? value.email ?? fallback;
}

function dateOf(value?: string) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

function textOf(value: unknown, fallback = '-') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

export default async function AdminDashboardPage() {
  await requireAdminAuth();
  const cookie = await getAdminCookieHeader();
  const user = await getAdminUser(cookie);

  const [posts, events, media, categories, users] = await Promise.all([
    listPosts(500),
    listEvents(500),
    listMedia(500),
    listCategories(500),
    adminFetch<PayloadList<Doc>>('/api/users?limit=0', emptyList()),
  ]);
  const publishedCount = posts.data.filter((post) => post.status === 'published').length;
  const draftCount = posts.data.filter((post) => post.status === 'draft').length;
  const recentPosts = posts.data.slice(0, 5);
  const recentEvents = events.data.slice(0, 5);

  return (
    <AdminShell user={user}>
      <div style={{ alignItems: 'end', display: 'flex', justifyContent: 'space-between', marginBottom: 26 }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Dashboard
          </div>
          <h1 style={{ fontSize: 34, lineHeight: 1.1, margin: '8px 0 0' }}>Overview</h1>
        </div>
        <AdminButton href="/admin/posts/new" variant="primary">
          <FaPlus /> New Post
        </AdminButton>
      </div>

      <div style={gridStyle}>
        <StatsCard color="#3b82f6" icon={FaNewspaper} label="Total Posts" value={posts.totalDocs} />
        <StatsCard color="#10b981" icon={FaCheckCircle} label="Published" value={publishedCount} />
        <StatsCard color="#f59e0b" icon={FaEdit} label="Drafts" value={draftCount} />
        <StatsCard color="#ec4899" icon={FaImage} label="Media Files" value={media.totalDocs} />
        <StatsCard color="#f97316" icon={FaUsers} label="Active Users" value={users.totalDocs} />
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <AdminButton href="/admin/posts/new"><FaPlus /> New Post</AdminButton>
        <AdminButton href="/admin/events/new"><FaPlus /> New Event</AdminButton>
        <AdminButton href="/admin/media"><FaUpload /> Upload Media</AdminButton>
        <AdminButton href="/admin/settings"><FaCog /> Site Settings</AdminButton>
      </div>

      <section style={panelStyle}>
        <h2 style={{ fontSize: 18, margin: 0, padding: 18 }}>Recent Posts</h2>
        <table style={tableStyle}>
          <thead>
            <tr><th style={thStyle}>Title</th><th style={thStyle}>Status</th><th style={thStyle}>Author</th><th style={thStyle}>Date</th><th style={thStyle}>Views</th></tr>
          </thead>
          <tbody>
            {recentPosts.map((post) => (
              <tr key={post.id}>
                <td style={tdStyle}>{textOf(post.title, 'Untitled')}</td>
                <td style={tdStyle}><StatusBadge status={textOf(post.status, 'draft')} /></td>
                <td style={tdStyle}>{titleOf(post.author)}</td>
                <td style={tdStyle}>{dateOf(typeof post.publishedAt === 'string' ? post.publishedAt : undefined)}</td>
                <td style={tdStyle}>{textOf(post.viewCount, '0')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={panelStyle}>
        <h2 style={{ fontSize: 18, margin: 0, padding: 18 }}>Recent Events</h2>
        <table style={tableStyle}>
          <thead>
            <tr><th style={thStyle}>Title</th><th style={thStyle}>Type</th><th style={thStyle}>Start Date</th><th style={thStyle}>Status</th></tr>
          </thead>
          <tbody>
            {recentEvents.map((event) => (
              <tr key={event.id}>
                <td style={tdStyle}>{textOf(event.title, 'Untitled')}</td>
                <td style={tdStyle}>{textOf(event.eventType, 'Community')}</td>
                <td style={tdStyle}>{dateOf(typeof event.eventStartDate === 'string' ? event.eventStartDate : undefined)}</td>
                <td style={tdStyle}><StatusBadge status={textOf(event.status, 'draft')} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 26 }}>
        <h2 style={{ fontSize: 20, margin: '0 0 16px' }}>Collections</h2>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {collections.map((collection) => (
            <CollectionCard {...collection} count={collection.title === 'Posts' ? posts.totalDocs : collection.title === 'Events' ? events.totalDocs : collection.title === 'Media Library' ? media.totalDocs : collection.title === 'Users' ? users.totalDocs : collection.title === 'Categories' ? categories.totalDocs : 0} key={collection.href} />
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
