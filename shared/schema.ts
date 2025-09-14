import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// createInsertSchema(users) returns a Zod object containing all columns.
// Use the shape to safely pick just the fields needed instead of boolean map (TS was inferring never)
const fullUserInsert = createInsertSchema(users);
// drizzle-zod's return type doesn't expose shape properties strongly; use internal _def.shape with a safe cast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userShape: any = (fullUserInsert as any)._def.shape();
export const insertUserSchema = z.object({
  username: userShape.username,
  password: userShape.password,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
