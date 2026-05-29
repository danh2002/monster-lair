'use client';

import type { ReactNode } from 'react';
import styled from 'styled-components';
import { adminTheme } from '@/styles/adminTheme';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.7);
`;

const Card = styled.div`
  width: min(100%, 980px);
  max-height: 86vh;
  overflow: auto;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radius};
  background: ${adminTheme.card};
  box-shadow: ${adminTheme.shadow};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid ${adminTheme.border};
`;

const Close = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid ${adminTheme.border};
  border-radius: ${adminTheme.radiusSm};
  background: rgba(255,255,255,0.04);
  color: ${adminTheme.text};
  cursor: pointer;
`;

export function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  return (
    <Overlay onMouseDown={onClose}>
      <Card onMouseDown={(event) => event.stopPropagation()}>
        <Header>
          <strong>{title}</strong>
          <Close onClick={onClose} type="button">x</Close>
        </Header>
        {children}
      </Card>
    </Overlay>
  );
}
