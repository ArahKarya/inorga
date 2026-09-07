"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navigasi bawah untuk layar sempit. Di ponsel, bilah peran horizontal di
 * atas sulit dijangkau ibu jari dan mudah terlewat; di sini peran jadi
 * target sentuh besar yang selalu terlihat.
 */
const PERAN = [
  {
    href: "/atlet",
    label: "Atlet",
    ikon: "M12 4a3 3 0 110 6 3 3 0 010-6zM5 20a7 7 0 0114 0",
  },
  { href: "/panitia", label: "Panitia", ikon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/juri", label: "Juri", ikon: "M12 3v18M5 8l7-5 7 5M5 8l2 7h10l2-7" },
  { href: "/klasemen", label: "Klasemen", ikon: "M6 20V10M12 20V4M18 20v-7" },
  {
    href: "/pemkot",
    label: "Pemkot",
    ikon: "M3 20h18M6 20V9l6-4 6 4v11M10 20v-5h4v5",
  },
];

export function NavBawah() {
  const pathname = usePathname();
  if (pathname.startsWith("/arena")) return null;

  return (
    <nav
      aria-label="Pindah peran"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex">
        {PERAN.map((p) => {
          const aktif = pathname.startsWith(p.href);
          return (
            <li key={p.href} className="flex-1">
              <Link
                href={p.href}
                aria-current={aktif ? "page" : undefined}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 px-1 py-2 transition-colors ${aktif ? "text-aksen" : "text-paper/55"}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d={p.ikon} />
                </svg>
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase">
                  {p.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
