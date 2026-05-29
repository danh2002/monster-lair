import { NextResponse } from 'next/server';
import { getMedia } from '@/lib/api/media';
import { getPopups } from '@/lib/api/popups';

function isVisible(item: Record<string, any>) {
  const now = Date.now();
  const startOk = !item.startDate && !item.start_date || new Date(item.startDate ?? item.start_date).getTime() <= now;
  const endOk = !item.endDate && !item.end_date || new Date(item.endDate ?? item.end_date).getTime() >= now;
  return item.active !== false && startOk && endOk;
}

export async function GET() {
  try {
    const [result, media] = await Promise.all([getPopups(10), getMedia(100)]);
    const mediaById = new Map(media.data.map((item) => [String(item.id), item]));
    const popups = result.data
      .filter((item: any) => isVisible(item))
      .map((item: any) => {
        const image = item.image ?? mediaById.get(String(item.image_id));
        return {
          ...item,
          ctaLink: item.ctaLink ?? item.cta_link,
          ctaText: item.ctaText ?? item.cta_text,
          image,
          image_url: item.image_url ?? image?.url ?? image?.sizes_card_url ?? image?.sizes_thumbnail_url,
          showOnce: item.showOnce ?? item.show_once,
        };
      });
    return NextResponse.json({ popups, total: popups.length });
  } catch {
    return NextResponse.json({ popups: [], total: 0 });
  }
}
