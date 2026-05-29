import type { ComponentType } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  background: #1a1a24;
`;

const IconBox = styled.div<{ $color: string }>`
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  margin-bottom: 18px;
  border-radius: 12px;
  background: ${({ $color }) => `${$color}22`};
  color: ${({ $color }) => $color};
`;

const Value = styled.div`
  color: #ffffff;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
`;

const Label = styled.div`
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
`;

export function StatsCard({ color, icon: Icon, label, value }: { color: string; icon: ComponentType; label: string; value: number | string }) {
  return (
    <Card>
      <IconBox $color={color}>
        <Icon />
      </IconBox>
      <Value>{value}</Value>
      <Label>{label}</Label>
    </Card>
  );
}
