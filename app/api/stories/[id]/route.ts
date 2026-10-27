import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories, storyPages } from "@/lib/db/schema";
import { dbUnavailable, notFound } from "@/lib/api/respond";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const found = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
    if (found.length === 0) return notFound("Cerita tidak ditemukan");
    const pages = await db
      .select()
      .from(storyPages)
      .where(eq(storyPages.storyId, id))
      .orderBy(asc(storyPages.pageNumber));
    return NextResponse.json({ story: found[0], pages });
  } catch {
    return dbUnavailable();
  }
}