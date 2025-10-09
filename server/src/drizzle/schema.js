"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plansRelations = exports.childrenRelations = exports.usersRelations = exports.sessions = exports.planProgress = exports.activities = exports.learningPlans = exports.children = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    clerkId: (0, pg_core_1.varchar)("clerk_id", { length: 255 }).notNull().unique(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.children = (0, pg_core_1.pgTable)("children", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id").notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 120 }).notNull(),
    ageYears: (0, pg_core_1.integer)("age_years"),
    neurotype: (0, pg_core_1.varchar)("neurotype", { length: 120 }),
    interests: (0, pg_core_1.text)("interests"),
    learningContext: (0, pg_core_1.varchar)("learning_context", { length: 40 }), // homeschool | classroom
    state: (0, pg_core_1.varchar)("state", { length: 10 }), // AU state code
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.learningPlans = (0, pg_core_1.pgTable)("learning_plans", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    childId: (0, pg_core_1.uuid)("child_id").notNull().references(() => exports.children.id, { onDelete: "cascade" }),
    weekOf: (0, pg_core_1.date)("week_of").notNull(),
    themeTitle: (0, pg_core_1.varchar)("theme_title", { length: 255 }).notNull(),
    overview: (0, pg_core_1.text)("overview").notNull(),
    // Structured JSON content for 5-day plan
    planJson: (0, pg_core_1.jsonb)("plan_json").$type().notNull(),
    tags: (0, pg_core_1.text)("tags"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.activities = (0, pg_core_1.pgTable)("activities", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    planId: (0, pg_core_1.uuid)("plan_id").notNull().references(() => exports.learningPlans.id, { onDelete: "cascade" }),
    dayIndex: (0, pg_core_1.integer)("day_index").notNull(), // 0..4
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    objective: (0, pg_core_1.text)("objective").notNull(),
    curriculumCodes: (0, pg_core_1.text)("curriculum_codes"),
    materials: (0, pg_core_1.text)("materials"),
    instructions: (0, pg_core_1.text)("instructions").notNull(),
    declarativeLanguage: (0, pg_core_1.text)("declarative_language"),
    modifications: (0, pg_core_1.text)("modifications"),
});
exports.planProgress = (0, pg_core_1.pgTable)("plan_progress", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    planId: (0, pg_core_1.uuid)("plan_id").notNull().references(() => exports.learningPlans.id, { onDelete: "cascade" }),
    dayIndex: (0, pg_core_1.integer)("day_index").notNull(),
    engagementNotes: (0, pg_core_1.text)("engagement_notes"),
    evidenceJson: (0, pg_core_1.jsonb)("evidence_json").$type(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id").notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    type: (0, pg_core_1.varchar)("type", { length: 50 }).notNull(), // generation, review, etc
    payload: (0, pg_core_1.jsonb)("payload").$type().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({ children: many(exports.children) }));
exports.childrenRelations = (0, drizzle_orm_1.relations)(exports.children, ({ many, one }) => ({
    user: one(exports.users, { fields: [exports.children.userId], references: [exports.users.id] }),
    plans: many(exports.learningPlans),
}));
exports.plansRelations = (0, drizzle_orm_1.relations)(exports.learningPlans, ({ many, one }) => ({
    child: one(exports.children, { fields: [exports.learningPlans.childId], references: [exports.children.id] }),
    activities: many(exports.activities),
    progress: many(exports.planProgress),
}));
