'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { TopPlayer } from './types';
import { TopPlayerCard } from './TopPlayerCard';

interface TopThreeShowcaseProps {
  players: TopPlayer[];
}

const Stage = styled.section`
  margin-top: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.18fr 1fr;
  gap: 1.25rem;
  align-items: end;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
`;

const Slot = styled.div<{ $rank: number }>`
  align-self: ${(props) => (props.$rank === 1 ? 'start' : 'end')};
`;

export function TopThreeShowcase({ players }: TopThreeShowcaseProps) {
  const rank2 = players.find((player) => player.rank === 2);
  const rank1 = players.find((player) => player.rank === 1);
  const rank3 = players.find((player) => player.rank === 3);

  const orderedPlayers = [rank2, rank1, rank3].filter((player): player is TopPlayer => Boolean(player));

  return (
    <Stage>
      <Grid>
        {orderedPlayers.map((player) => (
          <Slot key={player.rank} $rank={player.rank}>
            <TopPlayerCard player={player} />
          </Slot>
        ))}
      </Grid>
    </Stage>
  );
}
