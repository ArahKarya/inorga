"use client";

import { useCallback, useEffect, useState } from "react";

const AWALAN = "inorga:";

export function bacaState<T>(kunci: string): T | null {
  try {
    const raw = localStorage.getItem(AWALAN + kunci);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function tulisState<T>(kunci: string, nilai: T): void {
  try {
    localStorage.setItem(AWALAN + kunci, JSON.stringify(nilai));
  } catch {
    /* penyimpanan tidak tersedia — demo tetap jalan dari seed */
  }
}

export function hapusSemuaState(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(AWALAN))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* abaikan */
  }
}

/**
 * State yang bertahan di localStorage dan tersinkron antar-tab lewat event
 * `storage`. Render awal selalu dari nilai awal (seed) agar hidrasi cocok;
 * nilai tersimpan baru diterapkan di efek.
 */
export function useStateTersimpan<T>(
  kunci: string,
  awal: T,
): [T, (baru: T | ((s: T) => T)) => void] {
  const [nilai, setNilai] = useState<T>(awal);

  useEffect(() => {
    const tersimpan = bacaState<T>(kunci);
    if (tersimpan !== null) setNilai(tersimpan);
    const dengar = (e: StorageEvent) => {
      if (e.key === AWALAN + kunci) {
        if (e.newValue === null) setNilai(awal);
        else setNilai(JSON.parse(e.newValue) as T);
      }
    };
    window.addEventListener("storage", dengar);
    return () => window.removeEventListener("storage", dengar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci]);

  const set = useCallback(
    (baru: T | ((s: T) => T)) => {
      setNilai((s) => {
        const hasil =
          typeof baru === "function" ? (baru as (s: T) => T)(s) : baru;
        tulisState(kunci, hasil);
        return hasil;
      });
    },
    [kunci],
  );

  return [nilai, set];
}
