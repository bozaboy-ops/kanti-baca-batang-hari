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
  {
    slug: "bajubang",
    title: "Kota Minyak Bajubang",
    subtitle: "Alif belajar tentang sumur minyak tua dan energi di Bajubang",
    character: "Alif",
    palette: { sky: "#fdebd3", land: "#8a7a5b", accent: "#606c38" },
    pages: [
      {
        text: "Alif tiba di Bajubang bersama Ayah. Di kejauhan terlihat menara besi tua yang tinggi. Kata Ayah, Bajubang dikenal sebagai kota minyak sejak dulu.",
        question: "Apa yang dilihat Alif setiba di Bajubang?",
      },
      {
        text: "Alif melihat pompa minyak bergerak naik turun pelan. Pompa itu mengambil minyak dari dalam bumi. Alif menonton dari tempat yang aman bersama petugas.",
        question: "Mengapa Alif harus menonton pompa minyak dari tempat yang aman?",
      },
      {
        text: "Pak Petugas bercerita kepada Alif tentang pekerja Bajubang zaman dahulu. Mereka bekerja keras dengan alat sederhana. Minyak dari Bajubang menggerakkan banyak kendaraan dan mesin.",
        question: "Apa manfaat minyak bumi bagi kehidupan kita?",
      },
      {
        text: "Alif belajar bahwa minyak bisa habis bila dipakai terus. Kita harus hemat lampu dan kendaraan. Matahari dan air sungai juga bisa menjadi sumber tenaga.",
        question: "Apa yang bisa kita lakukan untuk menghemat tenaga di rumah?",
      },
      {
        text: "Di taman kecil Bajubang, Alif menanam pohon bersama anak-anak setempat. Pohon membuat udara bersih di sekitar kota minyak. Semua bekerja sambil tertawa.",
        question: "Mengapa menanam pohon penting bagi kota Bajubang?",
      },
      {
        text: "Alif pulang dari Bajubang membawa cerita tentang energi dan kerja keras. Alif ingin belajar rajin agar kelak bisa menjaga bumi. Bajubang tetap dikenang sebagai kota minyak yang bersejarah.",
        question: "Apa cita-cita Alif setelah berkunjung ke Bajubang?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, visiting the historic oil town of Bajubang in the Batanghari region, Jambi, Indonesia, with an old oil pumpjack seen safely from a distance, green park trees and soft light, gentle flat shapes, no text",
  },
  {
    slug: "mersam",
    title: "Durian Runtuh di Mersam",
    subtitle: "Alif memanen durian dan bermain di tepi sungai Mersam",
    character: "Alif",
    palette: { sky: "#e8f3d8", land: "#588157", accent: "#bc6c25" },
    pages: [
      {
        text: "Alif pergi ke kebun durian di Mersam bersama Paman. Pohon durian tinggi dan rindang sekali. Bau durian harum tercium dari kejauhan.",
        question: "Apa yang tercium oleh Alif di kebun Mersam?",
      },
      {
        text: "Di Mersam, durian tidak dipetik, tetapi ditunggu sampai jatuh sendiri. Alif mendengar bunyi gedebuk pelan dari kebun. Itu tanda durian sudah matang di pohon.",
        question: "Bagaimana cara mengetahui durian sudah matang di Mersam?",
      },
      {
        text: "Alif membantu Paman mengumpulkan durian yang jatuh ke jaring pengaman. Durian berduri tajam, jadi tangan harus hati-hati. Alif memakai sarung tangan tebal pemberian Paman.",
        question: "Mengapa Alif memakai sarung tangan saat mengumpulkan durian?",
      },
      {
        text: "Di tepi sungai Mersam, Alif membelah durian bersama keluarga Paman. Dagingnya kuning, lembut, dan manis sekali. Semua makan bergantian dengan gembira.",
        question: "Bagaimana rasa durian Mersam menurut Alif?",
      },
      {
        text: "Alif menyisihkan biji durian untuk ditanam kembali. Biji ditanam di tanah yang subur dekat kebun Mersam. Kelak, biji itu tumbuh menjadi pohon durian baru.",
        question: "Mengapa biji durian perlu ditanam kembali?",
      },
      {
        text: "Sore hari, Alif pulang dari Mersam membawa satu durian untuk Ibu. Sepanjang jalan, Alif bercerita tentang kebun dan sungai. Mersam selalu harum dalam kenangan Alif.",
        question: "Untuk siapa durian yang dibawa pulang Alif dari Mersam?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, in a durian orchard in Mersam, Batanghari region, Jambi, Indonesia, with tall durian trees, fallen durian fruit and a calm river nearby, soft sunlight, gentle flat shapes, no text",
  },
  {
    slug: "maro-sebo-ulu",
    title: "Perahu ke Hulu Maro Sebo Ulu",
    subtitle: "Alif menyusuri sungai menuju kampung-kampung di hulu Batang Hari",
    character: "Alif",
    palette: { sky: "#d8ecf3", land: "#386641", accent: "#40916c" },
    pages: [
      {
        text: "Alif naik perahu menuju Maro Sebo Ulu, ke arah hulu sungai. Air semakin jernih dan sejuk. Pepohonan hijau rapat di kedua tepi sungai.",
        question: "Ke mana arah perjalanan perahu Alif di Maro Sebo Ulu?",
      },
      {
        text: "Di tengah perjalanan ke Maro Sebo Ulu, Alif melihat burung-burung beterbangan rendah. Perahu melaju pelan agar tidak mengejutkan mereka. Alif berbisik agar burung tidak terbang jauh.",
        question: "Mengapa perahu melaju pelan di dekat burung-burung?",
      },
      {
        text: "Perahu berhenti di sebuah kampung di Maro Sebo Ulu. Anak-anak kampung menyambut Alif di dermaga bambu. Mereka bermain bersama sambil bercerita tentang sungai.",
        question: "Siapa yang menyambut Alif di kampung Maro Sebo Ulu?",
      },
      {
        text: "Alif belajar menangkap ikan dengan jala kecil bersama nelayan Maro Sebo Ulu. Ikan yang kecil dilepas kembali ke sungai. Ikan kecil harus tumbuh besar dulu.",
        question: "Mengapa ikan kecil dilepas kembali ke sungai?",
      },
      {
        text: "Di kampung Maro Sebo Ulu, Alif membantu ibu-ibu menjemur hasil kebun. Ada pisang, ubi, dan sayur segar dari ladang. Semua dibagi rata untuk warga kampung.",
        question: "Hasil kebun apa saja yang dijemur di kampung itu?",
      },
      {
        text: "Perahu membawa Alif pulang menyusuri sungai dari Maro Sebo Ulu. Langit sore berwarna jingga di atas air. Alif berjanji menjaga sungai dari hulu sampai ke hilir.",
        question: "Janji apa yang dibuat Alif untuk sungai?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, on a wooden boat travelling upstream to Maro Sebo Ulu in the Batanghari region, Jambi, Indonesia, with clear river water, dense green banks and a small riverside village, soft light, gentle flat shapes, no text",
  },
  {
    slug: "maro-sebo-ilir",
    title: "Rawa Ceria Maro Sebo Ilir",
    subtitle: "Alif mengenal rawa, itik, dan kampung air di Maro Sebo Ilir",
    character: "Alif",
    palette: { sky: "#e0f2f1", land: "#6a994e", accent: "#e07a5f" },
    pages: [
      {
        text: "Alif berkunjung ke kampung air di Maro Sebo Ilir. Rumah-rumah berdiri di atas tiang kayu yang tinggi. Di bawahnya, air rawa mengalir pelan.",
        question: "Mengapa rumah di Maro Sebo Ilir berdiri di atas tiang tinggi?",
      },
      {
        text: "Di rawa Maro Sebo Ilir, Alif melihat itik-itik berenang berbaris. Itik mencari makan di air yang dangkal. Bunyi kwek-kwek membuat Alif tertawa.",
        question: "Apa yang dicari itik di air rawa?",
      },
      {
        text: "Alif membantu Kak Rina mengumpulkan telur itik di kandang kayu. Telur dibersihkan pelan-pelan agar tidak pecah. Sebagian telur akan dibuat menjadi telur asin yang gurih.",
        question: "Telur itik bisa dibuat menjadi makanan apa?",
      },
      {
        text: "Dengan perahu kecil, Alif menyusuri rawa Maro Sebo Ilir bersama Kak Rina. Teratai merah muda mekar di permukaan air. Katak bernyanyi dari balik daun teratai.",
        question: "Bunga apa yang mekar di rawa Maro Sebo Ilir?",
      },
      {
        text: "Alif belajar bahwa rawa menyimpan air saat hujan datang. Rawa yang bersih mencegah kampung kebanjiran besar. Karena itu, warga Maro Sebo Ilir tidak membuang sampah ke rawa.",
        question: "Mengapa rawa yang bersih penting bagi kampung?",
      },
      {
        text: "Sebelum pulang, Alif menggambar itik dan teratai di buku kecilnya. Maro Sebo Ilir mengajarkan Alif bahwa air adalah rumah bagi banyak makhluk. Alif ingin menjaga rawa selamanya.",
        question: "Apa yang digambar Alif di buku kecilnya?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, in a wetland village in Maro Sebo Ilir, Batanghari region, Jambi, Indonesia, with stilt houses, ducks swimming in a swamp and pink lotus flowers, soft light, gentle flat shapes, no text",
  },
  {
    slug: "batin-xxiv",
    title: "Kebun Karet Batin XXIV",
    subtitle: "Alif belajar menyadap karet dan menjaga hutan di Batin XXIV",
    character: "Alif",
    palette: { sky: "#e8f3d8", land: "#4f772d", accent: "#dda15e" },
    pages: [
      {
        text: "Pagi-pagi sekali, Alif pergi ke kebun karet di Batin XXIV bersama Pak Darma. Embun masih menempel di daun-daun. Udara kebun sejuk dan harum tanah.",
        question: "Kapan Alif pergi ke kebun karet Batin XXIV?",
      },
      {
        text: "Pak Darma menunjukkan cara menyadap batang pohon karet di Batin XXIV. Kulit batang disayat tipis dengan pisau sadap. Alif menonton dengan saksama dari dekat.",
        question: "Alat apa yang dipakai untuk menyadap pohon karet?",
      },
      {
        text: "Dari sayatan batang, getah putih menetes pelan ke mangkuk kecil. Alif membantu memegang mangkuk getah dengan hati-hati. Getah itu kelak menjadi karet untuk banyak barang.",
        question: "Barang apa saja yang dibuat dari karet?",
      },
      {
        text: "Di sela pohon karet Batin XXIV, Alif mendengar suara burung dan jangkrik bersahutan. Pak Darma berkata, kebun yang rimbun adalah rumah satwa juga. Karena itu, pohon tidak boleh ditebang sembarangan.",
        question: "Mengapa pohon di kebun tidak boleh ditebang sembarangan?",
      },
      {
        text: "Alif membantu mengumpulkan mangkuk getah yang sudah penuh. Mangkuk dibawa ke tempat penampungan di tepi kebun Batin XXIV. Pekerjaan terasa ringan karena dikerjakan bersama-sama.",
        question: "Ke mana mangkuk getah yang penuh dibawa?",
      },
      {
        text: "Alif pulang dari Batin XXIV membawa cerita tentang pohon karet dan petani yang rajin. Di rumah, Alif melihat sandal dan penghapusnya berasal dari karet. Ternyata, kebun yang jauh terasa dekat sekali.",
        question: "Benda apa di rumah Alif yang berasal dari karet?",
      },
    ],
    imagePromptBase:
      "Warm watercolor children's book illustration of Alif, a young Indonesian boy, in a rubber plantation in Batin XXIV, Batanghari region, Jambi, Indonesia, at dawn with rows of rubber trees, small latex cups and soft mist, gentle flat shapes, no text",
  },
];
export function getTheme(themeSlug: string): Theme {
  const theme = THEMES.find((t) => t.slug === themeSlug);
  if (!theme) {
    throw new Error(`Unknown theme: ${themeSlug}`);
  }
  return theme;
}
