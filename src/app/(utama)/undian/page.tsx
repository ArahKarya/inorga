"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Kartu, JudulBagian, Lencana, CatatanDemo } from "@/components/ui";
import {
  EVENTS,
  ARENA,
  kategoriById,
  labelKategori,
  pendaftaranEvent,
} from "@/data/event";
import { atletById } from "@/data/atlet";
import { singkatanPerguruan } from "@/data/perguruan";
import { UNDIAN_TERKUNCI } from "@/data/juri";
import { acakTerurut, buatBenih, verifikasiUndian } from "@/lib/undian";
import { useUndianLive } from "@/lib/live";
import type { Undian } from "@/lib/types";

export default function HalamanUndian() {
  const eventDibuka = EVENTS.filter((e) => e.status === "dibuka");
  const [eventId, setEventId] = useState(eventDibuka[0]?.id ?? "");
  const kategoriTersedia = useMemo(
    () => [...new Set(pendaftaranEvent(eventId).map((p) => p.kategoriId))],
    [eventId],
  );
  const [kategoriId, setKategoriId] = useState(kategoriTersedia[0] ?? "");
  useEffect(() => {
    if (!kategoriTersedia.includes(kategoriId))
      setKategoriId(kategoriTersedia[0] ?? "");
  }, [kategoriTersedia, kategoriId]);

  const [undianLive, setUndianLive] = useUndianLive();
  const [benih, setBenih] = useState<number | null>(null);
  const [urutan, setUrutan] = useState<string[]>([]);
  const [terungkap, setTerungkap] = useState(0);
  const [saksi, setSaksi] = useState("Perwakilan perguruan hadir");
  const [hasilVerif, setHasilVerif] = useState<Record<string, boolean>>({});

  const peserta = useMemo(
    () =>
      pendaftaranEvent(eventId, kategoriId)
        .map((p) => p.atletId)
        .sort(),
    [eventId, kategoriId],
  );
  const semuaRekaman: Undian[] = [UNDIAN_TERKUNCI, ...undianLive];
  const sudahTerkunci = semuaRekaman.find(
    (u) => u.eventId === eventId && u.kategoriId === kategoriId && u.terkunci,
  );

  useEffect(() => {
    if (!urutan.length || terungkap >= urutan.length) return;
    const t = setTimeout(() => setTerungkap((n) => n + 1), 420);
    return () => clearTimeout(t);
  }, [urutan, terungkap]);

  const mulai = () => {
    const b = buatBenih();
    setBenih(b);
    setUrutan(acakTerurut(peserta, b));
    setTerungkap(0);
  };
  const kunci = () => {
    if (benih === null) return;
    const rec: Undian = {
      id: `u-${eventId}-${kategoriId}-${benih}`,
      eventId,
      kategoriId,
      arenaId: ARENA[0]?.id ?? "—",
      benih,
      versiAlgoritma: 1,
      pesertaAsal: peserta,
      urutan,
      waktu: new Date().toISOString(),
      saksi: saksi
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      terkunci: true,
    };
    setUndianLive((s) => [...s, rec]);
    setBenih(null);
    setUrutan([]);
    setTerungkap(0);
  };
  const verifikasi = (u: Undian) =>
    setHasilVerif((s) => ({ ...s, [u.id]: verifikasiUndian(u) }));

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-2">
        <span className="label">Undian urutan tampil</span>
        <h1 className="judul text-[clamp(28px,5vw,46px)] text-paper">
          Undian yang bisa dibuktikan ulang
        </h1>
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-paper-dim">
          Pengacakan memakai benih yang dicatat. Siapa pun — perwakilan
          perguruan, dewan juri, KORMI — bisa menjalankan ulang benih itu dan
          mendapat urutan yang sama persis. Begitu terkunci, tidak bisa diubah.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <JudulBagian eyebrow="Undian baru" judul="Pilih event dan kategori" />
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="border border-white/15 bg-ink-700 px-4 py-3 text-[14px] text-paper focus:border-aksen focus:outline-none"
          >
            {eventDibuka.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nama}
              </option>
            ))}
          </select>
          <select
            value={kategoriId}
            onChange={(e) => setKategoriId(e.target.value)}
            className="border border-white/15 bg-ink-700 px-4 py-3 text-[14px] text-paper focus:border-aksen focus:outline-none"
          >
            {kategoriTersedia.map((k) => (
              <option key={k} value={k}>
                {labelKategori(k)}
              </option>
            ))}
          </select>
        </div>

        {sudahTerkunci ? (
          <Kartu className="p-5">
            <Lencana nada="hijau">Sudah terkunci</Lencana>
            <p className="mt-3 text-[13px] text-paper-dim">
              Kategori ini sudah diundi dan terkunci. Lihat rekamannya di bawah.
            </p>
          </Kartu>
        ) : (
          <Kartu className="flex flex-col gap-5 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-[14px] text-paper-dim">
                <span className="tnum font-display text-[24px] font-black text-paper">
                  {peserta.length}
                </span>{" "}
                peserta · {kategoriById(kategoriId)?.nama}
              </span>
              {benih === null ? (
                <button
                  type="button"
                  onClick={mulai}
                  disabled={peserta.length < 2}
                  className="cta disabled:opacity-40"
                >
                  Mulai undian
                </button>
              ) : null}
            </div>

            {benih !== null ? (
              <>
                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                  {urutan.map((atletId, i) => {
                    const a = atletById(atletId)!;
                    const tampak = i < terungkap;
                    return (
                      <div
                        key={atletId}
                        className={`flex items-center gap-4 bg-ink-700 px-4 py-3 transition-opacity duration-300 ${tampak ? "opacity-100" : "opacity-0"}`}
                      >
                        <span className="tnum font-display text-[22px] font-black text-aksen">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[14px] text-paper">
                          {a.nama}
                        </span>
                        <span className="font-mono text-[10px] text-muted">
                          {singkatanPerguruan(a.perguruanId)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="flex flex-col gap-3">
                    <p className="tnum font-mono text-[12px] text-paper-dim">
                      Benih <span className="text-aksen">{benih}</span> ·
                      algoritma v1 · {peserta.length} peserta terurut
                    </p>
                    <label className="flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                        Saksi (pisahkan dengan koma)
                      </span>
                      <input
                        value={saksi}
                        onChange={(e) => setSaksi(e.target.value)}
                        className="border border-white/15 bg-ink-600 px-3 py-2.5 text-[13px] text-paper focus:border-aksen focus:outline-none"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={kunci}
                    disabled={urutan.length === 0}
                    className="cta disabled:opacity-40"
                  >
                    Kunci undian
                  </button>
                </div>
              </>
            ) : null}
          </Kartu>
        )}
        <CatatanDemo>
          Benih dibuat dari sumber acak kriptografis, bukan{" "}
          <code className="font-mono">Math.random</code>. Yang membuatnya bisa
          dipercaya bukan acaknya — tetapi bahwa setiap orang bisa mengulang
          perhitungannya.
        </CatatanDemo>
      </section>

      <section className="flex flex-col gap-4">
        <JudulBagian
          eyebrow="Rekaman terkunci"
          judul={`${semuaRekaman.length} undian tercatat`}
        />
        {semuaRekaman.map((u) => {
          const ev = EVENTS.find((e) => e.id === u.eventId);
          const v = hasilVerif[u.id];
          return (
            <Kartu key={u.id} className="flex flex-col gap-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-semibold text-paper">
                    {ev?.nama}
                  </span>
                  <span className="font-mono text-[11px] text-muted">
                    {labelKategori(u.kategoriId)} ·{" "}
                    {new Date(u.waktu).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  <span className="tnum font-mono text-[11px] text-paper-dim">
                    Benih {u.benih} · v{u.versiAlgoritma} · saksi:{" "}
                    {u.saksi.join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {v === true ? (
                    <Lencana nada="hijau">Cocok — tereproduksi</Lencana>
                  ) : v === false ? (
                    <Lencana nada="merah">Tidak cocok</Lencana>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => verifikasi(u)}
                    className="tombol-garis text-[11px]"
                  >
                    Verifikasi ulang
                  </button>
                </div>
              </div>
              <ol className="grid gap-1 font-mono text-[12px] text-paper-dim sm:grid-cols-2">
                {u.urutan.map((id, i) => (
                  <li key={id} className="flex gap-3">
                    <span className="tnum w-6 text-aksen">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-paper">
                      {atletById(id)?.nama ?? id}
                    </span>
                  </li>
                ))}
              </ol>
              {u.id === UNDIAN_TERKUNCI.id ? (
                <p className="text-[12px] text-muted">
                  Rekaman inilah sumber nomor urut Matras A hari ini —{" "}
                  <Link href="/panitia" className="text-aksen underline">
                    antrian panitia
                  </Link>{" "}
                  diturunkan darinya, bukan ditulis tangan.
                </p>
              ) : null}
            </Kartu>
          );
        })}
      </section>
    </main>
  );
}
