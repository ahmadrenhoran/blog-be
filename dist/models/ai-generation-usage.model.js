"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiGenerationUsages = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_model_1 = require("./user.model");
exports.aiGenerationUsages = (0, pg_core_1.pgTable)("ai_generation_usages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    user_id: (0, pg_core_1.integer)("user_id")
        .references(() => user_model_1.users.id)
        .notNull(),
    usageDate: (0, pg_core_1.date)("usage_date").notNull(),
    count: (0, pg_core_1.integer)("count").default(0).notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => ({
    userDateIdx: (0, pg_core_1.uniqueIndex)("ai_generation_usages_user_date_idx").on(table.user_id, table.usageDate),
}));
