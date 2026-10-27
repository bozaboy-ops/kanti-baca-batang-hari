import { describe, it, expect, afterEach } from "vitest";
import { THEMES } from "../lib/content/themes";
import { generateIllustrationSvg, escapeXml } from "../lib/meta/image";
import { continueStory, getMetaMode } from "../lib/meta/provider";

describe("THEMES", () => {
  it("has exactly 8 themes with the required slugs", () => {
    expect(THEMES.map((t) => t.slug)).toEqual([
      "sungai-batanghari",
      "hutan-senami",
      "benteng-tembesi",
      "kuliner-tradisi",
      "aek-meliuk",
      "danau-letang",
      "pasar-terusan",
      "sawah-pemayung",
    ]);
  });

  it("each theme has exactly 6 seed pages, an opening question, Alif, palette and imagePromptBase", () => {
    for (const theme of THEMES) {
      expect(theme.title.length).toBeGreaterThan(0);
      expect(theme.subtitle.length).toBeGreaterThan(0);
      expect(theme.character).toBe("Alif");
      expect(theme.palette.sky).toMatch(/^#/);
      expect(theme.palette.land).toMatch(/^#/);
      expect(theme.palette.accent).toMatch(/^#/);
      expect(theme.imagePromptBase.length).toBeGreaterThan(0);
      expect(theme.pages).toHaveLength(6);
      for (const page of theme.pages) {
        expect(page.text.length).toBeGreaterThan(0);
        expect(page.text).toContain("Alif");
        expect(page.question.length).toBeGreaterThan(0);
        expect(page.question).toContain("?");
      }
    }
  });
});

describe("continueStory", () => {
  it("weaves imagination, increments page, prompt contains Batanghari and 'no text'", () => {
    const r = continueStory({
      themeSlug: "sungai-batanghari",
      pageNumber: 2,
      imagination: "gajah Sumatera kecil yang membawa lentera",
      readingLevel: "Pemula",
    });
    expect(r.next_story_segment.page_number).toBe(3);
    expect(r.next_story_segment.story_text).toContain("gajah");
    expect(r.next_story_segment.story_text).toContain("lentera");
    expect(r.next_story_segment.interactive_question).toContain("?");
    expect(r.muse_image_prompt).toContain("Batanghari");
    expect(r.muse_image_prompt).toContain("no text");
  });

  it("trims imagination and truncates to 300 chars", () => {
    const long = "  " + "a".repeat(400) + "  ";
    const r = continueStory({ themeSlug: "hutan-senami", pageNumber: 1, imagination: long, readingLevel: "Lancar" });
    expect(r.next_story_segment.story_text).not.toContain("a".repeat(301));
    expect(r.next_story_segment.page_number).toBe(2);
  });

  it("throws on unknown themeSlug", () => {
    expect(() =>
      continueStory({ themeSlug: "tidak-ada", pageNumber: 1, imagination: "perahu", readingLevel: "Pemula" })
    ).toThrow();
  });
});

describe("generateIllustrationSvg", () => {
  it("returns complete 800x600 SVG", () => {
    const svg = generateIllustrationSvg("sungai-batanghari", "perahu kecil");
    expect(svg).toContain("<svg");
    expect(svg).toContain('width="800"');
    expect(svg).toContain('height="600"');
    expect(svg.trimEnd().endsWith("</svg>")).toBe(true);
  });

  it("escapes <script> highlight and never emits it raw", () => {
    const svg = generateIllustrationSvg("hutan-senami", "<script>alert(1)</script>");
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;script&gt;");
  });

  it("throws on unknown themeSlug", () => {
    expect(() => generateIllustrationSvg("tidak-ada", "gajah")).toThrow();
  });
});

describe("escapeXml", () => {
  it("escapes &, <, > and quotes", () => {
    expect(escapeXml(`a & <b> "c" 'd'`)).toBe("a &amp; &lt;b&gt; &quot;c&quot; &apos;d&apos;");
  });
});

describe("getMetaMode", () => {
  const keys = ["META_SPARK_URL", "META_IMAGE_URL", "META_VOICE_TRANSCRIBE_URL", "META_API_TOKEN"] as const;
  const saved: Record<string, string | undefined> = {};
  for (const k of keys) saved[k] = process.env[k];
  afterEach(() => {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("local-fallback when env incomplete", () => {
    for (const k of keys) delete process.env[k];
    expect(getMetaMode()).toBe("local-fallback");
  });

  it("http-configured when all env present and non-empty", () => {
    process.env.META_SPARK_URL = "https://example.invalid/spark";
    process.env.META_IMAGE_URL = "https://example.invalid/image";
    process.env.META_VOICE_TRANSCRIBE_URL = "https://example.invalid/transcribe";
    process.env.META_API_TOKEN = "token";
    expect(getMetaMode()).toBe("http-configured");
  });
});
describe("developed Batang Hari stories", () => {
  it("every theme tells a developed local arc mentioning its Batang Hari place", () => {
    const places: Record<string, string> = {
      "sungai-batanghari": "Batanghari",
      "hutan-senami": "Senami",
      "benteng-tembesi": "Tembesi",
      "kuliner-tradisi": "gulai",
      "aek-meliuk": "Aek Meliuk",
      "danau-letang": "Danau Letang",
      "pasar-terusan": "Pasar Terusan",
      "sawah-pemayung": "Pemayung",
    };
    for (const theme of THEMES) {
      const allText = theme.pages.map((p) => p.text).join(" ");
      expect(allText, theme.slug).toContain(places[theme.slug]);
      expect(theme.pages[5].question, theme.slug).toContain("?");
    }
  });

  it("continueStory works for the new Batang Hari themes", () => {
    for (const slug of ["aek-meliuk", "danau-letang", "pasar-terusan", "sawah-pemayung"]) {
      const r = continueStory({ themeSlug: slug, pageNumber: 6, imagination: "burung kuau yang pandai bernyanyi", readingLevel: "Pemula" });
      expect(r.next_story_segment.page_number).toBe(7);
      expect(r.next_story_segment.story_text).toContain("burung kuau");
      expect(r.muse_image_prompt).toContain("Batanghari");
    }
  });
});