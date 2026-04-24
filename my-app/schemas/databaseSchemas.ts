import { pgTable, integer, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    username: text().notNull().unique(),
    password: text().notNull()
});