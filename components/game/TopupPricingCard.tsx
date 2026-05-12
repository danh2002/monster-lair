'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { theme } from '@/styles/theme';
import { FaGem } from '@react-icons/all-files/fa/FaGem';
import { useTranslations } from 'next-intl';

export interface TopupPricingCardProps {
  title: string;
  price: string;
  gems: number;
  image: string;
  badge?: string;
  onClick?: () => void;
}

const CardContainer = styled.div`
  position: relative;
  overflow: hidden;
  border: 1px solid ${theme.colors.primary.main};
  background: rgba(20, 20, 20, 0.9);
  border-radius: 8px;
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    border-color: #ff8533;
    box-shadow: 0 0 20px rgba(255, 106, 0, 0.4);
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(40, 15, 10, 0.6), rgba(25, 12, 35, 0.6));

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
    transition: opacity ${theme.transitions.normal};
  }

  ${CardContainer}:hover & img {
    opacity: 1;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${theme.colors.primary.main};
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
  z-index: 10;
`;

const ContentContainer = styled.div`
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.3;
  min-height: 26px;
  display: flex;
  align-items: center;
  justify-content: center; 
  text-align: center;
`;

const GemsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(255, 215, 0, 0.08);
  border-radius: 4px;
`;

const GemsText = styled.span`
  color: #ffd700;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PriceContainer = styled.div`
  margin-bottom: 12px;
  text-align: center;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.primary.main};
  letter-spacing: 0.5px;
`;

const Button = styled.button`
  background: ${theme.colors.primary.main};
  color: #fff;
  border: none;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
  letter-spacing: 0.5px;
  font-style: italic;

  &:hover {
    background: #ff8533;
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
  }

  &:active {
    background: #e55a00;
  }
`;

export const TopupPricingCard: React.FC<TopupPricingCardProps> = ({
  title,
  price,
  gems,
  image,
  badge,
  onClick,
}) => {
  const t = useTranslations('topupPricingCard');
  return (
    <CardContainer onClick={onClick}>
      <ImageContainer>
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
        {badge && <Badge>{badge}</Badge>}
      </ImageContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <GemsContainer>
          <GemsText>
            <FaGem />
            {gems}
          </GemsText>
        </GemsContainer>
        <PriceContainer>
          <Price>{price} {t('currency')}</Price>
        </PriceContainer>
        <Button>{t('topupNow')}</Button>
      </ContentContainer>
    </CardContainer>
  );
};
