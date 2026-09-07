import { ARENA } from "@/data/event";

/**
 * Param statis untuk rute arena. Diletakkan di layout karena page-nya adalah
 * komponen klien; ini yang memungkinkan ekspor statis untuk build APK.
 */
/**
 * Semua id berasal dari data contoh statis, jadi seluruh halaman valid sudah
 * dirender di muka. Nilai false wajib agar ekspor statis untuk APK bisa jalan;
 * id yang tidak dikenal jatuh ke halaman tidak-ditemukan.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return ARENA.map((a) => ({ id: a.id }));
}

export default function LayoutArena({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
