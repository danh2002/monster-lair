'use client';

import { useMemo, useState } from 'react';
import { FaCalendar } from '@react-icons/all-files/fa/FaCalendar';
import { FaPlus } from '@react-icons/all-files/fa/FaPlus';
import { AdminButton } from './AdminButton';
import { EmptyState } from './EmptyState';
import { FilterTabs } from './FilterTabs';
import { Pagination } from './Pagination';
import { SearchInput } from './SearchInput';
import { Select } from './Select';
import { StatusBadge } from './StatusBadge';
import { adminTheme } from '@/styles/adminTheme';

const cell = { borderBottom: `1px solid ${adminTheme.border}`, padding: 14 };

export function EventsPageClient({ events }: { events: Array<Record<string, any>> }) {
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const counts = useMemo(
    () => ({
      all: events.length,
      cancelled: events.filter((event) => event.status === 'cancelled').length,
      ended: events.filter((event) => event.status === 'ended').length,
      ongoing: events.filter((event) => event.status === 'ongoing').length,
      upcoming: events.filter((event) => event.status === 'upcoming').length,
    }),
    [events],
  );
  const filtered = events.filter((event) => (status === 'all' || event.status === status) && (event.title ?? '').toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Events</h1>
        <AdminButton href="/admin/events/new" variant="primary"><FaPlus /> New Event</AdminButton>
      </div>
      <FilterTabs
        active={status}
        onChange={setStatus}
        tabs={[
          { count: counts.all, label: 'All', value: 'all' },
          { count: counts.upcoming, label: 'Upcoming', value: 'upcoming' },
          { count: counts.ongoing, label: 'Ongoing', value: 'ongoing' },
          { count: counts.ended, label: 'Ended', value: 'ended' },
          { count: counts.cancelled, label: 'Cancelled', value: 'cancelled' },
        ]}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <SearchInput onChange={(event) => setQuery(event.target.value)} placeholder="Search events..." value={query} />
        <Select><option>All Types</option><option>Tournament</option><option>Special</option><option>Community</option></Select>
        <Select><option>All Dates</option><option>This month</option><option>Next month</option></Select>
      </div>
      {filtered.length ? (
        <>
          <table style={{ background: adminTheme.card, borderCollapse: 'collapse', borderRadius: 12, overflow: 'hidden', width: '100%' }}>
            <thead>
              <tr><th style={cell}>□</th><th style={cell}>Event Title</th><th style={cell}>Type</th><th style={cell}>Start Date</th><th style={cell}>Location</th><th style={cell}>Status</th><th style={cell}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr key={event.id}>
                  <td style={cell}><input type="checkbox" /></td>
                  <td style={cell}><strong>{event.title ?? 'Untitled'}</strong></td>
                  <td style={cell}>{event.eventType ?? 'community'}</td>
                  <td style={cell}>{event.eventStartDate ? new Date(event.eventStartDate).toLocaleString() : 'Not set'}</td>
                  <td style={cell}>{event.locationName ?? event.address ?? 'TBD'}</td>
                  <td style={cell}><StatusBadge status={event.status} /></td>
                  <td style={cell}><AdminButton href={`/admin/events/${event.id}`}>Edit</AdminButton></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={filtered.length} />
        </>
      ) : (
        <EmptyState action={<AdminButton href="/admin/events/new" variant="primary">New Event</AdminButton>} description="Create your first event" icon={FaCalendar} title="No events scheduled" />
      )}
    </>
  );
}
