import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/api/events';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = Number(searchParams.get('limit')) || 10;

  try {
    const result = await getEvents(limit);
    const events = result.data.filter((event) => !status || event.status === status);

    return NextResponse.json({ events, total: events.length });
  } catch {
    return NextResponse.json({ events: [], total: 0 });
  }
}
