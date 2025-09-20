import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { LanguageProvider } from '../client/src/contexts/LanguageContext';
import { ProgressProvider } from '../client/src/contexts/ProgressContext';
import ProgressPage from '../client/src/components/ProgressDashboard';

describe('Daily goal setting', () => {
  beforeEach(() => {
    localStorage.removeItem('education-for-democracy-progress');
  });

  it('allows changing daily goal target', () => {
    act(() => {
      render(
        <LanguageProvider>
          <ProgressProvider>
            <ProgressPage />
          </ProgressProvider>
        </LanguageProvider>
      );
    });

  const input = screen.getByTestId('input-daily-goal') as HTMLInputElement;
    expect(input.value).toBe('20');
    fireEvent.change(input, { target: { value: '30' } });
    expect(input.value).toBe('30');
  });
});
