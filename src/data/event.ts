import type {
  Arena,
  AntrianItem,
  EventSilat,
  KategoriLomba,
  Pendaftaran,
  StatusAntrian,
} from "@/lib/types";
import { UNDIAN_TERKUNCI } from "@/data/juri";

export const KATEGORI: KategoriLomba[] = [
  {
    id: "k-tunggal-pra",
    nama: "Jurus Tunggal Baku",
    jenis: "tunggal",
    kelompokUmur: "Pra-Remaja (12–13)",
    gender: "Campuran",
  },
  {
    id: "k-tunggal-rem-l",
    nama: "Jurus Tunggal Baku",
    jenis: "tunggal",
    kelompokUmur: "Remaja (14–17)",
    gender: "L",
  },
  {
    id: "k-tunggal-rem-p",
    nama: "Jurus Tunggal Baku",
    jenis: "tunggal",
    kelompokUmur: "Remaja (14–17)",
    gender: "P",
  },
  {
    id: "k-ganda-rem",
    nama: "Jurus Berpasangan",
    jenis: "ganda",
    kelompokUmur: "Remaja (14–17)",
    gender: "Campuran",
  },
  {
    id: "k-beregu-rem",
    nama: "Beregu",
    jenis: "beregu",
    kelompokUmur: "Remaja (14–17)",
    gender: "L",
  },
  {
    id: "k-tradisi",
    nama: "Seni Tradisi Perorangan",
    jenis: "tradisi",
    kelompokUmur: "Dewasa (18+)",
    gender: "Campuran",
  },
];

export const kategoriById = (id: string): KategoriLomba | undefined =>
  KATEGORI.find((k) => k.id === id);
export const labelKategori = (id: string): string => {
  const k = kategoriById(id);
  return k ? `${k.nama} · ${k.kelompokUmur}` : "—";
};

export const EVENTS: EventSilat[] = [
  {
    id: "e-walikota",
    nama: "Kejuaraan Silat Tradisi Piala Walikota Palembang 2026",
    penyelenggara: "KORMI Kota Palembang",
    tanggalMulai: "2026-09-06",
    tanggalSelesai: "2026-09-07",
    lokasi: "GOR Ranau, Jakabaring Sport City",
    kecamatanId: "jakabaring",
    status: "berlangsung",
    kategoriIds: [
      "k-tunggal-pra",
      "k-tunggal-rem-l",
      "k-tunggal-rem-p",
      "k-ganda-rem",
      "k-tradisi",
    ],
    jumlahPeserta: 184,
    kuota: 200,
  },
  {
    id: "e-open",
    nama: "Palembang Open Silat Fest 2026",
    penyelenggara: "Pemkot Palembang & PPSI Sumsel",
    tanggalMulai: "2026-10-15",
    tanggalSelesai: "2026-10-17",
    lokasi: "Benteng Kuto Besak",
    kecamatanId: "bukitkecil",
    status: "dibuka",
    kategoriIds: [
      "k-tunggal-rem-l",
      "k-tunggal-rem-p",
      "k-ganda-rem",
      "k-beregu-rem",
      "k-tradisi",
    ],
    jumlahPeserta: 67,
    kuota: 320,
  },
  {
    id: "e-festival",
    nama: "Festival Silat Tradisi Sumatera Selatan 2026",
    penyelenggara: "KORMI Provinsi Sumsel",
    tanggalMulai: "2026-05-22",
    tanggalSelesai: "2026-05-24",
    lokasi: "Gedung Kesenian Palembang",
    kecamatanId: "it1",
    status: "selesai",
    kategoriIds: ["k-tunggal-rem-l", "k-tunggal-rem-p", "k-tradisi"],
    jumlahPeserta: 241,
    kuota: 250,
  },
];

export const eventById = (id: string): EventSilat | undefined =>
  EVENTS.find((e) => e.id === id);
export const eventAktif = EVENTS.find((e) => e.status === "berlangsung")!;
export const eventDibuka = EVENTS.filter((e) => e.status === "dibuka");

export const ARENA: Arena[] = [
  {
    id: "matras-a",
    nama: "Matras A",
    eventId: "e-walikota",
    kategoriAktifId: "k-tunggal-rem-l",
    jadwal: [
      {
        kategoriId: "k-tunggal-pra",
        hari: 1,
        mulai: "09:00",
        selesai: "11:30",
      },
      {
        kategoriId: "k-tunggal-rem-l",
        hari: 1,
        mulai: "13:00",
        selesai: "16:00",
      },
      { kategoriId: "k-ganda-rem", hari: 2, mulai: "09:00", selesai: "12:00" },
    ],
  },
  {
    id: "matras-b",
    nama: "Matras B",
    eventId: "e-walikota",
    kategoriAktifId: "k-tunggal-rem-p",
    jadwal: [
      {
        kategoriId: "k-tunggal-rem-p",
        hari: 1,
        mulai: "13:00",
        selesai: "16:00",
      },
      {
        kategoriId: "k-tunggal-pra",
        hari: 2,
        mulai: "09:00",
        selesai: "11:30",
      },
    ],
  },
  {
    id: "matras-c",
    nama: "Matras C",
    eventId: "e-walikota",
    kategoriAktifId: "k-tradisi",
    jadwal: [
      { kategoriId: "k-tradisi", hari: 1, mulai: "13:00", selesai: "17:00" },
      { kategoriId: "k-tradisi", hari: 2, mulai: "09:00", selesai: "12:00" },
    ],
  },
];

export const arenaById = (id: string): Arena | undefined =>
  ARENA.find((a) => a.id === id);

const jam = (mulaiMenit: number, i: number, langkah: number): string => {
  const m = mulaiMenit + i * langkah;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

const statusUrut = (i: number, selesai: number): StatusAntrian =>
  i < selesai
    ? "selesai"
    : i === selesai
      ? "tampil"
      : i === selesai + 1
        ? "dipanggil"
        : "menunggu";

const buatAntrian = (
  arenaId: string,
  kategoriId: string,
  atlet: readonly string[],
  nomorAwal: number,
  selesai: number,
  mulaiMenit: number,
  langkah: number,
): AntrianItem[] =>
  atlet.map((atletId, i) => ({
    id: `q-${arenaId.slice(-1)}-${nomorAwal + i}`,
    arenaId,
    nomorUrut: nomorAwal + i,
    atletId,
    kategoriId,
    status: statusUrut(i, selesai),
    jamPerkiraan: jam(mulaiMenit, i, langkah),
  }));

/**
 * Antrian Matras A diturunkan dari urutan undian yang terkunci — bukan ditulis
 * tangan. Nomor 025 (Andi Saputra) berstatus "dipanggil", mereplikasi persis
 * skenario pada slide "Kendali Arena Real-Time".
 */
export const ANTRIAN: AntrianItem[] = [
  ...buatAntrian(
    "matras-a",
    "k-tunggal-rem-l",
    UNDIAN_TERKUNCI.urutan,
    21,
    3,
    13 * 60 + 40,
    8,
  ),
  ...buatAntrian(
    "matras-b",
    "k-tunggal-rem-p",
    ["a-012", "a-019", "a-008", "a-057", "a-029", "a-084", "a-105", "a-106"],
    11,
    2,
    13 * 60 + 30,
    8,
  ),
  ...buatAntrian(
    "matras-c",
    "k-tradisi",
    ["a-047", "a-061", "a-096", "a-063", "a-091", "a-107", "a-108", "a-110"],
    1,
    3,
    13 * 60 + 15,
    10,
  ),
];

export const antrianArena = (arenaId: string): AntrianItem[] =>
  ANTRIAN.filter((q) => q.arenaId === arenaId).sort(
    (a, b) => a.nomorUrut - b.nomorUrut,
  );

/** Setiap peserta antrian pasti terdaftar — pendaftaran dibangkitkan dari antrian. */
const dariAntrian: Pendaftaran[] = ANTRIAN.map((q, i) => ({
  id: `p-${q.id}`,
  atletId: q.atletId,
  eventId: "e-walikota",
  kategoriId: q.kategoriId,
  nomorUrut: q.nomorUrut,
  waktuDaftar: `2026-08-${String(20 + (i % 9)).padStart(2, "0")}T${String(8 + (i % 9)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00+07:00`,
  checkIn: q.status !== "menunggu" ? "hadir" : i % 3 === 0 ? "belum" : "hadir",
}));

/** Jalur pendaftaran dibantu — temuan G12. */
const dibantu: Pendaftaran[] = [
  {
    id: "p-bantu-1",
    atletId: "a-053",
    eventId: "e-walikota",
    kategoriId: "k-tunggal-pra",
    nomorUrut: 7,
    waktuDaftar: "2026-08-29T14:33:00+07:00",
    checkIn: "belum",
    didaftarkanOleh: "Pengurus Perguruan Silat Tradisi Sriwijaya",
  },
  {
    id: "p-bantu-2",
    atletId: "a-038",
    eventId: "e-walikota",
    kategoriId: "k-tunggal-pra",
    nomorUrut: 8,
    waktuDaftar: "2026-08-30T08:20:00+07:00",
    checkIn: "belum",
    didaftarkanOleh: "Panitia — meja bantuan",
  },
  {
    id: "p-bantu-3",
    atletId: "a-041",
    eventId: "e-walikota",
    kategoriId: "k-tunggal-pra",
    nomorUrut: 9,
    waktuDaftar: "2026-08-30T09:05:00+07:00",
    checkIn: "belum",
    didaftarkanOleh: "Pengurus Padepokan Elang Putih Gandus",
  },
  {
    id: "p-bantu-4",
    atletId: "a-076",
    eventId: "e-walikota",
    kategoriId: "k-tunggal-pra",
    nomorUrut: 10,
    waktuDaftar: "2026-08-31T10:12:00+07:00",
    checkIn: "belum",
  },
  {
    id: "p-bantu-5",
    atletId: "a-111",
    eventId: "e-walikota",
    kategoriId: "k-tunggal-pra",
    nomorUrut: 11,
    waktuDaftar: "2026-08-31T10:40:00+07:00",
    checkIn: "belum",
    didaftarkanOleh: "Pengurus Padepokan Kuntau Musi",
  },
  {
    id: "p-bantu-6",
    atletId: "a-112",
    eventId: "e-walikota",
    kategoriId: "k-tunggal-pra",
    nomorUrut: 12,
    waktuDaftar: "2026-09-01T15:00:00+07:00",
    checkIn: "belum",
  },
];

/** Pendaftar Palembang Open — belum diundi, nomor urut 0. Masukan halaman undian. */
const pendaftarOpen: Pendaftaran[] = [
  ...[
    "a-025",
    "a-034",
    "a-031",
    "a-015",
    "a-069",
    "a-101",
    "a-102",
    "a-103",
    "a-104",
    "a-113",
  ].map((atletId, i) => ({
    id: `p-open-l-${i}`,
    atletId,
    eventId: "e-open",
    kategoriId: "k-tunggal-rem-l",
    nomorUrut: 0,
    waktuDaftar: `2026-09-0${1 + (i % 5)}T1${i % 10}:00:00+07:00`,
    checkIn: "belum" as const,
  })),
  ...["a-012", "a-019", "a-057", "a-029", "a-084", "a-105", "a-106"].map(
    (atletId, i) => ({
      id: `p-open-p-${i}`,
      atletId,
      eventId: "e-open",
      kategoriId: "k-tunggal-rem-p",
      nomorUrut: 0,
      waktuDaftar: `2026-09-0${1 + (i % 5)}T1${i % 10}:30:00+07:00`,
      checkIn: "belum" as const,
    }),
  ),
];

export const PENDAFTARAN: Pendaftaran[] = [
  ...dariAntrian,
  ...dibantu,
  ...pendaftarOpen,
];

export const pendaftaranAtlet = (atletId: string): Pendaftaran[] =>
  PENDAFTARAN.filter((p) => p.atletId === atletId);
export const pendaftaranEvent = (
  eventId: string,
  kategoriId?: string,
): Pendaftaran[] =>
  PENDAFTARAN.filter(
    (p) =>
      p.eventId === eventId && (!kategoriId || p.kategoriId === kategoriId),
  );
