import Link from "next/link";
import { totalAtlet, totalPerguruan } from "@/data/wilayah";
import { EVENTS } from "@/data/event";

const PERAN = [
  {
    href: "/atlet",
    nama: "Atlet",
    persona: "Andi Saputra · 16 tahun · PSHT",
    janji: "Daftar event sekali klik, tahu kapan dipanggil ke matras, prestasi tersimpan permanen.",
  },
  {
    href: "/perguruan",
    nama: "Perguruan",
    persona: "PSHT Cabang Palembang · 148 anggota",
    janji: "Daftarkan binaan secara kolektif, pantau kelengkapan data dan prestasi mereka.",
  },
  {
    href: "/panitia",
    nama: "Panitia Event",
    persona: "Matras A · Piala Walikota 2026",
    janji: "Check-in QR, kendali antrian arena, dan panggilan peserta yang tersinkron.",
  },
  {
    href: "/pemkot",
    nama: "Pemkot & KORMI",
    persona: "Dashboard Kota Palembang",
    janji: "Peta sebaran bakat per kecamatan, tren performa, dan statistik penyelenggaraan.",
  },
];

export default function Beranda() {
  const berlangsung = EVENTS.filter((e) => e.status === "berlangsung").length;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-teal-700 uppercase">
          Prototipe demo
        </span>
        <h1 className="max-w-[20ch] text-4xl leading-[1.05] font-extrabold tracking-tight text-balance text-teal-950 sm:text-5xl">
          Mendigitalkan tradisi, menemukan juara.
        </h1>
        <p className="max-w-[58ch] text-[15px] leading-relaxed text-teal-950/70">
          Ekosistem pemanduan bakat pencak silat tradisi Kota Palembang. Satu sistem,
          empat sudut pandang — dari atlet yang mendaftar sampai peta sebaran bakat
          yang dibaca Pemkot.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-gading-300 py-4">
        {[
          { angka: totalAtlet.toLocaleString("id-ID"), label: "atlet terdata" },
          { angka: totalPerguruan, label: "perguruan & padepokan" },
          { angka: 18, label: "kecamatan terpetakan" },
          { angka: berlangsung, label: "event berlangsung" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="tnum font-mono text-2xl font-bold text-teal-800">
              {s.angka}
            </span>
            <span className="text-[12px] text-teal-950/55">{s.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px] text-teal-950/50">
        Seluruh angka di prototipe ini adalah data contoh, bukan data atlet sungguhan.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {PERAN.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group flex flex-col gap-2 rounded-2xl border border-gading-300 bg-white p-5 transition-colors hover:border-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-[17px] font-bold text-teal-950">{p.nama}</h2>
              <span
                aria-hidden
                className="text-teal-700 transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </div>
            <p className="font-mono text-[11px] text-teal-700">{p.persona}</p>
            <p className="text-[13px] leading-relaxed text-teal-950/65">{p.janji}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
