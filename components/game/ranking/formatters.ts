export function formatRewardAmount(value: number) {
  return Math.round(value / 1000).toLocaleString();
}
