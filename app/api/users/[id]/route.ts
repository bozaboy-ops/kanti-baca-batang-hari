import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories, users } from "@/lib/db/schema";
import { badRequest, dbUnavailable, notFound, parseJson } from "@/lib/api/respond";
import { validateCreateUser } from "@/lib/api/validate";
import { removeStoryStorage } from "@/lib/api/storage";
import { ownerRequired } from "@/lib/admin/guard";

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = ownerRequired(req);
  if (denied) return denied;
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
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = ownerRequired(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = await parseJson(req);
  const v = validateCreateUser(body);
  if (!v.ok) return badRequest(v.error);
  try {
    const updated = await db.update(users).set(v.value).where(eq(users.id, id)).returning();
    if (updated.length === 0) return notFound("Pengguna tidak ditemukan");
    return NextResponse.json({ user: updated[0] });
  } catch {
    return dbUnavailable();
  }
}