 'use client';

import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PopupModal } from '@/components/marketing/PopupModal';
import { useRouter } from '@/i18n/navigation';

export default function PublicLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleAuthClick = (type: 'login' | 'register') => {
    router.push(`/auth?mode=${type}`);
  };

  return (
    <>
      <Navbar onAuthClick={handleAuthClick} />
      <div style={{ paddingTop: 58, minHeight: 'calc(100vh - 58px)' }}>{children}</div>
      <PopupModal />
      <Footer />
    </>
  );
}
