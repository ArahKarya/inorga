"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Kartu, JudulBagian, Lencana, CatatanDemo } from "@/components/ui";
import { GrafikTrenInti } from "@/components/charts";
import {
  TREN_ATLET,
  atletById,
  inisial,
  kelompokUmur,
  naikKelompok,
  kemiringanTren,
} from "@/data/atlet";
import { namaKecamatan } from "@/data/wilayah";
import { namaPerguruan } from "@/data/perguruan";
import {
  ARENA,
  EVENTS,
  eventById,
  labelKategori,
  pendaftaranAtlet,
} from "@/data/event";
import {
  ASPEK_INTI,
  HASIL,
  hasilAtlet,
  riwayatAtlet,
  nilaiPeserta,
} from "@/data/penilaian";
import { hitungSkor } from "@/lib/hasil";
import { rubrikEvent } from "@/data/penilaian";
import { nomorKeSlug } from "@/lib/sertifikat";
import { gabungNilai, useAntrianLive, useNilaiLive } from "@/lib/live";
import type { TrenTitik } from "@/lib/types";

const WARNA_MEDALI = {
  emas: "border-emas/50 text-emas",
  perak: "border-perak/50 text-perak",
  perunggu: "border-perunggu/50 text-perunggu",
} as const;

const TOMBOL_UTAMA =
  "w-full bg-aksen px-5 py-4 font-mono text-[12px] tracking-[0.14em] text-ink-900 uppercase transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen";

const tglId = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function ProfilAtlet({
  atletId,
  persona = false,
}: {
  atletId: string;
  persona?: boolean;
}) {
  const atlet = atletById(atletId);
  const [sudahDaftar, setSudahDaftar] = useState(false);
  const [bukaKartu, setBukaKartu] = useState(false);
  const [antrian] = useAntrianLive();
  const [nilaiLive] = useNilaiLive();

  const antrianSaya = antrian.find(
    (q) =>
      q.atletId === atletId &&
      (q.status === "dipanggil" || q.status === "tampil"),
  );
  const arena = ARENA.find((a) => a.id === antrianSaya?.arenaId);
  const eventArena = arena ? eventById(arena.eventId) : undefined;
  const eventTerbuka = EVENTS.find((e) => e.status === "dibuka")!;

  /** Tren historis + titik dari event yang sedang berlangsung bila juri sudah menilai. */
  const tren: TrenTitik[] = useMemo(() => {
    const dasar = TREN_ATLET[atletId] ?? [];
    const semua = gabungNilai(nilaiLive);
    const walikota = semua.filter(
      (n) => n.eventId === "e-walikota" && n.atletId === atletId,
    );
    if (walikota.length === 0) return dasar;
    const skor = hitungSkor(atletId, walikota, rubrikEvent("e-walikota"));
    const lengkap = ASPEK_INTI.every((a) => skor.perAspek[a.id] !== undefined);
    if (!lengkap) return dasar;
    const nilai: Record<string, number> = {};
    ASPEK_INTI.forEach((a) => (nilai[a.id] = skor.perAspek[a.id]));
    return [
      ...dasar,
      { event: "Piala Walikota 2026", tanggal: "Sep 2026", nilai },
    ];
  }, [atletId, nilaiLive]);

  /** Portofolio: hasil bersistem (bersertifikat terverifikasi) + prestasi arsip. */
  const portofolio = useMemo(() => {
    const sistem = hasilAtlet(atletId)
      .filter((h) => h.medali)
      .map((h) => {
        const ev = eventById(h.eventId)!;
        return {
          id: h.id,
          event: ev.nama,
          kategori: labelKategori(h.kategoriId),
          tanggal: tglId(ev.tanggalSelesai),
          medali: h.medali!,
          nomor: h.nomorSertifikat,
          terverifikasi: true,
          urut: ev.tanggalSelesai,
        };
      });
    const arsip = riwayatAtlet(atletId).map((r) => ({
      id: r.id,
      event: r.event,
      kategori: r.kategori,
      tanggal: r.tanggal,
      medali: r.medali,
      nomor: r.nomorSertifikat,
      terverifikasi: false,
      urut: r.nomorSertifikat.slice(-12),
    }));
    return [...sistem, ...arsip];
  }, [atletId]);

  /** Perbandingan dengan rata-rata kategori pada event bersistem terakhir. */
  const banding = useMemo(() => {
    const h = hasilAtlet(atletId).find((x) => x.eventId === "e-festival");
    if (!h) return null;
    const rubrik = rubrikEvent(h.eventId);
    const semua = gabungNilai(nilaiLive);
    const peserta = HASIL.filter(
      (x) => x.eventId === h.eventId && x.kategoriId === h.kategoriId,
    );
    const skor = peserta.map((x) =>
      hitungSkor(
        x.atletId,
        nilaiPeserta(semua, h.eventId, h.kategoriId, x.atletId),
        rubrik,
      ),
    );
    const saya = skor.find((x) => x.atletId === atletId)!;
    const rata = skor.reduce((a, b) => a + b.inti, 0) / skor.length;
    const tertinggi = Math.max(...skor.map((x) => x.inti));
    return {
      saya: saya.inti,
      rata: Math.round(rata * 10) / 10,
      tertinggi,
      peringkat: h.peringkat,
      dari: peserta.length,
      kategori: labelKategori(h.kategoriId),
    };
  }, [atletId, nilaiLive]);
  const daftarPendaftaran = useMemo(
    () =>
      pendaftaranAtlet(atletId)
        .map((p) => ({ p, ev: eventById(p.eventId)! }))
        .sort((a, b) => b.ev.tanggalMulai.localeCompare(a.ev.tanggalMulai)),
    [atletId],
  );

  if (!atlet) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <span className="label">Atlet</span>
        <h1 className="judul mt-3 text-[28px]">Tidak ditemukan</h1>
        <p className="mt-3 text-[14px] text-muted">
          Tidak ada atlet dengan ID {atletId} pada data contoh.
        </p>
      </main>
    );
  }

  const medali = portofolio.reduce(
    (m, p) => ({ ...m, [p.medali]: m[p.medali] + 1 }),
    { emas: 0, perak: 0, perunggu: 0 },
  );

  const jenjang = naikKelompok(atlet);
  const laju = kemiringanTren(tren);

  return (
    <main className="flex flex-col gap-10 pb-12">
      <div className="inner grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="flex min-w-0 flex-col gap-8">
          {antrianSaya && arena && eventArena ? (
            <div
              className={`border-2 border-aksen bg-aksen/10 p-6 ${antrianSaya.status === "dipanggil" ? "animate-panggil" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="size-2 animate-pulse rounded-full bg-aksen" />
                <span className="label">
                  {antrianSaya.status === "dipanggil"
                    ? "Giliran Anda"
                    : "Sedang tampil"}{" "}
                  — {arena.nama}
                </span>
              </div>
              <p className="judul judul-berat mt-4 text-[clamp(30px,7vw,52px)] text-paper">
                Nomor{" "}
                <span className="tnum text-aksen">{antrianSaya.nomorUrut}</span>{" "}
                {antrianSaya.status === "dipanggil" ? "dipanggil" : "di matras"}
              </p>
              <p className="mt-4 text-[14px] text-paper-dim">
                {labelKategori(antrianSaya.kategoriId)} · perkiraan tampil{" "}
                <span className="tnum font-mono font-semibold text-paper">
                  {antrianSaya.jamPerkiraan} WIB
                </span>
              </p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-muted">
                {eventArena.lokasi}
              </p>
            </div>
          ) : null}

          <Kartu>
            <div className="flex items-start gap-4 border-b border-white/10 p-6">
              <div className="grid size-14 shrink-0 place-items-center rounded-full border-[1.5px] border-aksen font-display text-[18px] font-black text-aksen">
                {inisial(atlet.nama)}
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <h1 className="judul text-[24px] text-paper">{atlet.nama}</h1>
                <p className="text-[13px] text-paper-dim">
                  {namaPerguruan(atlet.perguruanId)}
                </p>
                <p className="font-mono text-[11px] tracking-[0.06em] text-muted">
                  Kec. {namaKecamatan(atlet.kecamatanId)} · {atlet.umur} tahun ·{" "}
                  {atlet.jenisKelamin === "L" ? "Putra" : "Putri"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-6 py-4">
              {atlet.statusVerifikasi === "terverifikasi" ? (
                <Lencana nada="hijau">Terverifikasi Dukcapil</Lencana>
              ) : atlet.statusVerifikasi === "menunggu" ? (
                <Lencana nada="kuning">Verifikasi menunggu</Lencana>
              ) : (
                <Lencana nada="merah">Belum diverifikasi</Lencana>
              )}
              {atlet.wali ? (
                <Lencana nada={atlet.wali.terverifikasi ? "cyan" : "kuning"}>
                  Wali: {atlet.wali.nama}
                  {atlet.wali.terverifikasi ? "" : " · belum terverifikasi"}
                </Lencana>
              ) : null}
            </div>

            <div className="p-6">
              <button
                type="button"
                onClick={() => setBukaKartu((v) => !v)}
                aria-expanded={bukaKartu}
                className="w-full border border-white/25 px-5 py-3.5 font-mono text-[12px] tracking-[0.14em] text-paper uppercase transition-colors hover:bg-paper hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen"
              >
                {bukaKartu ? "Tutup kartu anggota" : "Tampilkan kartu anggota"}
              </button>
              {bukaKartu ? (
                <div className="mt-5 flex flex-col items-center gap-4 border border-white/10 bg-ink-600 p-6">
                  <QRCodeSVG
                    value={`INORGA:${atlet.id}`}
                    size={172}
                    bgColor="#2a2a2a"
                    fgColor="#e8481f"
                    level="M"
                  />
                  <p className="tnum font-mono text-[12px] tracking-[0.2em] text-aksen">
                    {atlet.id.toUpperCase()}
                  </p>
                  <p className="max-w-[34ch] text-center text-[12px] leading-relaxed text-muted">
                    Tunjukkan ke meja panitia untuk check-in. Menggantikan kartu
                    fisik dan fotokopi berkas.
                  </p>
                </div>
              ) : null}
            </div>
          </Kartu>

          {persona ? (
            <section className="flex flex-col gap-5">
              <JudulBagian eyebrow="Radar kejuaraan" judul="Event terdekat" />
              <Kartu className="p-6">
                <Link
                  href={`/event/${eventTerbuka.id}`}
                  className="judul text-[19px] text-paper hover:text-aksen"
                >
                  {eventTerbuka.nama}
                </Link>
                <p className="mt-2 text-[13px] text-paper-dim">
                  {eventTerbuka.lokasi} · 15–17 Oktober 2026
                </p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-muted">
                  {eventTerbuka.penyelenggara}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden bg-ink-500">
                    <div
                      className="h-full bg-aksen"
                      style={{
                        width: `${(eventTerbuka.jumlahPeserta / eventTerbuka.kuota) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="tnum font-mono text-[11px] text-muted">
                    {eventTerbuka.jumlahPeserta}/{eventTerbuka.kuota}
                  </span>
                </div>
                {sudahDaftar ? (
                  <div className="mt-5 border border-emerald-400/40 bg-emerald-400/5 px-5 py-4">
                    <p className="font-mono text-[12px] tracking-[0.12em] text-emerald-300 uppercase">
                      Terdaftar
                    </p>
                    <p className="mt-2 text-[14px] text-paper">
                      Jurus Tunggal Baku · Remaja Putra
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                      Data profil, atribut fisik, dan afiliasi perguruan terisi
                      otomatis. Nomor urut dikirim setelah undian.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSudahDaftar(true)}
                    className={`mt-5 ${TOMBOL_UTAMA}`}
                  >
                    Daftar sekarang — 1 klik
                  </button>
                )}
              </Kartu>
              <CatatanDemo>
                Tanpa aplikasi, langkah ini berarti mengisi formulir,
                memfotokopi KTP/KIA dan kartu perguruan, lalu antre di meja
                panitia.
              </CatatanDemo>
            </section>
          ) : null}

          <section className="flex flex-col gap-5">
            <JudulBagian
              eyebrow="Jenjang usia"
              judul={kelompokUmur(atlet.umur)}
            />
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10">
              <div className="flex flex-col gap-1 bg-ink-700 p-4">
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  Kelompok berikutnya
                </span>
                <span className="text-[15px] font-semibold text-paper">
                  {jenjang
                    ? `${jenjang.ke} · ${jenjang.tahun}`
                    : "Sudah dewasa"}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-ink-700 p-4">
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  Laju perbaikan
                </span>
                <span className="tnum text-[15px] font-semibold text-paper">
                  {laju > 0 ? "+" : ""}
                  {laju.toFixed(1).replace(".", ",")}{" "}
                  <span className="text-[11px] font-normal text-muted">
                    poin inti / event
                  </span>
                </span>
              </div>
            </div>
            {jenjang ? (
              <CatatanDemo>
                Sistem tahu atlet ini naik ke {jenjang.ke} pada {jenjang.tahun}{" "}
                — kohortnya bisa diikuti dari 12 sampai 18 tahun, bukan sekadar
                arsip hasil lomba.
              </CatatanDemo>
            ) : null}
          </section>

          <section className="flex flex-col gap-5">
            <JudulBagian
              eyebrow="Pendaftaran"
              judul="Event yang diikuti"
              aksi={
                <span className="tnum font-mono text-[11px] text-muted">
                  {daftarPendaftaran.length}
                </span>
              }
            />
            <Kartu className="divide-y divide-white/10">
              {daftarPendaftaran.map(({ p, ev }) => (
                <Link
                  key={p.id}
                  href={`/event/${ev.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-ink-600"
                >
                  <span className="tnum w-10 font-mono text-[12px] text-aksen">
                    {p.nomorUrut ? String(p.nomorUrut).padStart(3, "0") : "—"}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[13px] text-paper">
                      {ev.nama}
                    </span>
                    <span className="truncate font-mono text-[10px] text-muted">
                      {labelKategori(p.kategoriId)}
                      {p.didaftarkanOleh
                        ? ` · dibantu ${p.didaftarkanOleh}`
                        : ""}
                    </span>
                  </div>
                  <Lencana
                    nada={
                      ev.status === "berlangsung"
                        ? "cyan"
                        : ev.status === "dibuka"
                          ? "hijau"
                          : "netral"
                    }
                  >
                    {ev.status === "berlangsung"
                      ? p.checkIn === "hadir"
                        ? "Hadir"
                        : "Belum check-in"
                      : ev.status === "dibuka"
                        ? "Menunggu undian"
                        : "Selesai"}
                  </Lencana>
                </Link>
              ))}
              {daftarPendaftaran.length === 0 ? (
                <p className="p-4 text-[13px] text-muted">
                  Belum terdaftar di event mana pun.
                </p>
              ) : null}
            </Kartu>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-8">
          <section className="flex flex-col gap-5">
            <JudulBagian eyebrow="Rapor" judul="Tren nilai aspek inti" />
            <Kartu className="p-6">
              <GrafikTrenInti data={tren} />
            </Kartu>
            {tren.length > (TREN_ATLET[atletId]?.length ?? 0) ? (
              <CatatanDemo>
                Titik terakhir berasal dari nilai juri Piala Walikota 2026 yang
                baru saja dikunci — rapor bertambah begitu dewan juri selesai
                menilai.
              </CatatanDemo>
            ) : null}
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
              {[
                { label: "Tinggi", nilai: `${atlet.tinggi} cm` },
                { label: "Berat", nilai: `${atlet.berat} kg` },
                { label: "Reach", nilai: `${atlet.reach} cm` },
                { label: "Gol. darah", nilai: atlet.golonganDarah },
              ].map((a) => (
                <div
                  key={a.label}
                  className="flex flex-col gap-1.5 bg-ink-700 p-4"
                >
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                    {a.label}
                  </span>
                  <span className="tnum font-display text-[20px] font-bold text-paper">
                    {a.nilai}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {banding ? (
            <section className="flex flex-col gap-5">
              <JudulBagian
                eyebrow="Posisi di kategori"
                judul={`Peringkat ${banding.peringkat} dari ${banding.dari}`}
                aksi={
                  <span className="font-mono text-[10px] text-muted">
                    {banding.kategori}
                  </span>
                }
              />
              <Kartu className="flex flex-col gap-4 p-5">
                {[
                  ["Nilai inti saya", banding.saya, "bg-aksen"],
                  ["Rata-rata kategori", banding.rata, "bg-ink-500"],
                  ["Tertinggi kategori", banding.tertinggi, "bg-paper-dim"],
                ].map(([l, v, c]) => (
                  <div key={String(l)} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="text-paper-dim">{l}</span>
                      <span className="tnum font-mono text-paper">
                        {Number(v).toFixed(1).replace(".", ",")}
                      </span>
                    </div>
                    <div className="h-1.5 bg-ink-600">
                      <div
                        className={`h-full ${c}`}
                        style={{ width: `${(Number(v) / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-[12px] leading-relaxed text-muted">
                  Skala 30 = tiga aspek inti maksimal. Hanya inti yang
                  dibandingkan; ekstensi milik event.
                </p>
              </Kartu>
            </section>
          ) : null}

          <section className="flex flex-col gap-5">
            <JudulBagian
              eyebrow="Warisan digital"
              judul="Portofolio prestasi"
              aksi={
                <span className="tnum font-mono text-[11px] tracking-[0.1em] text-muted">
                  {medali.emas}E · {medali.perak}P · {medali.perunggu}Pr
                </span>
              }
            />
            {portofolio.length === 0 ? (
              <Kartu className="p-6">
                <p className="text-[13px] text-muted">
                  Belum ada medali yang tercatat.
                </p>
              </Kartu>
            ) : (
              <Kartu className="divide-y divide-white/10">
                {portofolio.map((p) => (
                  <Link
                    key={p.id}
                    href={`/sertifikat/${nomorKeSlug(p.nomor)}`}
                    className="flex items-start gap-4 p-5 transition-colors hover:bg-ink-600 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-aksen"
                  >
                    <span
                      className={`mt-0.5 shrink-0 border px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${WARNA_MEDALI[p.medali]}`}
                    >
                      {p.medali}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="text-[14px] leading-snug font-semibold text-paper">
                        {p.event}
                      </p>
                      <p className="text-[12px] text-paper-dim">{p.kategori}</p>
                      <p className="font-mono text-[10px] tracking-[0.06em] text-muted">
                        {p.tanggal} · {p.nomor}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 self-center font-mono text-[10px] tracking-[0.1em] uppercase ${p.terverifikasi ? "text-emerald-300" : "text-muted"}`}
                    >
                      {p.terverifikasi ? "Terverifikasi" : "Arsip"}
                    </span>
                  </Link>
                ))}
              </Kartu>
            )}
            <CatatanDemo>
              Setiap sertifikat punya nomor unik dan halaman verifikasi publik —
              klik salah satu untuk mengeceknya, tanpa menghubungi
              penyelenggara.
            </CatatanDemo>
          </section>
        </div>
      </div>
    </main>
  );
}
