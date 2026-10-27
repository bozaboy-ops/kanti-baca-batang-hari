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
      {
        text: "Pak Nelayan bercerita tentang ikan tapa dan ikan semah. Ikan itu besar dan kuat. Alif mendengarkan sambil memegang tepi perahu ketek.",
        question: "Mengapa Alif harus berhati-hati di atas perahu?",
      },
      {
        text: "Di tengah sungai, Alif melihat kantong plastik mengapung. Alif mengambilnya dengan jaring kecil. Sungai harus bersih agar ikan tetap sehat.",
        question: "Apa yang bisa kita lakukan agar Sungai Batanghari tetap bersih?",
      },
      {
        text: "Perahu ketek sampai di tepian Muara Tembesi. Air sungai bertemu dan berputar pelan. Alif melambaikan tangan kepada anak-anak di dermaga kayu.",
        question: "Siapa yang ingin Alif ajak bermain di tepian sungai?",
      },
      {
        text: "Sore hari, langit di atas Sungai Batanghari berwarna emas. Alif pulang membawa cerita baru. Besok, Alif ingin kembali menjaga sungai bersama teman-teman.",
        question: "Cerita apa yang akan Alif sampaikan kepada teman-temannya di rumah?",
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
      {
        text: "Di balik semak, seekor kancil kecil mengintip. Alif berjalan pelan agar kancil tidak takut. Kancil melompat pergi sambil menoleh.",
        question: "Mengapa Alif berjalan pelan di dekat kancil?",
      },
      {
        text: "Alif mendengar suara burung kuau dari jauh. Suaranya nyaring di antara pohon bulian yang tua. Kata penjaga hutan, pohon bulian kuat seperti besi dan menjadi asal nama Muara Bulian.",
        question: "Apa yang membuat pohon bulian istimewa?",
      },
      {
        text: "Alif membantu menanam bibit pohon di tanah yang kosong. Satu bibit, satu harapan. Kelak bibit itu menjadi rumah bagi burung dan kancil.",
        question: "Pohon apa yang ingin kamu tanam bersama Alif?",
      },
      {
        text: "Sebelum pulang, Alif memungut sampah yang tertinggal di jalan hutan Senami. Hutan bersih membuat satwa senang. Alif berjanji kembali sebagai penjaga hutan kecil.",
        question: "Janji apa yang ingin kamu buat untuk menjaga hutan?",
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
      {
        text: "Di halaman benteng, Alif menemukan peta tua di atas meja kayu. Peta itu menunjukkan sungai, danau, dan jalan desa Muara Tembesi. Ada tanda bintang kecil di tepi peta.",
        question: "Ke mana tanda bintang di peta itu menunjuk?",
      },
      {
        text: "Alif mengikuti peta menuju Danau Letang. Air danau tenang dan jernih. Anak-anak desa sedang membersihkan tepian danau bersama-sama.",
        question: "Mengapa anak-anak membersihkan tepian Danau Letang?",
      },
      {
        text: "Alif ikut bergotong royong mengangkat bambu dan menyapu daun kering. Serentak Bak Regam, kata mereka. Bersama-sama, pekerjaan berat terasa ringan.",
        question: "Pekerjaan apa yang terasa ringan bila dikerjakan bersama-sama?",
      },
      {
        text: "Di Benteng Tembesi, Alif menulis namanya di buku tamu penjaga. Alif pulang membawa pelajaran: menjaga sejarah dan alam adalah tugas semua orang.",
        question: "Apa pelajaran paling berkesan yang didapat Alif hari ini?",
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
      {
        text: "Di warung kecil, Alif mencicipi gulai talang yang hangat. Kuahnya gurih dan lezat. Ibu penjual tersenyum melihat Alif makan dengan lahap.",
        question: "Bagaimana rasa gulai talang menurut Alif?",
      },
      {
        text: "Alif melihat ikan pindang dimasak dalam periuk besar. Uapnya mengepul harum. Ikan segar datang dari sungai setiap pagi.",
        question: "Dari mana ikan segar untuk pindang itu berasal?",
      },
      {
        text: "Alif belajar membungkus kue dengan daun pisang. Daun hijau membuat kue wangi. Tangan Alif bergerak pelan dan hati-hati.",
        question: "Mengapa kue dibungkus dengan daun pisang?",
      },
      {
        text: "Sebelum pulang, Alif membeli kue untuk ibu di rumah. Makanan tradisional membuat Alif bangga. Rasanya lezat, ceritanya pun indah.",
        question: "Makanan khas apa yang ingin kamu perkenalkan kepada temanmu?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, at a traditional Jambi food market in the Batanghari region, Indonesia, with colorful traditional cakes and steaming dishes, soft warm light, gentle flat shapes, no text",
  },  {
    slug: "aek-meliuk",
    title: "Sore di Aek Meliuk",
    subtitle: "Alif bermain dan belajar di taman tepian Muara Bulian",
    character: "Alif",
    palette: { sky: "#ffe8c2", land: "#588157", accent: "#f4a261" },
    pages: [
      {
        text: "Sore hari, Alif pergi ke Aek Meliuk di Muara Bulian. Taman di tepian air ramai oleh keluarga. Angin bertiup sejuk sekali.",
        question: "Apa yang membuat sore di Aek Meliuk terasa sejuk?",
      },
      {
        text: "Alif melihat anak-anak bermain di taman Aek Meliuk. Ada yang berlari, ada yang membaca di bangku. Alif melambaikan tangan kepada mereka.",
        question: "Permainan apa yang ingin Alif mainkan di taman?",
      },
      {
        text: "Di dekat air yang meliuk pelan, Alif menemukan bunga kecil berwarna kuning. Alif hanya melihat, tidak memetiknya. Bunga itu untuk semua pengunjung taman.",
        question: "Mengapa Alif tidak memetik bunga di taman?",
      },
      {
        text: "Alif membantu petugas taman mengumpulkan daun kering. Daun dimasukkan ke keranjang besar. Taman Aek Meliuk menjadi bersih dan rapi.",
        question: "Apa yang dilakukan Alif agar taman tetap bersih?",
      },
      {
        text: "Saat matahari turun, lampu taman Aek Meliuk menyala satu per satu. Cahayanya memantul di air yang tenang. Alif duduk membaca buku cerita bersama ibu.",
        question: "Buku apa yang ingin kamu baca di taman saat sore hari?",
      },
      {
        text: "Alif pulang dari Aek Meliuk dengan hati senang. Taman yang bersih membuat semua orang nyaman. Besok, Alif ingin mengajak teman-temannya membaca di sana.",
        question: "Siapa yang ingin kamu ajak membaca di taman?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, at Aek Meliuk park in Muara Bulian, Batanghari region, Jambi, Indonesia, with a calm winding stream, park benches and evening lamps, soft warm light, gentle flat shapes, no text",
  },
  {
    slug: "danau-letang",
    title: "Danau Letang yang Jernih",
    subtitle: "Alif menjaga danau dan burung-burung di Muara Tembesi",
    character: "Alif",
    palette: { sky: "#d8ecf3", land: "#52796f", accent: "#e9c46a" },
    pages: [
      {
        text: "Pagi hari, Alif tiba di Danau Letang. Air danau jernih dan tenang. Bayangan pohon terlihat di permukaan air.",
        question: "Apa yang terlihat di permukaan Danau Letang?",
      },
      {
        text: "Alif naik perahu kecil bersama Kak Sari, penjaga danau. Mereka berlayar pelan agar air tidak bergelombang besar. Ikan-ikan kecil berenang di bawah perahu.",
        question: "Mengapa perahu harus berlayar pelan di danau?",
      },
      {
        text: "Seekor burung putih terbang rendah di atas Danau Letang. Burung itu mencari ikan untuk anaknya. Alif menunjuk sambil berbisik gembira.",
        question: "Apa yang dicari burung putih di danau?",
      },
      {
        text: "Di tepian danau, Alif melihat botol plastik hanyut. Alif mengambilnya dengan serokan panjang. Danau Letang harus tetap jernih untuk semua makhluk.",
        question: "Apa yang bisa kita lakukan agar danau tetap jernih?",
      },
      {
        text: "Alif mendengarkan cerita Kak Sari. Warga Muara Tembesi menjaga Danau Letang secara bergiliran. Ada jadwal memungut sampah dan menanam pohon di tepian. Semua ikut bekerja dengan senang hati.",
        question: "Mengapa warga menjaga danau secara bergiliran?",
      },
      {
        text: "Alif menulis janji di buku penjaga Danau Letang. Aku akan menjaga air tetap bersih. Alif pulang membawa kenangan danau yang jernih dan tenang.",
        question: "Janji apa yang ingin kamu tulis untuk menjaga danau atau sungai?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, on a small boat at Danau Letang lake in Muara Tembesi, Batanghari region, Jambi, Indonesia, with clear calm water, white birds and green shores, soft morning light, gentle flat shapes, no text",
  },
  {
    slug: "pasar-terusan",
    title: "Perahu Sayur Pasar Terusan",
    subtitle: "Alif membantu perahu ketek mengantar sayur ke Pasar Terusan",
    character: "Alif",
    palette: { sky: "#fdebd3", land: "#6a994e", accent: "#bc4749" },
    pages: [
      {
        text: "Subuh-subuh, Alif sudah berada di dermaga Pasar Terusan. Perahu ketek berderet menunggu muatan. Udara pagi terasa dingin dan segar.",
        question: "Mengapa Alif datang ke dermaga pagi-pagi sekali?",
      },
      {
        text: "Alif membantu Pak Udin menaikkan keranjang sayur ke perahu ketek. Ada cabai, kangkung, dan ikan segar. Keranjang ditata agar perahu seimbang.",
        question: "Mengapa keranjang harus ditata agar perahu seimbang?",
      },
      {
        text: "Perahu ketek berangkat menyusuri sungai menuju Pasar Terusan. Bunyi mesinnya tok-tok-tok memecah pagi. Alif memegang keranjang sambil tersenyum.",
        question: "Bunyi apa yang terdengar dari perahu ketek?",
      },
      {
        text: "Di Pasar Terusan, Alif melihat para ibu penjual menyambut perahu dengan gembira. Sayur segar langsung ditata di lapak kayu. Pembeli datang satu per satu.",
        question: "Apa yang dilakukan ibu penjual saat sayur segar tiba?",
      },
      {
        text: "Alif membantu seorang nenek membawakan belanjaan ke tepi jalan. Nenek memberi Alif sepotong kue dan doa baik. Alif berterima kasih dengan sopan.",
        question: "Bagaimana cara Alif berterima kasih kepada nenek?",
      },
      {
        text: "Matahari naik, Pasar Terusan makin ramai. Alif belajar bahwa perahu ketek membantu banyak orang. Setiap pagi, sungai menjadi jalan yang penuh cerita.",
        question: "Cerita apa yang paling berkesan bagi Alif di Pasar Terusan?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, helping load vegetable baskets onto a small wooden ketek boat for Pasar Terusan market in the Batanghari region, Jambi, Indonesia, at dawn on a calm river, soft golden light, gentle flat shapes, no text",
  },
  {
    slug: "sawah-pemayung",
    title: "Padi Emas di Pemayung",
    subtitle: "Alif belajar menanam padi bersama petani di Pemayung",
    character: "Alif",
    palette: { sky: "#e3f2d8", land: "#7fb069", accent: "#e9c46a" },
    pages: [
      {
        text: "Alif berkunjung ke sawah di Pemayung. Hamparan hijau terbentang luas sekali. Petani bekerja sambil bercakap gembira.",
        question: "Apa yang dilihat Alif di sawah Pemayung?",
      },
      {
        text: "Pak Tani mengajarkan Alif menanam bibit padi. Kaki Alif masuk ke lumpur yang lembut. Bibit ditanam berjajar rapi di air yang jernih.",
        question: "Bagaimana cara menanam bibit padi yang benar?",
      },
      {
        text: "Di pematang sawah, Alif melihat katak kecil melompat. Katak memakan serangga yang merusak padi. Alif membiarkannya hidup dengan tenang.",
        question: "Mengapa katak baik untuk tanaman padi?",
      },
      {
        text: "Hujan turun pelan di sawah Pemayung. Alif dan petani berteduh di pondok kecil sambil minum air hangat. Air hujan membuat padi tumbuh subur.",
        question: "Apa manfaat hujan bagi tanaman padi?",
      },
      {
        text: "Beberapa bulan kemudian, padi menguning seperti emas. Warga Pemayung dan Mersam memanen bersama dengan gotong royong. Alif membantu mengikat padi yang sudah dipotong.",
        question: "Mengapa panen dikerjakan bersama-sama?",
      },
      {
        text: "Alif pulang membawa seikat padi emas dari Pemayung. Di rumah, ibu memasak nasi hangat dari beras baru. Alif makan sambil bercerita tentang petani yang hebat.",
        question: "Kepada siapa Alif ingin menceritakan tentang petani Pemayung?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, planting rice seedlings with farmers in the green rice fields of Pemayung, Batanghari region, Jambi, Indonesia, with golden rice and a small hut, soft sunlight, gentle flat shapes, no text",
  },
];

export function getTheme(themeSlug: string): Theme {
  const theme = THEMES.find((t) => t.slug === themeSlug);
  if (!theme) {
    throw new Error(`Unknown theme: ${themeSlug}`);
  }
  return theme;
}
