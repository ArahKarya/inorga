import type { Atlet } from "@/lib/types";

/**
 * Data contoh. Nama atlet fiktif.
 * Atlet di bawah 17 tahun wajib punya wali terverifikasi — lihat temuan G1.
 */
export const ATLET: Atlet[] = [
  { id: "a-025", nama: "Andi Saputra", jenisKelamin: "L", tanggalLahir: "2010-03-14", umur: 16, kecamatanId: "su1", perguruanId: "psht", tinggi: 168, berat: 54, reach: 171, golonganDarah: "O", statusVerifikasi: "terverifikasi", wali: { nama: "Suparman Saputra", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 1, perak: 2, perunggu: 1 } },
  { id: "a-012", nama: "Siti Nurhaliza Putri", jenisKelamin: "P", tanggalLahir: "2009-07-22", umur: 17, kecamatanId: "sukarami", perguruanId: "tapaksuci", tinggi: 159, berat: 48, reach: 160, golonganDarah: "B", statusVerifikasi: "terverifikasi", medali: { emas: 2, perak: 0, perunggu: 1 } },
  { id: "a-031", nama: "Muhammad Rizky Ramadhan", jenisKelamin: "L", tanggalLahir: "2011-11-02", umur: 14, kecamatanId: "su2", perguruanId: "pagarnusa", tinggi: 158, berat: 45, reach: 159, golonganDarah: "A", statusVerifikasi: "terverifikasi", wali: { nama: "Nurhayati", hubungan: "Ibu", terverifikasi: true }, medali: { emas: 0, perak: 1, perunggu: 2 } },
  { id: "a-047", nama: "Dwi Anggara Putra", jenisKelamin: "L", tanggalLahir: "2008-01-30", umur: 18, kecamatanId: "plaju", perguruanId: "kuntaumusi", tinggi: 174, berat: 62, reach: 178, golonganDarah: "O", statusVerifikasi: "terverifikasi", medali: { emas: 3, perak: 1, perunggu: 0 } },
  { id: "a-008", nama: "Aisyah Rahmawati", jenisKelamin: "P", tanggalLahir: "2012-05-18", umur: 14, kecamatanId: "ib1", perguruanId: "perisaidiri", tinggi: 152, berat: 42, reach: 153, golonganDarah: "AB", statusVerifikasi: "terverifikasi", wali: { nama: "Hendri Wijaya", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 1, perak: 0, perunggu: 0 } },
  { id: "a-053", nama: "Kgs. Bagas Prayoga", jenisKelamin: "L", tanggalLahir: "2013-09-09", umur: 12, kecamatanId: "jakabaring", perguruanId: "sriwijaya", tinggi: 145, berat: 38, reach: 146, golonganDarah: "B", statusVerifikasi: "menunggu", wali: { nama: "Kgs. Hamzah", hubungan: "Ayah", terverifikasi: false }, medali: { emas: 0, perak: 0, perunggu: 1 } },
  { id: "a-019", nama: "Nabila Az-Zahra", jenisKelamin: "P", tanggalLahir: "2010-12-25", umur: 15, kecamatanId: "kemuning", perguruanId: "merpatiputih", tinggi: 161, berat: 50, reach: 162, golonganDarah: "O", statusVerifikasi: "terverifikasi", wali: { nama: "Sri Wahyuni", hubungan: "Ibu", terverifikasi: true }, medali: { emas: 1, perak: 1, perunggu: 0 } },
  { id: "a-061", nama: "Fajar Nugroho", jenisKelamin: "L", tanggalLahir: "2007-04-11", umur: 19, kecamatanId: "sako", perguruanId: "psht", tinggi: 176, berat: 66, reach: 180, golonganDarah: "A", statusVerifikasi: "terverifikasi", medali: { emas: 2, perak: 2, perunggu: 1 } },
  { id: "a-072", nama: "Tiara Salsabila", jenisKelamin: "P", tanggalLahir: "2011-02-28", umur: 15, kecamatanId: "kertapati", perguruanId: "elangputih", tinggi: 156, berat: 46, reach: 157, golonganDarah: "B", statusVerifikasi: "belum", wali: { nama: "Junaidi", hubungan: "Ayah", terverifikasi: false }, medali: { emas: 0, perak: 0, perunggu: 0 } },
  { id: "a-034", nama: "Reza Aditya Pratama", jenisKelamin: "L", tanggalLahir: "2009-08-17", umur: 17, kecamatanId: "it1", perguruanId: "tapaksuci", tinggi: 170, berat: 58, reach: 173, golonganDarah: "O", statusVerifikasi: "terverifikasi", medali: { emas: 1, perak: 1, perunggu: 2 } },
  { id: "a-088", nama: "Putri Maharani", jenisKelamin: "P", tanggalLahir: "2012-10-05", umur: 13, kecamatanId: "kalidoni", perguruanId: "pagarnusa", tinggi: 149, berat: 40, reach: 150, golonganDarah: "A", statusVerifikasi: "terverifikasi", wali: { nama: "Agus Salim", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 0, perak: 1, perunggu: 0 } },
  { id: "a-015", nama: "Ahmad Zaki Mubarok", jenisKelamin: "L", tanggalLahir: "2010-06-21", umur: 16, kecamatanId: "aal", perguruanId: "perisaidiri", tinggi: 166, berat: 53, reach: 168, golonganDarah: "AB", statusVerifikasi: "terverifikasi", wali: { nama: "Zainal Abidin", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 0, perak: 2, perunggu: 1 } },
  { id: "a-096", nama: "Rara Anggraini", jenisKelamin: "P", tanggalLahir: "2008-03-03", umur: 18, kecamatanId: "su1", perguruanId: "psht", tinggi: 163, berat: 52, reach: 165, golonganDarah: "O", statusVerifikasi: "terverifikasi", medali: { emas: 3, perak: 0, perunggu: 1 } },
  { id: "a-041", nama: "Ilham Maulana", jenisKelamin: "L", tanggalLahir: "2013-01-19", umur: 13, kecamatanId: "gandus", perguruanId: "elangputih", tinggi: 147, berat: 39, reach: 148, golonganDarah: "B", statusVerifikasi: "menunggu", wali: { nama: "Rohman", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 0, perak: 0, perunggu: 0 } },
  { id: "a-057", nama: "Cut Dinda Lestari", jenisKelamin: "P", tanggalLahir: "2009-11-30", umur: 16, kecamatanId: "ib2", perguruanId: "merpatiputih", tinggi: 158, berat: 47, reach: 159, golonganDarah: "A", statusVerifikasi: "terverifikasi", wali: { nama: "Teuku Malik", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 1, perak: 0, perunggu: 2 } },
  { id: "a-063", nama: "Yoga Pratama Wijaya", jenisKelamin: "L", tanggalLahir: "2007-09-14", umur: 18, kecamatanId: "it2", perguruanId: "kuntaumusi", tinggi: 172, berat: 61, reach: 175, golonganDarah: "O", statusVerifikasi: "terverifikasi", medali: { emas: 2, perak: 1, perunggu: 1 } },
  { id: "a-029", nama: "Salma Kirana", jenisKelamin: "P", tanggalLahir: "2011-07-07", umur: 15, kecamatanId: "su2", perguruanId: "pagarnusa", tinggi: 157, berat: 45, reach: 158, golonganDarah: "B", statusVerifikasi: "terverifikasi", wali: { nama: "Mahmud Yunus", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 0, perak: 1, perunggu: 1 } },
  { id: "a-076", nama: "Bayu Sanjaya", jenisKelamin: "L", tanggalLahir: "2012-12-12", umur: 13, kecamatanId: "bukitkecil", perguruanId: "tapaksuci", tinggi: 150, berat: 41, reach: 151, golonganDarah: "A", statusVerifikasi: "terverifikasi", wali: { nama: "Sanjaya Kusuma", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 1, perak: 0, perunggu: 0 } },
  { id: "a-084", nama: "Indah Permatasari", jenisKelamin: "P", tanggalLahir: "2010-04-26", umur: 16, kecamatanId: "sematangborang", perguruanId: "sriwijaya", tinggi: 160, berat: 49, reach: 161, golonganDarah: "AB", statusVerifikasi: "terverifikasi", wali: { nama: "Darmawan", hubungan: "Ayah", terverifikasi: true }, medali: { emas: 0, perak: 0, perunggu: 1 } },
  { id: "a-091", nama: "Rangga Adi Saputra", jenisKelamin: "L", tanggalLahir: "2008-08-08", umur: 18, kecamatanId: "it3", perguruanId: "psht", tinggi: 175, berat: 64, reach: 179, golonganDarah: "O", statusVerifikasi: "terverifikasi", medali: { emas: 1, perak: 2, perunggu: 0 } },
  { id: "a-038", nama: "Meutia Hafizah", jenisKelamin: "P", tanggalLahir: "2013-06-15", umur: 12, kecamatanId: "plaju", perguruanId: "kuntaumusi", tinggi: 144, berat: 36, reach: 145, golonganDarah: "B", statusVerifikasi: "menunggu", wali: { nama: "Hafiz Anwar", hubungan: "Ayah", terverifikasi: false }, medali: { emas: 0, perak: 0, perunggu: 0 } },
  { id: "a-069", nama: "Denny Kurniawan", jenisKelamin: "L", tanggalLahir: "2009-02-09", umur: 17, kecamatanId: "jakabaring", perguruanId: "sriwijaya", tinggi: 169, berat: 57, reach: 172, golonganDarah: "A", statusVerifikasi: "terverifikasi", medali: { emas: 0, perak: 1, perunggu: 3 } },
];

export const atletById = (id: string): Atlet | undefined => ATLET.find((a) => a.id === id);
export const namaAtlet = (id: string): string => atletById(id)?.nama ?? "—";
export const atletPerguruan = (perguruanId: string): Atlet[] =>
  ATLET.filter((a) => a.perguruanId === perguruanId);

/** Persona utama untuk demo: atlet 16 tahun, punya wali terverifikasi. */
export const ATLET_DEMO = "a-025";

export const inisial = (nama: string): string =>
  nama
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
