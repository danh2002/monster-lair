import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

interface StyledButtonProps {
  $fullWidth?: boolean;
  $disabled?: boolean;
  $size?: 'sm' | 'md' | 'lg';
}

const BaseButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  white-space: nowrap;
  gap: ${theme.spacing.sm};
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};

  font-size: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return theme.typography.fontSize.sm;
      case 'lg':
        return theme.typography.fontSize.lg;
      default:
        return theme.typography.fontSize.base;
    }
  }};

  padding: ${(props) => {
    switch (props.$size) {
      case 'sm':
        return `${theme.spacing.sm} ${theme.spacing.md}`;
      case 'lg':
        return `${theme.spacing.lg} ${theme.spacing.xl}`;
      default:
        return `${theme.spacing.md} ${theme.spacing.lg}`;
    }
  }};
`;

export const PrimaryButton = styled(BaseButton)`
  background: ${theme.colors.primary.gradient};
  color: ${theme.colors.text.primary};
  box-shadow: ${theme.shadows.glow};

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${theme.colors.primary.light} 0%, ${theme.colors.primary.main} 100%);
    box-shadow: ${theme.shadows.glowHeavy};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: ${theme.colors.background.card};
  color: ${theme.colors.text.primary};
  border: 2px solid ${theme.colors.primary.main};

  &:hover:not(:disabled) {
    background: ${theme.colors.background.cardHover};
    border-color: ${theme.colors.primary.light};
    box-shadow: ${theme.shadows.glow};
  }
`;

export const SuccessButton = styled(BaseButton)`
  background: linear-gradient(135deg, #00B366 0%, #00D080 100%);
  color: ${theme.colors.text.primary};
  box-shadow: 0 0 20px rgba(0, 208, 128, 0.4);

  &:hover:not(:disabled) {
    box-shadow: 0 0 40px rgba(0, 208, 128, 0.6);
    transform: translateY(-2px);
  }
`;

export const OutlineButton = styled(BaseButton)`
  background: transparent;
  color: ${theme.colors.primary.main};
  border: 2px solid ${theme.colors.primary.main};

  &:hover:not(:disabled) {
    background: rgba(255, 106, 0, 0.1);
    border-color: ${theme.colors.primary.light};
  }
`;

interface ButtonComponentProps extends ButtonProps {
  children: ReactNode;
}

export const Button: React.FC<ButtonComponentProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  children,
  ...props
}) => {
  const Component = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    success: SuccessButton,
    outline: OutlineButton,
  }[variant];

  return (
    <Component $size={size} $fullWidth={fullWidth} $disabled={disabled} {...props}>
      {children}
    </Component>
  );
};
