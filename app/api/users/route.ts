import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { validateCreateUser } from "@/lib/api/validate";
import { badRequest, dbUnavailable, parseJson } from "@/lib/api/respond";

export async function GET() {
  // Daftar publik untuk memilih profil anak: tanpa nama/HP orang tua.
  // Data orang tua hanya muncul di ringkasan pemilik dan ringkasan anak sendiri.
  try {
    const rows = await db.select().from(users).orderBy(desc(users.createdAt));
    return NextResponse.json({
      users: rows.map((u) => ({
        id: u.id,
        childName: u.childName,
        age: u.age,
        subdistrict: u.subdistrict,
        readingLevel: u.readingLevel,
        createdAt: u.createdAt,
      })),
    });
  } catch {
    return dbUnavailable();
  }
}

export async function POST(req: Request) {
  const body = await parseJson(req);
  const v = validateCreateUser(body);
  if (!v.ok) return badRequest(v.error);
  try {
    const [user] = await db.insert(users).values(v.value).returning();
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return dbUnavailable();
  }
}