import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories, users } from "@/lib/db/schema";
import { dbUnavailable, notFound } from "@/lib/api/respond";
import { removeStoryStorage } from "@/lib/api/storage";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  let storyIds: string[] = [];
  try {
    const existing = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (existing.length === 0) return notFound("Pengguna tidak ditemukan");
    const storyRows = await db.select({ id: stories.id }).from(stories).where(eq(stories.userId, id));
    storyIds = storyRows.map((s) => s.id);
    const deleted = await db.delete(users).where(eq(users.id, id)).returning();
    if (deleted.length === 0) return notFound("Pengguna tidak ditemukan");
  } catch {
    return dbUnavailable();
  }
  for (const sid of storyIds) {
    try { await removeStoryStorage(sid); } catch { /* storage cleanup is best-effort */ }
  }
  return NextResponse.json({ ok: true });
}