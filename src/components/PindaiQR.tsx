"use client";

import { useEffect, useRef, useState } from "react";
import { Kartu, Lencana } from "@/components/ui";
import { ATLET, atletById, inisial } from "@/data/atlet";
import { singkatanPerguruan } from "@/data/perguruan";

type Hasil = { atletId: string; waktu: string } | null;

/**
 * Pemindai QR memakai kamera perangkat. Memakai BarcodeDetector bila tersedia
 * (Chrome Android, dan WebView di dalam cangkang Capacitor); bila tidak, tombol
 * simulasi tetap disediakan agar demo tidak pernah macet di ruang rapat.
 */
export function PindaiQR({
  onPindai,
}: {
  onPindai?: (atletId: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [aktif, setAktif] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [hasil, setHasil] = useState<Hasil>(null);
  const [adaDetektor, setAdaDetektor] = useState(false);

  useEffect(() => {
    setAdaDetektor(
      typeof window !== "undefined" && "BarcodeDetector" in window,
    );
  }, []);

  useEffect(() => {
    if (!aktif) return;
    let stream: MediaStream | null = null;
    let batal = false;
    let timer: number;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (batal) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        if (!("BarcodeDetector" in window)) return;
        const Detector = (
          window as unknown as {
            BarcodeDetector: new (o: { formats: string[] }) => {
              detect: (s: CanvasImageSource) => Promise<{ rawValue: string }[]>;
            };
          }
        ).BarcodeDetector;
        const detektor = new Detector({ formats: ["qr_code"] });
        const pindai = async () => {
          if (batal || !videoRef.current) return;
          try {
            const kode = await detektor.detect(videoRef.current);
            const nilai = kode[0]?.rawValue;
            if (nilai?.startsWith("INORGA:")) {
              const id = nilai.split(":")[1];
              if (atletById(id)) {
                terima(id);
                return;
              }
            }
          } catch {
            /* frame belum siap */
          }
          timer = window.setTimeout(pindai, 350);
        };
        pindai();
      } catch {
        setGalat(
          "Kamera tidak bisa diakses. Izinkan akses kamera, atau pakai tombol simulasi di bawah.",
        );
        setAktif(false);
      }
    })();

    return () => {
      batal = true;
      window.clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [aktif]);

  function terima(atletId: string) {
    setHasil({
      atletId,
      waktu: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setAktif(false);
    onPindai?.(atletId);
    if ("vibrate" in navigator) navigator.vibrate(60);
  }

  const atlet = hasil ? atletById(hasil.atletId) : undefined;

  return (
    <Kartu className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="label">Pindai kartu anggota</span>
        {adaDetektor ? (
          <Lencana nada="hijau">Kamera siap</Lencana>
        ) : (
          <Lencana nada="kuning">Mode simulasi</Lencana>
        )}
      </div>

      {aktif ? (
        <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-ink-900">
          <video
            ref={videoRef}
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div
              className="size-40 border-2 border-aksen"
              style={{
                clipPath:
                  "polygon(0 0,28% 0,28% 4%,4% 4%,4% 28%,0 28%,0 100%,28% 100%,28% 96%,4% 96%,4% 72%,0 72%,0 0,100% 0,72% 0,72% 4%,96% 4%,96% 28%,100% 28%,100% 100%,72% 100%,72% 96%,96% 96%,96% 72%,100% 72%)",
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setAktif(false)}
            className="absolute right-3 bottom-3 border border-white/40 bg-ink-900/80 px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-paper uppercase"
          >
            Tutup
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setGalat(null);
            setAktif(true);
          }}
          className="cta w-full"
        >
          Buka kamera
        </button>
      )}

      {galat ? (
        <p className="text-[12px] leading-relaxed text-amber-300">{galat}</p>
      ) : null}

      {hasil && atlet ? (
        <div className="flex items-center gap-3 border border-emerald-400/40 bg-emerald-400/5 p-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-full border border-aksen/60 font-display text-[13px] font-black text-aksen">
            {inisial(atlet.nama)}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[14px] font-semibold text-paper">
              {atlet.nama}
            </span>
            <span className="font-mono text-[11px] text-muted">
              {atlet.id.toUpperCase()} · {singkatanPerguruan(atlet.perguruanId)}{" "}
              · check-in {hasil.waktu}
            </span>
          </div>
          <Lencana nada="hijau">Hadir</Lencana>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
        <span className="w-full font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
          Simulasi tanpa kamera
        </span>
        {ATLET.slice(0, 3).map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => terima(a.id)}
            className="tombol-garis text-[10px]"
          >
            {a.nama.split(" ")[0]}
          </button>
        ))}
      </div>
    </Kartu>
  );
}
