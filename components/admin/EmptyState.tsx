'use client';

import type { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display: grid;
  min-height: 320px;
  place-items: center;
  padding: 48px 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
  text-align: center;
`;

const IconBox = styled.div`
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  margin: 0 auto 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.25);
  font-size: 34px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
`;

const Text = styled.p`
  margin: 8px 0 20px;
  color: rgba(255, 255, 255, 0.55);
`;

export function EmptyState({
  action,
  description,
  icon: Icon,
  title,
}: {
  action?: ReactNode;
  description: string;
  icon: ComponentType;
  title: string;
}) {
  return (
    <Wrap>
      <div>
        <IconBox>
          <Icon />
        </IconBox>
        <Title>{title}</Title>
        <Text>{description}</Text>
        {action}
      </div>
    </Wrap>
  );
}
