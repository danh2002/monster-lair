import { NextResponse } from 'next/server';
import { getPackages } from '@/lib/api/packages';

export async function GET() {
  try {
    const result = await getPackages(50);
    const packages = result.data.filter((item) => item.active !== false);

    return NextResponse.json({ packages, total: packages.length });
  } catch {
    return NextResponse.json({ packages: [], total: 0 });
  }
}
