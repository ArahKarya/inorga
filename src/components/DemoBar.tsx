"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Bilah atas bergaya Apex: tetap di tempat, latar gelap, navigasi mono huruf
 * besar. Fungsinya pengalih peran — satu aplikasi, satu set data, empat sudut
 * pandang yang bisa dilompati di depan audiens.
 */
const PERAN = [
  { href: "/atlet", label: "Atlet" },
  { href: "/perguruan", label: "Perguruan" },
  { href: "/panitia", label: "Panitia" },
  { href: "/pemkot", label: "Pemkot" },
];

export function DemoBar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-[56px] max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksen"
        >
          <span className="grid size-8 place-items-center rounded-full border-[1.5px] border-paper font-display text-[14px] font-black text-paper">
            I
          </span>
          <span className="hidden font-mono text-[13px] tracking-[0.2em] text-paper uppercase sm:block">
            Inorga
          </span>
        </Link>

        <nav
          aria-label="Pilih peran"
          className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto sm:gap-7"
        >
          {PERAN.map((p) => {
            const aktif = pathname.startsWith(p.href);
            return (
              <Link
                key={p.href}
                href={p.href}
                aria-current={aktif ? "page" : undefined}
                className={`shrink-0 border-b-2 pb-0.5 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksen ${
                  aktif
                    ? "border-aksen text-aksen"
                    : "border-transparent text-paper/70 hover:text-paper"
                }`}
              >
                {p.label}
              </Link>
            );
          })}
        </nav>

        <span className="hidden shrink-0 border border-white/25 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase md:block">
          Data contoh
        </span>
      </div>
    </header>
  );
}
