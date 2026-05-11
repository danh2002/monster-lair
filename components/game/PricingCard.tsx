import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';

export interface PricingCardProps {
  icon?: React.ReactNode;
  title: string;
  price: string;
  currency: string;
  gems: number;
  discount?: number;
  badge?: string;
  onClick?: () => void;
}

const CardContainer = styled.div<{ isPopular?: boolean }>`
  background: linear-gradient(
    135deg,
    rgba(255, 106, 0, 0.1) 0%,
    rgba(20, 30, 60, 0.6) 100%
  );
  border: 2px solid ${(props) => (props.isPopular ? theme.colors.primary.main : theme.colors.ui.border)};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  transform: ${(props) => (props.isPopular ? 'scale(1.05)' : 'scale(1)')};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 106, 0, 0.2) 0%,
      transparent 50%,
      rgba(0, 102, 204, 0.1) 100%
    );
    pointer-events: none;
  }

  &:hover {
    border-color: ${theme.colors.primary.light};
    box-shadow: ${(props) => (props.isPopular ? theme.shadows.glowHeavy : theme.shadows.glow)};
    transform: translateY(-8px) ${(props) => (props.isPopular ? 'scale(1.08)' : '')};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;
  background: ${theme.colors.primary.gradient};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  text-transform: uppercase;
  box-shadow: ${theme.shadows.glow};
`;

const IconContainer = styled.div`
  font-size: ${theme.typography.fontSize['5xl']};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  font-weight: ${theme.typography.fontWeight.bold};
  text-transform: uppercase;
`;

const PriceContainer = styled.div`
  margin-bottom: ${theme.spacing.lg};
  text-align: center;

  .price {
    font-size: ${theme.typography.fontSize['4xl']};
    font-weight: ${theme.typography.fontWeight.extrabold};
    background: ${theme.colors.primary.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.xs};
  }

  .currency {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
  }
`;

const GemsBadge = styled.div`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #FFD700;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  font-weight: ${theme.typography.fontWeight.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ButtonContainer = styled.div`
  margin-top: ${theme.spacing.lg};
`;

export const PricingCard: React.FC<PricingCardProps> = ({
  icon,
  title,
  price,
  currency,
  gems,
  discount,
  badge,
  onClick,
}) => {
  const isPopular = Boolean(discount && discount > 0);

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> | undefined = onClick
    ? (e) => {
        e.preventDefault();
        onClick();
      }
    : undefined;

  return (
    <CardContainer isPopular={isPopular} onClick={handleCardClick}>
      {badge && <Badge>{badge}</Badge>}
      {icon && <IconContainer>{icon}</IconContainer>}

      <Title>{title}</Title>
      <PriceContainer>
        <div className="price">
          <span>{price}</span>
          <span className="currency">{currency}</span>
        </div>
        {discount && (
          <div style={{ color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm }}>
            Tiết kiệm {discount}%
          </div>
        )}
      </PriceContainer>

      <GemsBadge>
        <span>💎</span>
        <span>+{gems} Gems</span>
      </GemsBadge>

      <ButtonContainer>
        <Button variant="primary" size="lg" fullWidth onClick={onClick}>
          NẠP NGAY
        </Button>
      </ButtonContainer>
    </CardContainer>
  );
};
