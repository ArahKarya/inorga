/**
 * Model data INORGA.
 *
 * Catatan penting untuk fase produksi:
 * - `Atlet` TIDAK menyimpan NIK. Verifikasi Dukcapil dilakukan sekali, yang
 *   disimpan hanya `statusVerifikasi` + `nikHash` untuk deteksi duplikat.
 *   Lihat temuan G2 pada dokumen bedah kelayakan.
 * - Penilaian disimpan sebagai baris (event, kategori, atlet, aspek, nilai, juri),
 *   bukan kolom tetap, agar rubrik bisa berbeda antar-event tanpa mematikan
 *   perbandingan lintas-event. Lihat temuan G13.
 */

export type Peran = "atlet" | "perguruan" | "panitia" | "pemkot";

export type Zona = "Ilir" | "Ulu";

export interface Kecamatan {
  id: string;
  nama: string;
  zona: Zona;
  /** Posisi pada peta stilasi, ruang koordinat 0-100. Bukan koordinat geografis. */
  x: number;
  y: number;
  /** Penempatan label pada peta, ditentukan manual agar tidak saling tabrakan. */
  lp: "atas" | "bawah" | "kiri" | "kanan";
  jumlahAtlet: number;
  jumlahPerguruan: number;
}

export type JenisPerguruan = "nasional" | "lokal";

export interface Perguruan {
  id: string;
  nama: string;
  singkatan: string;
  jenis: JenisPerguruan;
  kecamatanId: string;
  ketua: string;
  berdiri: number;
  jumlahAnggota: number;
}

export type StatusVerifikasi = "terverifikasi" | "menunggu" | "belum";

export interface Atlet {
  id: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tanggalLahir: string;
  umur: number;
  kecamatanId: string;
  perguruanId: string;
  tinggi: number;
  berat: number;
  reach: number;
  golonganDarah: string;
  statusVerifikasi: StatusVerifikasi;
  /** Wajib untuk atlet di bawah 17 tahun. Lihat temuan G1. */
  wali?: { nama: string; hubungan: string; terverifikasi: boolean };
  medali: { emas: number; perak: number; perunggu: number };
}

export type JenisKategori = "tunggal" | "ganda" | "beregu" | "tradisi";

export interface KategoriLomba {
  id: string;
  nama: string;
  jenis: JenisKategori;
  kelompokUmur: string;
  gender: "L" | "P" | "Campuran";
}

export type StatusEvent = "dibuka" | "berlangsung" | "selesai";

export interface EventSilat {
  id: string;
  nama: string;
  penyelenggara: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  kecamatanId: string;
  status: StatusEvent;
  kategoriIds: string[];
  jumlahPeserta: number;
  kuota: number;
}

export type StatusCheckIn = "belum" | "hadir" | "tidak-hadir";

export interface Pendaftaran {
  id: string;
  atletId: string;
  eventId: string;
  kategoriId: string;
  nomorUrut: number;
  waktuDaftar: string;
  checkIn: StatusCheckIn;
  /** Diisi bila didaftarkan oleh panitia atau perguruan. Lihat temuan G12. */
  didaftarkanOleh?: string;
}

export interface Arena {
  id: string;
  nama: string;
  eventId: string;
  kategoriAktifId: string;
}

export type StatusAntrian = "selesai" | "tampil" | "dipanggil" | "menunggu";

export interface AntrianItem {
  id: string;
  arenaId: string;
  nomorUrut: number;
  atletId: string;
  kategoriId: string;
  status: StatusAntrian;
  jamPerkiraan: string;
}

/**
 * Aspek inti wajib dinilai di setiap event dan boleh diagregasi lintas-event.
 * Aspek ekstensi bebas ditentukan penyelenggara dan hanya tampil di hasil event.
 */
export interface AspekPenilaian {
  id: string;
  nama: string;
  tipe: "inti" | "ekstensi";
  deskripsi: string;
  skalaMin: number;
  skalaMaks: number;
}

export interface Nilai {
  eventId: string;
  kategoriId: string;
  atletId: string;
  aspekId: string;
  nilai: number;
  juriId: string;
}

export type Medali = "emas" | "perak" | "perunggu" | null;

export interface Hasil {
  id: string;
  eventId: string;
  kategoriId: string;
  atletId: string;
  peringkat: number;
  medali: Medali;
  totalNilai: number;
  nomorSertifikat: string;
}
