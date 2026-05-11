import styled from 'styled-components';
import { theme } from '@/styles/theme';

export interface ProgressBarProps {
  value: number;
  maxValue?: number;
  variant?: 'red' | 'blue' | 'primary';
  animated?: boolean;
}

const ProgressContainer = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const ProgressFill = styled.div<{ percentage: number; variant: string; animated: boolean }>`
  height: 100%;
  background: ${(props) => {
    switch (props.variant) {
      case 'red':
        return `linear-gradient(90deg, #DC143C 0%, #FF4444 100%)`;
      case 'blue':
        return `linear-gradient(90deg, #0066CC 0%, #0099FF 100%)`;
      default:
        return theme.colors.primary.gradient;
    }
  }};
  width: ${(props) => props.percentage}%;
  transition: ${(props) => (props.animated ? `width ${theme.transitions.normal}` : 'none')};
  box-shadow: ${(props) => {
    switch (props.variant) {
      case 'red':
        return '0 0 10px rgba(220, 20, 60, 0.5)';
      case 'blue':
        return '0 0 10px rgba(0, 102, 204, 0.5)';
      default:
        return theme.shadows.glow;
    }
  }};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${(props) => (props.animated ? 'shimmer 2s infinite' : 'none')};
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

interface ProgressBarComponentProps extends ProgressBarProps {
  label?: string;
  valueLabel?: string;
}

export const ProgressBar: React.FC<ProgressBarComponentProps> = ({
  value,
  maxValue = 100,
  variant = 'primary',
  animated = true,
  label,
  valueLabel,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div>
      {(label || valueLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          {label && <span style={{ fontSize: '0.875rem' }}>{label}</span>}
          {valueLabel && <span style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>{valueLabel}</span>}
        </div>
      )}
      <ProgressContainer>
        <ProgressFill percentage={percentage} variant={variant} animated={animated} />
      </ProgressContainer>
    </div>
  );
};
