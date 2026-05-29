'use client';

import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  gap: 18px;
  align-items: flex-start;
`;

const Circle = styled.div<{ $color: string }>`
  display: grid;
  width: 80px;
  height: 80px;
  flex: 0 0 80px;
  place-items: center;
  border: 6px solid ${({ $color }) => $color};
  border-radius: 50%;
  color: ${({ $color }) => $color};
  font-size: 24px;
  font-weight: 900;
`;

export function SeoScore({ checks }: { checks: Array<{ label: string; ok: boolean }> }) {
  const score = Math.round((checks.filter((check) => check.ok).length / checks.length) * 100);
  const color = score < 40 ? '#ef4444' : score < 70 ? '#f59e0b' : score < 90 ? '#10b981' : '#22c55e';
  const label = score < 40 ? 'Poor' : score < 70 ? 'Needs Work' : score < 90 ? 'Good' : 'Excellent';

  return (
    <Wrap>
      <Circle $color={color}>{score}</Circle>
      <div>
        <strong style={{ color, display: 'block', marginBottom: 8 }}>{label}</strong>
        {checks.map((check) => (
          <div key={check.label} style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
            {check.ok ? '✓' : '✗'} {check.label}
          </div>
        ))}
      </div>
    </Wrap>
  );
}
