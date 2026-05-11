export interface BattleCardProps {
  faction1: FactionData;
  faction2: FactionData;
  animated?: boolean;
  onViewDetails?: () => void;
}

export interface FactionData {
  name: string;
  players: number;
  score: number;
  maxScore?: number;
  color: 'red' | 'blue';
}

export interface RankingItem {
  rank: number;
  name: string;
  points: number;
  avatar?: string;
  badge?: React.ReactNode;
}

export interface PricingPackage {
  id: string;
  title: string;
  price: string;
  currency: string;
  gems: number;
  discount?: number;
  badge?: string;
}

export interface Order {
  id: string;
  date: string;
  price: string;
  gems: number;
  status: 'success' | 'pending' | 'failed';
}
