import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";
import { users } from "./user.model";
import { integer } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum('post_status', ['draft', 'published'])

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  status: statusEnum("status").default('draft').notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImage: varchar("cover_image").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
