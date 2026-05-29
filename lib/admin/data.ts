import { headers } from 'next/headers';

export type AdminCollection = {
  accent: string;
  description: string;
  group: 'System' | 'Custom';
  icon: 'database' | 'calendar' | 'image' | 'tags' | 'users';
  name: string;
  slug: string;
};

export const adminCollections: AdminCollection[] = [
  {
    accent: '#3b82f6',
    description: 'Editorial posts, announcements, patch notes, and long-form content.',
    group: 'Custom',
    icon: 'database',
    name: 'Posts',
    slug: 'posts',
  },
  {
    accent: '#10b981',
    description: 'Tournament schedules, special events, locations, rewards, and event status.',
    group: 'Custom',
    icon: 'calendar',
    name: 'Events',
    slug: 'events',
  },
  {
    accent: '#f59e0b',
    description: 'Reusable taxonomy for organizing news, events, and content surfaces.',
    group: 'Custom',
    icon: 'tags',
    name: 'Categories',
    slug: 'categories',
  },
  {
    accent: '#ec4899',
    description: 'Images and uploaded files used by posts, events, and visual content.',
    group: 'System',
    icon: 'image',
    name: 'Media',
    slug: 'media',
  },
  {
    accent: '#6366f1',
    description: 'Authenticated CMS operators, profile data, and access credentials.',
    group: 'System',
    icon: 'users',
    name: 'Users',
    slug: 'users',
  },
];

type CountResponse = {
  docs?: Array<{ updatedAt?: string }>;
  totalDocs?: number;
};

async function getBaseUrl() {
  const headerStore = await headers();
  const host = headerStore.get('host') ?? 'localhost:3000';
  const protocol = host.includes('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

async function fetchCollection(slug: string) {
  const headerStore = await headers();
  const cookie = headerStore.get('cookie') ?? '';
  const baseUrl = await getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/${slug}?limit=0&sort=-updatedAt`, {
      cache: 'no-store',
      headers: cookie ? { cookie } : undefined,
    });

    if (!response.ok) {
      return { docs: [], totalDocs: 0 } satisfies CountResponse;
    }

    return (await response.json()) as CountResponse;
  } catch {
    return { docs: [], totalDocs: 0 } satisfies CountResponse;
  }
}

export async function getAdminDashboardData() {
  const results = await Promise.all(adminCollections.map((collection) => fetchCollection(collection.slug)));
  const counts = Object.fromEntries(
    adminCollections.map((collection, index) => [collection.slug, results[index]?.totalDocs ?? 0]),
  );
  const updatedDates = results.flatMap((result) => result.docs?.map((doc) => doc.updatedAt).filter(Boolean) ?? []);

  return {
    collections: adminCollections.map((collection) => ({
      ...collection,
      count: counts[collection.slug] ?? 0,
    })),
    lastUpdated: updatedDates.sort().at(-1) ?? null,
    stats: {
      activeUsers: counts.users ?? 0,
      mediaFiles: counts.media ?? 0,
      totalCollections: adminCollections.length,
      totalEntries: Object.values(counts).reduce((total, count) => total + count, 0),
    },
  };
}

export async function getCollectionEntries(slug: string) {
  const headerStore = await headers();
  const cookie = headerStore.get('cookie') ?? '';
  const baseUrl = await getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/${slug}?limit=20&sort=-updatedAt`, {
      cache: 'no-store',
      headers: cookie ? { cookie } : undefined,
    });

    if (!response.ok) {
      return { docs: [], totalDocs: 0 };
    }

    return (await response.json()) as { docs?: Array<Record<string, unknown>>; totalDocs?: number };
  } catch {
    return { docs: [], totalDocs: 0 };
  }
}
