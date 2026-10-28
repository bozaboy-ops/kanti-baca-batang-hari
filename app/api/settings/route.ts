import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appSettings } from "@/lib/db/schema";
import { parseSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { dbUnavailable, parseJson } from "@/lib/api/respond";
import { ownerRequired } from "@/lib/admin/guard";

const KEY = "app";

export async function GET() {
  try {
    const rows = await db.select().from(appSettings).where(eq(appSettings.key, KEY)).limit(1);
    return NextResponse.json({ settings: rows.length > 0 ? parseSettings(rows[0].value) : DEFAULT_SETTINGS });
  } catch {
    return dbUnavailable();
  }
}

export async function PUT(req: Request) {
  const denied = ownerRequired(req);
  if (denied) return denied;
  const body = await parseJson(req);
  const settings = parseSettings(body);
  try {
    await db.insert(appSettings).values({ key: KEY, value: settings }).onConflictDoUpdate({ target: appSettings.key, set: { value: settings } });
    return NextResponse.json({ settings });
  } catch {
    return dbUnavailable();
  }
}