import { Kartu, JudulBagian, CatatanDemo } from"@/components/ui";
import { PetaSebaran } from"@/components/charts";
import { atletTerbanyak, totalAtlet, totalPerguruan } from"@/data/wilayah";
import { PERGURUAN } from"@/data/perguruan";
import { EVENTS } from"@/data/event";
import { ATLET } from"@/data/atlet";

export default function HalamanPemkot() {
  const maks = atletTerbanyak[0].jumlahAtlet;
  const teratas = atletTerbanyak.slice(0, 8);
  const pesertaTahunIni = EVENTS.reduce((n, e) => n + e.jumlahPeserta, 0);
  const dibawahUmur = ATLET.filter((a) => a.umur < 17).length;
  const persenAnak = Math.round((dibawahUmur / ATLET.length) * 100);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-1">
        <span className="label">
          Pemkot Palembang &amp; KORMI
        </span>
        <h1 className="judul text-[clamp(28px,5vw,46px)] text-paper">
          Peta pembinaan silat tradisi Kota Palembang
        </h1>
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-paper-dim">
          Agregat dari aktivitas harian atlet, perguruan, dan penyelenggaraan event.
          Halaman ini tidak pernah menampilkan NIK atau alamat rinci siapa pun.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { angka: totalAtlet.toLocaleString("id-ID"), label:"Atlet terdata", ket:"18 kecamatan" },
          { angka: totalPerguruan, label:"Perguruan aktif", ket: `${PERGURUAN.length} terverifikasi` },
          { angka: pesertaTahunIni.toLocaleString("id-ID"), label:"Peserta event 2026", ket:"3 penyelenggaraan" },
          { angka: `${persenAnak}%`, label:"Atlet di bawah 17 th", ket:"wajib persetujuan wali" },
        ].map((s) => (
          <Kartu key={s.label} className="flex flex-col gap-1 p-4">
            <span className="tnum font-display text-[clamp(32px,5vw,48px)] leading-[0.9] font-black text-aksen">
              {s.angka}
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] text-paper uppercase">{s.label}</span>
            <span className="text-[11px] text-muted">{s.ket}</span>
          </Kartu>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <section className="flex flex-col gap-3">
          <JudulBagian eyebrow="Sebaran geografis" judul="Konsentrasi bakat per kecamatan" />
          <Kartu className="p-5">
            <PetaSebaran />
          </Kartu>
          <CatatanDemo>
            Zona Ulu — Seberang Ulu I dan II — menyumbang atlet terbanyak, sementara
            Sematang Borang dan Ilir Timur III paling sedikit. Peta seperti ini yang
            menjadi dasar menempatkan pembinaan, bukan pemerataan buta.
          </CatatanDemo>
        </section>

        <section className="flex flex-col gap-3">
          <JudulBagian eyebrow="Peringkat" judul="Delapan kecamatan teratas" />
          <Kartu className="flex flex-col gap-3 p-5">
            {teratas.map((k) => (
              <div key={k.id} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-medium text-paper">{k.nama}</span>
                  <span className="tnum font-mono text-[12px] text-muted">
                    {k.jumlahAtlet}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-500">
                  <div
                    className="h-full rounded-r-[4px] bg-aksen"
                    style={{ width: `${(k.jumlahAtlet / maks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </Kartu>
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <JudulBagian eyebrow="Penyelenggaraan" judul="Event tahun berjalan" />
        <Kartu className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-white/10">
                {["Event","Penyelenggara","Tanggal","Peserta","Status"].map((h) => (
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
                <tr key={e.id} className="border-b border-white/10 last:border-0">
                  <td className="px-4 py-3 text-[13px] font-semibold text-paper">
                    {e.nama}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-paper-dim">
                    {e.penyelenggara}
                  </td>
                  <td className="tnum px-4 py-3 font-mono text-[12px] text-paper-dim">
                    {new Date(e.tanggalMulai).toLocaleDateString("id-ID", {
                      day:"2-digit",
                      month:"short",
                      year:"numeric",
                    })}
                  </td>
                  <td className="tnum px-4 py-3 font-mono text-[12px] text-paper-dim">
                    {e.jumlahPeserta}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        e.status ==="berlangsung"
                          ?"border-cyan-200 bg-cyan-50 text-aksen"
                          : e.status ==="dibuka"
                            ?"border-emerald-200 bg-emerald-50 text-emerald-800"
                            :"border-white/10 bg-ink-600 text-muted"
                      }`}
                    >
                      {e.status ==="berlangsung"
                        ?"Berlangsung"
                        : e.status ==="dibuka"
                          ?"Pendaftaran dibuka"
                          :"Selesai"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Kartu>
      </section>
    </main>
  );
}
