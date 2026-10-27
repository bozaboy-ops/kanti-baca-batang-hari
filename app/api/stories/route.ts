import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories, storyPages, users } from "@/lib/db/schema";
import { THEMES } from "@/lib/content/themes";
import { generateIllustrationSvg } from "@/lib/meta/image";
import { validateCreateStory } from "@/lib/api/validate";
import { badRequest, dbUnavailable, notFound, parseJson } from "@/lib/api/respond";
import { imageUrlFor, writeIllustration } from "@/lib/api/storage";

export async function POST(req: Request) {
  const body = await parseJson(req);
  const v = validateCreateStory(body);
  if (!v.ok) return badRequest(v.error);
  const theme = THEMES.find((t) => t.slug === v.value.themeSlug);
  if (!theme) return badRequest("Tema tidak ditemukan");
  let story: typeof stories.$inferSelect;
  try {
    const found = await db.select().from(users).where(eq(users.id, v.value.userId)).limit(1);
    if (found.length === 0) return notFound("Pengguna tidak ditemukan");
    const [created] = await db
      .insert(stories)
      .values({ userId: v.value.userId, themeSlug: theme.slug, title: theme.title })
      .returning();
    story = created;
  } catch {
    return dbUnavailable();
  }
  const seed = theme.pages[0];
  const imageUrl = imageUrlFor(story.id, 1);
  try {
    await writeIllustration(story.id, 1, generateIllustrationSvg(theme.slug, theme.title));
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan ilustrasi" }, { status: 500 });
  }
  try {
    const [page] = await db
      .insert(storyPages)
      .values({
        storyId: story.id,
        pageNumber: 1,
        storyText: seed.text,
        interactiveQuestion: seed.question,
        museImagePrompt: theme.imagePromptBase,
        imageUrl,
      })
      .returning();
    return NextResponse.json({ story, pages: [page] }, { status: 201 });
  } catch {
    return dbUnavailable();
  }
}