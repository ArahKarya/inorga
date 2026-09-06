import Link from "next/link";
import { Statistik } from "@/components/ui";
import { Reveal, RevealBaris } from "@/components/motion";
import { totalAtlet, totalPerguruan } from "@/data/wilayah";
import { EVENTS } from "@/data/event";

const PERAN = [
  {
    href: "/atlet",
    nama: "Atlet",
    persona: "Andi Saputra · 16 tahun · PSHT",
    janji:
      "Daftar event sekali klik, tahu kapan dipanggil ke matras, prestasi tersimpan permanen.",
  },
  {
    href: "/perguruan",
    nama: "Perguruan",
    persona: "PSHT Cabang Palembang · 148 anggota",
    janji:
      "Daftarkan binaan secara kolektif, pantau kelengkapan data dan prestasi mereka.",
  },
  {
    href: "/panitia",
    nama: "Panitia Event",
    persona: "Matras A · Piala Walikota 2026",
    janji:
      "Check-in QR, kendali antrian arena, dan panggilan peserta yang tersinkron.",
  },
  {
    href: "/pemkot",
    nama: "Pemkot & KORMI",
    persona: "Dashboard Kota Palembang",
    janji:
      "Peta sebaran bakat per kecamatan, tren performa, dan statistik penyelenggaraan.",
  },
];

export default function Beranda() {
  const berlangsung = EVENTS.filter((e) => e.status === "berlangsung").length;

  return (
    <main>
      {/* Hero — susunan dua kolom Apex: judul besar di kiri, ringkasan di kanan bawah. */}
      <section className="bagian-gelap flex min-h-[78vh] items-end pt-16 pb-14">
        <div className="inner grid grid-cols-1 items-end gap-7 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0">
            <Reveal>
              <span className="label">Prototipe Demo</span>
            </Reveal>
            <RevealBaris
              sebagai="h1"
              className="judul hero-judul mt-5"
              baris={[
                "Mendigitalkan",
                "tradisi,",
                <span className="text-aksen" key="a">
                  menemukan
                </span>,
                <span className="text-aksen" key="b">
                  juara
                </span>,
              ]}
            />
          </div>

          <Reveal delay={260} className="flex min-w-0 flex-col gap-6">
            <p className="max-w-[42ch] text-[16px] leading-[1.55] text-paper-dim">
              Ekosistem pemanduan bakat pencak silat tradisi Kota Palembang.
              Satu sistem, empat sudut pandang — dari atlet yang mendaftar
              sampai peta sebaran bakat yang dibaca Pemkot.
            </p>
            <Link href="/atlet" className="cta w-fit">
              Mulai dari layar atlet
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Pita statistik pada bagian terang — pergantian gelap/terang khas Apex. */}
      <section className="bagian-terang bagian">
        <div className="inner">
          <Reveal>
            <span className="label">Dalam angka</span>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-10 lg:grid-cols-4">
            {[
              {
                angka: totalAtlet.toLocaleString("id-ID"),
                label: "Atlet terdata",
              },
              { angka: totalPerguruan, label: "Perguruan & padepokan" },
              { angka: 18, label: "Kecamatan terpetakan" },
              { angka: berlangsung, label: "Event berlangsung" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <Statistik angka={s.angka} label={s.label} />
              </Reveal>
            ))}
          </div>
          <p className="mt-10 max-w-[52ch] text-[13px] leading-relaxed text-ink-500">
            Seluruh angka di prototipe ini adalah data contoh, bukan data atlet
            sungguhan.
          </p>
        </div>
      </section>

      <section className="bagian-gelap bagian">
        <div className="inner">
          <Reveal>
            <span className="label">Pilih sudut pandang</span>
          </Reveal>
          <RevealBaris
            className="judul judul-bagian mt-4"
            baris={["Empat peran,", "satu data"]}
          />

          <div className="mt-12 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
            {PERAN.map((p, i) => (
              <Reveal key={p.href} delay={i * 90} className="flex">
                <Link
                  href={p.href}
                  className="group flex w-full flex-col gap-3 bg-ink-800 p-7 transition-colors hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-aksen"
                >
                  <span className="font-mono text-[12px] tracking-[0.2em] text-aksen">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="judul text-[30px]">{p.nama}</h3>
                    <span
                      aria-hidden
                      className="text-aksen transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                  <p className="font-mono text-[11px] tracking-[0.06em] text-muted">
                    {p.persona}
                  </p>
                  <p className="max-w-[32ch] text-[14px] leading-relaxed text-paper-dim">
                    {p.janji}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] bg-ink-900 pt-20 pb-10">
        <div className="inner flex flex-col gap-3">
          <span className="label">Powered by</span>
          <span className="footer-besar">
            Arah Karya Sinergi
            <br />
            &times; NOZ Berkarya
          </span>
          <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-white/[0.07] pt-6 font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
            <span>INORGA — Prototipe Demo</span>
            <span>Palembang · 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
