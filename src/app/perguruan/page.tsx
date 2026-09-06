import { Kartu, JudulBagian, Lencana, CatatanDemo } from"@/components/ui";
import { PERGURUAN, perguruanById } from"@/data/perguruan";
import { atletPerguruan, inisial } from"@/data/atlet";
import { namaKecamatan } from"@/data/wilayah";

const PERGURUAN_DEMO ="psht";

export default function HalamanPerguruan() {
  const perguruan = perguruanById(PERGURUAN_DEMO)!;
  const anggota = atletPerguruan(PERGURUAN_DEMO);
  const belumLengkap = anggota.filter((a) => a.statusVerifikasi !=="terverifikasi");
  const perluWali = anggota.filter((a) => a.umur < 17 && !a.wali?.terverifikasi);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
      <header className="flex flex-col gap-1">
        <span className="label">
          Panel perguruan
        </span>
        <h1 className="judul text-[clamp(26px,5vw,40px)] text-paper">
          {perguruan.nama}
        </h1>
        <p className="text-[13px] text-paper-dim">
          Kec. {namaKecamatan(perguruan.kecamatanId)} · berdiri {perguruan.berdiri}
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {[
          { angka: perguruan.jumlahAnggota, label:"Anggota terdaftar" },
          { angka: belumLengkap.length, label:"Data belum lengkap" },
          { angka: perluWali.length, label:"Butuh izin wali" },
        ].map((s) => (
          <Kartu key={s.label} className="flex flex-col gap-1 p-4">
            <span className="tnum font-display text-[clamp(30px,5vw,44px)] leading-[0.9] font-black text-aksen">
              {s.angka}
            </span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">{s.label}</span>
          </Kartu>
        ))}
      </div>

      <section className="flex flex-col gap-3">
        <JudulBagian
          eyebrow="Pendaftaran kolektif"
          judul="Daftarkan binaan ke event"
        />
        <Kartu className="flex flex-col gap-3 p-5">
          <p className="text-[13px] leading-relaxed text-paper-dim">
            Pilih beberapa anggota sekaligus untuk didaftarkan ke Palembang Open Silat
            Fest 2026. Data profil masing-masing terisi otomatis; pengurus hanya
            memilih kategori lomba.
          </p>
          <button
            type="button"
            className="w-full bg-aksen px-5 py-4 font-mono text-[12px] tracking-[0.14em] text-ink-900 uppercase transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen"
          >
            Pilih anggota &amp; daftarkan
          </button>
          <CatatanDemo>
            Jalur ini juga yang dipakai untuk anggota yang tidak punya ponsel sendiri.
            Persetujuan wali tetap direkam terpisah dan tidak bisa diwakilkan pengurus.
          </CatatanDemo>
        </Kartu>
      </section>

      <section className="flex flex-col gap-3">
        <JudulBagian
          eyebrow="Binaan"
          judul="Anggota aktif"
          aksi={
            <span className="tnum font-mono text-[11px] text-muted">
              {anggota.length} ditampilkan
            </span>
          }
        />
        <Kartu className="divide-y divide-white/10">
          {anggota.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-full border border-aksen/60 font-display text-[13px] font-black text-aksen">
                {inisial(a.nama)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-[14px] font-semibold text-paper">
                  {a.nama}
                </p>
                <p className="font-mono text-[11px] text-muted">
                  {a.umur} th · {namaKecamatan(a.kecamatanId)} · {a.medali.emas}E{""}
                  {a.medali.perak}P {a.medali.perunggu}Pr
                </p>
              </div>
              {a.statusVerifikasi ==="terverifikasi" ? (
                <Lencana nada="hijau">Terverifikasi</Lencana>
              ) : a.statusVerifikasi ==="menunggu" ? (
                <Lencana nada="kuning">Menunggu</Lencana>
              ) : (
                <Lencana nada="merah">Belum</Lencana>
              )}
            </div>
          ))}
        </Kartu>
      </section>

      <section className="flex flex-col gap-3">
        <JudulBagian eyebrow="Direktori kota" judul="Perguruan lain di Palembang" />
        <Kartu className="divide-y divide-white/10">
          {PERGURUAN.filter((p) => p.id !== PERGURUAN_DEMO).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 p-3.5">
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-[13px] font-semibold text-paper">
                  {p.nama}
                </p>
                <p className="font-mono text-[11px] text-muted">
                  {namaKecamatan(p.kecamatanId)} · berdiri {p.berdiri}
                </p>
              </div>
              <span className="tnum shrink-0 font-mono text-[12px] text-muted">
                {p.jumlahAnggota}
              </span>
            </div>
          ))}
        </Kartu>
      </section>
    </main>
  );
}
