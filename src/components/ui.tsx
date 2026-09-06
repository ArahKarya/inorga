import type { ReactNode } from "react";

export function Kartu({
  children,
  className = "",
  warna = "bg-white",
}: {
  children: ReactNode;
  className?: string;
  /**
   * Warna latar kartu. Dilewatkan lewat prop, bukan lewat `className`, karena
   * dua utility background pada elemen yang sama saling meniadakan di Tailwind —
   * urutan pemenangnya ditentukan stylesheet, bukan urutan penulisan kelas.
   */
  warna?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gading-300/70 shadow-[0_1px_2px_rgba(6,43,45,0.05)] ${warna} ${className}`}
    >
      {children}
    </div>
  );
}

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
    <div className="flex items-end justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        {eyebrow ? (
          <span className="font-mono text-[10px] font-medium tracking-[0.14em] text-teal-700/70 uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-[17px] font-bold tracking-tight text-teal-950">
          {judul}
        </h2>
      </div>
      {aksi}
    </div>
  );
}

const NADA = {
  hijau: "bg-emerald-50 text-emerald-800 border-emerald-200",
  kuning: "bg-amber-50 text-amber-800 border-amber-200",
  merah: "bg-rose-50 text-rose-800 border-rose-200",
  cyan: "bg-cyan-50 text-teal-800 border-cyan-200",
  netral: "bg-gading-100 text-teal-800 border-gading-300",
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
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${NADA[nada]}`}
    >
      {children}
    </span>
  );
}

export function CatatanDemo({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-teal-700/30 bg-teal-700/5 px-3 py-2 text-[12px] leading-relaxed text-teal-800">
      {children}
    </p>
  );
}
