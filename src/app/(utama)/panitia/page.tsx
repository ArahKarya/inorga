"use client";

import { useState } from "react";
import Link from "next/link";
import { useAntrianLive } from "@/lib/live";
import { Kartu, JudulBagian, Lencana, CatatanDemo } from "@/components/ui";
import { ARENA, eventById, labelKategori } from "@/data/event";
import { atletById, inisial } from "@/data/atlet";
import { singkatanPerguruan } from "@/data/perguruan";
import type { StatusAntrian } from "@/lib/types";

const GAYA_STATUS: Record<StatusAntrian, string> = {
  selesai: "bg-transparent text-muted border-white/10",
  tampil: "bg-ink-600 text-paper border-aksen",
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
  const daftar = antrian
    .filter((q) => q.arenaId === arenaId)
    .sort((a, b) => a.nomorUrut - b.nomorUrut);

  const hadir = daftar.filter((q) => q.status !== "menunggu").length;

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

  function pulihkanKoneksi() {
    setLuring(false);
    setBelumTersinkron(0);
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
      <header className="flex flex-col gap-1">
        <span className="label">Panel panitia</span>
        <h1 className="judul text-[clamp(26px,5vw,40px)] text-paper">
          {event.nama}
        </h1>
        <p className="text-[13px] text-paper-dim">{event.lokasi}</p>
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
      </header>

      {/* Status koneksi — inti dari temuan G5 dan G12. */}
      <Kartu
        warna={luring ? "bg-amber-50" : "bg-ink-700"}
        className={`flex flex-wrap items-center justify-between gap-3 p-4 ${
          luring ? "border-amber-300" : ""
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`size-2.5 rounded-full ${luring ? "bg-amber-500" : "bg-emerald-500"}`}
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
          onClick={() => (luring ? pulihkanKoneksi() : setLuring(true))}
          className="border border-white/25 px-3 py-1.5 text-[12px] font-semibold text-aksen transition-colors hover:bg-paper hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen"
        >
          {luring ? "Pulihkan koneksi" : "Simulasikan koneksi putus"}
        </button>
      </Kartu>

      {/* Pilih matras */}
      <div className="flex gap-2">
        {ARENA.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setArenaId(a.id)}
            aria-pressed={a.id === arenaId}
            className={`flex-1  border px-3 py-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen ${
              a.id === arenaId
                ? "border-aksen bg-aksen text-ink-900"
                : "border-white/15 bg-transparent text-paper-dim hover:border-white/40 hover:text-paper"
            }`}
          >
            {a.nama}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-3">
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
          className="w-full bg-aksen px-5 py-4 font-mono text-[12px] tracking-[0.14em] text-ink-900 uppercase transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen"
        >
          Panggil peserta berikutnya
        </button>

        <Kartu className="divide-y divide-white/10">
          {daftar.map((q) => {
            const atlet = atletById(q.atletId)!;
            return (
              <div
                key={q.id}
                className={`flex items-center gap-3 p-3.5 ${
                  q.status === "selesai" ? "opacity-55" : ""
                }`}
              >
                <span className="tnum grid size-11 shrink-0 place-items-center bg-ink-600 font-mono text-[15px] font-bold text-aksen">
                  {String(q.nomorUrut).padStart(3, "0")}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-[14px] font-semibold text-paper">
                    {atlet.nama}
                  </p>
                  <p className="font-mono text-[11px] text-muted">
                    {singkatanPerguruan(atlet.perguruanId)} · {q.jamPerkiraan}{" "}
                    WIB
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${GAYA_STATUS[q.status]}`}
                >
                  {LABEL_STATUS[q.status]}
                </span>
              </div>
            );
          })}
        </Kartu>

        <CatatanDemo>
          Panel ini dirancang bekerja penuh tanpa internet lalu menyinkronkan
          saat sinyal kembali. Di GOR, koneksi tertekan ratusan penonton — dan
          panggilan yang telat tiga menit membuat atlet kehilangan gilirannya.
        </CatatanDemo>
      </section>

      <section className="flex flex-col gap-3">
        <JudulBagian eyebrow="Meja pendaftaran" judul="Check-in peserta" />
        <Kartu className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center border-2 border-dashed border-white/25/40 text-aksen">
              <span className="text-2xl">⌗</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-semibold text-paper">
                Pindai QR kartu anggota
              </p>
              <p className="text-[12px] leading-relaxed text-paper-dim">
                Data peserta muncul seketika. Tidak ada pencocokan nama manual,
                tidak ada fotokopi berkas.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-ink-600 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
                Pindaian terakhir
              </span>
              <Lencana nada="hijau">Terverifikasi</Lencana>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full border border-aksen/60 font-display text-[13px] font-black text-aksen">
                {inisial("Andi Saputra")}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-paper">
                  Andi Saputra
                </span>
                <span className="font-mono text-[11px] text-muted">
                  A-025 · PSHT · Nomor urut 025
                </span>
              </div>
            </div>
          </div>

          <CatatanDemo>
            Panitia juga bisa mendaftarkan atlet atas nama orang lain — untuk
            peserta tanpa ponsel atau dari perguruan yang belum terbiasa dengan
            aplikasi.
          </CatatanDemo>
        </Kartu>
      </section>
    </main>
  );
}
