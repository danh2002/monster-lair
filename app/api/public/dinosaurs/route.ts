import { NextResponse } from 'next/server';
import { getDinosaurs } from '@/lib/api/dinosaurs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 50;
  const rarity = searchParams.get('rarity');
  const type = searchParams.get('type');

  try {
    const result = await getDinosaurs(limit);
    const dinosaurs = result.data.filter((item) => {
      const rarityMatch = !rarity || item.rarity === rarity;
      const typeMatch = !type || item.type === type;
      return rarityMatch && typeMatch && String(item.status ?? 'published') === 'published';
    });

    return NextResponse.json({ dinosaurs, total: dinosaurs.length });
  } catch {
    return NextResponse.json({ dinosaurs: [], total: 0 });
  }
}
