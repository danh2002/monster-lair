'use client';

import styled from 'styled-components';
import { DashboardView } from './DashboardView';
import type { AdminCollection } from '@/lib/admin/data';

type CollectionsViewProps = {
  collections: Array<AdminCollection & { count: number }>;
};

export function CollectionsView({ collections }: CollectionsViewProps) {
  return (
    <DashboardView
      data={{
        collections,
        lastUpdated: null,
        stats: {
          activeUsers: collections.find((item) => item.slug === 'users')?.count ?? 0,
          mediaFiles: collections.find((item) => item.slug === 'media')?.count ?? 0,
          totalCollections: collections.length,
          totalEntries: collections.reduce((total, collection) => total + collection.count, 0),
        },
      }}
    />
  );
}

export const MutedText = styled.p`
  color: rgba(255, 255, 255, 0.5);
`;
