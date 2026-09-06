import type { AspekPenilaian, Hasil, Nilai } from "@/lib/types";
import { hitungSkor, susunPeringkat, tentukanMedali } from "@/lib/hasil";
import { mulberry32 } from "@/lib/undian";
import { juriArena } from "@/data/juri";

/**
 * Jalan keluar temuan G13.
 *
 * Aspek INTI wajib dinilai di setiap event dengan skala yang sama. Hanya aspek
 * inti yang boleh diagregasi lintas-event menjadi tren rapor dan peta sebaran bakat.
 *
 * Aspek EKSTENSI bebas ditentukan penyelenggara masing-masing event. Ditampilkan
 * pada hasil event, tidak pernah masuk perbandingan lintas-event.
 *
 * Daftar aspek inti di bawah adalah usulan kerja — masih menunggu penetapan PPSI/ASTI.
 */
export const ASPEK: AspekPenilaian[] = [
  {
    id: "kebenaran-gerak",
    nama: "Kebenaran Gerak",
    tipe: "inti",
    deskripsi: "Ketepatan urutan, bentuk, dan arah jurus sesuai pakem aliran.",
    skalaMin: 1,
    skalaMaks: 10,
  },
  {
    id: "kemantapan",
    nama: "Kemantapan",
    tipe: "inti",
    deskripsi: "Kemantapan kuda-kuda, keseimbangan, dan penyaluran tenaga.",
    skalaMin: 1,
    skalaMaks: 10,
  },
  {
    id: "penghayatan",
    nama: "Penghayatan",
    tipe: "inti",
    deskripsi: "Penjiwaan, irama, dan karakter khas aliran yang dibawakan.",
    skalaMin: 1,
    skalaMaks: 10,
  },
  {
    id: "kekompakan",
    nama: "Kekompakan Regu",
    tipe: "ekstensi",
    deskripsi: "Keserempakan antar-anggota regu. Khusus kategori beregu.",
    skalaMin: 1,
    skalaMaks: 10,
  },
  {
    id: "busana",
    nama: "Kelengkapan Busana Tradisi",
    tipe: "ekstensi",
    deskripsi: "Kesesuaian busana dengan pakem daerah asal aliran.",
    skalaMin: 1,
    skalaMaks: 5,
  },
  {
    id: "musik",
    nama: "Keselarasan Musik Pengiring",
    tipe: "ekstensi",
    deskripsi: "Keselarasan gerak dengan gendang dan serunai pengiring.",
    skalaMin: 1,
    skalaMaks: 5,
  },
];

export const ASPEK_INTI = ASPEK.filter((a) => a.tipe === "inti");
export const ASPEK_EKSTENSI = ASPEK.filter((a) => a.tipe === "ekstensi");
export const aspekById = (id: string): AspekPenilaian | undefined =>
  ASPEK.find((a) => a.id === id);

/** Rubrik yang dipakai tiap event: inti selalu ada, ekstensi berbeda-beda. */
export const RUBRIK_EVENT: Record<string, string[]> = {
  "e-festival": [
    "kebenaran-gerak",
    "kemantapan",
    "penghayatan",
    "busana",
    "musik",
  ],
  "e-walikota": ["kebenaran-gerak", "kemantapan", "penghayatan", "musik"],
  "e-open": [
    "kebenaran-gerak",
    "kemantapan",
    "penghayatan",
    "kekompakan",
    "busana",
  ],
};

export const rubrikEvent = (eventId: string): AspekPenilaian[] =>
  (RUBRIK_EVENT[eventId] ?? []).map((id) => aspekById(id)!).filter(Boolean);

/* ------------------------------------------------------------------ */
/* Skor target ditulis tangan; nilai per juri DIBANGKITKAN darinya.    */
/* Tiga juri diberi [s−δ, s, s+δ] sehingga rerata terpangkas = s persis */
/* — konsistensi hasil terjamin secara konstruksi, bukan pengecekan.   */
/* ------------------------------------------------------------------ */

interface SkorTarget {
  eventId: string;
  kategoriId: string;
  arenaId: string;
  atletId: string;
  /** Urutan mengikuti RUBRIK_EVENT[eventId]. */
  skor: number[];
  waktu: string;
}

const F = "e-festival";
const W = "e-walikota";

const SKOR_TARGET: SkorTarget[] = [
  // Festival Tradisi Sumsel 2026 — Remaja Putra  [kb, km, ph, busana, musik]
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-104",
    skor: [7.8, 7.5, 7.3, 4.1, 4.0],
    waktu: "2026-05-23T10:05:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-025",
    skor: [7.4, 7.0, 6.8, 4.0, 3.9],
    waktu: "2026-05-23T10:14:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-034",
    skor: [7.0, 6.8, 6.6, 3.8, 3.5],
    waktu: "2026-05-23T10:23:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-031",
    skor: [6.9, 6.6, 6.3, 3.6, 3.4],
    waktu: "2026-05-23T10:32:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-015",
    skor: [6.7, 6.5, 6.4, 3.7, 3.3],
    waktu: "2026-05-23T10:41:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-069",
    skor: [6.6, 6.3, 6.1, 3.5, 3.2],
    waktu: "2026-05-23T10:50:00+07:00",
  },
  // Festival — Remaja Putri
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-p",
    arenaId: "matras-b",
    atletId: "a-012",
    skor: [8.4, 8.1, 8.1, 4.4, 4.2],
    waktu: "2026-05-23T13:05:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-p",
    arenaId: "matras-b",
    atletId: "a-019",
    skor: [7.8, 7.6, 7.7, 4.1, 4.0],
    waktu: "2026-05-23T13:14:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-p",
    arenaId: "matras-b",
    atletId: "a-057",
    skor: [7.5, 7.3, 7.2, 4.0, 3.8],
    waktu: "2026-05-23T13:23:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-p",
    arenaId: "matras-b",
    atletId: "a-029",
    skor: [7.0, 6.9, 6.7, 3.7, 3.6],
    waktu: "2026-05-23T13:32:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-p",
    arenaId: "matras-b",
    atletId: "a-084",
    skor: [6.8, 6.5, 6.6, 3.6, 3.4],
    waktu: "2026-05-23T13:41:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tunggal-rem-p",
    arenaId: "matras-b",
    atletId: "a-008",
    skor: [6.6, 6.4, 6.3, 3.5, 3.5],
    waktu: "2026-05-23T13:50:00+07:00",
  },
  // Festival — Seni Tradisi Dewasa
  {
    eventId: F,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-047",
    skor: [8.6, 8.3, 8.2, 4.6, 4.5],
    waktu: "2026-05-24T09:05:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-061",
    skor: [8.3, 8.2, 8.0, 4.4, 4.3],
    waktu: "2026-05-24T09:15:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-096",
    skor: [8.1, 7.9, 7.8, 4.3, 4.1],
    waktu: "2026-05-24T09:25:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-063",
    skor: [7.9, 7.7, 7.6, 4.2, 4.0],
    waktu: "2026-05-24T09:35:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-107",
    skor: [7.6, 7.5, 7.3, 4.1, 4.0],
    waktu: "2026-05-24T09:45:00+07:00",
  },
  {
    eventId: F,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-091",
    skor: [7.5, 7.2, 7.1, 4.0, 3.9],
    waktu: "2026-05-24T09:55:00+07:00",
  },
  // Piala Walikota 2026 — sedang berlangsung; hanya peserta yang sudah selesai tampil  [kb, km, ph, musik]
  {
    eventId: W,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-015",
    skor: [7.1, 6.9, 6.7, 3.8],
    waktu: "2026-09-06T13:47:00+07:00",
  },
  {
    eventId: W,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-031",
    skor: [7.3, 7.0, 6.8, 3.9],
    waktu: "2026-09-06T13:55:00+07:00",
  },
  {
    eventId: W,
    kategoriId: "k-tunggal-rem-l",
    arenaId: "matras-a",
    atletId: "a-103",
    skor: [6.5, 6.3, 6.2, 3.4],
    waktu: "2026-09-06T14:03:00+07:00",
  },
  {
    eventId: W,
    kategoriId: "k-tunggal-rem-p",
    arenaId: "matras-b",
    atletId: "a-012",
    skor: [8.5, 8.3, 8.2, 4.4],
    waktu: "2026-09-06T13:37:00+07:00",
  },
  {
    eventId: W,
    kategoriId: "k-tunggal-rem-p",
    arenaId: "matras-b",
    atletId: "a-019",
    skor: [7.9, 7.8, 7.7, 4.1],
    waktu: "2026-09-06T13:45:00+07:00",
  },
  {
    eventId: W,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-047",
    skor: [8.7, 8.4, 8.3, 4.6],
    waktu: "2026-09-06T13:24:00+07:00",
  },
  {
    eventId: W,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-061",
    skor: [8.4, 8.2, 8.1, 4.4],
    waktu: "2026-09-06T13:34:00+07:00",
  },
  {
    eventId: W,
    kategoriId: "k-tradisi",
    arenaId: "matras-c",
    atletId: "a-096",
    skor: [8.2, 8.0, 7.9, 4.2],
    waktu: "2026-09-06T13:44:00+07:00",
  },
];

const bulat1 = (n: number) => Math.round(n * 10) / 10;
const jepit = (n: number, a: AspekPenilaian) =>
  Math.min(a.skalaMaks, Math.max(a.skalaMin, bulat1(n)));

/** Membangkitkan baris nilai per juri dari skor target — deterministik (benih tetap). */
function bangkitNilai(target: readonly SkorTarget[]): Nilai[] {
  const acak = mulberry32(90620);
  const rows: Nilai[] = [];
  for (const t of target) {
    const rubrik = rubrikEvent(t.eventId);
    const juri = juriArena(t.arenaId);
    rubrik.forEach((aspek, i) => {
      const s = t.skor[i];
      const d1 = bulat1(0.1 + acak() * 0.4);
      const d2 = bulat1(0.1 + acak() * 0.4);
      const tiga = [jepit(s - d1, aspek), bulat1(s), jepit(s + d2, aspek)];
      juri.forEach((j, k) => {
        rows.push({
          eventId: t.eventId,
          kategoriId: t.kategoriId,
          atletId: t.atletId,
          aspekId: aspek.id,
          nilai: tiga[k],
          juriId: j.id,
          waktu: t.waktu,
          terkunci: true,
        });
      });
    });
  }
  return rows;
}

export const NILAI: Nilai[] = bangkitNilai(SKOR_TARGET);

export const nilaiPeserta = (
  rows: readonly Nilai[],
  eventId: string,
  kategoriId: string,
  atletId: string,
): Nilai[] =>
  rows.filter(
    (r) =>
      r.eventId === eventId &&
      r.kategoriId === kategoriId &&
      r.atletId === atletId,
  );

/** Nomor sertifikat yang sudah beredar di materi demo sebelumnya — dipertahankan. */
const NOMOR_TETAP: Record<string, string> = {
  "a-012": "KORMI/SS/2026/05/0388",
  "a-047": "KORMI/SS/2026/05/0401",
  "a-025": "KORMI/SS/2026/05/0412",
  "a-034": "KORMI/SS/2026/05/0415",
};

/**
 * Hasil event yang sudah selesai DITURUNKAN dari nilai juri — bukan ditulis
 * tangan — sehingga peringkat, medali, dan total selalu konsisten dengan nilai.
 */
function turunkanHasil(eventId: string, rows: readonly Nilai[]): Hasil[] {
  const rubrik = rubrikEvent(eventId);
  const kategoriIds = [
    ...new Set(
      rows.filter((r) => r.eventId === eventId).map((r) => r.kategoriId),
    ),
  ];
  const hasil: Hasil[] = [];
  let n = 420;
  for (const kategoriId of kategoriIds) {
    const atletIds = [
      ...new Set(
        rows
          .filter((r) => r.eventId === eventId && r.kategoriId === kategoriId)
          .map((r) => r.atletId),
      ),
    ];
    const skor = atletIds.map((id) =>
      hitungSkor(id, nilaiPeserta(rows, eventId, kategoriId, id), rubrik),
    );
    susunPeringkat(skor).forEach((s, i) => {
      const nomor =
        NOMOR_TETAP[s.atletId] ??
        `KORMI/SS/2026/05/${String(n++).padStart(4, "0")}`;
      hasil.push({
        id: `h-${eventId}-${kategoriId}-${s.atletId}`,
        eventId,
        kategoriId,
        atletId: s.atletId,
        peringkat: i + 1,
        medali: tentukanMedali(i + 1),
        totalNilai: s.total,
        nomorSertifikat: nomor,
        sumber: "sistem",
      });
    });
  }
  return hasil;
}

export const HASIL: Hasil[] = turunkanHasil("e-festival", NILAI);

export const hasilAtlet = (atletId: string): Hasil[] =>
  HASIL.filter((h) => h.atletId === atletId);
export const hasilEvent = (eventId: string): Hasil[] =>
  HASIL.filter((h) => h.eventId === eventId);

/**
 * Prestasi arsip — event sebelum sistem berjalan, tanpa nilai juri pendukung.
 * Masuk portofolio, TIDAK masuk klasemen live.
 */
export interface Riwayat {
  id: string;
  atletId: string;
  event: string;
  penyelenggara: string;
  tanggal: string;
  kategori: string;
  medali: "emas" | "perak" | "perunggu";
  nomorSertifikat: string;
}

const r = (
  id: string,
  atletId: string,
  event: string,
  penyelenggara: string,
  tanggal: string,
  kategori: string,
  medali: Riwayat["medali"],
  nomorSertifikat: string,
): Riwayat => ({
  id,
  atletId,
  event,
  penyelenggara,
  tanggal,
  kategori,
  medali,
  nomorSertifikat,
});

const PW25 = "Piala Walikota Palembang 2025",
  KP = "KORMI Kota Palembang";
const PO25 = "Palembang Open Silat Fest 2025",
  PP = "Pemkot Palembang";
const FS25 = "Festival Silat Tradisi Sumsel 2025",
  KS = "KORMI Provinsi Sumsel";
const KD25 = "Kejurda Pencak Silat Sumsel 2025",
  PS = "PPSI Sumsel";

export const RIWAYAT_PRESTASI: Riwayat[] = [
  r(
    "r-1",
    "a-025",
    PW25,
    KP,
    "14 Sep 2025",
    "Jurus Tunggal Baku · Remaja",
    "perunggu",
    "KORMI/PLG/2025/09/0233",
  ),
  r(
    "r-2",
    "a-025",
    PO25,
    PP,
    "18 Okt 2025",
    "Jurus Tunggal Baku · Remaja",
    "perak",
    "PLG/OPEN/2025/10/0117",
  ),
  r(
    "r-3",
    "a-025",
    "Kejuaraan Antar-Perguruan PSHT Sumsel",
    "PSHT Cabang Palembang",
    "02 Feb 2026",
    "Seni Tunggal",
    "emas",
    "PSHT/PLG/2026/02/0044",
  ),
  r(
    "r-4",
    "a-012",
    PW25,
    KP,
    "14 Sep 2025",
    "Jurus Tunggal Baku · Remaja Putri",
    "emas",
    "KORMI/PLG/2025/09/0201",
  ),
  r(
    "r-5",
    "a-012",
    PO25,
    PP,
    "18 Okt 2025",
    "Jurus Tunggal Baku · Remaja Putri",
    "emas",
    "PLG/OPEN/2025/10/0088",
  ),
  r(
    "r-6",
    "a-012",
    KD25,
    PS,
    "22 Nov 2025",
    "Seni Tunggal Putri",
    "perunggu",
    "PPSI/SS/2025/11/0152",
  ),
  r(
    "r-7",
    "a-047",
    FS25,
    KS,
    "24 Mei 2025",
    "Seni Tradisi Perorangan",
    "emas",
    "KORMI/SS/2025/05/0311",
  ),
  r(
    "r-8",
    "a-047",
    PO25,
    PP,
    "18 Okt 2025",
    "Seni Tradisi Perorangan",
    "emas",
    "PLG/OPEN/2025/10/0140",
  ),
  r(
    "r-9",
    "a-047",
    KD25,
    PS,
    "22 Nov 2025",
    "Seni Tunggal Dewasa",
    "perak",
    "PPSI/SS/2025/11/0167",
  ),
  r(
    "r-10",
    "a-061",
    FS25,
    KS,
    "24 Mei 2025",
    "Seni Tradisi Perorangan",
    "perak",
    "KORMI/SS/2025/05/0312",
  ),
  r(
    "r-11",
    "a-061",
    PW25,
    KP,
    "14 Sep 2025",
    "Seni Tradisi Perorangan",
    "emas",
    "KORMI/PLG/2025/09/0260",
  ),
  r(
    "r-12",
    "a-061",
    KD25,
    PS,
    "22 Nov 2025",
    "Seni Tunggal Dewasa",
    "perak",
    "PPSI/SS/2025/11/0168",
  ),
  r(
    "r-13",
    "a-096",
    PW25,
    KP,
    "14 Sep 2025",
    "Seni Tradisi Perorangan",
    "emas",
    "KORMI/PLG/2025/09/0261",
  ),
  r(
    "r-14",
    "a-096",
    PO25,
    PP,
    "18 Okt 2025",
    "Seni Tradisi Perorangan",
    "perak",
    "PLG/OPEN/2025/10/0141",
  ),
  r(
    "r-15",
    "a-063",
    PW25,
    KP,
    "14 Sep 2025",
    "Seni Tradisi Perorangan",
    "perunggu",
    "KORMI/PLG/2025/09/0262",
  ),
  r(
    "r-16",
    "a-063",
    PO25,
    PP,
    "18 Okt 2025",
    "Seni Tradisi Perorangan",
    "emas",
    "PLG/OPEN/2025/10/0142",
  ),
  r(
    "r-17",
    "a-034",
    PW25,
    KP,
    "14 Sep 2025",
    "Jurus Tunggal Baku · Remaja",
    "emas",
    "KORMI/PLG/2025/09/0232",
  ),
  r(
    "r-18",
    "a-034",
    PO25,
    PP,
    "18 Okt 2025",
    "Jurus Tunggal Baku · Remaja",
    "perunggu",
    "PLG/OPEN/2025/10/0118",
  ),
  r(
    "r-19",
    "a-031",
    PO25,
    PP,
    "18 Okt 2025",
    "Jurus Tunggal Baku · Remaja",
    "perunggu",
    "PLG/OPEN/2025/10/0119",
  ),
  r(
    "r-20",
    "a-031",
    KD25,
    PS,
    "22 Nov 2025",
    "Seni Tunggal Remaja",
    "perak",
    "PPSI/SS/2025/11/0140",
  ),
  r(
    "r-21",
    "a-019",
    PO25,
    PP,
    "18 Okt 2025",
    "Jurus Tunggal Baku · Remaja Putri",
    "perak",
    "PLG/OPEN/2025/10/0089",
  ),
  r(
    "r-22",
    "a-019",
    PW25,
    KP,
    "14 Sep 2025",
    "Jurus Tunggal Baku · Remaja Putri",
    "emas",
    "KORMI/PLG/2025/09/0202",
  ),
  r(
    "r-23",
    "a-057",
    PW25,
    KP,
    "14 Sep 2025",
    "Jurus Tunggal Baku · Remaja Putri",
    "perunggu",
    "KORMI/PLG/2025/09/0203",
  ),
  r(
    "r-24",
    "a-015",
    PW25,
    KP,
    "14 Sep 2025",
    "Jurus Tunggal Baku · Remaja",
    "perak",
    "KORMI/PLG/2025/09/0234",
  ),
  r(
    "r-25",
    "a-069",
    PW25,
    KP,
    "14 Sep 2025",
    "Jurus Tunggal Baku · Remaja",
    "perunggu",
    "KORMI/PLG/2025/09/0235",
  ),
  r(
    "r-26",
    "a-091",
    FS25,
    KS,
    "24 Mei 2025",
    "Seni Tradisi Perorangan",
    "perunggu",
    "KORMI/SS/2025/05/0313",
  ),
  r(
    "r-27",
    "a-104",
    PO25,
    PP,
    "18 Okt 2025",
    "Jurus Tunggal Baku · Remaja",
    "perak",
    "PLG/OPEN/2025/10/0120",
  ),
  r(
    "r-28",
    "a-102",
    KD25,
    PS,
    "22 Nov 2025",
    "Seni Tunggal Remaja",
    "emas",
    "PPSI/SS/2025/11/0141",
  ),
  r(
    "r-29",
    "a-107",
    PW25,
    KP,
    "14 Sep 2025",
    "Seni Tradisi Perorangan",
    "perak",
    "KORMI/PLG/2025/09/0263",
  ),
  r(
    "r-30",
    "a-110",
    FS25,
    KS,
    "24 Mei 2025",
    "Seni Tradisi Perorangan",
    "emas",
    "KORMI/SS/2025/05/0310",
  ),
  r(
    "r-31",
    "a-108",
    PO25,
    PP,
    "18 Okt 2025",
    "Seni Tradisi Perorangan",
    "perunggu",
    "PLG/OPEN/2025/10/0143",
  ),
  r(
    "r-32",
    "a-008",
    PW25,
    KP,
    "14 Sep 2025",
    "Jurus Tunggal Baku · Pra-Remaja",
    "emas",
    "KORMI/PLG/2025/09/0180",
  ),
];

export const riwayatAtlet = (atletId: string): Riwayat[] =>
  RIWAYAT_PRESTASI.filter((x) => x.atletId === atletId);
