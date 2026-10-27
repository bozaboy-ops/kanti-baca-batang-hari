import { pgTable, uuid, text, integer, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  childName: text("child_name").notNull(),
  age: integer("age").notNull(),
  subdistrict: text("subdistrict").notNull(),
  readingLevel: text("reading_level").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const stories = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  themeSlug: text("theme_slug").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  stars: integer("stars"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const storyPages = pgTable("story_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  storyId: uuid("story_id")
    .notNull()
    .references(() => stories.id, { onDelete: "cascade" }),
  pageNumber: integer("page_number").notNull(),
  storyText: text("story_text").notNull(),
  imageUrl: text("image_url"),
  childAudioTranscript: text("child_audio_transcript"),
  accuracyScore: integer("accuracy_score"),
  childImaginationInput: text("child_imagination_input"),
  trickyWords: jsonb("tricky_words"),
  praiseMessage: text("praise_message"),
  interactiveQuestion: text("interactive_question"),
  museImagePrompt: text("muse_image_prompt"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("story_pages_story_id_page_number_unique").on(t.storyId, t.pageNumber),
]);
