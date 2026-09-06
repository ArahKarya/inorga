"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Pengalih peran. Inti dari demo: satu aplikasi, satu set data, empat sudut
 * pandang yang bisa dilompati dalam satu klik di depan audiens.
 */
const PERAN = [
  { href: "/atlet", label: "Atlet", sub: "Andi Saputra, 16 th" },
  { href: "/perguruan", label: "Perguruan", sub: "PSHT Palembang" },
  { href: "/panitia", label: "Panitia", sub: "Matras A" },
  { href: "/pemkot", label: "Pemkot & KORMI", sub: "Dashboard kota" },
];

export function DemoBar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-teal-700/40 bg-teal-950/95 backdrop-blur">
      <div className="mx-auto flex h-[52px] max-w-7xl items-center gap-3 px-3 sm:px-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          <span className="grid size-7 place-items-center rounded-md bg-cyan-400 font-mono text-[13px] font-bold text-teal-950">
            IN
          </span>
          <span className="hidden text-sm font-bold tracking-tight text-gading-100 sm:block">
            INORGA
          </span>
        </Link>

        <nav
          aria-label="Pilih peran"
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        >
          {PERAN.map((p) => {
            const aktif = pathname.startsWith(p.href);
            return (
              <Link
                key={p.href}
                href={p.href}
                aria-current={aktif ? "page" : undefined}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                  aktif
                    ? "bg-cyan-400 text-teal-950"
                    : "text-gading-200/80 hover:bg-teal-800 hover:text-gading-100"
                }`}
              >
                {p.label}
              </Link>
            );
          })}
        </nav>

        <span className="hidden shrink-0 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider text-amber-300 uppercase md:block">
          Data contoh
        </span>
      </div>
    </header>
  );
}
