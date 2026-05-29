'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { FaCalendarAlt } from '@react-icons/all-files/fa/FaCalendarAlt';
import { FaDatabase } from '@react-icons/all-files/fa/FaDatabase';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';
import { FaImage } from '@react-icons/all-files/fa/FaImage';
import { FaLayerGroup } from '@react-icons/all-files/fa/FaLayerGroup';
import { FaList } from '@react-icons/all-files/fa/FaList';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { FaSearch } from '@react-icons/all-files/fa/FaSearch';
import { FaTags } from '@react-icons/all-files/fa/FaTags';
import { FaTh } from '@react-icons/all-files/fa/FaTh';
import { FaUsers } from '@react-icons/all-files/fa/FaUsers';
import type { AdminCollection } from '@/lib/admin/data';

type DashboardData = {
  collections: Array<AdminCollection & { count: number }>;
  lastUpdated: string | null;
  stats: {
    activeUsers: number;
    mediaFiles: number;
    totalCollections: number;
    totalEntries: number;
  };
};

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 26px;
`;

const TitleBlock = styled.div``;

const Eyebrow = styled.div`
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: 34px;
  line-height: 1.1;
`;

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  background: #6366f1;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 26px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
`;

const StatIcon = styled.div<{ $color: string }>`
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  margin-bottom: 18px;
  border-radius: 12px;
  background: ${({ $color }) => `${$color}22`};
  color: ${({ $color }) => $color};
`;

const StatNumber = styled.div`
  color: #ffffff;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
`;

const StatLabel = styled.div`
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
`;

const Panel = styled.section`
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 260px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  background: #0f0f13;
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Pill = styled.button<{ $active?: boolean }>`
  height: 34px;
  padding: 0 12px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(99, 102, 241, 0.55)' : 'rgba(255, 255, 255, 0.06)')};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? 'rgba(99, 102, 241, 0.14)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)')};
  font-weight: 700;
`;

const Select = styled.select`
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 9px;
  background: #0f0f13;
  color: rgba(255, 255, 255, 0.72);
`;

const Toggle = styled.button`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 9px;
  background: #0f0f13;
  color: rgba(255, 255, 255, 0.62);
`;

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 18px;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const CollectionCard = styled(Link)`
  position: relative;
  display: block;
  min-height: 190px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #13131a;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.5);
    transform: translateY(-2px);
  }
`;

const CardIcon = styled.div<{ $color: string }>`
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  margin-bottom: 16px;
  border-radius: 13px;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
`;

const MenuButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.42);
`;

const CardTitle = styled.div`
  color: #ffffff;
  font-size: 17px;
  font-weight: 850;
`;

const Slug = styled.div`
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 12px;
`;

const Description = styled.p`
  display: -webkit-box;
  min-height: 38px;
  margin: 14px 0 18px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  line-height: 1.45;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.52);
  font-size: 13px;
`;

const Badge = styled.span<{ $system?: boolean }>`
  padding: 5px 9px;
  border-radius: 999px;
  background: ${({ $system }) => ($system ? 'rgba(59, 130, 246, 0.14)' : 'rgba(16, 185, 129, 0.14)')};
  color: ${({ $system }) => ($system ? '#3b82f6' : '#10b981')};
  font-size: 11px;
  font-weight: 800;
`;

const Pagination = styled.div`
  padding: 0 18px 18px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 13px;
`;

const iconMap = {
  calendar: FaCalendarAlt,
  database: FaDatabase,
  image: FaImage,
  tags: FaTags,
  users: FaUsers,
};

function formatDate(date: string | null) {
  if (!date) {
    return 'Never';
  }

  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));
}

export function DashboardView({ data }: { data: DashboardData }) {
  const statItems = [
    { color: '#3b82f6', icon: FaLayerGroup, label: 'Total Collections', value: data.stats.totalCollections },
    { color: '#10b981', icon: FaDatabase, label: 'Total Entries', value: data.stats.totalEntries },
    { color: '#ec4899', icon: FaImage, label: 'Media Files', value: data.stats.mediaFiles },
    { color: '#f59e0b', icon: FaUsers, label: 'Active Users', value: data.stats.activeUsers },
    { color: '#3b82f6', icon: FaCalendarAlt, label: 'Last Updated', value: formatDate(data.lastUpdated) },
  ];

  return (
    <>
      <Header>
        <TitleBlock>
          <Eyebrow>Dashboard &gt; Collections</Eyebrow>
          <Title>Collections</Title>
        </TitleBlock>
        <CreateButton type="button">
          <FaPlus />
          Create Collection
        </CreateButton>
      </Header>

      <StatsGrid>
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <StatCard key={item.label}>
              <StatIcon $color={item.color}>
                <Icon />
              </StatIcon>
              <StatNumber>{item.value}</StatNumber>
              <StatLabel>{item.label}</StatLabel>
            </StatCard>
          );
        })}
      </StatsGrid>

      <Panel>
        <Toolbar>
          <SearchBox>
            <FaSearch />
            Search collections
          </SearchBox>
          <Controls>
            <Pill $active>All</Pill>
            <Pill>System</Pill>
            <Pill>Custom</Pill>
            <Select aria-label="Sort collections" defaultValue="name">
              <option value="name">Sort by name</option>
              <option value="entries">Sort by entries</option>
            </Select>
            <Toggle aria-label="Grid view">
              <FaTh />
            </Toggle>
            <Toggle aria-label="List view">
              <FaList />
            </Toggle>
          </Controls>
        </Toolbar>
        <CollectionGrid>
          {data.collections.map((collection) => {
            const Icon = iconMap[collection.icon];
            return (
              <CollectionCard href={`/admin/collections/${collection.slug}`} key={collection.slug}>
                <MenuButton type="button" aria-label={`${collection.name} options`}>
                  <FaEllipsisH />
                </MenuButton>
                <CardIcon $color={collection.accent}>
                  <Icon />
                </CardIcon>
                <CardTitle>{collection.name}</CardTitle>
                <Slug>{collection.slug}</Slug>
                <Description>{collection.description}</Description>
                <CardFooter>
                  <span>{collection.count} entries</span>
                  <Badge $system={collection.group === 'System'}>{collection.group === 'System' ? 'System' : 'Active'}</Badge>
                </CardFooter>
              </CollectionCard>
            );
          })}
        </CollectionGrid>
        <Pagination>Showing 1 to {data.collections.length} of {data.collections.length} collections</Pagination>
      </Panel>
    </>
  );
}
