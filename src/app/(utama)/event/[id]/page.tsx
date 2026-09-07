import Link from "next/link";
import {
  Kartu,
  JudulBagian,
  Lencana,
  CatatanDemo,
  Statistik,
} from "@/components/ui";
import {
  ARENA,
  EVENTS,
  eventById,
  kategoriById,
  labelKategori,
  pendaftaranEvent,
} from "@/data/event";
import { atletById } from "@/data/atlet";
import { singkatanPerguruan } from "@/data/perguruan";
import { namaKecamatan } from "@/data/wilayah";
import { rubrikEvent } from "@/data/penilaian";

export const dynamicParams = true;
export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

const tgl = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
const STATUS = {
  berlangsung: ["cyan", "Berlangsung"],
  dibuka: ["hijau", "Pendaftaran dibuka"],
  selesai: ["netral", "Selesai"],
} as const;

export default async function HalamanEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = eventById(id);
  if (!event)
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="judul text-[28px]">Event tidak ditemukan</h1>
      </main>
    );

  const pendaftar = pendaftaranEvent(event.id);
  const arena = ARENA.filter((a) => a.eventId === event.id);
  const rubrik = rubrikEvent(event.id);
  const [nada, labelStatus] = STATUS[event.status];

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-3">
        <span className="label">{event.penyelenggara}</span>
        <h1 className="judul text-[clamp(28px,5vw,48px)] text-paper">
          {event.nama}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Lencana nada={nada}>{labelStatus}</Lencana>
          <span className="font-mono text-[11px] tracking-[0.06em] text-muted">
            {tgl(event.tanggalMulai)} – {tgl(event.tanggalSelesai)} ·{" "}
            {event.lokasi} · Kec. {namaKecamatan(event.kecamatanId)}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          {event.status !== "dibuka" ? (
            <Link href={`/event/${event.id}/hasil`} className="cta">
              Lihat hasil {event.status === "berlangsung" ? "sementara" : ""}
            </Link>
          ) : null}
          {event.status === "dibuka" ? (
            <Link href="/undian" className="cta">
              Undian urutan tampil
            </Link>
          ) : null}
          {arena.map((a) => (
            <Link key={a.id} href={`/arena/${a.id}`} className="tombol-garis">
              {a.nama} ↗
            </Link>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
        <div className="bg-ink-700 p-5">
          <Statistik
            kecil
            angka={event.jumlahPeserta}
            label="Peserta"
            ket={`kuota ${event.kuota}`}
          />
        </div>
        <div className="bg-ink-700 p-5">
          <Statistik kecil angka={event.kategoriIds.length} label="Kategori" />
        </div>
        <div className="bg-ink-700 p-5">
          <Statistik kecil angka={arena.length || "—"} label="Matras" />
        </div>
        <div className="bg-ink-700 p-5">
          <Statistik
            kecil
            angka={rubrik.length}
            label="Aspek dinilai"
            ket={`${rubrik.filter((a) => a.tipe === "inti").length} inti + ${rubrik.filter((a) => a.tipe === "ekstensi").length} ekstensi`}
          />
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <JudulBagian
          eyebrow="Rubrik penilaian"
          judul="Aspek inti tetap, ekstensi milik event"
        />
        <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
          {rubrik.map((a) => (
            <div key={a.id} className="flex flex-col gap-1 bg-ink-700 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-semibold text-paper">
                  {a.nama}
                </span>
                <Lencana nada={a.tipe === "inti" ? "cyan" : "netral"}>
                  {a.tipe}
                </Lencana>
              </div>
              <span className="text-[12px] leading-relaxed text-muted">
                {a.deskripsi} Skala {a.skalaMin}–{a.skalaMaks}.
              </span>
            </div>
          ))}
        </div>
      </section>

      {arena.length ? (
        <section className="flex flex-col gap-4">
          <JudulBagian eyebrow="Jadwal" judul="Rundown per matras" />
          <Kartu className="divide-y divide-white/10">
            {arena.map((a) => (
              <div key={a.id} className="flex flex-col gap-2 p-5">
                <span className="judul text-[18px] text-paper">{a.nama}</span>
                {a.jadwal.map((j, i) => (
                  <div
                    key={i}
                    className="flex items-baseline justify-between gap-3 text-[13px]"
                  >
                    <span className="text-paper-dim">
                      Hari {j.hari} · {labelKategori(j.kategoriId)}
                    </span>
                    <span className="tnum font-mono text-[12px] text-muted">
                      {j.mulai}–{j.selesai}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </Kartu>
          <CatatanDemo>
            Di versi produksi rundown ini disusun otomatis dari jumlah peserta
            per kategori dan durasi rata-rata, lalu dijadwalkan ulang bila satu
            kategori molor — penyebab kekacauan jadwal, bukan sekadar gejalanya.
          </CatatanDemo>
        </section>
      ) : null}

      <section className="flex flex-col gap-4">
        <JudulBagian
          eyebrow="Peserta terdaftar"
          judul={`${pendaftar.length} pendaftar tercatat`}
          aksi={
            <span className="font-mono text-[11px] text-muted">
              dari {event.jumlahPeserta} total
            </span>
          }
        />
        {event.kategoriIds.map((kId) => {
          const daftar = pendaftar.filter((p) => p.kategoriId === kId);
          if (!daftar.length) return null;
          return (
            <Kartu key={kId}>
              <div className="flex items-baseline justify-between gap-3 border-b border-white/10 px-5 py-3">
                <span className="text-[14px] font-semibold text-paper">
                  {kategoriById(kId)?.nama} · {kategoriById(kId)?.kelompokUmur}
                </span>
                <span className="tnum font-mono text-[11px] text-muted">
                  {daftar.length}
                </span>
              </div>
              <div className="divide-y divide-white/10">
                {daftar.map((p) => {
                  const a = atletById(p.atletId)!;
                  return (
                    <Link
                      key={p.id}
                      href={`/atlet/${a.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ink-600"
                    >
                      <span className="tnum w-10 font-mono text-[12px] text-aksen">
                        {p.nomorUrut
                          ? String(p.nomorUrut).padStart(3, "0")
                          : "—"}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-paper">
                        {a.nama}{" "}
                        <span className="text-muted">
                          · {singkatanPerguruan(a.perguruanId)}
                        </span>
                      </span>
                      {p.didaftarkanOleh ? (
                        <span className="hidden font-mono text-[10px] text-muted sm:block">
                          dibantu
                        </span>
                      ) : null}
                      <Lencana
                        nada={p.checkIn === "hadir" ? "hijau" : "netral"}
                      >
                        {p.checkIn === "hadir" ? "Hadir" : "Belum"}
                      </Lencana>
                    </Link>
                  );
                })}
              </div>
            </Kartu>
          );
        })}
      </section>
    </main>
  );
}
