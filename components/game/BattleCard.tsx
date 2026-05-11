import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';

export interface BattleCardProps {
  faction1: {
    name: string;
    players: number;
    score: number;
    maxScore?: number;
    color: 'red' | 'blue';
  };
  faction2: {
    name: string;
    players: number;
    score: number;
    maxScore?: number;
    color: 'red' | 'blue';
  };
  animated?: boolean;
  onViewDetails?: () => void;
}

const BattleCardContainer = styled.div`
  background: linear-gradient(
    135deg,
    rgba(20, 25, 50, 0.7) 0%,
    rgba(30, 40, 70, 0.5) 100%
  );
  border: 2px solid ${theme.colors.ui.border};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  backdrop-filter: blur(15px);
  transition: all ${theme.transitions.normal};
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${theme.colors.primary.main},
      transparent
    );
  }

  &:hover {
    border-color: ${theme.colors.ui.borderHover};
    box-shadow: 0 0 30px rgba(255, 106, 0, 0.2);
    transform: translateY(-4px);
  }
`;

const BattleTitle = styled.h3`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize['2xl']};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  font-weight: ${theme.typography.fontWeight.extrabold};
  text-transform: uppercase;
  letter-spacing: 2px;

  span {
    background: ${theme.colors.primary.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const BattleContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  gap: ${theme.spacing.xl};
  align-items: center;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const FactionContainer = styled.div<{ align: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  text-align: ${(props) => props.align};

  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
  }
`;

const FactionHeader = styled.div<{ color: 'red' | 'blue' }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  h4 {
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${(props) =>
      props.color === 'red' ? theme.colors.factions.hoaLong : theme.colors.factions.tuTien};
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.ui.border};

  .stat-label {
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    margin-bottom: ${theme.spacing.xs};
    letter-spacing: 1px;
  }

  .stat-value {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.text.primary};
  }
`;

const VSBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6A00 0%, #0066CC 100%);
  width: 70px;
  height: 70px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${theme.colors.text.primary};
  box-shadow: 0 0 30px rgba(255, 106, 0, 0.5);
  text-align: center;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.md}) {
    margin: ${theme.spacing.md} auto;
  }
`;

const AnimatedValue = ({ value, duration = 500 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentValue = Math.floor(value * progress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [value, duration]);

  return <>{displayValue}</>;
};

export const BattleCard: React.FC<BattleCardProps> = ({
  faction1,
  faction2,
  animated = true,
  onViewDetails,
}) => {
  const maxScore = faction1.maxScore || 100;

  return (
    <BattleCardContainer onClick={onViewDetails} style={{ cursor: onViewDetails ? 'pointer' : 'default' }}>
      <BattleTitle>
        TRẬN ĐẤU <span>LỜI ĐẤI</span>
      </BattleTitle>

      <BattleContent>
        {/* Faction 1 - Left */}
        <FactionContainer align="right">
          <FactionHeader color={faction1.color}>
            <h4>{faction1.name}</h4>
            <p>{faction1.players} Người</p>
          </FactionHeader>

          <StatsGrid>
            <StatItem>
              <div className="stat-label">Tấn công</div>
              <div className="stat-value">{faction1.score}</div>
            </StatItem>
            <StatItem>
              <div className="stat-label">Chiến thắng</div>
              <div className="stat-value">12%</div>
            </StatItem>
          </StatsGrid>

          <ProgressBar
            value={faction1.score}
            maxValue={maxScore}
            variant={faction1.color}
            animated={animated}
            valueLabel={`${faction1.score}/${maxScore}`}
          />
        </FactionContainer>

        {/* VS Badge */}
        <VSBadge>VS</VSBadge>

        {/* Faction 2 - Right */}
        <FactionContainer align="left">
          <FactionHeader color={faction2.color}>
            <h4>{faction2.name}</h4>
            <p>{faction2.players} Người</p>
          </FactionHeader>

          <StatsGrid>
            <StatItem>
              <div className="stat-label">Tấn công</div>
              <div className="stat-value">{faction2.score}</div>
            </StatItem>
            <StatItem>
              <div className="stat-label">Chiến thắng</div>
              <div className="stat-value">8%</div>
            </StatItem>
          </StatsGrid>

          <ProgressBar
            value={faction2.score}
            maxValue={maxScore}
            variant={faction2.color}
            animated={animated}
            valueLabel={`${faction2.score}/${maxScore}`}
          />
        </FactionContainer>
      </BattleContent>
    </BattleCardContainer>
  );
};

// Export AnimatedValue for use in other components
export { AnimatedValue };
