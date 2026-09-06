import type { Kecamatan } from "@/lib/types";

/**
 * 18 kecamatan Kota Palembang.
 * Koordinat x/y adalah posisi pada peta stilasi (ruang 0-100), disusun kasar
 * mengikuti geografi: zona Ilir di utara Sungai Musi, zona Ulu di selatan.
 */
export const KECAMATAN: Kecamatan[] = [
  { id: "gandus", nama: "Gandus", zona: "Ilir", x: 14, y: 52, lp: "bawah", jumlahAtlet: 38, jumlahPerguruan: 3 },
  { id: "aal", nama: "Alang-Alang Lebar", zona: "Ilir", x: 24, y: 26, lp: "bawah", jumlahAtlet: 51, jumlahPerguruan: 4 },
  { id: "sukarami", nama: "Sukarami", zona: "Ilir", x: 36, y: 17, lp: "bawah", jumlahAtlet: 96, jumlahPerguruan: 7 },
  { id: "ib1", nama: "Ilir Barat I", zona: "Ilir", x: 31, y: 48, lp: "atas", jumlahAtlet: 74, jumlahPerguruan: 5 },
  { id: "ib2", nama: "Ilir Barat II", zona: "Ilir", x: 31, y: 58, lp: "bawah", jumlahAtlet: 42, jumlahPerguruan: 3 },
  { id: "bukitkecil", nama: "Bukit Kecil", zona: "Ilir", x: 41, y: 53, lp: "atas", jumlahAtlet: 33, jumlahPerguruan: 2 },
  { id: "kemuning", nama: "Kemuning", zona: "Ilir", x: 47, y: 39, lp: "bawah", jumlahAtlet: 64, jumlahPerguruan: 5 },
  { id: "it1", nama: "Ilir Timur I", zona: "Ilir", x: 52, y: 52, lp: "kanan", jumlahAtlet: 58, jumlahPerguruan: 4 },
  { id: "it2", nama: "Ilir Timur II", zona: "Ilir", x: 62, y: 46, lp: "kanan", jumlahAtlet: 47, jumlahPerguruan: 3 },
  { id: "it3", nama: "Ilir Timur III", zona: "Ilir", x: 55, y: 31, lp: "kiri", jumlahAtlet: 29, jumlahPerguruan: 2 },
  { id: "sako", nama: "Sako", zona: "Ilir", x: 63, y: 22, lp: "atas", jumlahAtlet: 71, jumlahPerguruan: 5 },
  { id: "sematangborang", nama: "Sematang Borang", zona: "Ilir", x: 73, y: 25, lp: "bawah", jumlahAtlet: 26, jumlahPerguruan: 2 },
  { id: "kalidoni", nama: "Kalidoni", zona: "Ilir", x: 73, y: 38, lp: "kanan", jumlahAtlet: 55, jumlahPerguruan: 4 },
  { id: "su1", nama: "Seberang Ulu I", zona: "Ulu", x: 45, y: 69, lp: "atas", jumlahAtlet: 112, jumlahPerguruan: 8 },
  { id: "su2", nama: "Seberang Ulu II", zona: "Ulu", x: 33, y: 76, lp: "bawah", jumlahAtlet: 87, jumlahPerguruan: 6 },
  { id: "jakabaring", nama: "Jakabaring", zona: "Ulu", x: 57, y: 79, lp: "bawah", jumlahAtlet: 68, jumlahPerguruan: 4 },
  { id: "plaju", nama: "Plaju", zona: "Ulu", x: 69, y: 65, lp: "bawah", jumlahAtlet: 63, jumlahPerguruan: 4 },
  { id: "kertapati", nama: "Kertapati", zona: "Ulu", x: 22, y: 79, lp: "kiri", jumlahAtlet: 49, jumlahPerguruan: 3 },
];

export const kecamatanById = (id: string): Kecamatan | undefined =>
  KECAMATAN.find((k) => k.id === id);

export const namaKecamatan = (id: string): string =>
  kecamatanById(id)?.nama ?? "—";

export const totalAtlet = KECAMATAN.reduce((n, k) => n + k.jumlahAtlet, 0);
export const totalPerguruan = KECAMATAN.reduce((n, k) => n + k.jumlahPerguruan, 0);
export const atletTerbanyak = [...KECAMATAN].sort((a, b) => b.jumlahAtlet - a.jumlahAtlet);

/**
 * Ambang label pada peta. Tiga kecamatan dengan atlet paling sedikit
 * (Bukit Kecil, Ilir Timur III, Sematang Borang) berada di kluster terpadat —
 * labelnya baru muncul saat kursor diarahkan, agar label lain tidak bertumpuk.
 */
export const AMBANG_LABEL_PETA = 38;
