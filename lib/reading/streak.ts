export type ActivityMap = Record<string, number>;

function shiftDate(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function computeStreak(dates: string[], today: string): number {
  const set = new Set(dates);
  let cursor = set.has(today) ? today : shiftDate(today, -1);
  if (!set.has(cursor)) return 0;
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

export function weeklyPageCount(activity: ActivityMap, today: string): number {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    total += activity[shiftDate(today, -i)] ?? 0;
  }
  return total;
}

export function recordActivity(activity: ActivityMap, today: string): ActivityMap {
  return { ...activity, [today]: (activity[today] ?? 0) + 1 };
}

export function todayLocal(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export const WEEKLY_MISSION_TARGET = 10;