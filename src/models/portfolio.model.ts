import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }),
  description: jsonb("description"), // Stores multi-language descriptions
  image_url: varchar("image_url", { length: 255 }),
  tech_stack: text("tech_stack").array(), // array of strings
  demo_url: varchar("demo_url", { length: 255 }),
  repo_url: varchar("repo_url", { length: 255 }),
  is_featured: boolean("is_featured").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
