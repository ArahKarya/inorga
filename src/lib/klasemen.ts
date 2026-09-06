import type { Hasil } from "@/lib/types";

export interface BarisKlasemen {
  kunci: string;
  nama: string;
  peringkat: number;
  emas: number;
  perak: number;
  perunggu: number;
  total: number;
}

/**
 * Klasemen medali per kontingen. Urutan: emas ↓, perak ↓, perunggu ↓, total ↓,
 * nama ↑. Peringkat kompetisi: dua kontingen seri sama-sama peringkat 1, yang
 * berikutnya peringkat 3.
 */
export function hitungKlasemen(
  hasil: readonly Hasil[],
  kunciKontingen: (h: Hasil) => { kunci: string; nama: string } | null,
): BarisKlasemen[] {
  const peta = new Map<string, BarisKlasemen>();
  for (const h of hasil) {
    if (!h.medali) continue;
    const k = kunciKontingen(h);
    if (!k) continue;
    const baris = peta.get(k.kunci) ?? {
      ...k,
      peringkat: 0,
      emas: 0,
      perak: 0,
      perunggu: 0,
      total: 0,
    };
    const naik = {
      ...baris,
      [h.medali]: baris[h.medali] + 1,
      total: baris.total + 1,
    };
    peta.set(k.kunci, naik);
  }
  const urut = [...peta.values()].sort(
    (a, b) =>
      b.emas - a.emas ||
      b.perak - a.perak ||
      b.perunggu - a.perunggu ||
      b.total - a.total ||
      a.nama.localeCompare(b.nama),
  );
  return urut.map((b, i) => {
    const seri =
      i > 0 &&
      ["emas", "perak", "perunggu"].every(
        (m) => urut[i - 1][m as "emas"] === b[m as "emas"],
      );
    const peringkat = seri ? urut[i - 1].peringkat : i + 1;
    urut[i] = { ...b, peringkat };
    return urut[i];
  });
}
