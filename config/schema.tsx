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

  userId: text("user_id").notNull(),

  config: text("config"), // 👈 REQUIRED to stop data-loss warning

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});


/* =======================
   SCREEN CONFIG TABLE
======================= */
export const screenConfigTable = pgTable("screen_config", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.projectId, { onDelete: "cascade" }),

  screenId: varchar("screen_id", { length: 100 })  // ✅ change key to screenId
    .notNull()
    .unique(),

  screenName: varchar("screen_name", { length: 255 }).notNull(),

  purpose: varchar("purpose", { length: 255 }),

  screenDescription: text("screen_description"),

  code: text("code"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })  // ✅ add updatedAt
    .defaultNow()
    .notNull(),
});

