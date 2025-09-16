// API client for progress tracking endpoints

const API_BASE = '/api/v1';

export interface LessonProgressRequest {
  lessonId: string;
  userId: string;
  completed?: boolean;
}

export interface QuizResultRequest {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface ProgressResponse {
  status: string;
  message?: string;
  progress?: any;
  result?: any;
}

export interface UserProgressData {
  completedLessons: string[];
  quizResults: { id: string; score: number; totalQuestions: number }[];
  achievements: string[];
}

class ProgressAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        credentials: 'same-origin',
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}. Response: ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          'Network error: Unable to connect to server. Please check if the server is running.'
        );
      }
      throw error;
    }
  }

  async markLessonComplete(data: LessonProgressRequest): Promise<ProgressResponse> {
    return this.request<ProgressResponse>('/progress/lesson', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async recordQuizResult(data: QuizResultRequest): Promise<ProgressResponse> {
    return this.request<ProgressResponse>('/progress/quiz', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserProgress(userId: string): Promise<{ status: string; data: UserProgressData }> {
    return this.request<{ status: string; data: UserProgressData }>(`/progress/${userId}`);
  }

  // Utility to generate a temporary user ID for demo purposes
  getUserId(): string {
    let userId = localStorage.getItem('demo-user-id');
    if (!userId) {
      userId = `demo-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('demo-user-id', userId);
    }
    return userId;
  }
}

export const progressAPI = new ProgressAPI();
