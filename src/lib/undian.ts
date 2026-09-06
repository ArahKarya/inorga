import type { Undian } from "@/lib/types";

/** RNG deterministik 32-bit (mulberry32). Benih yang sama → urutan yang sama. */
export function mulberry32(benih: number): () => number {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher–Yates dengan RNG berbenih. Masukan diurutkan dulu agar hasilnya hanya
 * bergantung pada benih dan himpunan peserta — bukan pada urutan pendaftaran.
 */
export function acakTerurut<T extends string>(
  items: readonly T[],
  benih: number,
): T[] {
  const arr = [...items].sort();
  const acak = mulberry32(benih);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(acak() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Benih baru dari sumber acak kriptografis — bukan Math.random. */
export function buatBenih(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}

/** Menjalankan ulang pengacakan dari rekaman dan membandingkannya. */
export function verifikasiUndian(rec: Undian): boolean {
  if (rec.versiAlgoritma !== 1) return false;
  const ulang = acakTerurut(rec.pesertaAsal, rec.benih);
  return (
    ulang.length === rec.urutan.length &&
    ulang.every((id, i) => id === rec.urutan[i])
  );
}
