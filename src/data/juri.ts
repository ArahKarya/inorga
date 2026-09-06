import type { Juri, Undian } from "@/lib/types";
import { acakTerurut } from "@/lib/undian";

/** Tiga juri per matras. Data contoh. */
export const JURI: Juri[] = [
  {
    id: "j-a1",
    nama: "Juri A-1",
    lisensi: "PPSI Nasional II",
    masaBerlaku: "2027-12",
    arenaId: "matras-a",
  },
  {
    id: "j-a2",
    nama: "Juri A-2",
    lisensi: "PPSI Nasional I",
    masaBerlaku: "2026-11",
    arenaId: "matras-a",
  },
  {
    id: "j-a3",
    nama: "Juri A-3",
    lisensi: "ASTI Daerah",
    masaBerlaku: "2028-03",
    arenaId: "matras-a",
  },
  {
    id: "j-b1",
    nama: "Juri B-1",
    lisensi: "PPSI Nasional II",
    masaBerlaku: "2027-06",
    arenaId: "matras-b",
  },
  {
    id: "j-b2",
    nama: "Juri B-2",
    lisensi: "ASTI Daerah",
    masaBerlaku: "2026-12",
    arenaId: "matras-b",
  },
  {
    id: "j-b3",
    nama: "Juri B-3",
    lisensi: "PPSI Daerah",
    masaBerlaku: "2027-09",
    arenaId: "matras-b",
  },
  {
    id: "j-c1",
    nama: "Juri C-1",
    lisensi: "PPSI Nasional I",
    masaBerlaku: "2028-01",
    arenaId: "matras-c",
  },
  {
    id: "j-c2",
    nama: "Juri C-2",
    lisensi: "ASTI Nasional",
    masaBerlaku: "2027-04",
    arenaId: "matras-c",
  },
  {
    id: "j-c3",
    nama: "Juri C-3",
    lisensi: "PPSI Daerah",
    masaBerlaku: "2026-10",
    arenaId: "matras-c",
  },
];

export const juriById = (id: string): Juri | undefined =>
  JURI.find((j) => j.id === id);
export const juriArena = (arenaId: string): Juri[] =>
  JURI.filter((j) => j.arenaId === arenaId);

/** Peserta Jurus Tunggal Baku Remaja Putra di Matras A — masukan undian. */
export const PESERTA_MATRAS_A = [
  "a-015",
  "a-034",
  "a-031",
  "a-025",
  "a-069",
  "a-101",
  "a-102",
  "a-103",
  "a-104",
  "a-113",
] as const;

/**
 * Rekaman undian yang sudah terkunci untuk Matras A. Urutannya TIDAK ditulis
 * tangan — dihitung dari benih, sehingga `verifikasiUndian` selalu cocok dan
 * siapa pun bisa mereproduksinya. Benih dipilih agar Andi Saputra jatuh di
 * nomor 025, mereplikasi skenario pada slide deck.
 */
export const BENIH_MATRAS_A = 20260908;

export const UNDIAN_TERKUNCI: Undian = {
  id: "u-walikota-rem-l-a",
  eventId: "e-walikota",
  kategoriId: "k-tunggal-rem-l",
  arenaId: "matras-a",
  benih: BENIH_MATRAS_A,
  versiAlgoritma: 1,
  pesertaAsal: [...PESERTA_MATRAS_A].sort(),
  urutan: acakTerurut(PESERTA_MATRAS_A, BENIH_MATRAS_A),
  waktu: "2026-09-05T19:30:00+07:00",
  saksi: [
    "Perwakilan PSHT",
    "Perwakilan Tapak Suci",
    "Perwakilan Perisai Diri",
    "Dewan Juri Matras A",
  ],
  terkunci: true,
};
