'use client';

import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useRouter } from '@/i18n/navigation';

export default function NewsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <>
      <Navbar currentPage="news" onAuthClick={(type) => router.push(`/auth?mode=${type}`)} />
      <div style={{ paddingTop: 58, minHeight: 'calc(100vh - 58px)', background: '#08070b' }}>{children}</div>
      <Footer />
    </>
  );
}
