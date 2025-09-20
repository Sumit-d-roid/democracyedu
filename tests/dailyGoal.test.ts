import { describe, it, expect } from 'vitest';
import { todayKey, shouldResetDaily, applyDailyIncrement } from '../client/src/lib/dailyGoal';

function d(y:number,m:number,day:number){ return new Date(y,m-1,day,12,0,0,0); }

describe('dailyGoal', () => {
  it('todayKey formats YYYY-MM-DD', () => {
    const key = todayKey(new Date(2024, 0, 9));
    expect(key).toBe('2024-01-09');
  });

  it('shouldResetDaily resets when date key differs', () => {
    expect(shouldResetDaily('2024-01-01', new Date(2024,0,2))).toBe(true);
    expect(shouldResetDaily('2024-01-02', new Date(2024,0,2))).toBe(false);
    expect(shouldResetDaily(null as any, new Date(2024,0,2))).toBe(true);
  });

  it('applyDailyIncrement resets then increments for a new day', () => {
    const prev = { dailyPoints: 5, dailyGoal: 20, dailyDate: '2024-01-01' };
    const res = applyDailyIncrement(prev, 3, d(2024,1,2));
    expect(res.dailyPoints).toBe(3);
    expect(res.dailyDate).toBe('2024-01-02');
  });

  it('applyDailyIncrement accumulates within the same day', () => {
    const key = '2024-01-02';
    const prev = { dailyPoints: 5, dailyGoal: 20, dailyDate: key };
    const res = applyDailyIncrement(prev, 4, d(2024,1,2));
    expect(res.dailyPoints).toBe(9);
    expect(res.dailyDate).toBe(key);
  });
});
