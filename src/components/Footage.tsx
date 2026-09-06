/**
 * Footage latar: gambar diperlakukan seperti cuplikan film — desaturasi,
 * scrim gradien ala Apex, butiran halus, dan gerak Ken Burns lambat.
 * Sumber gambar diambil dari deck INORGA sendiri (hak milik klien).
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.22 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

type Arah = "atas" | "bawah" | "kiri" | "kanan";
const SCRIM: Record<Arah, string> = {
  bawah:
    "linear-gradient(180deg, rgba(23,23,23,.55) 0%, rgba(23,23,23,.15) 40%, rgba(23,23,23,.92) 100%)",
  atas: "linear-gradient(0deg, rgba(23,23,23,.55) 0%, rgba(23,23,23,.15) 40%, rgba(23,23,23,.92) 100%)",
  kiri: "linear-gradient(90deg, rgba(23,23,23,.96) 0%, rgba(23,23,23,.55) 45%, rgba(23,23,23,.2) 100%)",
  kanan:
    "linear-gradient(270deg, rgba(23,23,23,.96) 0%, rgba(23,23,23,.55) 45%, rgba(23,23,23,.2) 100%)",
};

export function Footage({
  src,
  posisi = "center",
  scrim = "bawah",
  gerak = true,
  kabur = 0,
  redup = 0.55,
  className = "",
}: {
  src: string;
  /** object-position CSS. */
  posisi?: string;
  /** Sisi yang paling gelap — tempat teks berada. */
  scrim?: Arah;
  gerak?: boolean;
  kabur?: number;
  redup?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`footage pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`h-full w-full object-cover ${gerak ? "footage-gerak" : ""}`}
        style={{
          objectPosition: posisi,
          filter: `grayscale(.45) contrast(1.12) brightness(${redup}) blur(${kabur}px)`,
        }}
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0" style={{ background: SCRIM[scrim] }} />
      <div
        className="absolute inset-0 opacity-[.35] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}

/** Ubin cuplikan ala kartu layanan Apex: gambar, scrim, nomor mono, judul. */
export function UbinCuplikan({
  src,
  nomor,
  judul,
  keterangan,
}: {
  src: string;
  nomor: string;
  judul: string;
  keterangan: string;
}) {
  return (
    <div className="group relative aspect-[16/10] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ filter: "grayscale(.3) contrast(1.1) brightness(.75)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 30%, rgba(0,0,0,.85))",
        }}
      />
      <div
        className="absolute inset-0 opacity-[.3] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div className="relative flex h-full flex-col justify-end p-5">
        <span className="font-mono text-[12px] tracking-[0.2em] text-aksen">
          {nomor}
        </span>
        <span className="judul mt-2 text-[22px] text-paper">{judul}</span>
        <span className="mt-1.5 max-w-[32ch] text-[13px] text-paper-dim">
          {keterangan}
        </span>
      </div>
    </div>
  );
}
