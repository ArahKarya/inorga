import type { AspekPenilaian, Medali, Nilai } from "@/lib/types";

/** Rerata terpangkas: buang nilai tertinggi dan terendah bila ada ≥3 juri. */
export function rerataTerpangkas(nilai: readonly number[]): number {
  if (nilai.length === 0) return 0;
  if (nilai.length < 3) return nilai.reduce((a, b) => a + b, 0) / nilai.length;
  const urut = [...nilai].sort((a, b) => a - b).slice(1, -1);
  return urut.reduce((a, b) => a + b, 0) / urut.length;
}

export interface SkorPeserta {
  atletId: string;
  inti: number;
  ekstensi: number;
  total: number;
  perAspek: Record<string, number>;
  waktuKunci: string;
  jumlahJuri: number;
}

const bulat1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Skor satu peserta dari baris nilai per juri. Inti dan ekstensi dijumlah
 * terpisah — hanya inti yang boleh dibandingkan lintas-event.
 */
export function hitungSkor(
  atletId: string,
  rows: readonly Nilai[],
  rubrik: readonly AspekPenilaian[],
): SkorPeserta {
  const perAspek: Record<string, number> = {};
  let inti = 0;
  let ekstensi = 0;
  const juri = new Set<string>();
  let waktuKunci = "";
  for (const aspek of rubrik) {
    const milik = rows.filter((r) => r.aspekId === aspek.id);
    if (milik.length === 0) continue;
    milik.forEach((r) => {
      juri.add(r.juriId);
      if (r.waktu > waktuKunci) waktuKunci = r.waktu;
    });
    const skor = bulat1(rerataTerpangkas(milik.map((r) => r.nilai)));
    perAspek[aspek.id] = skor;
    if (aspek.tipe === "inti") inti += skor;
    else ekstensi += skor;
  }
  inti = bulat1(inti);
  ekstensi = bulat1(ekstensi);
  return {
    atletId,
    inti,
    ekstensi,
    total: bulat1(inti + ekstensi),
    perAspek,
    waktuKunci,
    jumlahJuri: juri.size,
  };
}

/** Urut: inti ↓, lalu ekstensi ↓, lalu yang lebih dulu terkunci. */
export function susunPeringkat(skor: readonly SkorPeserta[]): SkorPeserta[] {
  return [...skor].sort(
    (a, b) =>
      b.inti - a.inti ||
      b.ekstensi - a.ekstensi ||
      a.waktuKunci.localeCompare(b.waktuKunci),
  );
}

export function tentukanMedali(peringkat: number): Medali {
  return peringkat === 1
    ? "emas"
    : peringkat === 2
      ? "perak"
      : peringkat === 3
        ? "perunggu"
        : null;
}
