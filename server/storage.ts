import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { users, userProgress, quizResults, userAchievements, bookmarks } from './db/schema';
import { randomUUID } from 'crypto';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: { username: string; password: string }): Promise<any>;
  
  // Progress methods
  getUserProgress(userId: string, lessonId: string): Promise<any>;
  updateUserProgress(userId: string, lessonId: string, progress: number): Promise<any>;
  markLessonComplete(userId: string, lessonId: string): Promise<any>;
  
  // Quiz methods
  saveQuizResult(userId: string, quizId: string, score: number, totalQuestions: number, correctAnswers: number): Promise<any>;
  getQuizResults(userId: string, quizId: string): Promise<any>;
  
  // Achievement methods
  unlockAchievement(userId: string, achievementId: string): Promise<any>;
  getUserAchievements(userId: string): Promise<any>;
  
  // Bookmark methods
  addBookmark(userId: string, lessonId: string): Promise<any>;
  removeBookmark(userId: string, lessonId: string): Promise<any>;
  getBookmarks(userId: string): Promise<any>;
}

export class SqliteStorage implements IStorage {
  async getUser(id: string) {
    return await db.select().from(users).where(eq(users.id, id)).get();
  }

  async getUserByUsername(username: string) {
    return await db.select().from(users).where(eq(users.username, username)).get();
  }

  async createUser(userData: { username: string; password: string }) {
    const id = randomUUID();
    await db.insert(users).values({ ...userData, id });
    return this.getUser(id);
  }

  async getUserProgress(userId: string, lessonId: string) {
    return await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.lessonId, lessonId)
        )
      )
      .get();
  }

  async updateUserProgress(userId: string, lessonId: string, progress: number) {
    const existing = await this.getUserProgress(userId, lessonId);
    const id = existing?.id || randomUUID();
    
    if (existing) {
      await db
        .update(userProgress)
        .set({ progress })
        .where(eq(userProgress.id, id));
    } else {
      await db
        .insert(userProgress)
        .values({ id, userId, lessonId, progress });
    }
    
    return this.getUserProgress(userId, lessonId);
  }

  async markLessonComplete(userId: string, lessonId: string) {
    const existing = await this.getUserProgress(userId, lessonId);
    const id = existing?.id || randomUUID();
    
    if (existing) {
      await db
        .update(userProgress)
        .set({ progress: 100, completed: true })
        .where(eq(userProgress.id, id));
    } else {
      await db
        .insert(userProgress)
        .values({ id, userId, lessonId, progress: 100, completed: true });
    }
    
    return this.getUserProgress(userId, lessonId);
  }

  async saveQuizResult(
    userId: string,
    quizId: string,
    score: number,
    totalQuestions: number,
    correctAnswers: number
  ) {
    const id = randomUUID();
    await db.insert(quizResults).values({
      id,
      userId,
      quizId,
      score,
      totalQuestions,
      correctAnswers,
    });
    return this.getQuizResults(userId, quizId);
  }

  async getQuizResults(userId: string, quizId: string) {
    return await db
      .select()
      .from(quizResults)
      .where(and(eq(quizResults.userId, userId), eq(quizResults.quizId, quizId)))
      .all();
  }

  async unlockAchievement(userId: string, achievementId: string) {
    // Check if achievement already exists
    const existing = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        )
      )
      .get();
    
    if (!existing) {
      const id = randomUUID();
      await db
        .insert(userAchievements)
        .values({ id, userId, achievementId });
    }
    
    return this.getUserAchievements(userId);
  }

  async getUserAchievements(userId: string) {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .all();
  }

  async addBookmark(userId: string, lessonId: string) {
    // Check if bookmark already exists
    const existing = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.lessonId, lessonId)
        )
      )
      .get();
    
    if (!existing) {
      const id = randomUUID();
      await db
        .insert(bookmarks)
        .values({ id, userId, lessonId });
    }
    
    return this.getBookmarks(userId);
  }

  async removeBookmark(userId: string, lessonId: string) {
    await db
      .delete(bookmarks)
      .where(
        and(eq(bookmarks.userId, userId), eq(bookmarks.lessonId, lessonId))
      );
  }

  async getBookmarks(userId: string) {
    return await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .all();
  }
}

export const storage = new SqliteStorage();
