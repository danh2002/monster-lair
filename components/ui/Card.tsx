import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const CardContainer = styled.div<{ hoverable?: boolean }>`
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.ui.border};
  border-radius: ${theme.borderRadius.xl};
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.lg};
  transition: all ${theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 106, 0, 0.1) 0%,
      transparent 50%,
      rgba(0, 102, 204, 0.1) 100%
    );
    pointer-events: none;
  }

  &:hover {
    background: ${theme.colors.background.cardHover};
    border-color: ${theme.colors.ui.borderHover};
    box-shadow: ${(props) => (props.hoverable ? theme.shadows.glow : 'none')};
    transform: ${(props) => (props.hoverable ? 'translateY(-4px)' : 'none')};
  }
`;

export const Card: React.FC<{ children: React.ReactNode; hoverable?: boolean }> = ({
  children,
  hoverable = true,
}) => {
  return <CardContainer hoverable={hoverable}>{children}</CardContainer>;
};
