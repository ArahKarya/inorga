"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Kartu,
  JudulBagian,
  Lencana,
  CatatanDemo,
  Statistik,
} from "@/components/ui";
import { Footage } from "@/components/Footage";
import { PindaiQR } from "@/components/PindaiQR";
import {
  ARENA,
  KATEGORI,
  PENDAFTARAN,
  eventById,
  kategoriById,
  labelKategori,
} from "@/data/event";
import { atletById, inisial } from "@/data/atlet";
import { singkatanPerguruan } from "@/data/perguruan";
import { useAntrianLive } from "@/lib/live";
import type { StatusAntrian } from "@/lib/types";

const GAYA_STATUS: Record<StatusAntrian, string> = {
  selesai: "bg-transparent text-muted border-white/10",
  tampil: "bg-ink-600 text-paper border-white/20",
  dipanggil: "bg-aksen text-ink-900 border-aksen",
  menunggu: "bg-ink-700 text-paper-dim border-white/10",
};
const LABEL_STATUS: Record<StatusAntrian, string> = {
  selesai: "Selesai",
  tampil: "Sedang tampil",
  dipanggil: "Dipanggil",
  menunggu: "Menunggu",
};

export default function HalamanPanitia() {
  const [arenaId, setArenaId] = useState(ARENA[0].id);
  const [antrian, setAntrian] = useAntrianLive();
  const [luring, setLuring] = useState(false);
  const [belumTersinkron, setBelumTersinkron] = useState(0);

  const arena = ARENA.find((a) => a.id === arenaId)!;
  const event = eventById(arena.eventId)!;
  const daftar = useMemo(
    () =>
      antrian
        .filter((q) => q.arenaId === arenaId)
        .sort((a, b) => a.nomorUrut - b.nomorUrut),
    [antrian, arenaId],
  );
  const hadir = daftar.filter((q) => q.status !== "menunggu").length;

  const pendaftarEvent = PENDAFTARAN.filter((p) => p.eventId === event.id);
  const rekapCheckIn = event.kategoriIds
    .map((kId) => {
      const d = pendaftarEvent.filter((p) => p.kategoriId === kId);
      return {
        kId,
        total: d.length,
        hadir: d.filter((p) => p.checkIn === "hadir").length,
      };
    })
    .filter((r) => r.total > 0);
  const dibantu = pendaftarEvent.filter((p) => p.didaftarkanOleh);
  const totalHadir = pendaftarEvent.filter((p) => p.checkIn === "hadir").length;

  function panggilBerikutnya() {
    setAntrian((sebelum) => {
      const diArena = sebelum
        .filter((q) => q.arenaId === arenaId)
        .sort((a, b) => a.nomorUrut - b.nomorUrut);
      const iTampil = diArena.findIndex((q) => q.status === "tampil");
      const iDipanggil = diArena.findIndex((q) => q.status === "dipanggil");
      const iBerikut = diArena.findIndex((q) => q.status === "menunggu");
      const ubah = new Map<string, StatusAntrian>();
      if (iTampil >= 0) ubah.set(diArena[iTampil].id, "selesai");
      if (iDipanggil >= 0) ubah.set(diArena[iDipanggil].id, "tampil");
      if (iBerikut >= 0) ubah.set(diArena[iBerikut].id, "dipanggil");
      if (ubah.size === 0) return sebelum;
      return sebelum.map((q) =>
        ubah.has(q.id) ? { ...q, status: ubah.get(q.id)! } : q,
      );
    });
    if (luring) setBelumTersinkron((n) => n + 1);
  }

  return (
    <main className="flex flex-col gap-10 pb-12">
      <header className="relative min-h-[240px] border-b border-white/10">
        <Footage
          src="/footage/arena-matras.png"
          posisi="right 40%"
          scrim="kiri"
          kabur={1.5}
          redup={0.5}
        />
        <div className="inner relative flex min-h-[240px] flex-col justify-end gap-2 py-10">
          <span className="label">Panel panitia</span>
          <h1 className="judul text-[clamp(28px,4.5vw,52px)] text-paper">
            {event.nama}
          </h1>
          <p className="text-[13px] text-paper-dim">
            {event.lokasi} · hari 1 dari 2
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={`/arena/${arenaId}`}
              target="_blank"
              className="tombol-garis text-[11px]"
            >
              Buka layar besar ↗
            </Link>
            <Link href="/undian" className="tombol-garis text-[11px]">
              Undian urutan tampil
            </Link>
            <Link
              href={`/event/${event.id}`}
              className="tombol-garis text-[11px]"
            >
              Detail event
            </Link>
          </div>
        </div>
      </header>

      <div className="inner grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex min-w-0 flex-col gap-8">
          <Kartu
            warna={luring ? "bg-amber-400/5" : "bg-ink-700"}
            className={`flex flex-wrap items-center justify-between gap-3 p-4 ${luring ? "border-amber-400/40" : ""}`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`size-2.5 rounded-full ${luring ? "bg-amber-400" : "bg-emerald-400"}`}
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-paper">
                  {luring
                    ? "Mode luring — sistem tetap jalan"
                    : "Tersambung ke server"}
                </span>
                <span className="text-[11px] text-muted">
                  {luring
                    ? `${belumTersinkron} perubahan menunggu sinkronisasi`
                    : "Semua perubahan tersimpan"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (luring) {
                  setLuring(false);
                  setBelumTersinkron(0);
                } else setLuring(true);
              }}
              className="tombol-garis text-[11px]"
            >
              {luring ? "Pulihkan koneksi" : "Simulasikan koneksi putus"}
            </button>
          </Kartu>

          <div className="flex gap-2">
            {ARENA.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setArenaId(a.id)}
                aria-pressed={a.id === arenaId}
                className={`flex-1 border px-3 py-3 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen ${a.id === arenaId ? "border-aksen bg-aksen text-ink-900" : "border-white/15 bg-transparent text-paper-dim hover:border-white/40 hover:text-paper"}`}
              >
                {a.nama}
              </button>
            ))}
          </div>

          <section className="flex min-w-0 flex-col gap-4">
            <JudulBagian
              eyebrow={labelKategori(arena.kategoriAktifId)}
              judul={`Antrian ${arena.nama}`}
              aksi={
                <span className="tnum font-mono text-[11px] text-muted">
                  {hadir}/{daftar.length} tampil
                </span>
              }
            />
            <button
              type="button"
              onClick={panggilBerikutnya}
              className="cta w-full"
            >
              Panggil peserta berikutnya
            </button>
            <Kartu className="divide-y divide-white/10">
              {daftar.map((q) => {
                const atlet = atletById(q.atletId)!;
                return (
                  <div
                    key={q.id}
                    className={`flex items-center gap-3 p-3.5 ${q.status === "selesai" ? "opacity-55" : ""}`}
                  >
                    <span className="tnum grid size-11 shrink-0 place-items-center bg-ink-600 font-mono text-[15px] font-bold text-aksen">
                      {String(q.nomorUrut).padStart(3, "0")}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/atlet/${atlet.id}`}
                        className="truncate text-[14px] font-semibold text-paper hover:text-aksen"
                      >
                        {atlet.nama}
                      </Link>
                      <p className="font-mono text-[11px] text-muted">
                        {singkatanPerguruan(atlet.perguruanId)} ·{" "}
                        {q.jamPerkiraan} WIB
                      </p>
                    </div>
                    <span
                      className={`shrink-0 border px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${GAYA_STATUS[q.status]}`}
                    >
                      {LABEL_STATUS[q.status]}
                    </span>
                  </div>
                );
              })}
            </Kartu>
            <CatatanDemo>
              Panel ini dirancang bekerja penuh tanpa internet lalu
              menyinkronkan saat sinyal kembali. Buka layar besar di tab lain —
              ia berubah bersamaan saat tombol ditekan.
            </CatatanDemo>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-8">
          <section className="flex min-w-0 flex-col gap-4">
            <JudulBagian eyebrow="Semua matras" judul="Sekilas arena" />
            <Kartu className="divide-y divide-white/10">
              {ARENA.map((a) => {
                const q = antrian.filter((x) => x.arenaId === a.id);
                const tampil = q.find((x) => x.status === "tampil");
                const dipanggil = q.find((x) => x.status === "dipanggil");
                const sisa = q.filter((x) => x.status === "menunggu").length;
                return (
                  <div key={a.id} className="flex flex-col gap-2 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="judul text-[16px] text-paper">
                        {a.nama}
                      </span>
                      <span className="font-mono text-[10px] text-muted">
                        {kategoriById(a.kategoriAktifId)?.kelompokUmur}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[12px]">
                      <div>
                        <span className="block font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                          Tampil
                        </span>
                        <span className="text-paper">
                          {tampil
                            ? `${String(tampil.nomorUrut).padStart(3, "0")} ${atletById(tampil.atletId)?.nama}`
                            : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="block font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
                          Dipanggil
                        </span>
                        <span className="text-aksen">
                          {dipanggil
                            ? `${String(dipanggil.nomorUrut).padStart(3, "0")} ${atletById(dipanggil.atletId)?.nama}`
                            : "—"}
                        </span>
                      </div>
                    </div>
                    <span className="tnum font-mono text-[10px] text-muted">
                      {sisa} menunggu
                    </span>
                  </div>
                );
              })}
            </Kartu>
          </section>

          <section className="flex min-w-0 flex-col gap-4">
            <JudulBagian eyebrow="Rundown" judul="Jadwal hari ini" />
            <Kartu className="divide-y divide-white/10">
              {ARENA.flatMap((a) =>
                a.jadwal.filter((j) => j.hari === 1).map((j) => ({ a, j })),
              )
                .sort((x, y) => x.j.mulai.localeCompare(y.j.mulai))
                .map(({ a, j }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 text-[12px]"
                  >
                    <span className="tnum w-24 font-mono text-[11px] text-aksen">
                      {j.mulai}–{j.selesai}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-paper">
                      {labelKategori(j.kategoriId)}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {a.nama}
                    </span>
                  </div>
                ))}
            </Kartu>
          </section>

          <section className="flex min-w-0 flex-col gap-4">
            <JudulBagian eyebrow="Meja pendaftaran" judul="Check-in" />
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10">
              <div className="bg-ink-700 p-4">
                <Statistik
                  kecil
                  angka={totalHadir}
                  label="Sudah check-in"
                  ket={`dari ${pendaftarEvent.length} pada data contoh`}
                />
              </div>
              <div className="bg-ink-700 p-4">
                <Statistik
                  kecil
                  angka={dibantu.length}
                  label="Pendaftaran dibantu"
                  ket="tanpa ponsel sendiri"
                />
              </div>
            </div>
            <Kartu className="divide-y divide-white/10">
              {rekapCheckIn.map((r) => (
                <div
                  key={r.kId}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="min-w-0 flex-1 truncate text-[12px] text-paper-dim">
                    {labelKategori(r.kId)}
                  </span>
                  <div className="h-1.5 w-14 shrink-0 bg-ink-500 sm:w-24">
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${(r.hadir / r.total) * 100}%` }}
                    />
                  </div>
                  <span className="tnum w-12 text-right font-mono text-[11px] text-muted">
                    {r.hadir}/{r.total}
                  </span>
                </div>
              ))}
            </Kartu>
            <PindaiQR />
            <Kartu className="divide-y divide-white/10">
              <p className="px-4 pt-3 pb-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                Didaftarkan lewat jalur bantuan
              </p>
              {dibantu.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-2.5 text-[12px]"
                >
                  <span className="min-w-0 flex-1 truncate text-paper">
                    {atletById(p.atletId)?.nama}
                  </span>
                  <span className="truncate font-mono text-[10px] text-muted">
                    {p.didaftarkanOleh}
                  </span>
                </div>
              ))}
            </Kartu>
            <CatatanDemo>
              Karena semua event diwajibkan lewat aplikasi, jalur bantuan ini
              yang memastikan atlet tanpa ponsel tidak tersingkir — temuan G12.
            </CatatanDemo>
          </section>
        </div>
      </div>
      <p className="inner font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
        {KATEGORI.length} kategori · {ARENA.length} matras · data contoh
      </p>
    </main>
  );
}
