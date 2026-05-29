import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { AuditLogs } from './collections/AuditLogs.ts';
import { Banners } from './collections/Banners.ts';
import { Categories } from './collections/Categories.ts';
import { Comments } from './collections/Comments.ts';
import { Dinosaurs } from './collections/Dinosaurs.ts';
import { Events } from './collections/Events.ts';
import { Media } from './collections/Media.ts';
import { Pages } from './collections/Pages.ts';
import { Packages } from './collections/Packages.ts';
import { PatchNotes } from './collections/PatchNotes.ts';
import { Popups } from './collections/Popups.ts';
import { Posts } from './collections/Posts.ts';
import { ServerStatus } from './collections/ServerStatus.ts';
import { Tags } from './collections/Tags.ts';
import { Users } from './collections/Users.ts';
import { SiteSettings } from './globals/SiteSettings.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    autoLogin: false,
    components: {},
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: 'users',
  },
  collections: [Users, Pages, Posts, Comments, Events, PatchNotes, Dinosaurs, Packages, ServerStatus, Banners, Popups, Categories, Tags, Media, AuditLogs],
  db: postgresAdapter({
    migrationDir: './prisma/migrations/payload',
    pool: {
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    tablesFilter: [
      'payload_*',
      'users*', '_users*',
      'posts*', '_posts*',
      'events*',
      '_events*',
      'categories*', '_categories*',
      'media*', '_media*',
      'tags*', '_tags*',
      'audit_logs*',
      'pages*', '_pages*',
      'banners*', 'popups*',
      'patch_notes*', '_patch_notes*',
      'dinosaurs*', '_dinosaurs*',
      'packages*', '_packages*',
      'server_status*',
      'comments*',
      'site_settings*',
      '_site_settings*',
    ],
  }),
  editor: lexicalEditor(),
  globals: [SiteSettings],
  plugins: [],
  secret: process.env.PAYLOAD_SECRET ?? 'development-payload-secret-change-me',
  routes: {
    admin: '/cms',
  },
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
