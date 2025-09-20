export interface StreakState {
  lastActiveAt?: number | null; // ms epoch
  streakDays: number; // current consecutive days
  bestStreak: number; // longest
}

export interface StreakUpdateResult extends StreakState {
  changed: boolean; // whether streakDays changed this call
}

// Normalize a date to local midnight (00:00) for day-diff calculations
export function normalizeDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function diffInDays(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const na = normalizeDate(a).getTime();
  const nb = normalizeDate(b).getTime();
  return Math.round((na - nb) / msPerDay);
}

/**
 * Update streak given previous state and an activity timestamp (now).
 * Rules:
 * - First activity: streak=1
 * - Same day: no change
 * - Next day: streak+1
 * - Gap > 1 day: reset to 1
 */
export function updateStreak(prev: StreakState, now: number = Date.now()): StreakUpdateResult {
  const last = prev.lastActiveAt ?? null;
  const nowDate = new Date(now);

  if (!last) {
    const streakDays = 1;
    const bestStreak = Math.max(prev.bestStreak ?? 0, streakDays);
    return { lastActiveAt: now, streakDays, bestStreak, changed: true };
  }

  const lastDate = new Date(last);
  const days = diffInDays(nowDate, lastDate);

  if (days <= 0) {
    // Same day or earlier (clock skew): no change, but update lastActiveAt to max
    const lastActiveAt = Math.max(last, now);
    return { lastActiveAt, streakDays: prev.streakDays, bestStreak: prev.bestStreak, changed: false };
  }

  let streakDays = 1;
  if (days === 1) {
    streakDays = (prev.streakDays || 0) + 1;
  } else {
    // Missed at least one day; reset to 1
    streakDays = 1;
  }
  const bestStreak = Math.max(prev.bestStreak || 0, streakDays);
  return { lastActiveAt: now, streakDays, bestStreak, changed: true };
}
