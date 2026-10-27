import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stories, storyPages } from "@/lib/db/schema";
import { evaluateReading } from "@/lib/reading/evaluate";
import { validateEvaluateBody } from "@/lib/api/validate";
import { badRequest, dbUnavailable, notFound, parseJson, toApiTrickyWord } from "@/lib/api/respond";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await parseJson(req);
  const v = validateEvaluateBody(body);
  if (!v.ok) return badRequest(v.error);
  try {
    const found = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
    if (found.length === 0) return notFound("Cerita tidak ditemukan");
    const pages = await db
      .select()
      .from(storyPages)
      .where(and(eq(storyPages.storyId, id), eq(storyPages.pageNumber, v.value.pageNumber)))
      .limit(1);
    if (pages.length === 0) return notFound("Halaman tidak ditemukan");
    const page = pages[0];
    const result = evaluateReading(page.storyText, v.value.transcript);
    const trickyWords = result.trickyWords.map(toApiTrickyWord);
    const reading_evaluation = {
      accuracy_score: result.accuracyScore,
      tricky_words: trickyWords,
      praise_message: result.praiseMessage,
    };
    await db
      .update(storyPages)
      .set({
        childAudioTranscript: v.value.transcript,
        accuracyScore: result.accuracyScore,
        trickyWords,
        praiseMessage: result.praiseMessage,
      })
      .where(eq(storyPages.id, page.id));
    return NextResponse.json({ reading_evaluation, provider: "local-fallback" });
  } catch {
    return dbUnavailable();
  }
}