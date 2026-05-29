import Link from 'next/link';
import type { ComponentType } from 'react';
import styled from 'styled-components';
import { FaEllipsisH } from '@react-icons/all-files/fa/FaEllipsisH';

const Card = styled(Link)`
  position: relative;
  display: block;
  min-height: 176px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.45);
    background: #1f1f2e;
    transform: translateY(-2px);
  }
`;

const IconBox = styled.div<{ $color: string }>`
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  margin-bottom: 16px;
  border-radius: 12px;
  background: ${({ $color }) => `${$color}22`};
  color: ${({ $color }) => $color};
`;

const Menu = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  color: rgba(255, 255, 255, 0.35);
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: 850;
`;

const Description = styled.p`
  display: -webkit-box;
  min-height: 38px;
  margin: 12px 0 16px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: rgba(255, 255, 255, 0.52);
  font-size: 13px;
  line-height: 1.45;
`;

const Footer = styled.div`
  color: rgba(255, 255, 255, 0.52);
  font-size: 13px;
`;

export function CollectionCard({
  color,
  count,
  description,
  href,
  icon: Icon,
  title,
}: {
  color: string;
  count: number | string;
  description: string;
  href: string;
  icon: ComponentType;
  title: string;
}) {
  return (
    <Card href={href}>
      <Menu>
        <FaEllipsisH />
      </Menu>
      <IconBox $color={color}>
        <Icon />
      </IconBox>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Footer>{count} entries</Footer>
    </Card>
  );
}
