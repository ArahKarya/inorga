"use client";

import { useState } from "react";
import { AMBANG_LABEL_PETA, KECAMATAN, totalAtlet } from "@/data/wilayah";
import { ASPEK_INTI, TREN_INTI } from "@/data/penilaian";

/**
 * Palet seri kategoris — divalidasi ulang terhadap LATAR GELAP setelah
 * peralihan ke sistem visual Apex, bukan sekadar dibalik dari versi terang.
 * Lolos seluruh pemeriksaan: band lightness, chroma floor, separasi CVD
 * ΔE 15,5 (deuteranopia), dan kontras ≥ 3:1 terhadap permukaan gelap.
 * Ungu diangkat dari #5b4fc7 ke #7b6ee0 karena versi lama hanya 2,81:1.
 */
const WARNA_ASPEK: Record<string, string> = {
  "kebenaran-gerak": "#00a09a",
  kemantapan: "#c2660a",
  penghayatan: "#7b6ee0",
};

/**
 * Ramp sekuensial satu hue untuk magnitudo sebaran atlet. Di latar gelap
 * arahnya dibalik: makin banyak atlet, makin terang — redup berarti sedikit.
 */
const RAMP = ["#24494b", "#2b6462", "#348b87", "#3db3ac", "#57d8d0"];

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

const px = (i: number) => M.kiri + (i / (TREN_INTI.length - 1)) * PLOT_W;
const py = (v: number) => M.atas + PLOT_H - ((v - Y_MIN) / (Y_MAKS - Y_MIN)) * PLOT_H;

const AKHIR = TREN_INTI.length - 1;
const JARAK_LABEL = 17;

/**
 * Nilai akhir ketiga aspek berdekatan, sehingga label langsung di ujung garis
 * akan bertumpuk. Posisi label digeser turun sampai berjarak aman, lalu
 * dihubungkan ke titiknya dengan garis tipis.
 */
const Y_LABEL: Map<string, number> = (() => {
  // Menurun: seri teratas diproses lebih dulu agar urutan label mengikuti
  // urutan garis di layar, bukan terbalik.
  const urut = [...ASPEK_INTI].sort(
    (a, b) => TREN_INTI[AKHIR].nilai[b.id] - TREN_INTI[AKHIR].nilai[a.id]
  );
  const hasil = new Map<string, number>();
  let sebelumnya = -Infinity;
  for (const aspek of urut) {
    const ideal = py(TREN_INTI[AKHIR].nilai[aspek.id]) + 4;
    const y = Math.max(ideal, sebelumnya + JARAK_LABEL);
    hasil.set(aspek.id, y);
    sebelumnya = y;
  }
  return hasil;
})();

export function GrafikTrenInti() {
  const [aktif, setAktif] = useState<number | null>(null);
  const titik = aktif ?? TREN_INTI.length - 1;

  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[520px]"
          role="img"
          aria-label="Tren nilai tiga aspek inti Andi Saputra pada lima event terakhir"
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

          {TREN_INTI.map((d, i) => (
            <text
              key={d.event}
              x={px(i)}
              y={H - 14}
              textAnchor="middle"
              className={`font-mono text-[10px] ${
                i === titik ? "fill-paper font-medium" : "fill-paper/40"
              }`}
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
            const d = TREN_INTI.map(
              (t, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(t.nilai[aspek.id])}`
            ).join(" ");
            const akhirNilai = TREN_INTI[AKHIR].nilai[aspek.id];
            const yTitik = py(akhirNilai);
            const yLabel = Y_LABEL.get(aspek.id)!;
            return (
              <g key={aspek.id}>
                <path d={d} fill="none" stroke={warna} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {TREN_INTI.map((t, i) => (
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
                {/* Penghubung ke label bila label digeser agar tidak bertumpuk. */}
                <path
                  d={`M ${px(AKHIR) + 7} ${yTitik} L ${px(AKHIR) + 12} ${yLabel - 4}`}
                  fill="none"
                  stroke={warna}
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text x={px(AKHIR) + 15} y={yLabel} className="text-[11px]">
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

          {TREN_INTI.map((_, i) => (
            <rect
              key={i}
              x={px(i) - PLOT_W / (TREN_INTI.length - 1) / 2}
              y={M.atas}
              width={PLOT_W / (TREN_INTI.length - 1)}
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
            <span key={a.id} className="flex items-center gap-1.5 text-[12px] text-paper-dim">
              <span
                aria-hidden
                className="size-2.5 rounded-full"
                style={{ background: WARNA_ASPEK[a.id] }}
              />
              {a.nama}
              <span className="tnum font-mono text-[11px] text-muted">
                {TREN_INTI[titik].nilai[a.id].toFixed(1)}
              </span>
            </span>
          ))}
        </div>
        <p className="text-[12px] leading-relaxed text-muted">
          Nilai aspek inti pada skala 1–10, dari lima event terakhir. Hanya aspek inti
          yang dibandingkan lintas-event; aspek tambahan milik masing-masing
          penyelenggara tampil di halaman hasil event.
        </p>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Peta sebaran bakat — 18 kecamatan Kota Palembang, peta stilasi.     */
/* ------------------------------------------------------------------ */

const maksAtlet = Math.max(...KECAMATAN.map((k) => k.jumlahAtlet));

type PosisiLabel = { x: number; y: number; anchor: "start" | "middle" | "end" };

/** Penempatan label mengikuti sisi yang ditentukan manual di data kecamatan. */
function posisiLabel(
  lp: (typeof KECAMATAN)[number]["lp"],
  x: number,
  y: number,
  r: number
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

export function PetaSebaran() {
  const [hover, setHover] = useState<string | null>(null);
  const terpilih = KECAMATAN.find((k) => k.id === hover);

  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="relative">
        <svg
          viewBox="0 0 100 96"
          className="h-auto w-full"
          role="img"
          aria-label="Peta sebaran atlet silat pada 18 kecamatan Kota Palembang"
        >
          <path
            d="M2 66 C 20 62, 30 58, 44 60 C 58 62, 70 54, 82 48 C 90 44, 96 42, 99 41"
            fill="none"
            stroke="#24424c"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <text x="4" y="72" className="fill-paper/30 text-[2.6px] font-medium tracking-wide">
            SUNGAI MUSI
          </text>

          {KECAMATAN.map((k) => {
            const r = 2.4 + (k.jumlahAtlet / maksAtlet) * 4.2;
            const disorot = hover === k.id;
            const label = posisiLabel(k.lp, k.x, k.y, r);
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
                  fill={langkahRamp(k.jumlahAtlet, maksAtlet)}
                  stroke={disorot ? "#f2f2f2" : "#1f1f1f"}
                  strokeWidth={disorot ? 0.9 : 0.6}
                />
                {k.jumlahAtlet >= AMBANG_LABEL_PETA || disorot ? (
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor={label.anchor}
                  stroke="#1f1f1f"
                  strokeWidth="0.7"
                  paintOrder="stroke"
                  className={`text-[2.5px] ${
                    disorot ? "fill-paper font-semibold" : "fill-paper/60"
                  }`}
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
              {terpilih.jumlahAtlet} atlet · {terpilih.jumlahPerguruan} perguruan
            </p>
            <p className="font-mono text-[10px] tracking-wide text-muted uppercase">
              Zona {terpilih.zona}
            </p>
          </div>
        ) : null}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label label-redup">
            Jumlah atlet
          </span>
          <span className="flex items-center gap-1">
            {RAMP.map((c) => (
              <span key={c} aria-hidden className="size-3.5" style={{ background: c }} />
            ))}
          </span>
          <span className="tnum font-mono text-[10px] text-muted">
            0 – {maksAtlet}
          </span>
        </div>
        <span className="tnum font-mono text-[11px] text-muted">
          {totalAtlet} atlet · 18 kecamatan
        </span>
      </figcaption>
    </figure>
  );
}
