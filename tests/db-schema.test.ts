import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function migrationSql(): string {
  const p = join(root, "scripts", "migrate.mjs");
  expect(existsSync(p), "scripts/migrate.mjs must exist").toBe(true);
  return readFileSync(p, "utf8");
}

describe("database schema (migration SQL text)", () => {
  it("creates the users, stories, and story_pages tables", () => {
    const sql = migrationSql().toLowerCase();
    expect(sql).toMatch(/create table if not exists users/);
    expect(sql).toMatch(/create table if not exists stories/);
    expect(sql).toMatch(/create table if not exists story_pages/);
  });

  it("users has id, child_name, age, subdistrict, reading_level, created_at", () => {
    const sql = migrationSql().toLowerCase();
    for (const col of ["id", "child_name", "age", "subdistrict", "reading_level", "created_at"]) {
      expect(sql, `users column ${col}`).toContain(col);
    }
  });

  it("stories has id, user_id, theme_slug, title, created_at", () => {
    const sql = migrationSql().toLowerCase();
    for (const col of ["id", "user_id", "theme_slug", "title", "created_at"]) {
      expect(sql, `stories column ${col}`).toContain(col);
    }
  });

  it("story_pages has all reading/co-creation columns", () => {
    const sql = migrationSql().toLowerCase();
    for (const col of [
      "id",
      "story_id",
      "page_number",
      "story_text",
      "image_url",
      "child_audio_transcript",
      "accuracy_score",
      "child_imagination_input",
      "tricky_words",
      "praise_message",
      "interactive_question",
      "muse_image_prompt",
      "created_at",
    ]) {
      expect(sql, `story_pages column ${col}`).toContain(col);
    }
  });

  it("tricky_words is jsonb", () => {
    const sql = migrationSql().toLowerCase();
    expect(sql).toMatch(/tricky_words\s+jsonb/);
  });

  it("Drizzle schema file defines the same three tables", () => {
    const p = join(root, "lib", "db", "schema.ts");
    expect(existsSync(p), "lib/db/schema.ts must exist").toBe(true);
    const schema = readFileSync(p, "utf8").toLowerCase();
    expect(schema).toContain("users");
    expect(schema).toContain("stories");
    expect(schema).toContain("story_pages");
    expect(schema).toContain("child_name");
    expect(schema).toContain("tricky_words");
  });
});

describe("story_pages page uniqueness", () => {
  it("migration creates a unique index on (story_id, page_number)", () => {
    const sql = migrationSql().toLowerCase();
    expect(sql).toMatch(/create unique index if not exists \w+ on story_pages\(story_id, page_number\)/);
  });
  it("Drizzle schema declares the same unique index", () => {
    const schema = readFileSync(join(root, "lib", "db", "schema.ts"), "utf8").toLowerCase();
    expect(schema).toContain("uniqueindex");
    expect(schema).toContain("story_pages_story_id_page_number_unique");
  });
});