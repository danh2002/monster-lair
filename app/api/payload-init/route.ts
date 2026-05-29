import config from '@payload-config';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';

export async function GET() {
  try {
    await getPayload({ config });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
