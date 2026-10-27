export const KECAMATAN = [
  "Muara Bulian",
  "Muara Tembesi",
  "Maro Sebo Ulu",
  "Maro Sebo Ilir",
  "Batin XXIV",
  "Pemayung",
  "Bajubang",
  "Mersam",
] as const;

export type Kecamatan = (typeof KECAMATAN)[number];

export const READING_LEVELS = ["Pemula", "Lancar"] as const;
export type ReadingLevel = (typeof READING_LEVELS)[number];

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function fail<T>(error: string): ValidationResult<T> {
  return { ok: false, error };
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function validPageNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1;
}

export interface CreateUserInput {
  childName: string;
  age: number;
  subdistrict: string;
  readingLevel: ReadingLevel;
}

export function validateCreateUser(body: unknown): ValidationResult<CreateUserInput> {
  if (!isRecord(body)) return fail("Data pengguna tidak valid");
  const childName = body.childName;
  if (typeof childName !== "string" || childName.trim().length === 0) {
    return fail("Nama anak wajib diisi");
  }
  const age = body.age;
  if (typeof age !== "number" || !Number.isInteger(age) || age < 6 || age > 10) {
    return fail("Usia harus bilangan bulat antara 6 sampai 10 tahun");
  }
  const subdistrict = body.subdistrict;
  if (typeof subdistrict !== "string" || !(KECAMATAN as readonly string[]).includes(subdistrict)) {
    return fail("Kecamatan tidak valid");
  }
  const readingLevel = body.readingLevel;
  if (readingLevel !== "Pemula" && readingLevel !== "Lancar") {
    return fail("Level membaca harus Pemula atau Lancar");
  }
  return { ok: true, value: { childName: childName.trim(), age, subdistrict, readingLevel } };
}

export interface CreateStoryInput {
  userId: string;
  themeSlug: string;
}

export function validateCreateStory(body: unknown): ValidationResult<CreateStoryInput> {
  if (!isRecord(body)) return fail("Data cerita tidak valid");
  const userId = body.userId;
  if (typeof userId !== "string" || userId.trim().length === 0) return fail("userId wajib diisi");
  const themeSlug = body.themeSlug;
  if (typeof themeSlug !== "string" || themeSlug.trim().length === 0) return fail("themeSlug wajib diisi");
  return { ok: true, value: { userId: userId.trim(), themeSlug: themeSlug.trim() } };
}

export interface EvaluateBody {
  pageNumber: number;
  transcript: string;
}

export function validateEvaluateBody(body: unknown): ValidationResult<EvaluateBody> {
  if (!isRecord(body)) return fail("Data evaluasi tidak valid");
  if (!validPageNumber(body.pageNumber)) return fail("pageNumber harus bilangan bulat positif");
  const transcript = body.transcript;
  if (typeof transcript !== "string" || transcript.trim().length === 0) {
    return fail("Transkrip bacaan wajib diisi");
  }
  return { ok: true, value: { pageNumber: body.pageNumber, transcript: transcript.trim() } };
}

export function normalizeImagination(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 300);
}

export interface ContinueBody {
  pageNumber: number;
  imagination: string;
}

export function validateContinueBody(body: unknown): ValidationResult<ContinueBody> {
  if (!isRecord(body)) return fail("Data lanjutan cerita tidak valid");
  if (!validPageNumber(body.pageNumber)) return fail("pageNumber harus bilangan bulat positif");
  const imagination = normalizeImagination(body.imagination);
  if (imagination.length === 0) return fail("Imajinasi anak wajib diisi");
  return { ok: true, value: { pageNumber: body.pageNumber, imagination } };
}

export { validateCreateUser as validateUserInput };
export { validateCreateUser as validateCreateUserInput };
export { validateCreateStory as validateStoryInput };
export { validateEvaluateBody as validateEvaluateInput };
export { validateContinueBody as validateContinueInput };