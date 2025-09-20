import { describe, it, expect } from 'vitest';
import { updateStreak, diffInDays, normalizeDate } from '../client/src/lib/streak';

function msAt(y:number,m:number,d:number){
  return new Date(y,m-1,d,12,0,0,0).getTime();
}

describe('streak utils', () => {
  it('normalizeDate zeros time', () => {
    const d = new Date(2024, 0, 15, 18, 30);
    const n = normalizeDate(d);
    expect(n.getHours()).toBe(0);
    expect(n.getMinutes()).toBe(0);
  });

  it('diffInDays handles next day and gaps', () => {
    const a = new Date(2024,0,10);
    const b = new Date(2024,0,9);
    expect(diffInDays(a,b)).toBe(1);
    const c = new Date(2024,0,1);
    expect(diffInDays(a,c)).toBe(9);
  });

  it('starts streak from 1 when no lastActiveAt', () => {
    const res = updateStreak({ lastActiveAt: null, streakDays: 0, bestStreak: 0 }, msAt(2024,1,10));
    expect(res.streakDays).toBe(1);
    expect(res.bestStreak).toBe(1);
    expect(res.changed).toBe(true);
  });

  it('does not increment when same day', () => {
    const day = msAt(2024,1,10);
    const first = updateStreak({ lastActiveAt: null, streakDays: 0, bestStreak: 0 }, day);
    const second = updateStreak(first, msAt(2024,1,10));
    expect(second.streakDays).toBe(1);
    expect(second.changed).toBe(false);
  });

  it('increments on next day', () => {
    const day1 = msAt(2024,1,10);
    const day2 = msAt(2024,1,11);
    const s1 = updateStreak({ lastActiveAt: null, streakDays: 0, bestStreak: 0 }, day1);
    const s2 = updateStreak(s1, day2);
    expect(s2.streakDays).toBe(2);
    expect(s2.bestStreak).toBe(2);
  });

  it('resets after a gap', () => {
    const day1 = msAt(2024,1,10);
    const day3 = msAt(2024,1,12);
    const s1 = updateStreak({ lastActiveAt: null, streakDays: 0, bestStreak: 0 }, day1);
    const s2 = updateStreak(s1, day3);
    expect(s2.streakDays).toBe(1);
    expect(s2.bestStreak).toBe(1);
  });
});
