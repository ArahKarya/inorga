import type { Kecamatan } from "@/lib/types";

export type TingkatKesenjangan = "tanpa" | "rendah" | "cukup" | "kuat";

/**
 * Peta kesenjangan: pertanyaannya bukan di mana atlet ada, melainkan
 * kecamatan mana yang belum punya perguruan dalam jangkauan wajar.
 */
export function tingkatKesenjangan(k: Kecamatan): TingkatKesenjangan {
  if (k.jumlahPerguruan === 0) return "tanpa";
  const rasio = k.jumlahAtlet / k.jumlahPerguruan;
  if (k.jumlahPerguruan <= 1 || rasio > 20) return "rendah";
  if (k.jumlahPerguruan >= 5 && rasio <= 15) return "kuat";
  return "cukup";
}

export const LABEL_KESENJANGAN: Record<TingkatKesenjangan, string> = {
  tanpa: "Tanpa perguruan",
  rendah: "Pembinaan rendah",
  cukup: "Cukup",
  kuat: "Kuat",
};

/** Warna status — bukan aksen merek, bukan palet seri grafik. */
export const WARNA_KESENJANGAN: Record<TingkatKesenjangan, string> = {
  tanpa: "#d64545",
  rendah: "#d9a441",
  cukup: "#7a8a94",
  kuat: "#3fa66f",
};
