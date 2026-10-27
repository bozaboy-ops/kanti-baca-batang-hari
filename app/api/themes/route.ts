import { NextResponse } from "next/server";
import { THEMES } from "@/lib/content/themes";

export async function GET() {
  return NextResponse.json({
    themes: THEMES.map((theme) => ({
      slug: theme.slug,
      title: theme.title,
      subtitle: theme.subtitle,
      pages: theme.pages,
      artUrls: theme.pages.map((_, i) => `/api/theme-art/${theme.slug}/${i + 1}`),
    })),
  });
}