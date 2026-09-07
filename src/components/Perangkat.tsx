"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ATLET_DEMO } from "@/data/atlet";
import { useAntrianLive } from "@/lib/live";

/**
 * Perilaku tingkat perangkat:
 * 1. Mendaftarkan service worker → mode luring sungguhan.
 * 2. Memantau antrian; saat nomor atlet persona berubah jadi "dipanggil",
 *    perangkat bergetar dan memunculkan notifikasi lokal. Sinyalnya datang
 *    dari event `storage` — panitia menekan tombol di perangkat lain.
 */
export function Perangkat() {
  const [antrian] = useAntrianLive();
  const pathname = usePathname();
  const sebelumnya = useRef<string | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const t = setTimeout(() => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* luring tetap berjalan dari cache peramban */
      });
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const saya = antrian.find((q) => q.atletId === ATLET_DEMO);
    const status = saya?.status ?? null;
    const berubahJadiDipanggil =
      status === "dipanggil" &&
      sebelumnya.current !== null &&
      sebelumnya.current !== "dipanggil";
    sebelumnya.current = status;
    if (!berubahJadiDipanggil || !saya) return;

    if ("vibrate" in navigator) navigator.vibrate([120, 60, 120]);

    const judul = `Nomor ${saya.nomorUrut} dipanggil`;
    const isi = `Segera menuju matras. Perkiraan tampil ${saya.jamPerkiraan} WIB.`;
    const tampilkan = () => {
      try {
        new Notification(judul, {
          body: isi,
          icon: "/ikon-192.png",
          badge: "/ikon-192.png",
          tag: "panggilan-arena",
        });
      } catch {
        /* sebagian peramban hanya izinkan lewat service worker */
      }
    };
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") tampilkan();
    else if (Notification.permission === "default")
      Notification.requestPermission().then((izin) => {
        if (izin === "granted") tampilkan();
      });
  }, [antrian]);

  useEffect(() => {
    // Minta izin sekali saat pengguna membuka layar atlet — konteks yang masuk akal.
    if (
      typeof Notification === "undefined" ||
      Notification.permission !== "default"
    )
      return;
    if (!pathname.startsWith("/atlet")) return;
    const t = setTimeout(
      () => Notification.requestPermission().catch(() => {}),
      2500,
    );
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
