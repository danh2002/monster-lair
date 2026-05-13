export type RankingCategory = 'topup' | 'arena' | 'daily' | 'weekly';

export interface TopPlayer {
  rank: 1 | 2 | 3;
  username: string;
  clan: string;
  value: number;
  rewardPreview: {
    coin: number;
    ruby: number;
    fang: number;
  };
  avatar: string;
}

export interface RankingEntry {
  rank: number;
  trend: 'up' | 'down' | 'same';
  trendValue: number;
  username: string;
  clan: string;
  value: number;
  winStreak: number;
  title: string;
  reward: number;
  status: 'online' | 'battle' | 'offline';
  avatar: string;
}

export interface RewardCardItem {
  tier: string;
  coin: number;
  skin: string;
  badge: string;
  title: string;
  frame: string;
  image: string;
}

export interface HallOfFameItem {
  username: string;
  season: string;
  achievement: string;
  value: number;
  avatar: string;
}

export interface RankingDataset {
  topPlayers: TopPlayer[];
  entries: RankingEntry[];
}
