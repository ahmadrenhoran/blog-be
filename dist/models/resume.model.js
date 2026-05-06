"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_model_1 = require("./user.model");
exports.resumes = (0, pg_core_1.pgTable)("resumes", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    user_id: (0, pg_core_1.integer)("user_id").references(() => user_model_1.users.id).notNull(),
    file_url: (0, pg_core_1.varchar)("file_url", { length: 255 }),
    file_name: (0, pg_core_1.varchar)("file_name", { length: 255 }),
    is_primary: (0, pg_core_1.boolean)("is_primary").default(false),
    uploaded_at: (0, pg_core_1.timestamp)("uploaded_at").defaultNow().notNull(),
});
