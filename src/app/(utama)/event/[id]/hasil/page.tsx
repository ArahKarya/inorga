"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Kartu, JudulBagian, Lencana, CatatanDemo } from "@/components/ui";
import { eventById, kategoriById } from "@/data/event";
import { atletById } from "@/data/atlet";
import { singkatanPerguruan } from "@/data/perguruan";
import { rubrikEvent, nilaiPeserta, HASIL } from "@/data/penilaian";
import { hitungSkor, susunPeringkat, tentukanMedali } from "@/lib/hasil";
import { gabungNilai, useNilaiLive } from "@/lib/live";
import { nomorKeSlug } from "@/lib/sertifikat";

const f1 = (n: number) => n.toFixed(1).replace(".", ",");
const WARNA = {
  emas: "text-emas",
  perak: "text-perak",
  perunggu: "text-perunggu",
} as const;

export default function HalamanHasil({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const event = eventById(id);
  const [nilaiLive] = useNilaiLive();
  const rubrik = useMemo(() => rubrikEvent(id), [id]);
  const inti = rubrik.filter((a) => a.tipe === "inti");
  const ekstensi = rubrik.filter((a) => a.tipe === "ekstensi");

  const perKategori = useMemo(() => {
    const rows = gabungNilai(nilaiLive).filter((n) => n.eventId === id);
    const kategoriIds = [...new Set(rows.map((r) => r.kategoriId))];
    return kategoriIds.map((kId) => {
      const atletIds = [
        ...new Set(
          rows.filter((r) => r.kategoriId === kId).map((r) => r.atletId),
        ),
      ];
      const skor = atletIds.map((a) =>
        hitungSkor(a, nilaiPeserta(rows, id, kId, a), rubrik),
      );
      return { kId, peringkat: susunPeringkat(skor) };
    });
  }, [id, nilaiLive, rubrik]);

  if (!event)
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="judul text-[28px]">Event tidak ditemukan</h1>
      </main>
    );
  const sementara = event.status === "berlangsung";

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-2">
        <span className="label">
          {sementara ? "Hasil sementara" : "Hasil resmi"}
        </span>
        <h1 className="judul text-[clamp(26px,4.5vw,44px)] text-paper">
          <Link href={`/event/${event.id}`} className="hover:text-aksen">
            {event.nama}
          </Link>
        </h1>
        <p className="max-w-[64ch] text-[13px] leading-relaxed text-paper-dim">
          Kolom inti dan ekstensi sengaja dipisah: peringkat ditentukan{" "}
          <strong className="text-paper">aspek inti dulu</strong>, ekstensi
          hanya pemecah seri. Hanya inti yang dibawa ke rapor dan klasemen
          lintas-event.
        </p>
      </header>

      {perKategori.length === 0 ? (
        <Kartu className="p-6">
          <p className="text-[14px] text-muted">
            Belum ada nilai juri yang terkunci untuk event ini.
          </p>
        </Kartu>
      ) : null}

      {perKategori.map(({ kId, peringkat }) => (
        <section key={kId} className="flex flex-col gap-4">
          <JudulBagian
            eyebrow={kategoriById(kId)?.kelompokUmur}
            judul={`${kategoriById(kId)?.nama ?? kId}${kategoriById(kId)?.gender === "L" ? " — Putra" : kategoriById(kId)?.gender === "P" ? " — Putri" : ""}`}
            aksi={
              <span className="tnum font-mono text-[11px] text-muted">
                {peringkat.length} peserta dinilai
              </span>
            }
          />
          <Kartu className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-3 py-3 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                    #
                  </th>
                  <th className="px-3 py-3 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                    Peserta
                  </th>
                  {inti.map((a) => (
                    <th
                      key={a.id}
                      className="px-3 py-3 text-right font-mono text-[10px] tracking-[0.12em] text-aksen uppercase"
                    >
                      {a.nama.split(" ")[0]}
                    </th>
                  ))}
                  <th className="border-l border-white/10 px-3 py-3 text-right font-mono text-[10px] tracking-[0.16em] text-aksen uppercase">
                    Inti
                  </th>
                  {ekstensi.map((a) => (
                    <th
                      key={a.id}
                      className="px-3 py-3 text-right font-mono text-[10px] tracking-[0.12em] text-muted uppercase"
                    >
                      {a.nama.split(" ")[0]}
                    </th>
                  ))}
                  <th className="border-l border-white/10 px-3 py-3 text-right font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                    Ekst.
                  </th>
                  <th className="px-3 py-3 text-right font-mono text-[10px] tracking-[0.16em] text-paper uppercase">
                    Total
                  </th>
                  <th className="px-3 py-3 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                    Juri
                  </th>
                </tr>
              </thead>
              <tbody>
                {peringkat.map((s, i) => {
                  const a = atletById(s.atletId)!;
                  const medali = tentukanMedali(i + 1);
                  const h = HASIL.find(
                    (x) =>
                      x.eventId === id &&
                      x.kategoriId === kId &&
                      x.atletId === s.atletId,
                  );
                  return (
                    <tr
                      key={s.atletId}
                      className="border-b border-white/10 last:border-0"
                    >
                      <td className="tnum px-3 py-3 font-mono text-[13px] text-aksen">
                        {i + 1}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/atlet/${a.id}`}
                          className="text-[13px] font-semibold text-paper hover:text-aksen"
                        >
                          {a.nama}
                        </Link>
                        <span className="ml-2 font-mono text-[10px] text-muted">
                          {singkatanPerguruan(a.perguruanId)}
                        </span>
                        {medali ? (
                          <span
                            className={`ml-2 font-mono text-[10px] tracking-[0.1em] uppercase ${WARNA[medali]}`}
                          >
                            {medali}
                          </span>
                        ) : null}
                      </td>
                      {inti.map((x) => (
                        <td
                          key={x.id}
                          className="tnum px-3 py-3 text-right font-mono text-[13px] text-paper-dim"
                        >
                          {s.perAspek[x.id] !== undefined
                            ? f1(s.perAspek[x.id])
                            : "—"}
                        </td>
                      ))}
                      <td className="tnum border-l border-white/10 px-3 py-3 text-right font-display text-[16px] font-bold text-paper">
                        {f1(s.inti)}
                      </td>
                      {ekstensi.map((x) => (
                        <td
                          key={x.id}
                          className="tnum px-3 py-3 text-right font-mono text-[13px] text-muted"
                        >
                          {s.perAspek[x.id] !== undefined
                            ? f1(s.perAspek[x.id])
                            : "—"}
                        </td>
                      ))}
                      <td className="tnum border-l border-white/10 px-3 py-3 text-right font-mono text-[13px] text-paper-dim">
                        {f1(s.ekstensi)}
                      </td>
                      <td className="tnum px-3 py-3 text-right font-mono text-[13px] text-paper">
                        {f1(s.total)}
                      </td>
                      <td className="px-3 py-3">
                        <span className="tnum font-mono text-[11px] text-muted">
                          {s.jumlahJuri}/3
                        </span>
                        {h ? (
                          <Link
                            href={`/sertifikat/${nomorKeSlug(h.nomorSertifikat)}`}
                            className="ml-2 font-mono text-[10px] text-emerald-300 hover:underline"
                          >
                            sertifikat
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Kartu>
        </section>
      ))}

      <CatatanDemo>
        Urutan pemecah seri: total aspek inti → total ekstensi → siapa yang
        nilainya lebih dulu dikunci.{" "}
        {sementara ? (
          <>
            Peringkat bisa berubah sampai seluruh peserta selesai —{" "}
            <Link href="/juri" className="text-aksen underline">
              panel juri
            </Link>{" "}
            mengunci nilai peserta yang sedang tampil.
          </>
        ) : null}
      </CatatanDemo>
      {sementara ? (
        <Lencana nada="kuning">Hasil sementara — belum resmi</Lencana>
      ) : null}
    </main>
  );
}
