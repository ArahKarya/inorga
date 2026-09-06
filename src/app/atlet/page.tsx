"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Kartu, JudulBagian, Lencana, CatatanDemo } from "@/components/ui";
import { GrafikTrenInti } from "@/components/charts";
import { ATLET_DEMO, atletById, inisial } from "@/data/atlet";
import { namaKecamatan } from "@/data/wilayah";
import { namaPerguruan } from "@/data/perguruan";
import { ANTRIAN, ARENA, EVENTS, eventById, labelKategori } from "@/data/event";
import { riwayatAtlet } from "@/data/penilaian";

const WARNA_MEDALI = {
  emas: "border-emas/50 text-emas",
  perak: "border-perak/50 text-perak",
  perunggu: "border-perunggu/50 text-perunggu",
} as const;

const TOMBOL_UTAMA =
  "w-full bg-aksen px-5 py-4 font-mono text-[12px] tracking-[0.14em] text-ink-900 uppercase transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen";

export default function HalamanAtlet() {
  const atlet = atletById(ATLET_DEMO)!;
  const [sudahDaftar, setSudahDaftar] = useState(false);
  const [bukaKartu, setBukaKartu] = useState(false);

  const antrianSaya = ANTRIAN.find((q) => q.atletId === atlet.id);
  const arena = ARENA.find((a) => a.id === antrianSaya?.arenaId);
  const eventArena = arena ? eventById(arena.eventId) : undefined;
  const eventTerbuka = EVENTS.find((e) => e.status === "dibuka")!;
  const riwayat = riwayatAtlet(atlet.id);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-8 sm:px-6">
      {/* Panggilan arena — momen paling menentukan dalam demo. */}
      {antrianSaya?.status === "dipanggil" && arena && eventArena ? (
        <div className="animate-panggil border-2 border-aksen bg-aksen/10 p-6">
          <div className="flex items-center gap-2.5">
            <span className="size-2 animate-pulse rounded-full bg-aksen" />
            <span className="label">Giliran Anda — {arena.nama}</span>
          </div>
          <p className="judul judul-berat mt-4 text-[clamp(30px,7vw,52px)] text-paper">
            Nomor{" "}
            <span className="tnum text-aksen">{antrianSaya.nomorUrut}</span>{" "}
            dipanggil
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

      {/* Identitas */}
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
              Kec. {namaKecamatan(atlet.kecamatanId)} · {atlet.umur} tahun
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-6 py-4">
          <Lencana nada="hijau">Terverifikasi Dukcapil</Lencana>
          {atlet.wali?.terverifikasi ? (
            <Lencana nada="cyan">Wali: {atlet.wali.nama}</Lencana>
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
                value={`INORGA:${atlet.id}:${eventArena?.id ?? "—"}`}
                size={172}
                bgColor="#2a2a2a"
                fgColor="#22c3d6"
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

      {/* Event terbuka */}
      <section className="flex flex-col gap-5">
        <JudulBagian eyebrow="Radar kejuaraan" judul="Event terdekat" />
        <Kartu className="p-6">
          <h3 className="judul text-[19px] text-paper">{eventTerbuka.nama}</h3>
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
          Tanpa aplikasi, langkah ini berarti mengisi formulir, memfotokopi
          KTP/KIA dan kartu perguruan, lalu antre di meja panitia.
        </CatatanDemo>
      </section>

      {/* Rapor */}
      <section className="flex flex-col gap-5">
        <JudulBagian eyebrow="Rapor" judul="Tren nilai aspek inti" />
        <Kartu className="p-6">
          <GrafikTrenInti />
        </Kartu>

        <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
          {[
            { label: "Tinggi", nilai: `${atlet.tinggi} cm` },
            { label: "Berat", nilai: `${atlet.berat} kg` },
            { label: "Reach", nilai: `${atlet.reach} cm` },
            { label: "Gol. darah", nilai: atlet.golonganDarah },
          ].map((a) => (
            <div key={a.label} className="flex flex-col gap-1.5 bg-ink-700 p-4">
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

      {/* Portofolio */}
      <section className="flex flex-col gap-5">
        <JudulBagian
          eyebrow="Warisan digital"
          judul="Portofolio prestasi"
          aksi={
            <span className="tnum font-mono text-[11px] tracking-[0.1em] text-muted">
              {atlet.medali.emas}E · {atlet.medali.perak}P ·{" "}
              {atlet.medali.perunggu}Pr
            </span>
          }
        />
        <Kartu className="divide-y divide-white/10">
          {riwayat.map((r) => (
            <div key={r.id} className="flex items-start gap-4 p-5">
              <span
                className={`mt-0.5 shrink-0 border px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${WARNA_MEDALI[r.medali]}`}
              >
                {r.medali}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-[14px] leading-snug font-semibold text-paper">
                  {r.event}
                </p>
                <p className="text-[12px] text-paper-dim">{r.kategori}</p>
                <p className="font-mono text-[10px] tracking-[0.06em] text-muted">
                  {r.tanggal} · {r.nomorSertifikat}
                </p>
              </div>
            </div>
          ))}
        </Kartu>
        <CatatanDemo>
          Setiap sertifikat punya nomor unik dan halaman verifikasi publik,
          sehingga keasliannya bisa dicek tanpa menghubungi penyelenggara.
        </CatatanDemo>
      </section>
    </main>
  );
}
