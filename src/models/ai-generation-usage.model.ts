import { date, integer, pgTable, serial, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const aiGenerationUsages = pgTable(
  "ai_generation_usages",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .references(() => users.id)
      .notNull(),
    usageDate: date("usage_date").notNull(),
    count: integer("count").default(0).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userDateIdx: uniqueIndex("ai_generation_usages_user_date_idx").on(
      table.user_id,
      table.usageDate,
    ),
  }),
);
