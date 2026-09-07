"use client";

import { useMemo, useState } from "react";
import { AMBANG_LABEL_PETA, KECAMATAN, totalAtlet } from "@/data/wilayah";
import { ASPEK_INTI } from "@/data/penilaian";
import type { TrenTitik } from "@/lib/types";
import {
  LABEL_KESENJANGAN,
  WARNA_KESENJANGAN,
  tingkatKesenjangan,
  type TingkatKesenjangan,
} from "@/lib/kesenjangan";

/**
 * Palet seri kategoris — divalidasi terhadap LATAR GELAP, bukan dibalik dari
 * versi terang. Lolos: band lightness, chroma floor, separasi CVD ΔE 14,5
 * (protanopia), kontras ≥ 3:1. Ambar dihindari agar tidak rancu dengan aksen
 * oranye merek.
 */
const WARNA_ASPEK: Record<string, string> = {
  "kebenaran-gerak": "#00a09a",
  kemantapan: "#a8880f",
  penghayatan: "#7b6ee0",
};

/** Ramp sekuensial satu hue (hue aksen). Di latar gelap: makin banyak atlet makin terang. */
const RAMP = ["#4a2517", "#78381c", "#a54c1f", "#d06226", "#f2823e"];

const langkahRamp = (nilai: number, maks: number): string => {
  const i = Math.min(RAMP.length - 1, Math.floor((nilai / maks) * RAMP.length));
  return RAMP[i];
};

/* ------------------------------------------------------------------ */
/* Tren aspek inti — perbandingan lintas-event yang hanya mungkin bila */
/* setiap event menilai aspek inti yang sama. Lihat temuan G13.        */
/* ------------------------------------------------------------------ */

const W = 680;
const H = 268;
const M = { atas: 18, kanan: 118, bawah: 40, kiri: 44 };
const PLOT_W = W - M.kiri - M.kanan;
const PLOT_H = H - M.atas - M.bawah;
const Y_MIN = 5;
const Y_MAKS = 9;
const JARAK_LABEL = 17;

const py = (v: number) =>
  M.atas +
  PLOT_H -
  ((Math.min(Y_MAKS, Math.max(Y_MIN, v)) - Y_MIN) / (Y_MAKS - Y_MIN)) * PLOT_H;

export function GrafikTrenInti({ data }: { data: readonly TrenTitik[] }) {
  const [aktif, setAktif] = useState<number | null>(null);
  const akhir = data.length - 1;
  const titik = aktif ?? akhir;
  const px = (i: number) =>
    data.length < 2 ? M.kiri + PLOT_W / 2 : M.kiri + (i / akhir) * PLOT_W;

  /**
   * Nilai akhir ketiga aspek berdekatan, sehingga label di ujung garis akan
   * bertumpuk. Label digeser turun sampai berjarak aman — seri teratas
   * diproses dulu agar urutan label mengikuti urutan garis.
   */
  const yLabel = useMemo(() => {
    const hasil = new Map<string, number>();
    if (akhir < 0) return hasil;
    const urut = [...ASPEK_INTI].sort(
      (a, b) => data[akhir].nilai[b.id] - data[akhir].nilai[a.id],
    );
    let sebelumnya = -Infinity;
    for (const aspek of urut) {
      const y = Math.max(
        py(data[akhir].nilai[aspek.id]) + 4,
        sebelumnya + JARAK_LABEL,
      );
      hasil.set(aspek.id, y);
      sebelumnya = y;
    }
    return hasil;
  }, [data, akhir]);

  if (data.length === 0) {
    return (
      <p className="text-[13px] text-muted">
        Belum ada nilai aspek inti yang tercatat.
      </p>
    );
  }

  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="-mx-2 overflow-x-auto px-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[460px]"
          role="img"
          aria-label="Tren nilai tiga aspek inti pada event-event terakhir"
        >
          {[5, 6, 7, 8, 9].map((t) => (
            <g key={t}>
              <line
                x1={M.kiri}
                x2={M.kiri + PLOT_W}
                y1={py(t)}
                y2={py(t)}
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1"
              />
              <text
                x={M.kiri - 10}
                y={py(t) + 4}
                textAnchor="end"
                className="fill-paper/40 font-mono text-[11px]"
              >
                {t},0
              </text>
            </g>
          ))}

          {data.map((d, i) => (
            <text
              key={`${d.event}-${i}`}
              x={px(i)}
              y={H - 14}
              textAnchor="middle"
              className={`font-mono text-[10px] ${i === titik ? "fill-paper font-medium" : "fill-paper/40"}`}
            >
              {d.tanggal}
            </text>
          ))}

          <line
            x1={px(titik)}
            x2={px(titik)}
            y1={M.atas}
            y2={M.atas + PLOT_H}
            stroke="#f2f2f2"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.28"
          />

          {ASPEK_INTI.map((aspek) => {
            const warna = WARNA_ASPEK[aspek.id];
            const d = data
              .map(
                (t, i) =>
                  `${i === 0 ? "M" : "L"} ${px(i)} ${py(t.nilai[aspek.id])}`,
              )
              .join(" ");
            const akhirNilai = data[akhir].nilai[aspek.id];
            const yTitik = py(akhirNilai);
            const yL = yLabel.get(aspek.id) ?? yTitik;
            return (
              <g key={aspek.id}>
                <path
                  d={d}
                  fill="none"
                  stroke={warna}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {data.map((t, i) => (
                  <circle
                    key={i}
                    cx={px(i)}
                    cy={py(t.nilai[aspek.id])}
                    r={i === titik ? 5.5 : 4}
                    fill={warna}
                    stroke="#1f1f1f"
                    strokeWidth="2"
                  />
                ))}
                <path
                  d={`M ${px(akhir) + 7} ${yTitik} L ${px(akhir) + 12} ${yL - 4}`}
                  fill="none"
                  stroke={warna}
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text x={px(akhir) + 15} y={yL} className="text-[11px]">
                  <tspan className="fill-paper font-semibold">
                    {aspek.nama.split(" ")[0]}
                  </tspan>
                  <tspan dx="6" className="fill-paper/55 font-mono text-[10px]">
                    {akhirNilai.toFixed(1).replace(".", ",")}
                  </tspan>
                </text>
              </g>
            );
          })}

          {data.map((_, i) => (
            <rect
              key={i}
              x={px(i) - (data.length > 1 ? PLOT_W / akhir / 2 : PLOT_W / 2)}
              y={M.atas}
              width={data.length > 1 ? PLOT_W / akhir : PLOT_W}
              height={PLOT_H}
              fill="transparent"
              onPointerEnter={() => setAktif(i)}
              onPointerLeave={() => setAktif(null)}
            />
          ))}
        </svg>
      </div>

      <figcaption className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {ASPEK_INTI.map((a) => (
            <span
              key={a.id}
              className="flex items-center gap-1.5 text-[12px] text-paper-dim"
            >
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ background: WARNA_ASPEK[a.id] }}
              />
              {a.nama}
              <span className="tnum font-mono text-[11px] text-muted">
                {data[titik].nilai[a.id].toFixed(1)}
              </span>
            </span>
          ))}
        </div>
        <p className="text-[12px] leading-relaxed text-muted">
          Nilai aspek inti pada skala 1–10. Hanya aspek inti yang dibandingkan
          lintas-event; aspek tambahan milik masing-masing penyelenggara tampil
          di halaman hasil event.
        </p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Peta 18 kecamatan Kota Palembang — sebaran atau kesenjangan.        */
/* ------------------------------------------------------------------ */

const maksAtlet = Math.max(...KECAMATAN.map((k) => k.jumlahAtlet));

type PosisiLabel = { x: number; y: number; anchor: "start" | "middle" | "end" };

function posisiLabel(
  lp: (typeof KECAMATAN)[number]["lp"],
  x: number,
  y: number,
  r: number,
): PosisiLabel {
  switch (lp) {
    case "atas":
      return { x, y: y - r - 1.8, anchor: "middle" };
    case "kiri":
      return { x: x - r - 1.6, y: y + 0.9, anchor: "end" };
    case "kanan":
      return { x: x + r + 1.6, y: y + 0.9, anchor: "start" };
    default:
      return { x, y: y + r + 3, anchor: "middle" };
  }
}

export type ModePeta = "sebaran" | "kesenjangan";
const URUTAN_TINGKAT: TingkatKesenjangan[] = [
  "tanpa",
  "rendah",
  "cukup",
  "kuat",
];

export function PetaSebaran({ mode = "sebaran" }: { mode?: ModePeta }) {
  const [hover, setHover] = useState<string | null>(null);
  const terpilih = KECAMATAN.find((k) => k.id === hover);
  const kesenjangan = mode === "kesenjangan";

  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="relative">
        <svg
          viewBox="0 0 100 96"
          className="h-auto w-full"
          role="img"
          aria-label={
            kesenjangan
              ? "Peta kesenjangan pembinaan pada 18 kecamatan Kota Palembang"
              : "Peta sebaran atlet silat pada 18 kecamatan Kota Palembang"
          }
        >
          <path
            d="M2 66 C 20 62, 30 58, 44 60 C 58 62, 70 54, 82 48 C 90 44, 96 42, 99 41"
            fill="none"
            stroke="#33343a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <text
            x="4"
            y="72"
            className="fill-paper/30 text-[2.6px] font-medium tracking-wide"
          >
            SUNGAI MUSI
          </text>

          {KECAMATAN.map((k) => {
            const tingkat = tingkatKesenjangan(k);
            const r = kesenjangan
              ? 4.2
              : 2.4 + (k.jumlahAtlet / maksAtlet) * 4.2;
            const disorot = hover === k.id;
            const label = posisiLabel(k.lp, k.x, k.y, r);
            const tampilLabel = kesenjangan
              ? tingkat === "tanpa" || tingkat === "rendah" || disorot
              : k.jumlahAtlet >= AMBANG_LABEL_PETA || disorot;
            return (
              <g
                key={k.id}
                onPointerEnter={() => setHover(k.id)}
                onPointerLeave={() => setHover(null)}
                className="cursor-default"
              >
                <circle cx={k.x} cy={k.y} r={r + 2.5} fill="transparent" />
                <circle
                  cx={k.x}
                  cy={k.y}
                  r={r}
                  fill={
                    kesenjangan
                      ? WARNA_KESENJANGAN[tingkat]
                      : langkahRamp(k.jumlahAtlet, maksAtlet)
                  }
                  fillOpacity={
                    kesenjangan && (tingkat === "cukup" || tingkat === "kuat")
                      ? 0.45
                      : 1
                  }
                  stroke={disorot ? "#f2f2f2" : "#1f1f1f"}
                  strokeWidth={disorot ? 0.9 : 0.6}
                />
                {kesenjangan && tingkat === "tanpa" ? (
                  <text
                    x={k.x}
                    y={k.y + 1.3}
                    textAnchor="middle"
                    className="fill-paper text-[3.4px] font-bold"
                  >
                    !
                  </text>
                ) : null}
                {tampilLabel ? (
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor={label.anchor}
                    stroke="#1f1f1f"
                    strokeWidth="0.7"
                    paintOrder="stroke"
                    className={`text-[2.5px] ${disorot ? "fill-paper font-semibold" : "fill-paper/60"}`}
                  >
                    {k.nama}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        {terpilih ? (
          <div className="pointer-events-none absolute top-2 right-2 border border-white/15 bg-ink-900/95 px-3 py-2 backdrop-blur">
            <p className="judul text-[14px] text-paper">{terpilih.nama}</p>
            <p className="tnum font-mono text-[11px] text-aksen">
              {terpilih.jumlahAtlet} atlet · {terpilih.jumlahPerguruan}{" "}
              perguruan
            </p>
            <p className="font-mono text-[10px] tracking-wide text-muted uppercase">
              {kesenjangan
                ? LABEL_KESENJANGAN[tingkatKesenjangan(terpilih)]
                : `Zona ${terpilih.zona}`}
            </p>
          </div>
        ) : null}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        {kesenjangan ? (
          <div className="flex flex-wrap items-center gap-2">
            {URUTAN_TINGKAT.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 border border-white/10 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-paper-dim uppercase"
              >
                <span
                  aria-hidden
                  className="size-2.5 rounded-full"
                  style={{ background: WARNA_KESENJANGAN[t] }}
                />
                {LABEL_KESENJANGAN[t]}
                <span className="tnum text-muted">
                  {KECAMATAN.filter((k) => tingkatKesenjangan(k) === t).length}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="label label-redup">Jumlah atlet</span>
            <span className="flex items-center gap-1">
              {RAMP.map((c) => (
                <span
                  key={c}
                  aria-hidden
                  className="size-3.5"
                  style={{ background: c }}
                />
              ))}
            </span>
            <span className="tnum font-mono text-[10px] text-muted">
              0 – {maksAtlet}
            </span>
          </div>
        )}
        <span className="tnum font-mono text-[11px] text-muted">
          {totalAtlet} atlet · 18 kecamatan
        </span>
      </figcaption>
    </figure>
  );
}
