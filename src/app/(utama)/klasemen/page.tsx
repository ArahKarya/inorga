"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Kartu, JudulBagian, CatatanDemo, Statistik } from "@/components/ui";
import { Footage, UbinCuplikan } from "@/components/Footage";
import { atletById, kelompokUmur } from "@/data/atlet";
import { namaPerguruan, singkatanPerguruan } from "@/data/perguruan";
import { namaKecamatan } from "@/data/wilayah";
import { EVENTS, kategoriById } from "@/data/event";
import { HASIL, rubrikEvent, nilaiPeserta } from "@/data/penilaian";
import { hitungKlasemen } from "@/lib/klasemen";
import { hitungSkor, susunPeringkat, tentukanMedali } from "@/lib/hasil";
import { gabungNilai, useNilaiLive } from "@/lib/live";
import type { Hasil } from "@/lib/types";

type Kontingen = "perguruan" | "kecamatan";

/**
 * Hasil sementara event yang sedang berlangsung, diturunkan dari nilai juri
 * (seed + live). Peringkat bisa berubah sampai seluruh peserta selesai.
 */
function hasilSementara(nilaiSemua: ReturnType<typeof gabungNilai>): Hasil[] {
  const eventId = "e-walikota";
  const rubrik = rubrikEvent(eventId);
  const rows = nilaiSemua.filter((n) => n.eventId === eventId);
  const kategoriIds = [...new Set(rows.map((r) => r.kategoriId))];
  return kategoriIds.flatMap((kategoriId) => {
    const atletIds = [
      ...new Set(
        rows.filter((r) => r.kategoriId === kategoriId).map((r) => r.atletId),
      ),
    ];
    const skor = atletIds.map((id) =>
      hitungSkor(id, nilaiPeserta(rows, eventId, kategoriId, id), rubrik),
    );
    return susunPeringkat(skor).map((s, i) => ({
      id: `sementara-${kategoriId}-${s.atletId}`,
      eventId,
      kategoriId,
      atletId: s.atletId,
      peringkat: i + 1,
      medali: tentukanMedali(i + 1),
      totalNilai: s.total,
      nomorSertifikat: "",
      sumber: "sistem" as const,
    }));
  });
}

export default function HalamanKlasemen() {
  const [kontingen, setKontingen] = useState<Kontingen>("perguruan");
  const [ikutSementara, setIkutSementara] = useState(true);
  const [nilaiLive] = useNilaiLive();

  const sementara = useMemo(
    () => hasilSementara(gabungNilai(nilaiLive)),
    [nilaiLive],
  );
  const semua = useMemo(
    () => (ikutSementara ? [...HASIL, ...sementara] : HASIL),
    [ikutSementara, sementara],
  );

  const baris = useMemo(
    () =>
      hitungKlasemen(semua, (h) => {
        const a = atletById(h.atletId);
        if (!a) return null;
        return kontingen === "perguruan"
          ? { kunci: a.perguruanId, nama: namaPerguruan(a.perguruanId) }
          : { kunci: a.kecamatanId, nama: namaKecamatan(a.kecamatanId) };
      }),
    [semua, kontingen],
  );

  const totalMedali = semua.filter((h) => h.medali).length;
  const peraih = [
    ...new Set(semua.filter((h) => h.medali).map((h) => h.atletId)),
  ]
    .map((id) => ({
      a: atletById(id)!,
      emas: semua.filter((h) => h.atletId === id && h.medali === "emas").length,
      total: semua.filter((h) => h.atletId === id && h.medali).length,
    }))
    .sort((x, y) => y.emas - x.emas || y.total - x.total)
    .slice(0, 8);
  const perKategori = [
    ...new Set(semua.filter((h) => h.medali).map((h) => h.kategoriId)),
  ]
    .map((kId) => ({
      kId,
      n: semua.filter((h) => h.kategoriId === kId && h.medali).length,
    }))
    .sort((x, y) => y.n - x.n);
  const eventTercakup = [...new Set(semua.map((h) => h.eventId))].map(
    (id) => EVENTS.find((e) => e.id === id)?.nama ?? id,
  );

  return (
    <main className="flex flex-col gap-8 pb-8">
      <header className="relative min-h-[300px] border-b border-white/10 sm:min-h-[380px]">
        <Footage
          src="/footage/atlet-ilustrasi.png"
          posisi="right 20%"
          scrim="kiri"
          kabur={1}
          redup={0.6}
        />
        <div className="inner relative flex h-full min-h-[300px] flex-col justify-end gap-2 py-10 sm:min-h-[380px]">
          <span className="label">Klasemen medali</span>
          <h1 className="judul text-[clamp(32px,6vw,64px)] text-paper">
            Perolehan medali{" "}
            {kontingen === "perguruan" ? "per perguruan" : "per kecamatan"}
          </h1>
          <p className="max-w-[62ch] text-[13px] leading-relaxed text-paper-dim">
            Dihitung dari hasil bersistem — event yang nilai jurinya tercatat.
            Prestasi arsip pra-sistem tampil di portofolio atlet, tidak di sini.
          </p>
        </div>
      </header>
      <div className="inner flex flex-col gap-8">
        <div className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
          <div className="bg-ink-700 p-5">
            <Statistik
              kecil
              angka={baris.length}
              label={
                kontingen === "perguruan"
                  ? "Perguruan bermedali"
                  : "Kecamatan bermedali"
              }
            />
          </div>
          <div className="bg-ink-700 p-5">
            <Statistik kecil angka={totalMedali} label="Medali tercatat" />
          </div>
          <div className="bg-ink-700 p-5">
            <Statistik kecil angka={eventTercakup.length} label="Event tercakup" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(["perguruan", "kecamatan"] as Kontingen[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKontingen(k)}
                aria-pressed={kontingen === k}
                className={`border px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen ${kontingen === k ? "border-aksen bg-aksen text-ink-900" : "border-white/15 text-paper-dim hover:border-white/40 hover:text-paper"}`}
              >
                {k}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-paper-dim uppercase">
            <input
              type="checkbox"
              checked={ikutSementara}
              onChange={(e) => setIkutSementara(e.target.checked)}
              className="accent-aksen"
            />
            Sertakan hasil sementara Piala Walikota
          </label>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <Kartu className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    {[
                      "#",
                      kontingen === "perguruan" ? "Perguruan" : "Kecamatan",
                      "Emas",
                      "Perak",
                      "Perunggu",
                      "Total",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 font-mono text-[10px] tracking-[0.16em] text-muted uppercase ${i >= 2 ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {baris.map((b) => (
                    <tr
                      key={b.kunci}
                      className="border-b border-white/10 last:border-0"
                    >
                      <td className="tnum px-4 py-3 font-mono text-[13px] text-aksen">
                        {b.peringkat}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[14px] font-semibold text-paper">
                          {b.nama}
                        </span>
                        {kontingen === "perguruan" ? (
                          <span className="ml-2 font-mono text-[10px] text-muted">
                            {singkatanPerguruan(b.kunci)}
                          </span>
                        ) : null}
                      </td>
                      <td className="tnum px-4 py-3 text-right font-mono text-[14px] font-bold text-emas">
                        {b.emas}
                      </td>
                      <td className="tnum px-4 py-3 text-right font-mono text-[14px] font-bold text-perak">
                        {b.perak}
                      </td>
                      <td className="tnum px-4 py-3 text-right font-mono text-[14px] font-bold text-perunggu">
                        {b.perunggu}
                      </td>
                      <td className="tnum px-4 py-3 text-right font-mono text-[14px] text-paper">
                        {b.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Kartu>

            <CatatanDemo>
              Peringkat memakai aturan kompetisi: dua kontingen dengan perolehan
              sama berbagi peringkat, dan yang berikutnya melompat. Hasil
              sementara berubah begitu juri mengunci nilai — buka{" "}
              <Link href="/juri" className="text-aksen underline">
                panel juri
              </Link>{" "}
              lalu kembali ke sini.
            </CatatanDemo>

            <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
              Mencakup: {eventTercakup.join(" · ")}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
              <JudulBagian eyebrow="Atlet" judul="Peraih medali terbanyak" />
              <Kartu className="divide-y divide-white/10">
                {peraih.map(({ a, emas, total }, i) => (
                  <Link
                    key={a.id}
                    href={`/atlet/${a.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-ink-600"
                  >
                    <span className="tnum w-5 font-mono text-[12px] text-aksen">
                      {i + 1}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[13px] font-semibold text-paper">
                        {a.nama}
                      </span>
                      <span className="font-mono text-[10px] text-muted">
                        {singkatanPerguruan(a.perguruanId)} ·{" "}
                        {kelompokUmur(a.umur)}
                      </span>
                    </div>
                    <span className="tnum font-mono text-[12px] text-emas">
                      {emas}E
                    </span>
                    <span className="tnum w-8 text-right font-mono text-[12px] text-muted">
                      {total}
                    </span>
                  </Link>
                ))}
              </Kartu>
            </section>
            <section className="flex flex-col gap-4">
              <JudulBagian eyebrow="Kategori" judul="Medali per kategori" />
              <Kartu className="divide-y divide-white/10">
                {perKategori.map(({ kId, n }) => (
                  <div key={kId} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[13px] text-paper">
                        {kategoriById(kId)?.nama}
                      </span>
                      <span className="font-mono text-[10px] text-muted">
                        {kategoriById(kId)?.kelompokUmur}
                        {kategoriById(kId)?.gender === "L"
                          ? " · Putra"
                          : kategoriById(kId)?.gender === "P"
                            ? " · Putri"
                            : ""}
                      </span>
                    </div>
                    <div className="h-1.5 w-20 bg-ink-500">
                      <div
                        className="h-full bg-aksen"
                        style={{ width: `${(n / perKategori[0].n) * 100}%` }}
                      />
                    </div>
                    <span className="tnum w-6 text-right font-mono text-[12px] text-paper">
                      {n}
                    </span>
                  </div>
                ))}
              </Kartu>
            </section>
          </div>
        </div>
        <section className="flex flex-col gap-4">
          <JudulBagian
            eyebrow="Dari matras"
            judul="Cuplikan kategori"
            aksi={
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                Ilustrasi contoh
              </span>
            }
          />
          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            <UbinCuplikan
              src="/footage/jurus-1.png"
              nomor="01"
              judul="Jurus Tunggal Baku"
              keterangan="Pra-Remaja & Remaja — kategori terbanyak pesertanya."
            />
            <UbinCuplikan
              src="/footage/jurus-2.png"
              nomor="02"
              judul="Jurus Berpasangan"
              keterangan="Remaja campuran — dibuka di Palembang Open 2026."
            />
            <UbinCuplikan
              src="/footage/jurus-3.png"
              nomor="03"
              judul="Seni Tradisi Perorangan"
              keterangan="Dewasa — aspek busana dan musik pengiring ikut dinilai."
            />
          </div>
          <CatatanDemo>
            Di versi produksi, ubin ini berisi cuplikan 30–60 detik yang
            diunggah atlet — galeri keterampilan untuk kurator, tidak pernah
            publik, aksesnya dicatat.
          </CatatanDemo>
        </section>
      </div>
    </main>
  );
}
