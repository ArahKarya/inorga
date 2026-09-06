"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Menyala sekali saat elemen masuk ke layar.
 *
 * `paksaTampil` adalah jaring pengaman. Elemen reveal berawal dari opacity 0,
 * dan peramban membekukan animasi saat dokumen tidak terlihat — jendela
 * terhalang, tab di latar belakang, atau di-render di luar layar oleh
 * perangkat lunak berbagi layar. Tanpa pengaman, layar bisa kosong tepat saat
 * dipresentasikan. Karena itu kelas penuntas dipasang bila dokumen sedang
 * tersembunyi, dan tetap dipasang 2 detik setelah reveal menyala — jauh
 * setelah animasi 0,7 detik selesai, jadi tidak mengubah apa pun bila normal.
 */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [paksaTampil, setPaksaTampil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (document.visibilityState === "hidden") setPaksaTampil(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setPaksaTampil(true), 2000);
    return () => clearTimeout(t);
  }, [inView]);

  return { ref, inView, paksaTampil };
}

/** Reveal naik-memudar untuk teks dan kartu. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView, paksaTampil } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${paksaTampil ? "gerak-tuntas" : ""} ${className}`}
      data-in={inView}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Judul yang muncul baris demi baris dari balik topeng. */
export function RevealBaris({
  baris,
  className = "",
  sebagai: Tag = "h2",
}: {
  baris: readonly ReactNode[];
  className?: string;
  sebagai?: "h1" | "h2";
}) {
  const { ref, inView, paksaTampil } = useInView<HTMLHeadingElement>();
  return (
    <Tag ref={ref} className={className}>
      {baris.map((b, i) => (
        <span
          className={`baris-topeng ${paksaTampil ? "gerak-tuntas" : ""}`}
          data-in={inView}
          key={i}
        >
          <span style={{ animationDelay: `${i * 90}ms` }}>{b}</span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Gulir halus lewat Lenis — inilah yang membuat rasa gulirnya berbeda dari
 * bawaan peramban. Dimatikan bila pengguna meminta gerak dikurangi.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
