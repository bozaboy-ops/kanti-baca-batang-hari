import { THEMES } from "@/lib/content/themes";
import { generateIllustrationSvg } from "@/lib/meta/image";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string; page: string }> }) {
  const { slug, page } = await ctx.params;
  const theme = THEMES.find((t) => t.slug === slug);
  const pageNumber = Number(page);
  if (!theme || !Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > theme.pages.length) {
    return new Response("Not found", { status: 404 });
  }
  const svg = generateIllustrationSvg(theme.slug, theme.pages[pageNumber - 1].text.slice(0, 60));
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
}