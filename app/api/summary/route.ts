import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stories, storyPages, users } from "@/lib/db/schema";
import { dbUnavailable, normalizeStoredTrickyWords } from "@/lib/api/respond";

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    const allStories = await db.select().from(stories);
    const allPages = await db.select().from(storyPages);

    const result = allUsers.map((user) => {
      const userStories = allStories.filter((s) => s.userId === user.id);
      const storyById = new Map(userStories.map((s) => [s.id, s]));
      const userPages = allPages.filter((p) => storyById.has(p.storyId));

      const scored = userPages.filter((p) => p.accuracyScore !== null && p.accuracyScore !== undefined);
      const averageScore =
        scored.length === 0
          ? null
          : Math.round((scored.reduce((sum, p) => sum + (p.accuracyScore ?? 0), 0) / scored.length) * 100) / 100;

      const counts = new Map<string, { word: string; count: number }>();
      for (const p of userPages) {
        for (const tw of normalizeStoredTrickyWords(p.trickyWords)) {
          const key = tw.word.toLowerCase();
          const existing = counts.get(key);
          if (existing) existing.count += 1;
          else counts.set(key, { word: tw.word, count: 1 });
        }
      }
      const frequentTrickyWords = [...counts.values()]
        .filter((c) => c.count >= 2)
        .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));

      const recentPages = [...userPages]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((p) => ({
          storyTitle: storyById.get(p.storyId)?.title ?? "",
          pageNumber: p.pageNumber,
          accuracyScore: p.accuracyScore ?? null,
          createdAt: p.createdAt,
        }));

      return { user, storyCount: userStories.length, averageScore, frequentTrickyWords, recentPages };
    });

    return NextResponse.json({ users: result });
  } catch {
    return dbUnavailable();
  }
}