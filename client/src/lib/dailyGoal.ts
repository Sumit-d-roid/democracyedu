export interface DailyState {
  dailyPoints: number;
  dailyGoal: number; // target
  dailyDate?: string | null; // YYYY-MM-DD
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function shouldResetDaily(currentKey: string | null | undefined, now: Date = new Date()): boolean {
  if (!currentKey) return true;
  return currentKey !== todayKey(now);
}

export function applyDailyIncrement(prev: DailyState, amount: number, now: Date = new Date()): DailyState {
  const key = todayKey(now);
  const reset = shouldResetDaily(prev.dailyDate ?? null, now);
  const base = reset ? 0 : (prev.dailyPoints || 0);
  const next = base + amount;
  return {
    ...prev,
    dailyPoints: next,
    dailyDate: key,
    dailyGoal: prev.dailyGoal || 20, // default goal if unset
  };
}
