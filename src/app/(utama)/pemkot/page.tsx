import Link from "next/link";
import { Kartu, JudulBagian, CatatanDemo, Statistik } from "@/components/ui";
import { PetaPemkot } from "@/components/PetaPemkot";
import { Footage } from "@/components/Footage";
import {
  KECAMATAN,
  atletTerbanyak,
  totalAtlet,
  totalPerguruan,
} from "@/data/wilayah";
import { PERGURUAN, singkatanPerguruan } from "@/data/perguruan";
import { EVENTS, PENDAFTARAN } from "@/data/event";
import {
  ATLET,
  TREN_ATLET,
  kelompokUmur,
  kemiringanTren,
  atletById,
} from "@/data/atlet";
import { HASIL } from "@/data/penilaian";
import { tingkatKesenjangan } from "@/lib/kesenjangan";

export default function HalamanPemkot() {
  const maks = atletTerbanyak[0].jumlahAtlet;
  const teratas = atletTerbanyak.slice(0, 8);
  const pesertaTahunIni = EVENTS.reduce((n, e) => n + e.jumlahPeserta, 0);
  const dibawahUmur = ATLET.filter((a) => a.umur < 17).length;
  const persenAnak = Math.round((dibawahUmur / ATLET.length) * 100);
  const dibantu = PENDAFTARAN.filter((p) => p.didaftarkanOleh).length;
  const perluPerhatian = KECAMATAN.filter((k) =>
    ["tanpa", "rendah"].includes(tingkatKesenjangan(k)),
  ).length;

  /** Radar bakat: laju perbaikan aspek inti, bukan nilai absolut. */
  const radar = Object.entries(TREN_ATLET)
    .map(([id, tren]) => ({
      a: atletById(id)!,
      laju: kemiringanTren(tren),
      titik: tren.length,
      terakhir: Object.values(tren[tren.length - 1].nilai).reduce(
        (x, y) => x + y,
        0,
      ),
    }))
    .sort((x, y) => y.laju - x.laju);

  const kohort = (["Pra-Remaja", "Remaja", "Dewasa"] as const).map((g) => {
    const anggota = ATLET.filter((a) => kelompokUmur(a.umur) === g);
    return {
      g,
      n: anggota.length,
      putri: anggota.filter((a) => a.jenisKelamin === "P").length,
    };
  });

  const medaliPerguruan = PERGURUAN.map((p) => ({
    p,
    n: HASIL.filter(
      (h) => h.medali && atletById(h.atletId)?.perguruanId === p.id,
    ).length,
  })).sort((x, y) => y.n - x.n);

  return (
    <main className="flex flex-col gap-10 pb-12">
      <header className="relative min-h-[260px] border-b border-white/10">
        <Footage
          src="/footage/atlet-ilustrasi.png"
          posisi="right 25%"
          scrim="kiri"
          kabur={1.5}
          redup={0.45}
        />
        <div className="inner relative flex min-h-[260px] flex-col justify-end gap-2 py-10">
          <span className="label">Pemkot Palembang &amp; KORMI</span>
          <h1 className="judul text-[clamp(30px,5vw,60px)] text-paper">
            Peta pembinaan silat tradisi Kota Palembang
          </h1>
          <p className="max-w-[62ch] text-[13px] leading-relaxed text-paper-dim">
            Agregat dari aktivitas harian atlet, perguruan, dan penyelenggaraan
            event. Halaman ini tidak pernah menampilkan NIK atau alamat rinci
            siapa pun.
          </p>
        </div>
      </header>

      <div className="inner flex flex-col gap-10">
        <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-3 xl:grid-cols-6">
          <div className="bg-ink-700 p-4">
            <Statistik
              kecil
              angka={totalAtlet.toLocaleString("id-ID")}
              label="Atlet terdata"
              ket="18 kecamatan"
            />
          </div>
          <div className="bg-ink-700 p-4">
            <Statistik
              kecil
              angka={totalPerguruan}
              label="Perguruan aktif"
              ket={`${PERGURUAN.length} terverifikasi`}
            />
          </div>
          <div className="bg-ink-700 p-4">
            <Statistik
              kecil
              angka={pesertaTahunIni.toLocaleString("id-ID")}
              label="Peserta event 2026"
              ket="3 penyelenggaraan"
            />
          </div>
          <div className="bg-ink-700 p-4">
            <Statistik
              kecil
              angka={`${persenAnak}%`}
              label="Atlet di bawah 17 th"
              ket="wajib persetujuan wali"
            />
          </div>
          <div className="bg-ink-700 p-4">
            <Statistik
              kecil
              angka={dibantu}
              label="Pendaftaran dibantu"
              ket="jalur tanpa ponsel"
            />
          </div>
          <div className="bg-ink-700 p-4">
            <Statistik
              kecil
              angka={perluPerhatian}
              label="Kecamatan perlu perhatian"
              ket="tanpa / rendah"
            />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <section className="flex min-w-0 flex-col gap-4">
            <JudulBagian
              eyebrow="Sebaran geografis"
              judul="Peta pembinaan per kecamatan"
            />
            <Kartu className="p-5">
              <PetaPemkot />
            </Kartu>
            <CatatanDemo>
              Zona Ulu — Seberang Ulu I dan II — menyumbang atlet terbanyak.
              Mode kesenjangan menjawab pertanyaan kebijakan yang sesungguhnya:
              kecamatan mana yang atletnya ada tetapi perguruannya tidak.
            </CatatanDemo>
          </section>

          <div className="flex min-w-0 flex-col gap-10">
            <section className="flex min-w-0 flex-col gap-4">
              <JudulBagian
                eyebrow="Peringkat"
                judul="Delapan kecamatan teratas"
              />
              <Kartu className="flex flex-col gap-3 p-5">
                {teratas.map((k) => (
                  <div key={k.id} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-medium text-paper">
                        {k.nama}
                      </span>
                      <span className="tnum font-mono text-[12px] text-muted">
                        {k.jumlahAtlet}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden bg-ink-500">
                      <div
                        className="h-full rounded-r-[4px] bg-aksen"
                        style={{ width: `${(k.jumlahAtlet / maks) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </Kartu>
            </section>

            <section className="flex min-w-0 flex-col gap-4">
              <JudulBagian eyebrow="Kohort" judul="Jenjang usia" />
              <div className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
                {kohort.map(({ g, n, putri }) => (
                  <div key={g} className="flex flex-col gap-1 bg-ink-700 p-4">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                      {g}
                    </span>
                    <span className="tnum font-display text-[28px] leading-none font-black text-paper">
                      {n}
                    </span>
                    <span className="tnum font-mono text-[10px] text-muted">
                      {putri} putri · {n - putri} putra
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[12px] leading-relaxed text-muted">
                Dari {ATLET.length} atlet pada data contoh. Sistem mengikuti
                satu angkatan dari 12 sampai 18 tahun — dasar pembinaan
                berjenjang, bukan sekadar arsip hasil lomba.
              </p>
            </section>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <section className="flex min-w-0 flex-col gap-4">
            <JudulBagian
              eyebrow="Radar bakat"
              judul="Laju perbaikan tercepat"
              aksi={
                <span className="font-mono text-[10px] text-muted">
                  poin inti / event
                </span>
              }
            />
            <Kartu className="divide-y divide-white/10">
              {radar.map(({ a, laju, titik, terakhir }, i) => (
                <Link
                  key={a.id}
                  href={`/atlet/${a.id}`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-ink-600"
                >
                  <span className="tnum w-5 font-mono text-[12px] text-aksen">
                    {i + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[13px] font-semibold text-paper">
                      {a.nama}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {a.umur} th · {kelompokUmur(a.umur)} ·{" "}
                      {singkatanPerguruan(a.perguruanId)} · {titik} event
                    </span>
                  </div>
                  <span className="tnum font-display text-[20px] font-black text-paper">
                    +{laju.toFixed(1).replace(".", ",")}
                  </span>
                  <span className="tnum w-12 text-right font-mono text-[11px] text-muted">
                    {terakhir.toFixed(1).replace(".", ",")}
                  </span>
                </Link>
              ))}
            </Kartu>
            <CatatanDemo>
              Diurutkan menurut{" "}
              <strong className="text-paper">laju perbaikan</strong>, bukan
              nilai absolut. Anak 14 tahun yang naik cepat lebih berharga bagi
              pembinaan daripada atlet 19 tahun yang mandek — itulah definisi
              bakat.
            </CatatanDemo>
          </section>

          <section className="flex min-w-0 flex-col gap-4">
            <JudulBagian
              eyebrow="Perguruan"
              judul="Medali bersistem per perguruan"
              aksi={
                <Link
                  href="/klasemen"
                  className="font-mono text-[11px] tracking-[0.1em] text-aksen uppercase hover:underline"
                >
                  Klasemen →
                </Link>
              }
            />
            <Kartu className="divide-y divide-white/10">
              {medaliPerguruan.map(({ p, n }) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[13px] text-paper">
                      {p.nama}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {p.jenis === "nasional" ? "nasional" : "lokal"} ·{" "}
                      {p.jumlahAnggota} anggota
                    </span>
                  </div>
                  <div className="h-1.5 w-14 shrink-0 bg-ink-500 sm:w-24">
                    <div
                      className="h-full bg-aksen"
                      style={{
                        width: `${(n / Math.max(1, medaliPerguruan[0].n)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="tnum w-6 text-right font-mono text-[12px] text-paper">
                    {n}
                  </span>
                </div>
              ))}
            </Kartu>
          </section>
        </div>

        <section className="flex min-w-0 flex-col gap-4">
          <JudulBagian eyebrow="Penyelenggaraan" judul="Event tahun berjalan" />
          <Kartu className="hidden min-w-0 overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {[
                    "Event",
                    "Penyelenggara",
                    "Tanggal",
                    "Peserta",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-mono text-[10px] tracking-[0.16em] text-muted uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EVENTS.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-white/10 last:border-0"
                  >
                    <td className="px-4 py-3 text-[13px] font-semibold text-paper">
                      <Link
                        href={`/event/${e.id}`}
                        className="hover:text-aksen"
                      >
                        {e.nama}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-paper-dim">
                      {e.penyelenggara}
                    </td>
                    <td className="tnum px-4 py-3 font-mono text-[12px] text-paper-dim">
                      {new Date(e.tanggalMulai).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="tnum px-4 py-3 font-mono text-[12px] text-paper-dim">
                      {e.jumlahPeserta}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`border px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase ${e.status === "berlangsung" ? "border-aksen/50 text-aksen" : e.status === "dibuka" ? "border-emerald-400/40 text-emerald-300" : "border-white/20 text-muted"}`}
                      >
                        {e.status === "berlangsung"
                          ? "Berlangsung"
                          : e.status === "dibuka"
                            ? "Pendaftaran dibuka"
                            : "Selesai"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Kartu>

          <div className="flex flex-col gap-px bg-white/10 sm:hidden">
            {EVENTS.map((e) => (
              <Link
                key={e.id}
                href={`/event/${e.id}`}
                className="flex flex-col gap-1.5 bg-ink-700 p-4"
              >
                <span className="text-[14px] font-semibold text-paper">
                  {e.nama}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {e.penyelenggara} · {e.jumlahPeserta} peserta
                </span>
                <span
                  className={`w-fit border px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] uppercase ${e.status === "berlangsung" ? "border-aksen/50 text-aksen" : e.status === "dibuka" ? "border-emerald-400/40 text-emerald-300" : "border-white/20 text-muted"}`}
                >
                  {e.status === "berlangsung"
                    ? "Berlangsung"
                    : e.status === "dibuka"
                      ? "Pendaftaran dibuka"
                      : "Selesai"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
