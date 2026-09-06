import type { ReactNode } from "react";

/** Panel gelap bergaris rambut — pengganti kartu putih pada sistem lama. */
export function Kartu({
  children,
  className = "",
  warna = "bg-ink-700",
}: {
  children: ReactNode;
  className?: string;
  /**
   * Warna latar panel. Dilewatkan lewat prop, bukan lewat `className`, karena
   * dua utility background pada elemen yang sama saling meniadakan di Tailwind —
   * urutan pemenangnya ditentukan stylesheet, bukan urutan penulisan kelas.
   */
  warna?: string;
}) {
  return (
    <div className={`border border-white/10 ${warna} ${className}`}>
      {children}
    </div>
  );
}

/** Kepala bagian ala Apex: label mono beraksen di atas judul display berat. */
export function JudulBagian({
  eyebrow,
  judul,
  aksi,
}: {
  eyebrow?: string;
  judul: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-3">
      <div className="flex flex-col gap-2">
        {eyebrow ? <span className="label">{eyebrow}</span> : null}
        <h2 className="judul text-[clamp(26px,3.2vw,44px)]">{judul}</h2>
      </div>
      {aksi}
    </div>
  );
}

const NADA = {
  hijau: "border-emerald-400/40 text-emerald-300",
  kuning: "border-amber-400/40 text-amber-300",
  merah: "border-rose-400/40 text-rose-300",
  cyan: "border-aksen/50 text-aksen",
  netral: "border-white/20 text-paper-dim",
} as const;

export function Lencana({
  children,
  nada = "netral",
}: {
  children: ReactNode;
  nada?: keyof typeof NADA;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${NADA[nada]}`}
    >
      {children}
    </span>
  );
}

/** Catatan naratif untuk presenter — dibedakan dengan garis aksen di kiri. */
export function CatatanDemo({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-aksen/60 py-1 pl-4 text-[13px] leading-relaxed text-paper-dim/80">
      {children}
    </p>
  );
}

/** Angka besar beraksen + label mono — pita statistik khas Apex. */
export function Statistik({
  angka,
  label,
  ket,
}: {
  angka: ReactNode;
  label: string;
  ket?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="stat-num tnum">{angka}</span>
      <span className="stat-label">{label}</span>
      {ket ? <span className="text-[12px] text-muted">{ket}</span> : null}
    </div>
  );
}
