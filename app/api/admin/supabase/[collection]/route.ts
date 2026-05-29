import { NextResponse, type NextRequest } from 'next/server';
import { createRow, listRows } from '@/lib/api/admin/shared';
import { requireAdminAuth } from '@/lib/admin-auth';
import { adminSupabaseTables, sanitizeAdminPayload } from '../sanitize';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  await requireAdminAuth();
  const { collection } = await params;
  const table = adminSupabaseTables[collection];

  if (!table) {
    return NextResponse.json({ error: 'Unsupported admin Supabase collection' }, { status: 404 });
  }

  const result = await listRows(table);
  return NextResponse.json({ docs: result.data, totalDocs: result.totalDocs, error: result.error });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ collection: string }> }) {
  await requireAdminAuth();
  const { collection } = await params;
  const table = adminSupabaseTables[collection];

  if (!table) {
    return NextResponse.json({ error: 'Unsupported admin Supabase collection' }, { status: 404 });
  }

  const sanitized = await sanitizeAdminPayload(collection, await request.json(), 'create');

  if (sanitized.error || !sanitized.body) {
    return NextResponse.json({ error: sanitized.error }, { status: 400 });
  }

  const body = sanitized.body;
  const result = await createRow(table, body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ doc: result.data }, { status: 201 });
}
