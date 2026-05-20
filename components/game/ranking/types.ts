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
  titleKey: 'title_warrior' | 'title_hunter' | 'title_recruit';
  reward: number;
  status: 'online' | 'battle' | 'offline';
  avatar: string;
}

export interface RewardCardItem {
  tier: string;
  coin: number;
  skinKey: 'exclusive_skins' | 'rare_skins';
  badgeKey: 'gold_title_badge' | 'silver_title_badge' | 'bronze_title_badge';
  frameKey: 'gold_avatar_frame' | 'silver_avatar_frame' | 'bronze_portrait';
  image: string;
}

export interface HallOfFameItem {
  username: string;
  seasonKey: 'season_alpha_s1' | 'season_alpha_s0';
  achievementKey: 'season_champion' | 'arena_king' | 'topup_champion' | 'battlefield_commander' | 'survival_master';
  value: number;
  avatar: string;
}

export interface RankingDataset {
  topPlayers: TopPlayer[];
  entries: RankingEntry[];
}
