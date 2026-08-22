import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cmsContent = sqliteTable("cms_content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const agendaEvents = sqliteTable("agenda_events", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  day: text("day").notNull(),
  month: text("month").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  detail: text("detail").notNull(),
  tone: text("tone").notNull(),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const newsPosts = sqliteTable("news_posts", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  readTime: text("read_time").notNull(),
  image: text("image").notNull(),
  publishedAt: text("published_at").notNull(),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const cmsSessions = sqliteTable("cms_sessions", {
  token: text("token").primaryKey(),
  email: text("email").notNull(),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
});
