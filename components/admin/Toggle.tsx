'use client';

import styled from 'styled-components';
import { adminTheme } from '@/styles/adminTheme';

const Switch = styled.button<{ $checked?: boolean }>`
  position: relative;
  width: 46px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  background: ${({ $checked }) => ($checked ? adminTheme.accent : 'rgba(255,255,255,0.12)')};
  cursor: pointer;
  transition: background 160ms ease;

  &::after {
    position: absolute;
    top: 3px;
    left: ${({ $checked }) => ($checked ? '23px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    content: '';
    transition: left 160ms ease;
  }
`;

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return <Switch aria-pressed={checked} $checked={checked} onClick={() => onChange(!checked)} type="button" />;
}
