import { ProfilAtlet } from "@/components/ProfilAtlet";
import { ATLET } from "@/data/atlet";

/**
 * Semua id berasal dari data contoh statis, jadi seluruh halaman valid sudah
 * dirender di muka. Nilai false wajib agar ekspor statis untuk APK bisa jalan;
 * id yang tidak dikenal jatuh ke halaman tidak-ditemukan.
 */
export const dynamicParams = false;
export function generateStaticParams() {
  return ATLET.map((a) => ({ id: a.id }));
}

export default async function HalamanDetailAtlet({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfilAtlet atletId={id} />;
}
