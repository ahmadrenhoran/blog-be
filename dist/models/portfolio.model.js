"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolios = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_model_1 = require("./user.model");
exports.portfolios = (0, pg_core_1.pgTable)("portfolios", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    user_id: (0, pg_core_1.integer)("user_id").references(() => user_model_1.users.id).notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }),
    description: (0, pg_core_1.jsonb)("description"), // Stores multi-language descriptions
    image_url: (0, pg_core_1.varchar)("image_url", { length: 255 }),
    tech_stack: (0, pg_core_1.text)("tech_stack").array(), // array of strings
    demo_url: (0, pg_core_1.varchar)("demo_url", { length: 255 }),
    repo_url: (0, pg_core_1.varchar)("repo_url", { length: 255 }),
    is_featured: (0, pg_core_1.boolean)("is_featured").default(false),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
