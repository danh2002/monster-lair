'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaFacebookF } from '@react-icons/all-files/fa/FaFacebookF';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import { FaLink } from '@react-icons/all-files/fa/FaLink';

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

const ShareLink = styled.a`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 106, 0, 0.35);
  border-radius: 50%;
  background: rgba(20, 12, 8, 0.85);
  color: #fff;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: #ff6a00;
    background: rgba(255, 106, 0, 0.18);
  }
`;

const ShareButton = styled.button`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 106, 0, 0.35);
  border-radius: 50%;
  background: rgba(20, 12, 8, 0.85);
  color: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: #ff6a00;
    background: rgba(255, 106, 0, 0.18);
  }
`;

export function ShareButtons({ title, shareLabel }: { title: string; shareLabel: string }) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(currentUrl);
  };

  if (!currentUrl) return null;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <Row aria-label={shareLabel}>
      <ShareLink href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">
        <FaFacebookF />
      </ShareLink>
      <ShareLink href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer">
        <FaTwitter />
      </ShareLink>
      <ShareButton type="button" onClick={copy} aria-label="Copy link">
        <FaLink />
      </ShareButton>
    </Row>
  );
}
