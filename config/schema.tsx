import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* =======================
   USERS TABLE
======================= */
export const usersTable = pgTable("users", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),

  clerkId: text("clerk_id").unique(),

  credits: integer("credits").notNull().default(5),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* =======================
   PROJECTS TABLE
======================= */
export const projectsTable = pgTable("projects", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  projectId: text("project_id").notNull().unique(),

  userInput: text("user_input").notNull(),

  device: text("device").notNull(),

  userId: text("user_id").notNull(), // Clerk userId

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
