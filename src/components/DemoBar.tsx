"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import { PanelPaparan } from "@/components/PanelPaparan";
import { hapusSemuaState } from "@/lib/simpan";

/**
 * Bilah atas bergaya Apex: tetap di tempat, latar gelap, navigasi mono huruf
 * besar. Fungsinya pengalih peran — satu aplikasi, satu set data, empat sudut
 * pandang yang bisa dilompati di depan audiens.
 */
const PERAN = [
  { href: "/atlet", label: "Atlet" },
  { href: "/perguruan", label: "Perguruan" },
  { href: "/panitia", label: "Panitia" },
  { href: "/juri", label: "Juri" },
  { href: "/pemkot", label: "Pemkot" },
  { href: "/klasemen", label: "Klasemen" },
];

export function DemoBar() {
  const pathname = usePathname();
  const [panelTerbuka, setPanelTerbuka] = useState(false);

  return (
    /*
     * Panel dirender sebagai saudara header, bukan anaknya. Elemen dengan
     * backdrop-filter menjadi containing block bagi keturunan position:fixed,
     * sehingga panel yang bersarang di dalam header akan terkurung setinggi
     * bilah itu sendiri, bukan setinggi layar.
     */
    <>
      <header className="bilah-atas fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-4 px-[18px] sm:px-8">
          <Link
            href="/"
            className="brand flex shrink-0 items-center gap-2.5 text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksen"
          >
            <LogoMark />
            <span className="hidden font-mono text-[14px] tracking-[0.2em] text-paper uppercase sm:block">
              Inorga
            </span>
          </Link>

          <nav
            aria-label="Pilih peran"
            className="hidden min-w-0 flex-1 items-center gap-5 overflow-x-auto [scrollbar-width:none] sm:gap-7 md:flex [&::-webkit-scrollbar]:hidden"
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

          <button
            type="button"
            onClick={() => {
              hapusSemuaState();
              window.location.reload();
            }}
            title="Kembalikan antrian, nilai juri, dan undian ke keadaan awal"
            className="hidden shrink-0 border border-white/25 px-2.5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase transition-colors hover:border-white/60 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen lg:block"
          >
            Reset demo
          </button>

          <span className="hidden shrink-0 border border-white/25 px-2.5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase lg:block">
            Data contoh
          </span>

          <button
            type="button"
            onClick={() => setPanelTerbuka(true)}
            data-open={panelTerbuka}
            className="ajakan tombol-garis hidden shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen md:block"
          >
            Ajukan paparan <span className="plus">+</span>
          </button>
        </div>
      </header>

      {panelTerbuka ? (
        <PanelPaparan onTutup={() => setPanelTerbuka(false)} />
      ) : null}
    </>
  );
}
