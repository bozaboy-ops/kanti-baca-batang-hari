import { readFile } from "fs/promises";
import { notFound } from "@/lib/api/respond";
import { resolveImagePath } from "@/lib/api/storage";

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await ctx.params;
  if (!segments || segments.length === 0) {
    return Response.json({ error: "Path tidak valid" }, { status: 400 });
  }
  const resolved = resolveImagePath(segments);
  if (!resolved) {
    return Response.json({ error: "Path tidak valid" }, { status: 400 });
  }
  try {
    const data = await readFile(resolved);
    return new Response(new Uint8Array(data), {
      status: 200,
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT" || code === "ENOTDIR" || code === "EISDIR") return notFound("Gambar tidak ditemukan");
    return Response.json({ error: "Gagal membaca gambar" }, { status: 500 });
  }
}