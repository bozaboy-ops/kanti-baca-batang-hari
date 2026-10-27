import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories, storyPages } from "@/lib/db/schema";
import { calculateStars } from "@/lib/reading/stars";
import { badgeForTheme } from "@/lib/content/badges";
import { dbUnavailable, notFound } from "@/lib/api/respond";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const found = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
    if (found.length === 0) return notFound("Cerita tidak ditemukan");
    const story = found[0];
    const pages = await db.select().from(storyPages).where(eq(storyPages.storyId, id));
    const scored = pages.filter((p) => p.accuracyScore !== null && p.accuracyScore !== undefined);
    const averageScore = scored.length === 0 ? null : Math.round((scored.reduce((sum, p) => sum + (p.accuracyScore ?? 0), 0) / scored.length) * 100) / 100;
    const stars = calculateStars(averageScore);
    const completedAt = story.completedAt ?? new Date();
    const [updated] = await db.update(stories).set({ completedAt, stars }).where(eq(stories.id, id)).returning();
    return NextResponse.json({
      story: updated,
      stars,
      averageScore,
      badge: badgeForTheme(story.themeSlug),
      provider: "local-fallback",
    });
  } catch {
    return dbUnavailable();
  }
}