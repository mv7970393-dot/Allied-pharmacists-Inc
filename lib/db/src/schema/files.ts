import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const filesTable = pgTable("files", {
  id: text("id").primaryKey(),
  originalName: text("original_name").notNull(),
  objectPath: text("object_path").notNull(),
  folderId: text("folder_id").notNull(),
  size: integer("size").notNull().default(0),
  date: text("date").notNull(),
  type: text("type").notNull().default("doc"),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFileSchema = createInsertSchema(filesTable).omit({ createdAt: true });
export type InsertFile = z.infer<typeof insertFileSchema>;
export type FileRecord = typeof filesTable.$inferSelect;

export const foldersTable = pgTable("folders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFolderSchema = createInsertSchema(foldersTable).omit({ createdAt: true });
export type InsertFolder = z.infer<typeof insertFolderSchema>;
export type FolderRecord = typeof foldersTable.$inferSelect;

export const activityTable = pgTable("activity", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  action: text("action").notNull(),
  detail: text("detail").notNull().default(""),
  time: text("time").notNull(),
  timestamp: text("timestamp").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activityTable).omit({ createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type ActivityRecord = typeof activityTable.$inferSelect;
