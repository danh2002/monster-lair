import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/api/events';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const result = await getEvents(100);
    const event = result.data.find((item) => item.slug === slug);

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    return NextResponse.json({ event });
  } catch {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
}
