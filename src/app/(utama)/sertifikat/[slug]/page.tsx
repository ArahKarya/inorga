import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Kartu, Lencana, CatatanDemo } from "@/components/ui";
import { atletById } from "@/data/atlet";
import { namaPerguruan } from "@/data/perguruan";
import { eventById, labelKategori } from "@/data/event";
import { HASIL, RIWAYAT_PRESTASI } from "@/data/penilaian";
import { hashSertifikat, nomorKeSlug, slugKeNomor } from "@/lib/sertifikat";

export const dynamicParams = true;
export function generateStaticParams() {
  return [
    ...HASIL.map((h) => h.nomorSertifikat),
    ...RIWAYAT_PRESTASI.map((r) => r.nomorSertifikat),
  ].map((n) => ({ slug: nomorKeSlug(n) }));
}

interface Temuan {
  nomor: string;
  atletId: string;
  event: string;
  penyelenggara: string;
  kategori: string;
  tanggal: string;
  medali: string;
  peringkat?: number;
  total?: number;
  sumber: "sistem" | "arsip";
  eventId: string;
}

function cariSertifikat(nomor: string): Temuan | null {
  const h = HASIL.find((x) => x.nomorSertifikat === nomor);
  if (h) {
    const ev = eventById(h.eventId)!;
    return {
      nomor,
      atletId: h.atletId,
      event: ev.nama,
      penyelenggara: ev.penyelenggara,
      kategori: labelKategori(h.kategoriId),
      tanggal: new Date(ev.tanggalSelesai).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      medali: h.medali ?? "peserta",
      peringkat: h.peringkat,
      total: h.totalNilai,
      sumber: "sistem",
      eventId: h.eventId,
    };
  }
  const r = RIWAYAT_PRESTASI.find((x) => x.nomorSertifikat === nomor);
  if (r)
    return {
      nomor,
      atletId: r.atletId,
      event: r.event,
      penyelenggara: r.penyelenggara,
      kategori: r.kategori,
      tanggal: r.tanggal,
      medali: r.medali,
      sumber: "arsip",
      eventId: "arsip",
    };
  return null;
}

export default async function HalamanSertifikat({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nomor = slugKeNomor(slug);
  const t = cariSertifikat(nomor);
  const atlet = t ? atletById(t.atletId) : undefined;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <span className="label">Verifikasi sertifikat</span>
        <h1 className="judul text-[clamp(26px,5vw,40px)] text-paper">
          {t ? "Sertifikat sah" : "Tidak ditemukan"}
        </h1>
        <p className="tnum font-mono text-[12px] tracking-[0.08em] text-paper-dim">
          {nomor}
        </p>
      </header>

      {t && atlet ? (
        <Kartu>
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-6 py-4">
            <Lencana nada="hijau">
              {t.sumber === "sistem"
                ? "Terverifikasi — nilai juri tercatat"
                : "Terverifikasi — arsip penyelenggara"}
            </Lencana>
            <Lencana nada="netral">{t.medali}</Lencana>
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-5 bg-ink-700 p-6">
              {[
                [
                  "Pemegang",
                  <Link
                    key="a"
                    href={`/atlet/${atlet.id}`}
                    className="text-paper hover:text-aksen"
                  >
                    {atlet.nama}
                  </Link>,
                ],
                ["Perguruan", namaPerguruan(atlet.perguruanId)],
                ["Event", t.event],
                ["Penyelenggara", t.penyelenggara],
                ["Kategori", t.kategori],
                ["Tanggal", t.tanggal],
                ...(t.peringkat
                  ? [
                      [
                        "Peringkat · total",
                        `${t.peringkat} · ${t.total?.toFixed(1).replace(".", ",")}`,
                      ],
                    ]
                  : []),
              ].map(([k, v]) => (
                <div key={String(k)} className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                    {k}
                  </span>
                  <span className="text-[14px] text-paper">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-3 bg-ink-700 p-6">
              <QRCodeSVG
                value={`https://inorga.example/sertifikat/${slug}`}
                size={140}
                bgColor="#1f1f1f"
                fgColor="#f2f2f2"
                level="M"
              />
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                Sidik verifikasi
              </span>
              <span className="tnum font-mono text-[13px] tracking-[0.2em] text-aksen">
                {hashSertifikat(t.nomor, t.atletId, t.eventId)}
              </span>
            </div>
          </div>
        </Kartu>
      ) : (
        <Kartu className="p-6">
          <p className="text-[14px] leading-relaxed text-paper-dim">
            Nomor ini tidak tercatat, baik pada hasil bersistem maupun arsip
            penyelenggara. Periksa ejaan nomor, atau hubungi penyelenggara yang
            tertera di piagam.
          </p>
        </Kartu>
      )}

      <CatatanDemo>
        Halaman ini bisa dibuka siapa pun tanpa masuk — itulah gunanya. Sidik di
        atas dihitung dari nomor, pemegang, dan event, sehingga piagam yang
        diedit tidak akan cocok. Pada versi produksi, sidik diganti tanda tangan
        elektronik tersertifikasi bila dibutuhkan kekuatan hukum.
      </CatatanDemo>
      <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
        Data contoh — prototipe demo INORGA
      </p>
    </main>
  );
}
