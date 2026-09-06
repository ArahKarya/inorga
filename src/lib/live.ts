"use client";

import { useStateTersimpan } from "@/lib/simpan";
import { ANTRIAN } from "@/data/event";
import { NILAI } from "@/data/penilaian";
import type { AntrianItem, Nilai, Undian } from "@/lib/types";

/**
 * State demo yang hidup di klien dan tersinkron antar-tab: antrian arena,
 * nilai juri yang dimasukkan live, dan rekaman undian yang dibuat live.
 * Render awal selalu dari seed; localStorage diterapkan setelahnya.
 */
export const useAntrianLive = () =>
  useStateTersimpan<AntrianItem[]>("antrian", ANTRIAN);
export const useNilaiLive = () => useStateTersimpan<Nilai[]>("nilai", []);
export const useUndianLive = () => useStateTersimpan<Undian[]>("undian", []);

/** Nilai seed + nilai live. Baris live untuk (event, kategori, atlet, aspek, juri) yang sama menggantikan seed. */
export function gabungNilai(live: readonly Nilai[]): Nilai[] {
  const kunci = (n: Nilai) =>
    `${n.eventId}|${n.kategoriId}|${n.atletId}|${n.aspekId}|${n.juriId}`;
  const ada = new Set(live.map(kunci));
  return [...NILAI.filter((n) => !ada.has(kunci(n))), ...live];
}
