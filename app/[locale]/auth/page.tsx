'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AuthPage } from '@/components/auth';
import { useAuth } from '@/context/AuthContext';

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export default function AuthPageRoute() {
  return (
    <Suspense fallback={<PageWrapper />}>
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const mode = (searchParams.get('mode') as 'login' | 'register') || 'login';

  const handleClose = () => {
    if (isAuthenticated) {
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <PageWrapper>
      <AuthPage onClose={handleClose} initialMode={mode} />
    </PageWrapper>
  );
}
