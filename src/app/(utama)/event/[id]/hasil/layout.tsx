import { EVENTS } from "@/data/event";

/** Param statis untuk halaman hasil — page-nya komponen klien. */
/**
 * Semua id berasal dari data contoh statis, jadi seluruh halaman valid sudah
 * dirender di muka. Nilai false wajib agar ekspor statis untuk APK bisa jalan;
 * id yang tidak dikenal jatuh ke halaman tidak-ditemukan.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export default function LayoutHasil({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
