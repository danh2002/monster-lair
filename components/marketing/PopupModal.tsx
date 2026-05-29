'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

type Popup = {
  content?: any;
  ctaLink?: string | null;
  cta_link?: string | null;
  ctaText?: string | null;
  cta_text?: string | null;
  delay?: number | null;
  id: string | number;
  image?: { alt?: string | null; thumbnailURL?: string | null; url?: string | null } | null;
  image_url?: string | null;
  showOnce?: boolean | null;
  show_once?: boolean | null;
  title?: string | null;
  trigger?: 'onLoad' | 'onExit' | 'afterSeconds' | null;
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0,0,0,0.72);
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  width: min(100%, 560px);
  border: 1px solid rgba(255, 106, 0, 0.28);
  border-radius: 8px;
  background: #141018;
  color: #fff;
  box-shadow: 0 24px 80px rgba(0,0,0,0.55);
`;

const Close = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 50%;
  background: rgba(0,0,0,0.45);
  color: #fff;
  cursor: pointer;
`;

const Media = styled.div`
  position: relative;
  aspect-ratio: 16 / 8;
  background: #08070b;
`;

const Body = styled.div`
  display: grid;
  gap: 14px;
  padding: 22px;

  h2 {
    margin: 0;
    font-size: 1.8rem;
    font-style: italic;
  }
`;

const Text = styled.div`
  color: rgba(255,255,255,0.74);
  line-height: 1.65;
`;

const Cta = styled(Link)`
  display: inline-flex;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  align-items: center;
  border-radius: 6px;
  background: #ff6a00;
  color: #fff;
  font-weight: 900;
  text-decoration: none;
`;

function getImageUrl(popup: Popup) {
  return popup.image?.url || popup.image?.thumbnailURL || popup.image_url || '';
}

function lexicalToText(value: any): string {
  const children = value?.root?.children;
  if (!Array.isArray(children)) return '';
  return children
    .map((node) => (Array.isArray(node.children) ? node.children.map((child: any) => child.text ?? '').join('') : ''))
    .filter(Boolean)
    .map((text) => `<p>${text}</p>`)
    .join('');
}

export function PopupModal() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [active, setActive] = useState<Popup | null>(null);
  const [closed, setClosed] = useState(false);
  const popup = active ?? popups[0];
  const storageKey = popup ? `popup-seen-${popup.id}` : '';
  const imageUrl = popup ? getImageUrl(popup) : '';
  const html = useMemo(() => (typeof popup?.content === 'string' ? popup.content : lexicalToText(popup?.content)), [popup?.content]);

  useEffect(() => {
    fetch('/api/public/popups')
      .then((res) => res.json())
      .then((data) => setPopups(Array.isArray(data.popups) ? data.popups : []))
      .catch(() => setPopups([]));
  }, []);

  useEffect(() => {
    if (!popup || closed) return;
    if ((popup.showOnce ?? popup.show_once) && window.localStorage.getItem(storageKey)) return;

    if (popup.trigger === 'afterSeconds') {
      const timer = window.setTimeout(() => setActive(popup), Math.max(0, Number(popup.delay ?? 0)) * 1000);
      return () => window.clearTimeout(timer);
    }

    if (popup.trigger === 'onExit') {
      const onMouseLeave = (event: MouseEvent) => {
        if (event.clientY <= 0) setActive(popup);
      };
      document.addEventListener('mouseleave', onMouseLeave);
      return () => document.removeEventListener('mouseleave', onMouseLeave);
    }

    setActive(popup);
    return undefined;
  }, [closed, popup, storageKey]);

  function close() {
    if ((popup?.showOnce ?? popup?.show_once) && storageKey) window.localStorage.setItem(storageKey, '1');
    setClosed(true);
    setActive(null);
  }

  if (!active || closed) return null;

  return (
    <Overlay>
      <Card>
        <Close onClick={close} type="button">x</Close>
        {imageUrl ? (
          <Media>
            <Image alt={active.image?.alt || active.title || 'Popup'} fill src={imageUrl} style={{ objectFit: 'cover' }} />
          </Media>
        ) : null}
        <Body>
          {active.title ? <h2>{active.title}</h2> : null}
          {html ? <Text dangerouslySetInnerHTML={{ __html: html }} /> : null}
          {(active.ctaText ?? active.cta_text) && (active.ctaLink ?? active.cta_link) ? <Cta href={(active.ctaLink ?? active.cta_link)!}>{active.ctaText ?? active.cta_text}</Cta> : null}
        </Body>
      </Card>
    </Overlay>
  );
}
