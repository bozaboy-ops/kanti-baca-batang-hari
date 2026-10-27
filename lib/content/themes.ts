export interface ThemePalette {
  sky: string;
  land: string;
  accent: string;
}

export interface SeedPage {
  text: string;
  question: string;
}

export interface Theme {
  slug: string;
  title: string;
  subtitle: string;
  character: "Alif";
  palette: ThemePalette;
  pages: SeedPage[];
  imagePromptBase: string;
}

export const THEMES: Theme[] = [
  {
    slug: "sungai-batanghari",
    title: "Sungai Batanghari",
    subtitle: "Petualangan Alif di sungai besar Jambi",
    character: "Alif",
    palette: { sky: "#fde8c8", land: "#7fb069", accent: "#e07a5f" },
    pages: [
      {
        text: "Alif berdiri di tepi Sungai Batanghari. Air mengalir pelan. Perahu kecil lewat di depan Alif.",
        question: "Apa yang dilihat Alif di sungai?",
      },
      {
        text: "Alif naik perahu bersama nelayan. Ikan melompat dari air. Alif tertawa gembira.",
        question: "Hewan apa yang ingin Alif temui di sungai?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, exploring the Batanghari River in Jambi, Indonesia, with lush riverbanks and a small wooden boat, soft golden light, gentle flat shapes, no text",
  },
  {
    slug: "hutan-senami",
    title: "Hutan Senami",
    subtitle: "Alif menjaga hutan dan teman-teman satwanya",
    character: "Alif",
    palette: { sky: "#e8f3d8", land: "#4f772d", accent: "#f2cc8f" },
    pages: [
      {
        text: "Alif masuk ke Hutan Senami. Pohon bulian tinggi sekali. Burung berkicau di atas Alif.",
        question: "Suara apa yang didengar Alif di hutan?",
      },
      {
        text: "Alif melihat pohon kecil yang layu. Alif menyiramnya dengan air. Daunnya bergerak pelan.",
        question: "Apa yang bisa Alif lakukan untuk menjaga hutan?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, in the Senami forest near the Batanghari region in Jambi, Indonesia, with tall bulian trees, friendly birds and soft green light, gentle flat shapes, no text",
  },
  {
    slug: "benteng-tembesi",
    title: "Benteng Tembesi",
    subtitle: "Alif menelusuri cerita lama di Tembesi",
    character: "Alif",
    palette: { sky: "#fdeed3", land: "#bc6c25", accent: "#606c38" },
    pages: [
      {
        text: "Alif tiba di Benteng Tembesi. Dinding benteng tinggi dan kuat. Alif berjalan pelan masuk.",
        question: "Apa yang ingin Alif ketahui tentang benteng ini?",
      },
      {
        text: "Alif mendengar cerita penjaga benteng. Dulu, benteng menjaga sungai. Alif mendengarkan dengan saksama.",
        question: "Siapa yang akan Alif temui di dalam benteng?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, exploring the historic Tembesi fort in the Batanghari region in Jambi, Indonesia, with old brick walls and a river view, soft golden light, gentle flat shapes, no text",
  },
  {
    slug: "kuliner-tradisi",
    title: "Kuliner Tradisi",
    subtitle: "Alif mencicipi makanan khas Jambi",
    character: "Alif",
    palette: { sky: "#fff1d6", land: "#dda15e", accent: "#bc4749" },
    pages: [
      {
        text: "Alif pergi ke pasar pagi. Bau tempoyak dan gulai tercium harum. Alif tersenyum lapar.",
        question: "Makanan apa yang ingin Alif coba pertama kali?",
      },
      {
        text: "Alif membantu ibu penjual menata kue. Kue warna-warni tertata rapi. Alif belajar nama setiap kue.",
        question: "Kue apa yang paling ingin Alif buat sendiri?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, at a traditional Jambi food market in the Batanghari region, Indonesia, with colorful traditional cakes and steaming dishes, soft warm light, gentle flat shapes, no text",
  },
];

export function getTheme(themeSlug: string): Theme {
  const theme = THEMES.find((t) => t.slug === themeSlug);
  if (!theme) {
    throw new Error(`Unknown theme: ${themeSlug}`);
  }
  return theme;
}