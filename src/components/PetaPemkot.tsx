"use client";

import { useState } from "react";
import { PetaSebaran, type ModePeta } from "@/components/charts";
import { KECAMATAN } from "@/data/wilayah";
import { LABEL_KESENJANGAN, tingkatKesenjangan } from "@/lib/kesenjangan";

/** Peta dashboard dengan dua pertanyaan: di mana atlet ada, dan di mana pembinaan belum ada. */
export function PetaPemkot() {
  const [mode, setMode] = useState<ModePeta>("sebaran");
  const perluPerhatian = KECAMATAN.filter((k) =>
    ["tanpa", "rendah"].includes(tingkatKesenjangan(k)),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(
          [
            ["sebaran", "Sebaran atlet"],
            ["kesenjangan", "Kesenjangan pembinaan"],
          ] as [ModePeta, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`border px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen ${mode === m ? "border-aksen bg-aksen text-ink-900" : "border-white/15 text-paper-dim hover:border-white/40 hover:text-paper"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <PetaSebaran mode={mode} />
      {mode === "kesenjangan" ? (
        <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
          <span className="label label-redup">Perlu perhatian</span>
          {perluPerhatian.map((k) => (
            <div
              key={k.id}
              className="flex items-baseline justify-between gap-3 text-[13px]"
            >
              <span className="text-paper">{k.nama}</span>
              <span className="tnum font-mono text-[11px] text-muted">
                {k.jumlahAtlet} atlet · {k.jumlahPerguruan} perguruan ·{" "}
                {LABEL_KESENJANGAN[tingkatKesenjangan(k)]}
              </span>
            </div>
          ))}
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            Peta sebaran menjawab di mana atlet berada. Peta ini menjawab
            pertanyaan kebijakan yang sesungguhnya: kecamatan mana yang atletnya
            ada tetapi perguruannya tidak — di sanalah pembinaan baru
            ditempatkan.
          </p>
        </div>
      ) : null}
    </div>
  );
}
