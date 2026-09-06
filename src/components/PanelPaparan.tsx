"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Panel geser — mekanik yang sama dengan modal pemesanan pada referensi Apex:
 * masuk dari kanan (dari bawah di layar sempit) di atas latar yang memudar,
 * dengan Esc, tombol tutup, dan penguncian gulir.
 */
export function PanelPaparan({ onTutup }: { onTutup: () => void }) {
  const [terkirim, setTerkirim] = useState(false);
  const tutupRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saatTekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") onTutup();
    };
    const gulirSemula = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", saatTekan);
    tutupRef.current?.focus();
    return () => {
      document.body.style.overflow = gulirSemula;
      document.removeEventListener("keydown", saatTekan);
    };
  }, [onTutup]);

  return (
    <>
      <button
        type="button"
        aria-label="Tutup panel"
        onClick={onTutup}
        className="latar-panel fixed inset-0 z-[200] border-0 bg-black/60 p-0 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-paparan"
        className="panel-geser fixed inset-x-0 bottom-0 z-[210] flex h-[86vh] w-full flex-col gap-6 overflow-y-auto border-t border-white/10 bg-ink-800 p-8 sm:inset-y-0 sm:right-0 sm:left-auto sm:h-auto sm:w-[min(460px,100%)] sm:border-t-0 sm:border-l sm:p-10"
      >
        <button
          ref={tutupRef}
          type="button"
          onClick={onTutup}
          aria-label="Tutup"
          className="absolute top-5 right-5 border-0 bg-transparent text-[26px] leading-none text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen"
        >
          &times;
        </button>

        <div className="flex flex-col gap-3">
          <span className="label">Untuk Pemkot &amp; KORMI</span>
          <h3 id="judul-paparan" className="judul text-[clamp(26px,5vw,34px)]">
            Ajukan paparan lengkap
          </h3>
          <p className="text-[14px] leading-relaxed text-paper-dim">
            Paparan mencakup arsitektur sistem, jalur kepatuhan PSE dan UU PDP,
            serta peta fitur bertahap sampai produksi.
          </p>
        </div>

        {terkirim ? (
          <div className="border border-aksen/50 bg-aksen/5 p-5">
            <p className="font-mono text-[12px] tracking-[0.12em] text-aksen uppercase">
              Prototipe
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-paper-dim">
              Formulir ini belum terhubung ke mana pun. Di versi produksi,
              pengajuan masuk ke panel admin dan memicu notifikasi.
            </p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setTerkirim(true);
            }}
          >
            {[
              { id: "nama", label: "Nama", tipe: "text" },
              { id: "instansi", label: "Instansi", tipe: "text" },
              { id: "kontak", label: "Email atau WhatsApp", tipe: "text" },
            ].map((f) => (
              <div key={f.id}>
                <label
                  htmlFor={f.id}
                  className="mb-2 block font-mono text-[11px] tracking-[0.14em] text-muted uppercase"
                >
                  {f.label}
                </label>
                <input
                  id={f.id}
                  name={f.id}
                  type={f.tipe}
                  className="w-full border border-white/10 bg-ink-600 px-4 py-3 text-[14px] text-paper focus:border-aksen focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="catatan"
                className="mb-2 block font-mono text-[11px] tracking-[0.14em] text-muted uppercase"
              >
                Catatan
              </label>
              <textarea
                id="catatan"
                name="catatan"
                rows={4}
                className="w-full border border-white/10 bg-ink-600 px-4 py-3 text-[14px] text-paper focus:border-aksen focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-aksen px-5 py-4 font-mono text-[12px] tracking-[0.14em] text-ink-900 uppercase transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen"
            >
              Kirim pengajuan
            </button>
            <p className="text-[12px] leading-relaxed text-muted">
              Prototipe demo — data yang diisi tidak dikirim ke mana pun.
            </p>
          </form>
        )}
      </div>
    </>
  );
}
