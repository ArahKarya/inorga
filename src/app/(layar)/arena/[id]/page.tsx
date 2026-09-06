"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { arenaById, eventById, labelKategori } from "@/data/event";
import { atletById } from "@/data/atlet";
import { singkatanPerguruan } from "@/data/perguruan";
import { rubrikEvent, nilaiPeserta } from "@/data/penilaian";
import { hitungSkor, susunPeringkat } from "@/lib/hasil";
import { gabungNilai, useAntrianLive, useNilaiLive } from "@/lib/live";
import { Footage } from "@/components/Footage";

/**
 * Papan skor arena untuk layar besar. Tanpa bilah, tanpa reveal, tanpa gulir
 * halus — semuanya tampil seketika dan berubah sendiri lewat event `storage`
 * saat panitia menekan "panggil" di perangkat lain.
 */
export default function LayarArena({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const arena = arenaById(id);
  const [antrian] = useAntrianLive();
  const [nilaiLive] = useNilaiLive();
  const [jam, setJam] = useState("");

  useEffect(() => {
    const tick = () =>
      setJam(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);

  const daftar = useMemo(
    () =>
      antrian
        .filter((q) => q.arenaId === id)
        .sort((a, b) => a.nomorUrut - b.nomorUrut),
    [antrian, id],
  );
  const tampil = daftar.find((q) => q.status === "tampil");
  const dipanggil = daftar.find((q) => q.status === "dipanggil");
  const berikut = daftar.filter((q) => q.status === "menunggu").slice(0, 4);

  const skorBerjalan = useMemo(() => {
    if (!arena) return [];
    const rubrik = rubrikEvent(arena.eventId);
    const semua = gabungNilai(nilaiLive);
    const selesai = daftar.filter(
      (q) => q.status === "selesai" || q.status === "tampil",
    );
    const skor = selesai
      .map((q) =>
        hitungSkor(
          q.atletId,
          nilaiPeserta(semua, arena.eventId, q.kategoriId, q.atletId),
          rubrik,
        ),
      )
      .filter((s) => s.jumlahJuri > 0);
    return susunPeringkat(skor);
  }, [arena, daftar, nilaiLive]);

  if (!arena) {
    return (
      <main className="grid min-h-dvh place-items-center p-8">
        <p className="judul text-[28px]">Arena tidak ditemukan</p>
      </main>
    );
  }
  const event = eventById(arena.eventId)!;
  const atletTampil = tampil ? atletById(tampil.atletId) : undefined;
  const atletDipanggil = dipanggil ? atletById(dipanggil.atletId) : undefined;

  return (
    <main className="flex min-h-dvh flex-col bg-ink-900 text-paper">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-8 py-5">
        <div className="flex items-center gap-4">
          <span className="grid size-10 place-items-center rounded-full border-[1.5px] border-paper font-display text-[16px] font-black">
            I
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[12px] tracking-[0.2em] uppercase">
              Inorga · {arena.nama}
            </span>
            <span className="text-[13px] text-paper-dim">{event.nama}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
            Data contoh
          </span>
          <span className="tnum font-display text-[40px] leading-none font-black text-aksen">
            {jam}
          </span>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-px bg-white/10 lg:grid-cols-[1.5fr_1fr]">
        <section className="relative flex flex-col justify-between gap-10 bg-ink-900 p-10">
          <Footage
            src="/footage/arena-matras.png"
            posisi="right 35%"
            scrim="kiri"
            kabur={1.5}
            redup={0.5}
          />
          <div className="relative">
            <span className="label">Sedang tampil</span>
            {tampil && atletTampil ? (
              <>
                <p className="tnum mt-6 font-display text-[clamp(96px,14vw,220px)] leading-[0.85] font-black text-paper">
                  {String(tampil.nomorUrut).padStart(3, "0")}
                </p>
                <p className="judul mt-6 text-[clamp(30px,4.5vw,64px)]">
                  {atletTampil.nama}
                </p>
                <p className="mt-3 font-mono text-[14px] tracking-[0.12em] text-paper-dim uppercase">
                  {singkatanPerguruan(atletTampil.perguruanId)} ·{" "}
                  {labelKategori(tampil.kategoriId)}
                </p>
              </>
            ) : (
              <p className="judul mt-6 text-[clamp(30px,4.5vw,64px)] text-muted">
                Matras kosong
              </p>
            )}
          </div>
          <div className="relative border-t border-aksen/40 pt-8">
            <span className="label">Bersiap — dipanggil</span>
            {dipanggil && atletDipanggil ? (
              <div className="mt-4 flex items-baseline gap-6">
                <span className="tnum font-display text-[clamp(48px,7vw,104px)] leading-none font-black text-aksen">
                  {String(dipanggil.nomorUrut).padStart(3, "0")}
                </span>
                <div>
                  <p className="judul text-[clamp(22px,3vw,40px)]">
                    {atletDipanggil.nama}
                  </p>
                  <p className="mt-1 font-mono text-[12px] tracking-[0.12em] text-paper-dim uppercase">
                    {singkatanPerguruan(atletDipanggil.perguruanId)} · perkiraan{" "}
                    {dipanggil.jamPerkiraan}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-[16px] text-muted">—</p>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-px bg-white/10">
          <div className="flex-1 bg-ink-900 p-8">
            <span className="label">Berikutnya</span>
            <ol className="mt-5 flex flex-col divide-y divide-white/10">
              {berikut.map((q) => {
                const a = atletById(q.atletId)!;
                return (
                  <li key={q.id} className="flex items-center gap-5 py-4">
                    <span className="tnum font-mono text-[22px] font-bold text-paper-dim">
                      {String(q.nomorUrut).padStart(3, "0")}
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-[18px] font-semibold">
                        {a.nama}
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
                        {singkatanPerguruan(a.perguruanId)} · {q.jamPerkiraan}
                      </span>
                    </div>
                  </li>
                );
              })}
              {berikut.length === 0 ? (
                <li className="py-4 text-[14px] text-muted">
                  Tidak ada lagi peserta menunggu.
                </li>
              ) : null}
            </ol>
          </div>
          <div className="flex-1 bg-ink-900 p-8">
            <span className="label">Skor berjalan — aspek inti</span>
            <ol className="mt-5 flex flex-col divide-y divide-white/10">
              {skorBerjalan.map((s, i) => {
                const a = atletById(s.atletId)!;
                return (
                  <li
                    key={s.atletId}
                    className="flex items-center gap-5 py-3.5"
                  >
                    <span className="tnum w-6 font-mono text-[14px] text-aksen">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[17px] font-semibold">
                      {a.nama}
                    </span>
                    <span className="tnum font-display text-[26px] font-black">
                      {s.inti.toFixed(1).replace(".", ",")}
                    </span>
                    <span className="tnum w-12 text-right font-mono text-[12px] text-muted">
                      +{s.ekstensi.toFixed(1).replace(".", ",")}
                    </span>
                  </li>
                );
              })}
              {skorBerjalan.length === 0 ? (
                <li className="py-4 text-[14px] text-muted">
                  Belum ada nilai yang dikunci.
                </li>
              ) : null}
            </ol>
          </div>
        </aside>
      </div>

      <footer className="flex items-center justify-between border-t border-white/10 px-8 py-3 font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
        <span>
          Skor inti diurutkan menurun · nilai ekstensi ditampilkan terpisah
        </span>
        <Link href="/panitia" className="hover:text-paper">
          Keluar layar besar
        </Link>
      </footer>
    </main>
  );
}
