import { HallOfFameItem, RankingCategory, RankingDataset, RewardCardItem } from './types';

const avatar = '/images/rank-avatar.webp';

const topupData: RankingDataset = {
  topPlayers: [
    { rank: 2, username: 'DragonHunter', clan: 'Alpha Squad', value: 2450000, rewardPreview: { coin: 50000, ruby: 3, fang: 1 }, avatar },
    { rank: 1, username: 'KingRex', clan: 'Apex Predator', value: 5750000, rewardPreview: { coin: 150000, ruby: 10, fang: 1 }, avatar },
    { rank: 3, username: 'JurassicGod', clan: 'Titan Warriors', value: 1890000, rewardPreview: { coin: 30000, ruby: 2, fang: 1 }, avatar },
  ],
  entries: [
    { rank: 4, trend: 'up', trendValue: 2, username: 'DinoMaster', clan: 'Savage Hunters', value: 1250000, winStreak: 12, titleKey: 'title_warrior', reward: 20000, status: 'online', avatar },
    { rank: 5, trend: 'down', trendValue: 1, username: 'FossilBreaker', clan: 'Prehistoric Force', value: 980000, winStreak: 8, titleKey: 'title_hunter', reward: 15000, status: 'online', avatar },
    { rank: 6, trend: 'up', trendValue: 3, username: 'RaptorOne', clan: 'Raptor Squad', value: 750000, winStreak: 7, titleKey: 'title_hunter', reward: 10000, status: 'battle', avatar },
    { rank: 7, trend: 'down', trendValue: 2, username: 'TyrantKing', clan: 'Dino Legends', value: 650000, winStreak: 6, titleKey: 'title_warrior', reward: 8000, status: 'online', avatar },
    { rank: 8, trend: 'same', trendValue: 0, username: 'MegaClaw', clan: 'Jurassic Pack', value: 520000, winStreak: 5, titleKey: 'title_hunter', reward: 5000, status: 'offline', avatar },
    { rank: 9, trend: 'up', trendValue: 1, username: 'AncientBeast', clan: 'Beast Mode', value: 410000, winStreak: 4, titleKey: 'title_recruit', reward: 3000, status: 'online', avatar },
    { rank: 10, trend: 'down', trendValue: 1, username: 'DinoWarrior', clan: 'Alpha Squad', value: 320000, winStreak: 3, titleKey: 'title_recruit', reward: 3000, status: 'offline', avatar },
  ],
};

const arenaData: RankingDataset = {
  ...topupData,
  topPlayers: topupData.topPlayers.map((p) => ({ ...p, value: Math.round(p.value * 0.78) })),
  entries: topupData.entries.map((e, i) => ({ ...e, value: Math.round(e.value * 0.8), winStreak: Math.max(2, e.winStreak - (i % 3)) })),
};

const dailyData: RankingDataset = {
  ...topupData,
  topPlayers: topupData.topPlayers.map((p) => ({ ...p, value: Math.round(p.value * 0.22) })),
  entries: topupData.entries.map((e, i) => ({ ...e, value: Math.round(e.value * 0.26), winStreak: Math.max(1, e.winStreak - (i % 4)) })),
};

const weeklyData: RankingDataset = {
  ...topupData,
  topPlayers: topupData.topPlayers.map((p) => ({ ...p, value: Math.round(p.value * 0.44) })),
  entries: topupData.entries.map((e, i) => ({ ...e, value: Math.round(e.value * 0.48), winStreak: Math.max(1, e.winStreak - (i % 2)) })),
};

export const rankingByCategory: Record<RankingCategory, RankingDataset> = {
  topup: topupData,
  arena: arenaData,
  daily: dailyData,
  weekly: weeklyData,
};

export const rewardCards: RewardCardItem[] = [
  { tier: 'Top 1', coin: 150000, skinKey: 'exclusive_skins', badgeKey: 'gold_title_badge', frameKey: 'gold_avatar_frame', image: '/images/hero-dinosaur.png' },
  { tier: 'Top 2', coin: 80000, skinKey: 'rare_skins', badgeKey: 'silver_title_badge', frameKey: 'silver_avatar_frame', image: '/images/feature-herd.webp' },
  { tier: 'Top 3', coin: 40000, skinKey: 'rare_skins', badgeKey: 'bronze_title_badge', frameKey: 'bronze_portrait', image: '/images/feature-war.jpg' },
];

export const hallOfFameData: HallOfFameItem[] = [
  { username: 'DinoEmperor', seasonKey: 'season_alpha_s1', achievementKey: 'season_champion', value: 5200000, avatar },
  { username: 'RexLegend', seasonKey: 'season_alpha_s0', achievementKey: 'arena_king', value: 4850000, avatar },
  { username: 'AlphaHunter', seasonKey: 'season_alpha_s0', achievementKey: 'topup_champion', value: 4120000, avatar },
  { username: 'JurassicKing', seasonKey: 'season_alpha_s0', achievementKey: 'battlefield_commander', value: 3650000, avatar },
  { username: 'DinoWarrior', seasonKey: 'season_alpha_s0', achievementKey: 'survival_master', value: 3200000, avatar },
];
