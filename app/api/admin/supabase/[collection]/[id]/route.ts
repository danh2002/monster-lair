import { NextResponse, type NextRequest } from 'next/server';
import { deleteRow, getRowById, updateRow } from '@/lib/api/admin/shared';
import { requireAdminAuth } from '@/lib/admin-auth';
import { adminSupabaseTables, sanitizeAdminPayload } from '../../sanitize';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  await requireAdminAuth();
  const { collection, id } = await params;
  const table = adminSupabaseTables[collection];

  if (!table) {
    return NextResponse.json({ error: 'Unsupported admin Supabase collection' }, { status: 404 });
  }

  const result = await getRowById(table, id);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data ?? {});
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  await requireAdminAuth();
  const { collection, id } = await params;
  const table = adminSupabaseTables[collection];

  if (!table) {
    return NextResponse.json({ error: 'Unsupported admin Supabase collection' }, { status: 404 });
  }

  const sanitized = await sanitizeAdminPayload(collection, await request.json(), 'update');

  if (sanitized.error || !sanitized.body) {
    return NextResponse.json({ error: sanitized.error }, { status: 400 });
  }

  const body = sanitized.body;
  const result = await updateRow(table, id, body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ doc: result.data });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  await requireAdminAuth();
  const { collection, id } = await params;
  const table = adminSupabaseTables[collection];

  if (!table) {
    return NextResponse.json({ error: 'Unsupported admin Supabase collection' }, { status: 404 });
  }

  const result = await deleteRow(table, id);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
