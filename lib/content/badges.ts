export interface Badge {
  slug: string;
  name: string;
}

const BADGES: Record<string, string> = {
  "sungai-batanghari": "Penjaga Sungai Batanghari",
  "hutan-senami": "Penjaga Hutan Senami",
  "benteng-tembesi": "Penjelajah Benteng Tembesi",
  "kuliner-tradisi": "Ahli Kuliner Tradisi",
  "aek-meliuk": "Sahabat Aek Meliuk",
  "danau-letang": "Penjaga Danau Letang",
  "pasar-terusan": "Sahabat Pasar Terusan",
  "sawah-pemayung": "Petani Kecil Pemayung",
  "bajubang": "Penjelajah Kota Minyak Bajubang",
  "mersam": "Sahabat Durian Mersam",
  "maro-sebo-ulu": "Penjelajah Hulu Maro Sebo Ulu",
  "maro-sebo-ilir": "Sahabat Rawa Maro Sebo Ilir",
  "batin-xxiv": "Penjaga Kebun Batin XXIV",
};

export function badgeForTheme(themeSlug: string): string | null {
  return BADGES[themeSlug] ?? null;
}

export function computeBadges(completedThemeSlugs: string[]): Badge[] {
  const seen = new Set<string>();
  const result: Badge[] = [];
  for (const slug of completedThemeSlugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    const name = badgeForTheme(slug);
    if (name) result.push({ slug, name });
  }
  return result;
}