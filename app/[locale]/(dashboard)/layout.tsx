'use client';

import { ReactNode } from 'react';
import styled from 'styled-components';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { theme } from '@/styles/theme';
import { useRouter } from '@/i18n/navigation';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 58px;
  background: ${theme.colors.background.darker};
`;

const MainContent = styled.main`
  flex: 1;
`;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleAuthClick = (type: 'login' | 'register') => {
    router.push(`/auth?mode=${type}`);
  };

  return (
    <LayoutContainer>
      <Navbar onAuthClick={handleAuthClick} />
      <MainContent>{children}</MainContent>
      <Footer />
    </LayoutContainer>
  );
}
