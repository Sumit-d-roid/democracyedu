import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import DailyGoalBar from '../client/src/components/DailyGoalBar';
import { ProgressProvider } from '../client/src/contexts/ProgressContext';
import { LanguageProvider } from '../client/src/contexts/LanguageContext';

// Smoke test to ensure the DailyGoalBar renders with default provider state

describe('DailyGoalBar UI', () => {
  beforeEach(() => {
    // Ensure no persisted progress interferes
    localStorage.removeItem('education-for-democracy-progress');
  });
  afterEach(() => {
    cleanup();
    localStorage.removeItem('education-for-democracy-progress');
  });

  it('renders without crashing and shows numbers', () => {
    const { getByText } = render(
      <LanguageProvider>
        <ProgressProvider>
          <DailyGoalBar />
        </ProgressProvider>
      </LanguageProvider>
    );

    // Default progress is 0/20 per ProgressContext default
    expect(getByText(/0\/20/)).toBeInTheDocument();
  });

  it('shows Completed when goal reached', () => {
    // Seed localStorage so ProgressProvider initializes with a completed daily goal
    localStorage.setItem('education-for-democracy-progress', JSON.stringify({
      totalPoints: 0,
      dailyPoints: 25,
      dailyGoal: 20,
      dailyDate: '2099-01-01',
      completedLessons: [],
      completedSections: {},
      quizScores: {},
      unlockedAchievements: [],
      perfectQuizzes: [],
      lastActiveAt: null,
      streakDays: 0,
      bestStreak: 0,
    }));

    const { getByText } = render(
      <LanguageProvider>
        <ProgressProvider>
          <DailyGoalBar />
        </ProgressProvider>
      </LanguageProvider>
    );

    expect(getByText(/Completed/i)).toBeInTheDocument();
  });
});
