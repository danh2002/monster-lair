import { NextResponse } from 'next/server';
import { getBanners } from '@/lib/api/banners';
import { getMedia } from '@/lib/api/media';

function isVisible(item: Record<string, any>) {
  const now = Date.now();
  const startOk = !item.startDate && !item.start_date || new Date(item.startDate ?? item.start_date).getTime() <= now;
  const endOk = !item.endDate && !item.end_date || new Date(item.endDate ?? item.end_date).getTime() >= now;
  return item.active !== false && startOk && endOk;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const position = searchParams.get('position') || 'home';

  try {
    const [result, media] = await Promise.all([getBanners(20), getMedia(100)]);
    const mediaById = new Map(media.data.map((item) => [String(item.id), item]));
    const banners = result.data
      .filter((item: any) => isVisible(item) && (item.position === position || item.position === 'all'))
      .map((item: any) => {
        const image = item.image ?? mediaById.get(String(item.image_id));
        return {
          ...item,
          image,
          image_url: item.image_url ?? image?.url ?? image?.sizes_card_url ?? image?.sizes_thumbnail_url,
        };
      });
    return NextResponse.json({ banners, total: banners.length });
  } catch {
    return NextResponse.json({ banners: [], total: 0 });
  }
}
