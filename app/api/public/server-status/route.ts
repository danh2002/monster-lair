import { NextResponse } from 'next/server';
import { getServerStatus } from '@/lib/api/server-status';

export async function GET() {
  try {
    const result = await getServerStatus(1);

    return NextResponse.json({ serverStatus: result.data[0] ?? null });
  } catch {
    return NextResponse.json({ serverStatus: null });
  }
}
