import styled from 'styled-components';
import { theme } from '@/styles/theme';

export interface RankingItem {
  rank: number;
  name: string;
  points: number;
  avatar?: string;
  badge?: React.ReactNode;
}

export interface RankingListProps {
  items: RankingItem[];
  maxItems?: number;
}

const ListContainer = styled.div`
  background: linear-gradient(135deg, rgba(20, 25, 50, 0.7) 0%, rgba(30, 40, 70, 0.5) 100%);
  border: 1px solid ${theme.colors.ui.border};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const ListItem = styled.div<{ rank: number }>`
  display: grid;
  grid-template-columns: 50px 1fr 100px;
  gap: ${theme.spacing.lg};
  align-items: center;
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.ui.border};
  transition: all ${theme.transitions.normal};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 106, 0, 0.05);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 40px 1fr 80px;
    padding: ${theme.spacing.md};
  }
`;

const RankBadge = styled.div<{ rank: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  font-weight: ${theme.typography.fontWeight.extrabold};
  font-size: ${theme.typography.fontSize.lg};
  background: ${(props) => {
    switch (props.rank) {
      case 1:
        return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
      case 2:
        return 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)';
      case 3:
        return 'linear-gradient(135deg, #CD7F32 0%, #996633 100%)';
      default:
        return theme.colors.background.card;
    }
  }};
  color: ${theme.colors.text.primary};
  box-shadow: ${(props) => {
    if (props.rank <= 3) return theme.shadows.glow;
    return 'none';
  }};
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.light});
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  overflow: hidden;
  background-size: cover;
  background-position: center;
`;

const PlayerName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.base};
`;

const Points = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary.main};
  font-size: ${theme.typography.fontSize.lg};
  justify-self: end;
`;

const Badge = styled.div`
  font-size: ${theme.typography.fontSize.sm};
`;

export const RankingList: React.FC<RankingListProps> = ({ items, maxItems }) => {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <ListContainer>
      {displayItems.map((item) => (
        <ListItem key={item.rank} rank={item.rank}>
          <RankBadge rank={item.rank}>#{item.rank}</RankBadge>

          <PlayerInfo>
            <Avatar style={{ backgroundImage: item.avatar ? `url(${item.avatar})` : undefined }}>
              {!item.avatar && item.name.charAt(0).toUpperCase()}
            </Avatar>
            <PlayerName>{item.name}</PlayerName>
          </PlayerInfo>

          <Points>
            <span>💎</span>
            <span>{item.points.toLocaleString()}</span>
            {item.badge && <Badge>{item.badge}</Badge>}
          </Points>
        </ListItem>
      ))}
    </ListContainer>
  );
};
