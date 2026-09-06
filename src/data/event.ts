import type { Arena, AntrianItem, EventSilat, KategoriLomba, Pendaftaran } from "@/lib/types";

export const KATEGORI: KategoriLomba[] = [
  { id: "k-tunggal-pra", nama: "Jurus Tunggal Baku", jenis: "tunggal", kelompokUmur: "Pra-Remaja (12–13)", gender: "Campuran" },
  { id: "k-tunggal-rem-l", nama: "Jurus Tunggal Baku", jenis: "tunggal", kelompokUmur: "Remaja (14–17)", gender: "L" },
  { id: "k-tunggal-rem-p", nama: "Jurus Tunggal Baku", jenis: "tunggal", kelompokUmur: "Remaja (14–17)", gender: "P" },
  { id: "k-ganda-rem", nama: "Jurus Berpasangan", jenis: "ganda", kelompokUmur: "Remaja (14–17)", gender: "Campuran" },
  { id: "k-beregu-rem", nama: "Beregu", jenis: "beregu", kelompokUmur: "Remaja (14–17)", gender: "L" },
  { id: "k-tradisi", nama: "Seni Tradisi Perorangan", jenis: "tradisi", kelompokUmur: "Dewasa (18+)", gender: "Campuran" },
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
    kategoriIds: ["k-tunggal-pra", "k-tunggal-rem-l", "k-tunggal-rem-p", "k-ganda-rem", "k-tradisi"],
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
    kategoriIds: ["k-tunggal-rem-l", "k-tunggal-rem-p", "k-ganda-rem", "k-beregu-rem", "k-tradisi"],
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

export const eventById = (id: string): EventSilat | undefined => EVENTS.find((e) => e.id === id);
export const eventAktif = EVENTS.find((e) => e.status === "berlangsung")!;
export const eventDibuka = EVENTS.filter((e) => e.status === "dibuka");

export const ARENA: Arena[] = [
  { id: "matras-a", nama: "Matras A", eventId: "e-walikota", kategoriAktifId: "k-tunggal-rem-l" },
  { id: "matras-b", nama: "Matras B", eventId: "e-walikota", kategoriAktifId: "k-tunggal-rem-p" },
  { id: "matras-c", nama: "Matras C", eventId: "e-walikota", kategoriAktifId: "k-tradisi" },
];

/**
 * Antrian Matras A. Nomor 025 (Andi Saputra) berstatus "dipanggil" —
 * mereplikasi persis skenario pada slide "Kendali Arena Real-Time".
 */
export const ANTRIAN: AntrianItem[] = [
  { id: "q-021", arenaId: "matras-a", nomorUrut: 21, atletId: "a-015", kategoriId: "k-tunggal-rem-l", status: "selesai", jamPerkiraan: "13:40" },
  { id: "q-022", arenaId: "matras-a", nomorUrut: 22, atletId: "a-034", kategoriId: "k-tunggal-rem-l", status: "selesai", jamPerkiraan: "13:52" },
  { id: "q-023", arenaId: "matras-a", nomorUrut: 23, atletId: "a-031", kategoriId: "k-tunggal-rem-l", status: "selesai", jamPerkiraan: "14:00" },
  { id: "q-024", arenaId: "matras-a", nomorUrut: 24, atletId: "a-076", kategoriId: "k-tunggal-rem-l", status: "tampil", jamPerkiraan: "14:08" },
  { id: "q-025", arenaId: "matras-a", nomorUrut: 25, atletId: "a-025", kategoriId: "k-tunggal-rem-l", status: "dipanggil", jamPerkiraan: "14:15" },
  { id: "q-026", arenaId: "matras-a", nomorUrut: 26, atletId: "a-041", kategoriId: "k-tunggal-rem-l", status: "menunggu", jamPerkiraan: "14:23" },
  { id: "q-027", arenaId: "matras-a", nomorUrut: 27, atletId: "a-053", kategoriId: "k-tunggal-rem-l", status: "menunggu", jamPerkiraan: "14:31" },
  { id: "q-028", arenaId: "matras-a", nomorUrut: 28, atletId: "a-069", kategoriId: "k-tunggal-rem-l", status: "menunggu", jamPerkiraan: "14:39" },
  { id: "q-029", arenaId: "matras-a", nomorUrut: 29, atletId: "a-091", kategoriId: "k-tunggal-rem-l", status: "menunggu", jamPerkiraan: "14:47" },
  { id: "q-030", arenaId: "matras-a", nomorUrut: 30, atletId: "a-063", kategoriId: "k-tunggal-rem-l", status: "menunggu", jamPerkiraan: "14:55" },
];

export const antrianArena = (arenaId: string): AntrianItem[] =>
  ANTRIAN.filter((q) => q.arenaId === arenaId).sort((a, b) => a.nomorUrut - b.nomorUrut);

export const PENDAFTARAN: Pendaftaran[] = [
  { id: "p-1", atletId: "a-025", eventId: "e-walikota", kategoriId: "k-tunggal-rem-l", nomorUrut: 25, waktuDaftar: "2026-08-28T09:14:00+07:00", checkIn: "hadir" },
  { id: "p-2", atletId: "a-012", eventId: "e-walikota", kategoriId: "k-tunggal-rem-p", nomorUrut: 11, waktuDaftar: "2026-08-28T10:02:00+07:00", checkIn: "hadir" },
  { id: "p-3", atletId: "a-053", eventId: "e-walikota", kategoriId: "k-tunggal-rem-l", nomorUrut: 27, waktuDaftar: "2026-08-29T14:33:00+07:00", checkIn: "belum", didaftarkanOleh: "Pengurus Padepokan Kuntau Musi" },
  { id: "p-4", atletId: "a-038", eventId: "e-walikota", kategoriId: "k-tunggal-pra", nomorUrut: 8, waktuDaftar: "2026-08-30T08:20:00+07:00", checkIn: "belum", didaftarkanOleh: "Panitia — meja bantuan" },
  { id: "p-5", atletId: "a-047", eventId: "e-walikota", kategoriId: "k-tradisi", nomorUrut: 5, waktuDaftar: "2026-08-27T16:45:00+07:00", checkIn: "hadir" },
];

export const pendaftaranAtlet = (atletId: string): Pendaftaran[] =>
  PENDAFTARAN.filter((p) => p.atletId === atletId);
