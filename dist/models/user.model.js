"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_2.pgTable)('users', {
    id: (0, pg_core_2.serial)('id').primaryKey(),
    email: (0, pg_core_2.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_2.text)('password').notNull(),
    name: (0, pg_core_2.varchar)('name', { length: 255 }).notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
