import { pgTable, serial, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  file_url: varchar("file_url", { length: 255 }),
  file_name: varchar("file_name", { length: 255 }),
  is_primary: boolean("is_primary").default(false),
  uploaded_at: timestamp("uploaded_at").defaultNow().notNull(),
});
