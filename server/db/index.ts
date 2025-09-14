import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

// Initialize SQLite database
const sqlite = new Database('democracyedu.db');

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Run migrations
export const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};