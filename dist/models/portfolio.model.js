"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioToolsRelations = exports.toolsRelations = exports.portfolioMediaRelations = exports.portfolioSectionsRelations = exports.portfoliosRelations = exports.portfolioTools = exports.tools = exports.portfolioMedia = exports.portfolioSections = exports.portfolios = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_model_1 = require("./user.model");
exports.portfolios = (0, pg_core_1.pgTable)("portfolios", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    user_id: (0, pg_core_1.integer)("user_id").references(() => user_model_1.users.id).notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 255 }).unique().notNull(),
    short_description: (0, pg_core_1.jsonb)("short_description"), // { en: "", id: "" }
    category: (0, pg_core_1.varchar)("category", { length: 100 }),
    cover_image: (0, pg_core_1.varchar)("cover_image", { length: 255 }),
    live_url: (0, pg_core_1.varchar)("live_url", { length: 255 }),
    repo_url: (0, pg_core_1.varchar)("repo_url", { length: 255 }),
    is_featured: (0, pg_core_1.boolean)("is_featured").default(false),
    is_published: (0, pg_core_1.boolean)("is_published").default(false),
    custom_fields: (0, pg_core_1.jsonb)("custom_fields"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.portfolioSections = (0, pg_core_1.pgTable)("portfolio_sections", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    portfolio_id: (0, pg_core_1.integer)("portfolio_id").references(() => exports.portfolios.id, { onDelete: 'cascade' }).notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 50 }).notNull(), // text, gallery, metrics, embed, timeline, faq, quote, links, video
    title: (0, pg_core_1.varchar)("title", { length: 255 }),
    content: (0, pg_core_1.jsonb)("content").notNull(),
    sort_order: (0, pg_core_1.integer)("sort_order").default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.portfolioMedia = (0, pg_core_1.pgTable)("portfolio_media", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    portfolio_id: (0, pg_core_1.integer)("portfolio_id").references(() => exports.portfolios.id, { onDelete: 'cascade' }).notNull(),
    url: (0, pg_core_1.varchar)("url", { length: 255 }).notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 50 }).default('image'), // image, video
    alt: (0, pg_core_1.varchar)("alt", { length: 255 }),
    sort_order: (0, pg_core_1.integer)("sort_order").default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.tools = (0, pg_core_1.pgTable)("tools", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 100 }).unique().notNull(),
    icon_url: (0, pg_core_1.varchar)("icon_url", { length: 255 }),
    category: (0, pg_core_1.varchar)("category", { length: 100 }),
    website_url: (0, pg_core_1.varchar)("website_url", { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.portfolioTools = (0, pg_core_1.pgTable)("portfolio_tools", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    portfolio_id: (0, pg_core_1.integer)("portfolio_id").references(() => exports.portfolios.id, { onDelete: 'cascade' }).notNull(),
    tool_id: (0, pg_core_1.integer)("tool_id").references(() => exports.tools.id, { onDelete: 'cascade' }).notNull(),
    sort_order: (0, pg_core_1.integer)("sort_order").default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// RELATIONS
exports.portfoliosRelations = (0, drizzle_orm_1.relations)(exports.portfolios, ({ one, many }) => ({
    user: one(user_model_1.users, {
        fields: [exports.portfolios.user_id],
        references: [user_model_1.users.id],
    }),
    sections: many(exports.portfolioSections),
    media: many(exports.portfolioMedia),
    tools: many(exports.portfolioTools),
}));
exports.portfolioSectionsRelations = (0, drizzle_orm_1.relations)(exports.portfolioSections, ({ one }) => ({
    portfolio: one(exports.portfolios, {
        fields: [exports.portfolioSections.portfolio_id],
        references: [exports.portfolios.id],
    }),
}));
exports.portfolioMediaRelations = (0, drizzle_orm_1.relations)(exports.portfolioMedia, ({ one }) => ({
    portfolio: one(exports.portfolios, {
        fields: [exports.portfolioMedia.portfolio_id],
        references: [exports.portfolios.id],
    }),
}));
exports.toolsRelations = (0, drizzle_orm_1.relations)(exports.tools, ({ many }) => ({
    portfolios: many(exports.portfolioTools),
}));
exports.portfolioToolsRelations = (0, drizzle_orm_1.relations)(exports.portfolioTools, ({ one }) => ({
    portfolio: one(exports.portfolios, {
        fields: [exports.portfolioTools.portfolio_id],
        references: [exports.portfolios.id],
    }),
    tool: one(exports.tools, {
        fields: [exports.portfolioTools.tool_id],
        references: [exports.tools.id],
    }),
}));
