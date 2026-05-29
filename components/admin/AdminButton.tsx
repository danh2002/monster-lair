'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import styled from 'styled-components';

const baseStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  ${baseStyles}
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'primary' ? '#6366f1' : $variant === 'danger' ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'};
  background: ${({ $variant }) =>
    $variant === 'primary' ? '#6366f1' : $variant === 'danger' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)'};
  color: #ffffff;

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'primary' ? '#4f46e5' : $variant === 'danger' ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.08)'};
  }
`;

const LinkButton = styled(Link)<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  ${baseStyles}
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'primary' ? '#6366f1' : $variant === 'danger' ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'};
  background: ${({ $variant }) =>
    $variant === 'primary' ? '#6366f1' : $variant === 'danger' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)'};
  color: #ffffff;

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'primary' ? '#4f46e5' : $variant === 'danger' ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.08)'};
  }
`;

type Props = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'danger';
} & ComponentProps<'button'>;

export function AdminButton({ children, href, variant = 'secondary', ...props }: Props) {
  if (href) {
    return (
      <LinkButton href={href} $variant={variant}>
        {children}
      </LinkButton>
    );
  }

  return (
    <Button type="button" $variant={variant} {...props}>
      {children}
    </Button>
  );
}
