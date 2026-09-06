"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Kartu, JudulBagian, Lencana, CatatanDemo } from "@/components/ui";
import { ARENA, eventById, labelKategori } from "@/data/event";
import { atletById, inisial } from "@/data/atlet";
import { singkatanPerguruan } from "@/data/perguruan";
import { rubrikEvent, nilaiPeserta } from "@/data/penilaian";
import { juriArena } from "@/data/juri";
import { hitungSkor } from "@/lib/hasil";
import { gabungNilai, useAntrianLive, useNilaiLive } from "@/lib/live";
import type { Nilai } from "@/lib/types";

const bulat1 = (n: number) => Math.round(n * 10) / 10;

export default function HalamanJuri() {
  const [arenaId, setArenaId] = useState(ARENA[0].id);
  const [juriId, setJuriId] = useState(juriArena(ARENA[0].id)[0].id);
  const [antrian] = useAntrianLive();
  const [nilaiLive, setNilaiLive] = useNilaiLive();
  const [isian, setIsian] = useState<Record<string, number>>({});

  const arena = ARENA.find((a) => a.id === arenaId)!;
  const event = eventById(arena.eventId)!;
  const rubrik = rubrikEvent(arena.eventId);
  const juri = juriArena(arenaId);
  const tampil = antrian.find(
    (q) => q.arenaId === arenaId && q.status === "tampil",
  );
  const atlet = tampil ? atletById(tampil.atletId) : undefined;

  const semua = useMemo(() => gabungNilai(nilaiLive), [nilaiLive]);
  const milikPeserta = tampil
    ? nilaiPeserta(semua, arena.eventId, tampil.kategoriId, tampil.atletId)
    : [];
  const sudahKunci = (jId: string) =>
    milikPeserta.some((n) => n.juriId === jId);
  const skor =
    tampil && milikPeserta.length
      ? hitungSkor(tampil.atletId, milikPeserta, rubrik)
      : null;
  const nilaiAspek = (id: string) =>
    isian[id] ?? rubrik.find((a) => a.id === id)!.skalaMaks * 0.7;

  function buatBaris(jId: string, geser = 0): Nilai[] {
    if (!tampil) return [];
    const waktu = new Date().toISOString();
    return rubrik.map((a) => ({
      eventId: arena.eventId,
      kategoriId: tampil.kategoriId,
      atletId: tampil.atletId,
      aspekId: a.id,
      nilai: Math.min(
        a.skalaMaks,
        Math.max(a.skalaMin, bulat1(nilaiAspek(a.id) + geser)),
      ),
      juriId: jId,
      waktu,
      terkunci: true,
    }));
  }

  const kunci = () =>
    setNilaiLive((s) => [
      ...s.filter(
        (n) =>
          !(
            tampil &&
            n.eventId === arena.eventId &&
            n.atletId === tampil.atletId &&
            n.juriId === juriId
          ),
      ),
      ...buatBaris(juriId),
    ]);
  const kunciTiga = () =>
    setNilaiLive((s) => [
      ...s.filter(
        (n) =>
          !(
            tampil &&
            n.eventId === arena.eventId &&
            n.atletId === tampil.atletId &&
            n.kategoriId === tampil.kategoriId
          ),
      ),
      ...juri.flatMap((j, i) => buatBaris(j.id, [-0.2, 0, 0.3][i] ?? 0)),
    ]);

  const gantiArena = (id: string) => {
    setArenaId(id);
    setJuriId(juriArena(id)[0].id);
    setIsian({});
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-1">
        <span className="label">Panel juri</span>
        <h1 className="judul text-[clamp(26px,5vw,40px)] text-paper">
          {event.nama}
        </h1>
        <p className="text-[13px] text-paper-dim">
          Rubrik: {rubrik.filter((a) => a.tipe === "inti").length} aspek inti +{" "}
          {rubrik.filter((a) => a.tipe === "ekstensi").length} ekstensi
        </p>
      </header>

      <div className="flex gap-2">
        {ARENA.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => gantiArena(a.id)}
            aria-pressed={a.id === arenaId}
            className={`flex-1 border px-3 py-3 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen ${a.id === arenaId ? "border-aksen bg-aksen text-ink-900" : "border-white/15 text-paper-dim hover:border-white/40 hover:text-paper"}`}
          >
            {a.nama}
          </button>
        ))}
      </div>

      <Kartu className="flex flex-wrap items-center gap-3 p-4">
        <span className="label label-redup">Saya menilai sebagai</span>
        <div className="flex flex-wrap gap-2">
          {juri.map((j) => (
            <button
              key={j.id}
              type="button"
              onClick={() => setJuriId(j.id)}
              aria-pressed={j.id === juriId}
              className={`border px-3 py-2 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen ${j.id === juriId ? "border-paper bg-paper text-ink-900" : "border-white/15 text-paper-dim hover:border-white/40"}`}
            >
              {j.nama}
              {sudahKunci(j.id) ? " ✓" : ""}
            </button>
          ))}
        </div>
      </Kartu>

      {tampil && atlet ? (
        <>
          <Kartu className="flex items-center gap-4 p-5">
            <span className="tnum grid size-14 shrink-0 place-items-center bg-ink-600 font-mono text-[18px] font-bold text-aksen">
              {String(tampil.nomorUrut).padStart(3, "0")}
            </span>
            <div className="grid size-11 shrink-0 place-items-center rounded-full border border-aksen/60 font-display text-[13px] font-black text-aksen">
              {inisial(atlet.nama)}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="judul text-[20px] text-paper">{atlet.nama}</span>
              <span className="font-mono text-[11px] tracking-[0.06em] text-muted">
                {singkatanPerguruan(atlet.perguruanId)} ·{" "}
                {labelKategori(tampil.kategoriId)}
              </span>
            </div>
            <Lencana nada="cyan">Sedang tampil</Lencana>
          </Kartu>

          {sudahKunci(juriId) ? (
            <Kartu className="p-6">
              <Lencana nada="hijau">Terkunci</Lencana>
              <p className="mt-3 text-[14px] leading-relaxed text-paper-dim">
                Nilai Anda untuk peserta ini sudah dikunci dan tidak bisa diubah
                dari layar mana pun. Ganti identitas juri di atas untuk mengisi
                sebagai juri lain.
              </p>
            </Kartu>
          ) : (
            <Kartu className="flex flex-col gap-6 p-6">
              {(["inti", "ekstensi"] as const).map((tipe) => (
                <div key={tipe} className="flex flex-col gap-5">
                  <span className="label">
                    {tipe === "inti"
                      ? "Aspek inti — wajib di semua event"
                      : "Aspek ekstensi — milik event ini"}
                  </span>
                  {rubrik
                    .filter((a) => a.tipe === tipe)
                    .map((a) => (
                      <div key={a.id} className="flex flex-col gap-2">
                        <div className="flex items-baseline justify-between gap-3">
                          <label
                            htmlFor={a.id}
                            className="text-[14px] font-semibold text-paper"
                          >
                            {a.nama}
                          </label>
                          <span className="tnum font-display text-[24px] font-black text-aksen">
                            {nilaiAspek(a.id).toFixed(1).replace(".", ",")}
                          </span>
                        </div>
                        <input
                          id={a.id}
                          type="range"
                          min={a.skalaMin}
                          max={a.skalaMaks}
                          step={0.1}
                          value={nilaiAspek(a.id)}
                          onChange={(e) =>
                            setIsian((s) => ({
                              ...s,
                              [a.id]: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-aksen"
                        />
                        <p className="text-[12px] leading-relaxed text-muted">
                          {a.deskripsi} Skala {a.skalaMin}–{a.skalaMaks}.
                        </p>
                      </div>
                    ))}
                </div>
              ))}
              <button type="button" onClick={kunci} className="cta w-full">
                Kunci nilai sebagai {juri.find((j) => j.id === juriId)?.nama}
              </button>
              <button
                type="button"
                onClick={kunciTiga}
                className="tombol-garis w-full"
              >
                Demo: kunci sebagai ketiga juri sekaligus
              </button>
            </Kartu>
          )}

          <section className="flex flex-col gap-4">
            <JudulBagian
              eyebrow="Rekap dewan juri"
              judul={`${milikPeserta.length ? new Set(milikPeserta.map((n) => n.juriId)).size : 0} dari ${juri.length} juri terkunci`}
            />
            {skor ? (
              <div className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
                {[
                  ["Inti", skor.inti],
                  ["Ekstensi", skor.ekstensi],
                  ["Total", skor.total],
                ].map(([l, v]) => (
                  <div
                    key={String(l)}
                    className="flex flex-col gap-1 bg-ink-700 p-4"
                  >
                    <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                      {l}
                    </span>
                    <span className="tnum font-display text-[28px] font-black text-paper">
                      {Number(v).toFixed(1).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-muted">
                Belum ada juri yang mengunci nilai untuk peserta ini.
              </p>
            )}
            <CatatanDemo>
              Rerata terpangkas: nilai tertinggi dan terendah dari tiga juri
              dibuang. Hasilnya langsung tampil di{" "}
              <Link href={`/arena/${arenaId}`} className="text-aksen underline">
                papan skor arena
              </Link>
              ,{" "}
              <Link
                href={`/event/${event.id}/hasil`}
                className="text-aksen underline"
              >
                hasil event
              </Link>
              , klasemen, dan rapor atlet.
            </CatatanDemo>
          </section>
        </>
      ) : (
        <Kartu className="p-6">
          <p className="text-[14px] text-paper-dim">
            Tidak ada peserta yang sedang tampil di {arena.nama}. Panitia
            memanggil peserta berikutnya dari panelnya.
          </p>
        </Kartu>
      )}
    </main>
  );
}
