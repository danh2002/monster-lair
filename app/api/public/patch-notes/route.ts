import { NextResponse } from 'next/server';
import { getPatchNotes } from '@/lib/api/patch-notes';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 10;
  const gameMode = searchParams.get('gameMode');

  try {
    const result = await getPatchNotes(limit);
    const patchNotes = result.data.filter((item) => {
      const gameModeMatch = !gameMode || item.game_mode === gameMode || item.gameMode === gameMode;
      return gameModeMatch && String(item.status ?? 'published') === 'published';
    });

    return NextResponse.json({ patchNotes, total: patchNotes.length });
  } catch {
    return NextResponse.json({ patchNotes: [], total: 0 });
  }
}
