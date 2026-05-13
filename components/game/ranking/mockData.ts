import { HallOfFameItem, RankingCategory, RankingDataset, RewardCardItem } from './types';

const avatar = '/images/rank-avatar.webp';

const topupData: RankingDataset = {
  topPlayers: [
    { rank: 2, username: 'DragonHunter', clan: 'Alpha Squad', value: 2450000, rewardPreview: { coin: 50000, ruby: 3, fang: 1 }, avatar },
    { rank: 1, username: 'KingRex', clan: 'Apex Predator', value: 5750000, rewardPreview: { coin: 150000, ruby: 10, fang: 1 }, avatar },
    { rank: 3, username: 'JurassicGod', clan: 'Titan Warriors', value: 1890000, rewardPreview: { coin: 30000, ruby: 2, fang: 1 }, avatar },
  ],
  entries: [
    { rank: 4, trend: 'up', trendValue: 2, username: 'DinoMaster', clan: 'Savage Hunters', value: 1250000, winStreak: 12, title: 'Chiến Binh', reward: 20000, status: 'online', avatar },
    { rank: 5, trend: 'down', trendValue: 1, username: 'FossilBreaker', clan: 'Prehistoric Force', value: 980000, winStreak: 8, title: 'Thợ Săn', reward: 15000, status: 'online', avatar },
    { rank: 6, trend: 'up', trendValue: 3, username: 'RaptorOne', clan: 'Raptor Squad', value: 750000, winStreak: 7, title: 'Thợ Săn', reward: 10000, status: 'battle', avatar },
    { rank: 7, trend: 'down', trendValue: 2, username: 'TyrantKing', clan: 'Dino Legends', value: 650000, winStreak: 6, title: 'Chiến Binh', reward: 8000, status: 'online', avatar },
    { rank: 8, trend: 'same', trendValue: 0, username: 'MegaClaw', clan: 'Jurassic Pack', value: 520000, winStreak: 5, title: 'Thợ Săn', reward: 5000, status: 'offline', avatar },
    { rank: 9, trend: 'up', trendValue: 1, username: 'AncientBeast', clan: 'Beast Mode', value: 410000, winStreak: 4, title: 'Tân Binh', reward: 3000, status: 'online', avatar },
    { rank: 10, trend: 'down', trendValue: 1, username: 'DinoWarrior', clan: 'Alpha Squad', value: 320000, winStreak: 3, title: 'Tân Binh', reward: 3000, status: 'offline', avatar },
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
  { tier: 'Top 1', coin: 150000, skin: 'Skin Độc Quyền', badge: 'Danh Hiệu Vàng', title: 'Apex Chúa Tể', frame: 'Khung Avatar Hoàng Kim', image: '/images/hero-dinosaur.png' },
  { tier: 'Top 2', coin: 80000, skin: 'Skin Hiếm', badge: 'Danh Hiệu Bạc', title: 'Lãnh Chúa Cổ Đại', frame: 'Khung Avatar Bạc', image: '/images/feature-herd.webp' },
  { tier: 'Top 3', coin: 40000, skin: 'Skin Hiếm', badge: 'Danh Hiệu Đồng', title: 'Bão Chủ Săn Mồi', frame: 'Khung Avatar Đồng', image: '/images/feature-war.jpg' },
  { tier: 'Top 10', coin: 5000, skin: 'Vật Phẩm Ngẫu Nhiên', badge: 'Danh Hiệu', title: 'Truy Sát Tinh Anh', frame: 'Khung Avatar', image: '/images/trailer-dinosaur.webp' },
];

export const hallOfFameData: HallOfFameItem[] = [
  { username: 'DinoEmperor', season: 'Mùa Săn Alpha S1', achievement: 'Nhà Vô Địch Tổng BXH', value: 5200000, avatar },
  { username: 'RexLegend', season: 'Mùa Săn Alpha S0', achievement: 'Vua Lôi Đài', value: 4850000, avatar },
  { username: 'AlphaHunter', season: 'Mùa Săn Alpha S0', achievement: 'Chúa Tể Nạp Game', value: 4120000, avatar },
  { username: 'JurassicKing', season: 'Mùa Săn Alpha S0', achievement: 'Thống Lĩnh Chiến Trường', value: 3650000, avatar },
  { username: 'DinoWarrior', season: 'Mùa Săn Alpha S0', achievement: 'Bậc Thầy Sinh Tồn', value: 3200000, avatar },
];
