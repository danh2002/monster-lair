'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { adminTheme } from '@/styles/adminTheme';

type ToastType = 'error' | 'success';

type ToastState = {
  id: number;
  message: string;
  type: ToastType;
};

declare global {
  interface WindowEventMap {
    'admin-toast': CustomEvent<{ message: string; type: ToastType }>;
  }
}

const Stack = styled.div`
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 200;
  display: grid;
  gap: 10px;
  width: min(360px, calc(100vw - 36px));
`;

const ToastCard = styled.div<{ $type: ToastType }>`
  padding: 13px 15px;
  border: 1px solid ${({ $type }) => ($type === 'success' ? 'rgba(16,185,129,0.45)' : 'rgba(239,68,68,0.45)')};
  border-radius: ${adminTheme.radius};
  background: ${({ $type }) => ($type === 'success' ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)')};
  box-shadow: ${adminTheme.shadow};
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
`;

export function showAdminToast(type: ToastType, message: string) {
  window.dispatchEvent(new CustomEvent('admin-toast', { detail: { message, type } }));
}

export function Toast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    function onToast(event: WindowEventMap['admin-toast']) {
      const id = Date.now();
      setToasts((current) => [...current, { id, ...event.detail }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 3000);
    }

    window.addEventListener('admin-toast', onToast);
    return () => window.removeEventListener('admin-toast', onToast);
  }, []);

  return (
    <Stack>
      {toasts.map((toast) => (
        <ToastCard $type={toast.type} key={toast.id}>
          {toast.message}
        </ToastCard>
      ))}
    </Stack>
  );
}
