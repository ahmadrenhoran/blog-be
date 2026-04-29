"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posts = exports.statusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_model_1 = require("./user.model");
const pg_core_2 = require("drizzle-orm/pg-core");
const pg_core_3 = require("drizzle-orm/pg-core");
const pg_core_4 = require("drizzle-orm/pg-core");
exports.statusEnum = (0, pg_core_4.pgEnum)('post_status', ['draft', 'published']);
exports.posts = (0, pg_core_1.pgTable)("posts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    user_id: (0, pg_core_2.integer)("user_id").references(() => user_model_1.users.id),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 255 }).unique().notNull(),
    status: (0, exports.statusEnum)("status").default('draft').notNull(),
    excerpt: (0, pg_core_1.text)("excerpt"),
    content: (0, pg_core_1.text)("content"),
    coverImage: (0, pg_core_1.varchar)("cover_image").notNull(),
    updatedAt: (0, pg_core_3.timestamp)("updated_at").defaultNow().notNull(),
    createdAt: (0, pg_core_3.timestamp)("created_at").defaultNow().notNull(),
});
