import type { AspekPenilaian, Hasil, Nilai } from "@/lib/types";

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
  { id: "kebenaran-gerak", nama: "Kebenaran Gerak", tipe: "inti", deskripsi: "Ketepatan urutan, bentuk, dan arah jurus sesuai pakem aliran.", skalaMin: 1, skalaMaks: 10 },
  { id: "kemantapan", nama: "Kemantapan", tipe: "inti", deskripsi: "Kemantapan kuda-kuda, keseimbangan, dan penyaluran tenaga.", skalaMin: 1, skalaMaks: 10 },
  { id: "penghayatan", nama: "Penghayatan", tipe: "inti", deskripsi: "Penjiwaan, irama, dan karakter khas aliran yang dibawakan.", skalaMin: 1, skalaMaks: 10 },
  { id: "kekompakan", nama: "Kekompakan Regu", tipe: "ekstensi", deskripsi: "Keserempakan antar-anggota regu. Khusus kategori beregu.", skalaMin: 1, skalaMaks: 10 },
  { id: "busana", nama: "Kelengkapan Busana Tradisi", tipe: "ekstensi", deskripsi: "Kesesuaian busana dengan pakem daerah asal aliran.", skalaMin: 1, skalaMaks: 5 },
  { id: "musik", nama: "Keselarasan Musik Pengiring", tipe: "ekstensi", deskripsi: "Keselarasan gerak dengan gendang dan serunai pengiring.", skalaMin: 1, skalaMaks: 5 },
];

export const ASPEK_INTI = ASPEK.filter((a) => a.tipe === "inti");
export const ASPEK_EKSTENSI = ASPEK.filter((a) => a.tipe === "ekstensi");
export const aspekById = (id: string): AspekPenilaian | undefined => ASPEK.find((a) => a.id === id);

/** Rubrik yang dipakai tiap event: inti selalu ada, ekstensi berbeda-beda. */
export const RUBRIK_EVENT: Record<string, string[]> = {
  "e-festival": ["kebenaran-gerak", "kemantapan", "penghayatan", "busana", "musik"],
  "e-walikota": ["kebenaran-gerak", "kemantapan", "penghayatan", "musik"],
  "e-open": ["kebenaran-gerak", "kemantapan", "penghayatan", "kekompakan", "busana"],
};

/** Riwayat nilai aspek inti Andi Saputra — sumber grafik tren pada rapor. */
export const NILAI: Nilai[] = [
  { eventId: "e-festival", kategoriId: "k-tunggal-rem-l", atletId: "a-025", aspekId: "kebenaran-gerak", nilai: 7.4, juriId: "j-01" },
  { eventId: "e-festival", kategoriId: "k-tunggal-rem-l", atletId: "a-025", aspekId: "kemantapan", nilai: 7.0, juriId: "j-01" },
  { eventId: "e-festival", kategoriId: "k-tunggal-rem-l", atletId: "a-025", aspekId: "penghayatan", nilai: 6.8, juriId: "j-01" },
  { eventId: "e-walikota", kategoriId: "k-tunggal-rem-l", atletId: "a-025", aspekId: "kebenaran-gerak", nilai: 8.6, juriId: "j-02" },
  { eventId: "e-walikota", kategoriId: "k-tunggal-rem-l", atletId: "a-025", aspekId: "kemantapan", nilai: 8.2, juriId: "j-02" },
  { eventId: "e-walikota", kategoriId: "k-tunggal-rem-l", atletId: "a-025", aspekId: "penghayatan", nilai: 8.0, juriId: "j-02" },
];

/**
 * Tren aspek inti lintas-event. Inilah yang tidak akan mungkin dibuat bila
 * setiap event bebas memakai rubriknya sendiri tanpa inti wajib.
 */
export const TREN_INTI: { event: string; tanggal: string; nilai: Record<string, number> }[] = [
  { event: "Festival Tradisi Sumsel 2025", tanggal: "Mei 2025", nilai: { "kebenaran-gerak": 6.2, kemantapan: 5.8, penghayatan: 5.5 } },
  { event: "Piala Walikota 2025", tanggal: "Sep 2025", nilai: { "kebenaran-gerak": 6.8, kemantapan: 6.4, penghayatan: 6.1 } },
  { event: "Palembang Open 2025", tanggal: "Okt 2025", nilai: { "kebenaran-gerak": 7.1, kemantapan: 6.6, penghayatan: 6.5 } },
  { event: "Festival Tradisi Sumsel 2026", tanggal: "Mei 2026", nilai: { "kebenaran-gerak": 7.4, kemantapan: 7.0, penghayatan: 6.8 } },
  { event: "Piala Walikota 2026", tanggal: "Sep 2026", nilai: { "kebenaran-gerak": 8.6, kemantapan: 8.2, penghayatan: 8.0 } },
];

export const HASIL: Hasil[] = [
  { id: "h-1", eventId: "e-festival", kategoriId: "k-tunggal-rem-l", atletId: "a-025", peringkat: 2, medali: "perak", totalNilai: 21.2, nomorSertifikat: "KORMI/SS/2026/05/0412" },
  { id: "h-2", eventId: "e-festival", kategoriId: "k-tunggal-rem-p", atletId: "a-012", peringkat: 1, medali: "emas", totalNilai: 24.6, nomorSertifikat: "KORMI/SS/2026/05/0388" },
  { id: "h-3", eventId: "e-festival", kategoriId: "k-tradisi", atletId: "a-047", peringkat: 1, medali: "emas", totalNilai: 25.1, nomorSertifikat: "KORMI/SS/2026/05/0401" },
  { id: "h-4", eventId: "e-festival", kategoriId: "k-tunggal-rem-l", atletId: "a-034", peringkat: 3, medali: "perunggu", totalNilai: 20.4, nomorSertifikat: "KORMI/SS/2026/05/0415" },
];

export const hasilAtlet = (atletId: string): Hasil[] => HASIL.filter((h) => h.atletId === atletId);
export const hasilById = (id: string): Hasil | undefined => HASIL.find((h) => h.id === id);

/** Prestasi historis untuk portofolio — termasuk event sebelum sistem berjalan. */
export const RIWAYAT_PRESTASI: {
  id: string;
  atletId: string;
  event: string;
  penyelenggara: string;
  tanggal: string;
  kategori: string;
  medali: "emas" | "perak" | "perunggu";
  nomorSertifikat: string;
}[] = [
  { id: "r-1", atletId: "a-025", event: "Piala Walikota Palembang 2025", penyelenggara: "KORMI Kota Palembang", tanggal: "14 Sep 2025", kategori: "Jurus Tunggal Baku · Remaja", medali: "perunggu", nomorSertifikat: "KORMI/PLG/2025/09/0233" },
  { id: "r-2", atletId: "a-025", event: "Palembang Open Silat Fest 2025", penyelenggara: "Pemkot Palembang", tanggal: "18 Okt 2025", kategori: "Jurus Tunggal Baku · Remaja", medali: "perak", nomorSertifikat: "PLG/OPEN/2025/10/0117" },
  { id: "r-3", atletId: "a-025", event: "Festival Silat Tradisi Sumsel 2026", penyelenggara: "KORMI Provinsi Sumsel", tanggal: "24 Mei 2026", kategori: "Jurus Tunggal Baku · Remaja", medali: "perak", nomorSertifikat: "KORMI/SS/2026/05/0412" },
  { id: "r-4", atletId: "a-025", event: "Kejuaraan Antar-Perguruan PSHT Sumsel", penyelenggara: "PSHT Cabang Palembang", tanggal: "02 Feb 2026", kategori: "Seni Tunggal", medali: "emas", nomorSertifikat: "PSHT/PLG/2026/02/0044" },
];

export const riwayatAtlet = (atletId: string) => RIWAYAT_PRESTASI.filter((r) => r.atletId === atletId);
