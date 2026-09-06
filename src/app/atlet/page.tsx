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
  emas: "text-amber-700 bg-amber-50 border-amber-200",
  perak: "text-slate-600 bg-slate-50 border-slate-200",
  perunggu: "text-orange-800 bg-orange-50 border-orange-200",
} as const;

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
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-6">
      {/* Panggilan arena — momen paling menentukan dalam demo. */}
      {antrianSaya?.status === "dipanggil" && arena && eventArena ? (
        <Kartu
          warna="bg-teal-900"
          className="animate-panggil overflow-hidden border-cyan-400"
        >
          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-cyan-400" />
              <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-cyan-200 uppercase">
                Giliran Anda — {arena.nama}
              </span>
            </div>
            <p className="text-2xl leading-tight font-extrabold text-gading-50">
              Nomor urut {antrianSaya.nomorUrut} dipanggil panitia
            </p>
            <p className="text-[13px] text-cyan-100/80">
              {labelKategori(antrianSaya.kategoriId)} · perkiraan tampil pukul{" "}
              <span className="tnum font-mono font-semibold text-gading-50">
                {antrianSaya.jamPerkiraan} WIB
              </span>
            </p>
            <p className="text-[12px] text-cyan-100/60">
              {eventArena.lokasi}
            </p>
          </div>
        </Kartu>
      ) : null}

      {/* Kartu anggota digital */}
      <Kartu className="overflow-hidden">
        <div className="flex items-start gap-4 bg-teal-800 p-5 text-gading-50">
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-cyan-400 text-lg font-bold text-teal-950">
            {inisial(atlet.nama)}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="truncate text-lg leading-tight font-bold">{atlet.nama}</h1>
            <p className="text-[13px] text-cyan-100/80">
              {namaPerguruan(atlet.perguruanId)}
            </p>
            <p className="font-mono text-[11px] text-cyan-100/60">
              Kec. {namaKecamatan(atlet.kecamatanId)} · {atlet.umur} tahun
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-gading-200 px-5 py-3">
          <Lencana nada="hijau">✓ Identitas terverifikasi Dukcapil</Lencana>
          {atlet.wali?.terverifikasi ? (
            <Lencana nada="cyan">Wali: {atlet.wali.nama}</Lencana>
          ) : null}
        </div>

        <div className="p-5">
          <button
            type="button"
            onClick={() => setBukaKartu((v) => !v)}
            aria-expanded={bukaKartu}
            className="w-full rounded-xl border border-teal-700 px-4 py-2.5 text-[14px] font-semibold text-teal-800 transition-colors hover:bg-teal-700 hover:text-gading-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {bukaKartu ? "Tutup kartu anggota" : "Tampilkan kartu anggota (QR)"}
          </button>

          {bukaKartu ? (
            <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-gading-100 p-5">
              <QRCodeSVG
                value={`INORGA:${atlet.id}:${eventArena?.id ?? "—"}`}
                size={168}
                bgColor="#f0efea"
                fgColor="#0e4547"
                level="M"
              />
              <p className="tnum font-mono text-[12px] tracking-wider text-teal-800">
                {atlet.id.toUpperCase()}
              </p>
              <p className="max-w-[34ch] text-center text-[12px] leading-relaxed text-teal-950/55">
                Tunjukkan ke meja panitia untuk check-in. Menggantikan kartu fisik dan
                fotokopi berkas.
              </p>
            </div>
          ) : null}
        </div>
      </Kartu>

      {/* Event terbuka — pendaftaran 1 klik */}
      <section className="flex flex-col gap-3">
        <JudulBagian eyebrow="Radar kejuaraan" judul="Event terdekat" />
        <Kartu className="p-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] leading-snug font-bold text-teal-950">
              {eventTerbuka.nama}
            </h3>
            <p className="text-[13px] text-teal-950/65">
              {eventTerbuka.lokasi} · 15–17 Oktober 2026
            </p>
            <p className="font-mono text-[11px] text-teal-950/45">
              {eventTerbuka.penyelenggara}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gading-200">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{
                  width: `${(eventTerbuka.jumlahPeserta / eventTerbuka.kuota) * 100}%`,
                }}
              />
            </div>
            <span className="tnum font-mono text-[11px] text-teal-950/55">
              {eventTerbuka.jumlahPeserta}/{eventTerbuka.kuota} peserta
            </span>
          </div>

          {sudahDaftar ? (
            <div className="mt-4 flex flex-col gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-[14px] font-semibold text-emerald-900">
                Terdaftar — Jurus Tunggal Baku, Remaja Putra
              </p>
              <p className="text-[12px] leading-relaxed text-emerald-800/80">
                Data profil, atribut fisik, dan afiliasi perguruan terisi otomatis.
                Nomor urut dan jadwal tampil dikirim setelah undian.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSudahDaftar(true)}
              className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 text-[15px] font-bold text-teal-950 transition-colors hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Daftar sekarang — 1 klik
            </button>
          )}
        </Kartu>
        <CatatanDemo>
          Tanpa aplikasi, langkah ini berarti mengisi formulir, memfotokopi KTP/KIA
          dan kartu perguruan, lalu antre di meja panitia.
        </CatatanDemo>
      </section>

      {/* Rapor */}
      <section className="flex flex-col gap-3">
        <JudulBagian eyebrow="Rapor" judul="Tren nilai aspek inti" />
        <Kartu className="p-5">
          <GrafikTrenInti />
        </Kartu>

        <Kartu className="grid grid-cols-2 gap-px overflow-hidden bg-gading-200 sm:grid-cols-4">
          {[
            { label: "Tinggi", nilai: `${atlet.tinggi} cm` },
            { label: "Berat", nilai: `${atlet.berat} kg` },
            { label: "Rentang tangan", nilai: `${atlet.reach} cm` },
            { label: "Gol. darah", nilai: atlet.golonganDarah },
          ].map((a) => (
            <div key={a.label} className="flex flex-col gap-0.5 bg-white px-4 py-3">
              <span className="text-[11px] text-teal-950/50">{a.label}</span>
              <span className="tnum font-mono text-[15px] font-semibold text-teal-950">
                {a.nilai}
              </span>
            </div>
          ))}
        </Kartu>
      </section>

      {/* Portofolio */}
      <section className="flex flex-col gap-3">
        <JudulBagian
          eyebrow="Warisan digital"
          judul="Portofolio prestasi"
          aksi={
            <span className="tnum font-mono text-[11px] text-teal-950/50">
              {atlet.medali.emas}E · {atlet.medali.perak}P · {atlet.medali.perunggu}Pr
            </span>
          }
        />
        <Kartu className="divide-y divide-gading-200">
          {riwayat.map((r) => (
            <div key={r.id} className="flex items-start gap-3 p-4">
              <span
                className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${WARNA_MEDALI[r.medali]}`}
              >
                {r.medali}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-[14px] leading-snug font-semibold text-teal-950">
                  {r.event}
                </p>
                <p className="text-[12px] text-teal-950/60">{r.kategori}</p>
                <p className="font-mono text-[10px] text-teal-950/40">
                  {r.tanggal} · {r.nomorSertifikat}
                </p>
              </div>
            </div>
          ))}
        </Kartu>
        <CatatanDemo>
          Setiap sertifikat punya nomor unik dan halaman verifikasi publik, sehingga
          keasliannya bisa dicek tanpa menghubungi penyelenggara.
        </CatatanDemo>
      </section>
    </main>
  );
}
