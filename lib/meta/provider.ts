import { getTheme } from "../content/themes";

export type ReadingLevel = "Pemula" | "Lancar";

export interface ContinueStoryInput {
  themeSlug: string;
  pageNumber: number;
  imagination: string;
  readingLevel: ReadingLevel;
}

export interface ContinueStoryResult {
  next_story_segment: {
    page_number: number;
    story_text: string;
    interactive_question: string;
  };
  muse_image_prompt: string;
}

const PLACES: Record<string, string> = {
  "sungai-batanghari": "tepi Sungai Batanghari",
  "hutan-senami": "Hutan Senami",
  "benteng-tembesi": "Benteng Tembesi",
  "kuliner-tradisi": "pasar makanan tradisional Jambi",
  "aek-meliuk": "taman Aek Meliuk di Muara Bulian",
  "danau-letang": "tepian Danau Letang",
  "pasar-terusan": "dermaga Pasar Terusan",
  "sawah-pemayung": "sawah hijau di Pemayung",
};

const QUESTIONS: string[] = [
  "Menurutmu, apa yang akan terjadi selanjutnya?",
  "Apa yang sebaiknya dilakukan Alif sekarang?",
  "Siapa lagi yang ingin kamu temui dalam cerita ini?",
  "Ke mana Alif harus pergi setelah ini?",
];

export function continueStory(input: ContinueStoryInput): ContinueStoryResult {
  const theme = getTheme(input.themeSlug);
  const idea = (input.imagination ?? "").trim().slice(0, 300) || "sebuah kejutan kecil";
  const place = PLACES[theme.slug] ?? theme.title;
  const pageNumber = input.pageNumber + 1;

  const storyText =
    input.readingLevel === "Pemula"
      ? `Alif melihat ${idea} di ${place}. Alif tersenyum lebar. Mereka berjalan pelan bersama.`
      : `Alif terkesima ketika ${idea} muncul di ${place}, seolah membawa cerita baru dari Jambi. Dengan hati-hati, Alif melangkah mendekat sambil mendengarkan suara di sekitarnya. Petualangan itu membuat Alif makin penasaran dengan apa yang akan terjadi selanjutnya.`;

  const interactiveQuestion = QUESTIONS[Math.abs(input.pageNumber) % QUESTIONS.length];

  return {
    next_story_segment: {
      page_number: pageNumber,
      story_text: storyText,
      interactive_question: interactiveQuestion,
    },
    muse_image_prompt: `${theme.imagePromptBase} New scene featuring ${idea}, set in the Batanghari region of Jambi, Indonesia, warm watercolor style, cheerful and safe for children, no text`,
  };
}

export function getMetaMode(): "local-fallback" | "http-configured" {
  const configured = [
    process.env.META_SPARK_URL,
    process.env.META_IMAGE_URL,
    process.env.META_VOICE_TRANSCRIBE_URL,
    process.env.META_API_TOKEN,
  ].every((v) => typeof v === "string" && v.trim().length > 0);
  return configured ? "http-configured" : "local-fallback";
}