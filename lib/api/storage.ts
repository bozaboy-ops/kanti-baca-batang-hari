import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

export function getStorageDir(): string {
  return process.env.APP_STORAGE_DIR ?? "D:\\bacca-ai\\storage";
}

export function imageUrlFor(storyId: string, pageNumber: number): string {
  return `/api/images/${storyId}/page-${pageNumber}.svg`;
}

export async function writeIllustration(
  storyId: string,
  pageNumber: number,
  svg: string
): Promise<string> {
  const dir = path.join(getStorageDir(), storyId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `page-${pageNumber}.svg`), svg, "utf-8");
  return imageUrlFor(storyId, pageNumber);
}

export async function removeStoryStorage(storyId: string): Promise<void> {
  await rm(path.join(getStorageDir(), storyId), { recursive: true, force: true });
}

export function resolveImagePath(segments: string[]): string | null {
  for (const seg of segments) {
    if (!seg || seg === "." || seg === "..") return null;
    if (seg.includes("/") || seg.includes("\\") || seg.includes("\0")) return null;
    let decoded = seg;
    try { decoded = decodeURIComponent(seg); } catch { return null; }
    if (decoded === ".." || decoded === "." || decoded.includes("/") || decoded.includes("\\")) return null;
  }
  const root = path.resolve(getStorageDir());
  const resolved = path.resolve(root, ...segments);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

export async function readImageFile(segments: string[]): Promise<Buffer | null> {
  const resolved = resolveImagePath(segments);
  if (!resolved) return null;
  return readFile(resolved);
}