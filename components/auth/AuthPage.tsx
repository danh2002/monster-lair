'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { LoginForm, RegisterForm } from '@/components/auth';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const AuthPageWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(20, 15, 30, 0.95));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
`;

const AuthPageContent = styled.div`
  animation: slideIn 0.4s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 106, 0, 0.3);
    color: #ff6a00;
  }
`;

interface AuthPageProps {
  onClose?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
  };

  const handleClose = () => {
    if (isAuthenticated) {
      onClose?.();
      router.push('/');
    } else {
      onClose?.();
    }
  };

  return (
    <AuthPageWrapper>
      <CloseButton onClick={handleClose}>×</CloseButton>
      <AuthPageContent>
        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => handleSwitchMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => handleSwitchMode('login')} />
        )}
      </AuthPageContent>
    </AuthPageWrapper>
  );
};
