'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

type Banner = {
  id: string | number;
  image?: { alt?: string | null; thumbnailURL?: string | null; url?: string | null } | null;
  image_url?: string | null;
  link?: string | null;
  title?: string | null;
};

const Wrap = styled.section`
  position: relative;
  overflow: hidden;
  width: 100%;
  background: #08070b;
`;

const Slide = styled.div`
  position: relative;
  aspect-ratio: 16 / 5;
  min-height: 220px;
  background: #120b08;
`;

const Caption = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 28px;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.78));
  color: #fff;
  font-size: clamp(1.4rem, 3vw, 2.8rem);
  font-style: italic;
  font-weight: 900;
`;

const Dots = styled.div`
  position: absolute;
  right: 18px;
  bottom: 16px;
  display: flex;
  gap: 8px;
`;

const Dot = styled.button<{ $active?: boolean }>`
  width: 10px;
  height: 10px;
  border: 0;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#ff6a00' : 'rgba(255,255,255,0.45)')};
  cursor: pointer;
`;

function getImageUrl(banner: Banner) {
  return banner.image?.url || banner.image?.thumbnailURL || banner.image_url || '';
}

export function BannerSlider({ position = 'home' }: { position?: 'home' | 'news' | 'ranking' | 'all' }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [active, setActive] = useState(0);
  const banner = banners[active];
  const imageUrl = banner ? getImageUrl(banner) : '';
  const content = useMemo(() => {
    if (!banner || !imageUrl) return null;

    const slide = (
      <Slide>
        <Image alt={banner.image?.alt || banner.title || 'Banner'} fill priority src={imageUrl} style={{ objectFit: 'cover' }} />
        {banner.title ? <Caption>{banner.title}</Caption> : null}
      </Slide>
    );

    return banner.link ? <Link href={banner.link}>{slide}</Link> : slide;
  }, [banner, imageUrl]);

  useEffect(() => {
    fetch(`/api/public/banners?position=${position}`)
      .then((res) => res.json())
      .then((data) => setBanners(Array.isArray(data.banners) ? data.banners : []))
      .catch(() => setBanners([]));
  }, [position]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % banners.length), 5000);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  if (!content) return null;

  return (
    <Wrap>
      {content}
      {banners.length > 1 ? (
        <Dots>
          {banners.map((item, index) => (
            <Dot $active={index === active} aria-label={`Go to banner ${index + 1}`} key={item.id} onClick={() => setActive(index)} type="button" />
          ))}
        </Dots>
      ) : null}
    </Wrap>
  );
}
