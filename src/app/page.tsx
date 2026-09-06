import Link from "next/link";
import { Statistik } from "@/components/ui";
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
      <section className="mx-auto max-w-6xl px-5 pt-14 pb-16 sm:px-8 sm:pt-20">
        <span className="label">Prototipe Demo</span>
        <h1 className="judul judul-berat mt-5 max-w-[16ch] text-[clamp(42px,9vw,104px)]">
          Mendigitalkan tradisi,{" "}
          <span className="text-aksen">menemukan juara</span>
        </h1>
        <p className="mt-7 max-w-[56ch] text-[16px] leading-relaxed text-paper-dim">
          Ekosistem pemanduan bakat pencak silat tradisi Kota Palembang. Satu
          sistem, empat sudut pandang — dari atlet yang mendaftar sampai peta
          sebaran bakat yang dibaca Pemkot.
        </p>
      </section>

      <section className="border-y border-white/10 bg-ink-700">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-10 sm:px-8 lg:grid-cols-4">
          <Statistik
            angka={totalAtlet.toLocaleString("id-ID")}
            label="Atlet terdata"
          />
          <Statistik angka={totalPerguruan} label="Perguruan & padepokan" />
          <Statistik angka={18} label="Kecamatan terpetakan" />
          <Statistik angka={berlangsung} label="Event berlangsung" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-3">
          <div className="flex flex-col gap-2">
            <span className="label">Pilih sudut pandang</span>
            <h2 className="judul text-[26px]">Empat peran, satu data</h2>
          </div>
        </div>

        <div className="mt-px grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
          {PERAN.map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col gap-3 bg-ink-800 p-7 transition-colors hover:bg-ink-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-aksen"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-aksen">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="judul text-[24px]">{p.nama}</h3>
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
              <p className="max-w-[42ch] text-[14px] leading-relaxed text-paper-dim">
                {p.janji}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-8 border-l-2 border-aksen/60 py-1 pl-4 text-[13px] leading-relaxed text-muted">
          Seluruh angka di prototipe ini adalah data contoh, bukan data atlet
          sungguhan.
        </p>
      </section>

      <footer className="border-t border-white/10 bg-ink-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 sm:px-8">
          <span className="label label-redup">Powered by</span>
          <span className="judul text-[clamp(26px,5vw,44px)] text-paper">
            Arah Karya Sinergi &times; NOZ Berkarya
          </span>
        </div>
      </footer>
    </main>
  );
}
