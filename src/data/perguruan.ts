import type { Perguruan } from "@/lib/types";

/**
 * DATA CONTOH — bukan data sungguhan.
 *
 * Nama perguruan nasional dipakai agar konteks demo terasa nyata; organisasi
 * tersebut memang ada di Palembang. Namun SELURUH atribut di bawah ini fiktif:
 * nama pengurus, tahun berdiri, jumlah anggota, dan kecamatan kedudukan.
 * Tidak satu pun diambil dari sumber resmi organisasi yang bersangkutan.
 */
export const PERGURUAN: Perguruan[] = [
  { id: "psht", nama: "Persaudaraan Setia Hati Terate", singkatan: "PSHT", jenis: "nasional", kecamatanId: "su1", ketua: "(nama contoh)", berdiri: 1976, jumlahAnggota: 148 },
  { id: "tapaksuci", nama: "Tapak Suci Putera Muhammadiyah", singkatan: "Tapak Suci", jenis: "nasional", kecamatanId: "sukarami", ketua: "(nama contoh)", berdiri: 1981, jumlahAnggota: 121 },
  { id: "perisaidiri", nama: "Keluarga Silat Nasional Perisai Diri", singkatan: "Perisai Diri", jenis: "nasional", kecamatanId: "ib1", ketua: "(nama contoh)", berdiri: 1988, jumlahAnggota: 94 },
  { id: "merpatiputih", nama: "Merpati Putih", singkatan: "MP", jenis: "nasional", kecamatanId: "kemuning", ketua: "(nama contoh)", berdiri: 1992, jumlahAnggota: 76 },
  { id: "pagarnusa", nama: "Pagar Nusa NU", singkatan: "Pagar Nusa", jenis: "nasional", kecamatanId: "su2", ketua: "(nama contoh)", berdiri: 1995, jumlahAnggota: 103 },
  { id: "kuntaumusi", nama: "Padepokan Kuntau Musi", singkatan: "Kuntau Musi", jenis: "lokal", kecamatanId: "plaju", ketua: "(nama contoh)", berdiri: 1969, jumlahAnggota: 62 },
  { id: "sriwijaya", nama: "Perguruan Silat Tradisi Sriwijaya", singkatan: "PSTS", jenis: "lokal", kecamatanId: "jakabaring", ketua: "(nama contoh)", berdiri: 1974, jumlahAnggota: 58 },
  { id: "elangputih", nama: "Padepokan Elang Putih Gandus", singkatan: "Elang Putih", jenis: "lokal", kecamatanId: "gandus", ketua: "(nama contoh)", berdiri: 2003, jumlahAnggota: 34 },
];

export const perguruanById = (id: string): Perguruan | undefined =>
  PERGURUAN.find((p) => p.id === id);

export const namaPerguruan = (id: string): string =>
  perguruanById(id)?.nama ?? "—";

export const singkatanPerguruan = (id: string): string =>
  perguruanById(id)?.singkatan ?? "—";
