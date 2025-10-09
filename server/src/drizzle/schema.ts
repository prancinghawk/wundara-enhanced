import { pgTable, serial, text, timestamp, varchar, integer, boolean, jsonb, uuid, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const children = pgTable("children", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 120 }).notNull(),
  ageYears: integer("age_years"),
  neurotype: varchar("neurotype", { length: 120 }),
  interests: text("interests"),
  learningContext: varchar("learning_context", { length: 40 }), // homeschool | classroom
  state: varchar("state", { length: 10 }), // AU state code
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const learningPlans = pgTable("learning_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  childId: uuid("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  weekOf: date("week_of").notNull(),
  themeTitle: varchar("theme_title", { length: 255 }).notNull(),
  overview: text("overview").notNull(),
  // Structured JSON content for 5-day plan
  planJson: jsonb("plan_json").$type<Record<string, any>>().notNull(),
  tags: text("tags"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id").notNull().references(() => learningPlans.id, { onDelete: "cascade" }),
  dayIndex: integer("day_index").notNull(), // 0..4
  title: varchar("title", { length: 255 }).notNull(),
  objective: text("objective").notNull(),
  curriculumCodes: text("curriculum_codes"),
  materials: text("materials"),
  instructions: text("instructions").notNull(),
  declarativeLanguage: text("declarative_language"),
  modifications: text("modifications"),
});

export const planProgress = pgTable("plan_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id").notNull().references(() => learningPlans.id, { onDelete: "cascade" }),
  dayIndex: integer("day_index").notNull(),
  engagementNotes: text("engagement_notes"),
  evidenceJson: jsonb("evidence_json").$type<Record<string, any>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // generation, review, etc
  payload: jsonb("payload").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({ children: many(children) }));
export const childrenRelations = relations(children, ({ many, one }) => ({
  user: one(users, { fields: [children.userId], references: [users.id] }),
  plans: many(learningPlans),
}));
export const plansRelations = relations(learningPlans, ({ many, one }) => ({
  child: one(children, { fields: [learningPlans.childId], references: [children.id] }),
  activities: many(activities),
  progress: many(planProgress),
}));
