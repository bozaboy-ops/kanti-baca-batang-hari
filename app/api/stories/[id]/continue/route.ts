import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories, storyPages, users } from "@/lib/db/schema";
import { continueStory } from "@/lib/meta/provider";
import type { ReadingLevel } from "@/lib/meta/provider";
import { generateIllustrationSvg } from "@/lib/meta/image";
import { validateContinueBody } from "@/lib/api/validate";
import { badRequest, dbUnavailable, notFound, normalizeStoredTrickyWords, parseJson } from "@/lib/api/respond";
import { imageUrlFor, writeIllustration } from "@/lib/api/storage";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await parseJson(req);
  const v = validateContinueBody(body);
  if (!v.ok) return badRequest(v.error);
  let story: typeof stories.$inferSelect;
  let page: typeof storyPages.$inferSelect;
  let readingLevel: ReadingLevel = "Pemula";
  try {
    const found = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
    if (found.length === 0) return notFound("Cerita tidak ditemukan");
    story = found[0];
    const pages = await db
      .select()
      .from(storyPages)
      .where(and(eq(storyPages.storyId, id), eq(storyPages.pageNumber, v.value.pageNumber)))
      .limit(1);
    if (pages.length === 0) return notFound("Halaman tidak ditemukan");
    page = pages[0];
    const owners = await db.select().from(users).where(eq(users.id, story.userId)).limit(1);
    if (owners.length > 0 && (owners[0].readingLevel === "Pemula" || owners[0].readingLevel === "Lancar")) {
      readingLevel = owners[0].readingLevel;
    }
  } catch {
    return dbUnavailable();
  }

  let result: ReturnType<typeof continueStory>;
  try {
    result = continueStory({
      themeSlug: story.themeSlug,
      pageNumber: v.value.pageNumber,
      imagination: v.value.imagination,
      readingLevel,
    });
  } catch {
    return badRequest("Tema tidak ditemukan");
  }

  const reading_evaluation =
    page.accuracyScore === null || page.accuracyScore === undefined
      ? null
      : {
          accuracy_score: page.accuracyScore,
          tricky_words: normalizeStoredTrickyWords(page.trickyWords),
          praise_message: page.praiseMessage ?? "",
        };

  const nextNumber = result.next_story_segment.page_number;
  const imageUrl = imageUrlFor(story.id, nextNumber);
  try {
    await writeIllustration(story.id, nextNumber, generateIllustrationSvg(story.themeSlug, v.value.imagination));
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan ilustrasi" }, { status: 500 });
  }
  try {
    await db
      .update(storyPages)
      .set({ childImaginationInput: v.value.imagination })
      .where(eq(storyPages.id, page.id));
    await db.insert(storyPages).values({
      storyId: story.id,
      pageNumber: nextNumber,
      storyText: result.next_story_segment.story_text,
      interactiveQuestion: result.next_story_segment.interactive_question,
      museImagePrompt: result.muse_image_prompt,
      childImaginationInput: v.value.imagination,
      imageUrl,
    });
  } catch {
    return dbUnavailable();
  }
  return NextResponse.json({
    reading_evaluation,
    next_story_segment: result.next_story_segment,
    muse_image_prompt: result.muse_image_prompt,
    provider: "local-fallback",
  });
}