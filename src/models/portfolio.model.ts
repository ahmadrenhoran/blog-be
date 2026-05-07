import { pgTable, serial, varchar, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.model";

export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  short_description: jsonb("short_description"), // { en: "", id: "" }
  category: varchar("category", { length: 100 }),
  cover_image: varchar("cover_image", { length: 255 }),
  live_url: varchar("live_url", { length: 255 }),
  repo_url: varchar("repo_url", { length: 255 }),
  is_featured: boolean("is_featured").default(false),
  is_published: boolean("is_published").default(false),
  custom_fields: jsonb("custom_fields"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioSections = pgTable("portfolio_sections", {
  id: serial("id").primaryKey(),
  portfolio_id: integer("portfolio_id").references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // text, gallery, metrics, embed, timeline, faq, quote, links, video
  title: varchar("title", { length: 255 }),
  content: jsonb("content").notNull(),
  sort_order: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioMedia = pgTable("portfolio_media", {
  id: serial("id").primaryKey(),
  portfolio_id: integer("portfolio_id").references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).default('image'), // image, video
  alt: varchar("alt", { length: 255 }),
  sort_order: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  icon_url: varchar("icon_url", { length: 255 }),
  category: varchar("category", { length: 100 }),
  website_url: varchar("website_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioTools = pgTable("portfolio_tools", {
  id: serial("id").primaryKey(),
  portfolio_id: integer("portfolio_id").references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
  tool_id: integer("tool_id").references(() => tools.id, { onDelete: 'cascade' }).notNull(),
  sort_order: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// RELATIONS
export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.user_id],
    references: [users.id],
  }),
  sections: many(portfolioSections),
  media: many(portfolioMedia),
  tools: many(portfolioTools),
}));

export const portfolioSectionsRelations = relations(portfolioSections, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioSections.portfolio_id],
    references: [portfolios.id],
  }),
}));

export const portfolioMediaRelations = relations(portfolioMedia, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioMedia.portfolio_id],
    references: [portfolios.id],
  }),
}));

export const toolsRelations = relations(tools, ({ many }) => ({
  portfolios: many(portfolioTools),
}));

export const portfolioToolsRelations = relations(portfolioTools, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioTools.portfolio_id],
    references: [portfolios.id],
  }),
  tool: one(tools, {
    fields: [portfolioTools.tool_id],
    references: [tools.id],
  }),
}));
