import Link from "next/link";
import { Kartu, JudulBagian, Lencana, CatatanDemo, Statistik } from "@/components/ui";
import { Footage } from "@/components/Footage";
import { PERGURUAN, perguruanById } from "@/data/perguruan";
import { atletPerguruan, inisial, kelompokUmur } from "@/data/atlet";
import { KECAMATAN, namaKecamatan } from "@/data/wilayah";
import { EVENTS, PENDAFTARAN, eventById, labelKategori } from "@/data/event";
import { HASIL } from "@/data/penilaian";

const PERGURUAN_DEMO = "psht";
const TOMBOL = "cta w-full";

export default function HalamanPerguruan() {
  const perguruan = perguruanById(PERGURUAN_DEMO)!;
  const anggota = atletPerguruan(PERGURUAN_DEMO);
  const ids = new Set(anggota.map((a) => a.id));
  const belumLengkap = anggota.filter((a) => a.statusVerifikasi !== "terverifikasi");
  const perluWali = anggota.filter((a) => a.umur < 17 && !a.wali?.terverifikasi);

  const medali = HASIL.filter((h) => ids.has(h.atletId) && h.medali).reduce(
    (m, h) => ({ ...m, [h.medali!]: m[h.medali!] + 1 }),
    { emas: 0, perak: 0, perunggu: 0 }
  );
  const peraih = anggota
    .map((a) => ({ a, n: HASIL.filter((h) => h.atletId === a.id && h.medali).length }))
    .filter((x) => x.n > 0)
    .sort((x, y) => y.n - x.n);
  const perKecamatan = KECAMATAN.map((k) => ({ k, n: anggota.filter((a) => a.kecamatanId === k.id).length })).filter((x) => x.n > 0).sort((x, y) => y.n - x.n);
  const perKelompok = (["Pra-Remaja", "Remaja", "Dewasa"] as const).map((g) => ({ g, n: anggota.filter((a) => kelompokUmur(a.umur) === g).length }));
  const pendaftarAktif = PENDAFTARAN.filter((p) => ids.has(p.atletId) && eventById(p.eventId)?.status !== "selesai");

  return (
    <main className="flex flex-col gap-10 pb-12">
      <header className="relative min-h-[260px] border-b border-white/10">
        <Footage src="/footage/peta-bawah.png" posisi="center 55%" scrim="kiri" kabur={1} redup={0.55} />
        <div className="inner relative flex min-h-[260px] flex-col justify-end gap-2 py-10">
          <span className="label">Panel perguruan</span>
          <h1 className="judul text-[clamp(30px,5vw,56px)] text-paper">{perguruan.nama}</h1>
          <p className="text-[13px] text-paper-dim">
            Kec. {namaKecamatan(perguruan.kecamatanId)} · berdiri {perguruan.berdiri} · {perguruan.jenis === "nasional" ? "perguruan nasional" : "padepokan lokal"}
          </p>
        </div>
      </header>

      <div className="inner grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
            <div className="bg-ink-700 p-4"><Statistik kecil angka={perguruan.jumlahAnggota} label="Anggota terdaftar" ket={`${anggota.length} pada data contoh`} /></div>
            <div className="bg-ink-700 p-4"><Statistik kecil angka={belumLengkap.length} label="Data belum lengkap" /></div>
            <div className="bg-ink-700 p-4"><Statistik kecil angka={perluWali.length} label="Butuh izin wali" /></div>
          </div>

          <section className="flex flex-col gap-4">
            <JudulBagian eyebrow="Prestasi perguruan" judul="Medali bersistem" aksi={<Link href="/klasemen" className="font-mono text-[11px] tracking-[0.1em] text-aksen uppercase hover:underline">Klasemen →</Link>} />
            <div className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
              {[["Emas", medali.emas, "text-emas"], ["Perak", medali.perak, "text-perak"], ["Perunggu", medali.perunggu, "text-perunggu"]].map(([l, n, c]) => (
                <div key={String(l)} className="flex flex-col gap-1 bg-ink-700 p-4">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">{l}</span>
                  <span className={`tnum font-display text-[32px] leading-none font-black ${c}`}>{n}</span>
                </div>
              ))}
            </div>
            <Kartu className="divide-y divide-white/10">
              {peraih.map(({ a, n }) => (
                <Link key={a.id} href={`/atlet/${a.id}`} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-ink-600">
                  <span className="text-[13px] text-paper">{a.nama}</span>
                  <span className="tnum font-mono text-[11px] text-muted">{n} medali · {kelompokUmur(a.umur)}</span>
                </Link>
              ))}
              {peraih.length === 0 ? <p className="p-4 text-[13px] text-muted">Belum ada medali bersistem.</p> : null}
            </Kartu>
          </section>

          <section className="flex flex-col gap-4">
            <JudulBagian eyebrow="Komposisi binaan" judul="Kelompok umur & asal" />
            <div className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
              {perKelompok.map(({ g, n }) => (
                <div key={g} className="flex flex-col gap-1 bg-ink-700 p-4">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">{g}</span>
                  <span className="tnum font-display text-[28px] leading-none font-black text-paper">{n}</span>
                </div>
              ))}
            </div>
            <Kartu className="flex flex-col gap-3 p-4">
              {perKecamatan.map(({ k, n }) => (
                <div key={k.id} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-[13px]"><span className="text-paper">{k.nama}</span><span className="tnum font-mono text-[11px] text-muted">{n}</span></div>
                  <div className="h-1.5 bg-ink-500"><div className="h-full bg-aksen" style={{ width: `${(n / anggota.length) * 100}%` }} /></div>
                </div>
              ))}
            </Kartu>
            <CatatanDemo>Anggota datang dari {perKecamatan.length} kecamatan — jangkauan perguruan melampaui kecamatan kedudukannya. Ini yang dibaca Pemkot saat menempatkan pembinaan baru.</CatatanDemo>
          </section>
        </div>

        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-4">
            <JudulBagian eyebrow="Pendaftaran kolektif" judul="Daftarkan binaan ke event" />
            <Kartu className="flex flex-col gap-4 p-6">
              <p className="text-[13px] leading-relaxed text-paper-dim">Pilih beberapa anggota sekaligus untuk didaftarkan ke Palembang Open Silat Fest 2026. Data profil masing-masing terisi otomatis; pengurus hanya memilih kategori lomba.</p>
              <button type="button" className={TOMBOL}>Pilih anggota &amp; daftarkan</button>
              <CatatanDemo>Jalur ini juga yang dipakai untuk anggota yang tidak punya ponsel sendiri. Persetujuan wali tetap direkam terpisah dan tidak bisa diwakilkan pengurus.</CatatanDemo>
            </Kartu>
          </section>

          <section className="flex flex-col gap-4">
            <JudulBagian eyebrow="Binaan" judul="Anggota aktif" aksi={<span className="tnum font-mono text-[11px] text-muted">{anggota.length} ditampilkan</span>} />
            <Kartu className="divide-y divide-white/10">
              {anggota.map((a) => (
                <Link key={a.id} href={`/atlet/${a.id}`} className="flex items-center gap-3 p-4 transition-colors hover:bg-ink-600 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-aksen">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full border border-aksen/60 font-display text-[13px] font-black text-aksen">{inisial(a.nama)}</div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate text-[14px] font-semibold text-paper">{a.nama}</p>
                    <p className="font-mono text-[11px] text-muted">{a.umur} th · {kelompokUmur(a.umur)} · {namaKecamatan(a.kecamatanId)}</p>
                  </div>
                  {a.umur < 17 && !a.wali?.terverifikasi ? <Lencana nada="kuning">Wali belum</Lencana> : null}
                  {a.statusVerifikasi === "terverifikasi" ? <Lencana nada="hijau">Terverifikasi</Lencana> : a.statusVerifikasi === "menunggu" ? <Lencana nada="kuning">Menunggu</Lencana> : <Lencana nada="merah">Belum</Lencana>}
                </Link>
              ))}
            </Kartu>
          </section>

          <section className="flex flex-col gap-4">
            <JudulBagian eyebrow="Event aktif" judul="Binaan yang terdaftar" aksi={<span className="tnum font-mono text-[11px] text-muted">{pendaftarAktif.length} pendaftaran</span>} />
            <Kartu className="divide-y divide-white/10">
              {pendaftarAktif.map((p) => {
                const a = anggota.find((x) => x.id === p.atletId)!;
                const ev = eventById(p.eventId)!;
                return (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="tnum w-10 font-mono text-[12px] text-aksen">{p.nomorUrut ? String(p.nomorUrut).padStart(3, "0") : "—"}</span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[13px] text-paper">{a.nama}</span>
                      <span className="truncate font-mono text-[10px] text-muted">{ev.nama} · {labelKategori(p.kategoriId)}</span>
                    </div>
                    <Lencana nada={ev.status === "berlangsung" ? "cyan" : "netral"}>{ev.status === "berlangsung" ? (p.checkIn === "hadir" ? "Hadir" : "Belum check-in") : "Menunggu undian"}</Lencana>
                  </div>
                );
              })}
            </Kartu>
          </section>

          <section className="flex flex-col gap-4">
            <JudulBagian eyebrow="Direktori kota" judul="Perguruan lain di Palembang" />
            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              {PERGURUAN.filter((p) => p.id !== PERGURUAN_DEMO).map((p) => (
                <div key={p.id} className="flex flex-col gap-1 bg-ink-700 p-4">
                  <span className="text-[13px] font-semibold text-paper">{p.nama}</span>
                  <span className="font-mono text-[11px] text-muted">{namaKecamatan(p.kecamatanId)} · berdiri {p.berdiri} · {p.jumlahAnggota} anggota</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <p className="inner font-mono text-[10px] tracking-[0.1em] text-muted uppercase">{EVENTS.length} event tercatat · data contoh</p>
    </main>
  );
}
