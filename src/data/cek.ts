import { ANTRIAN, PENDAFTARAN } from "@/data/event";
import { HASIL, NILAI, RIWAYAT_PRESTASI } from "@/data/penilaian";
import { UNDIAN_TERKUNCI } from "@/data/juri";
import { verifikasiUndian } from "@/lib/undian";

/**
 * Asersi konsistensi data contoh. Dipanggil sekali saat pengembangan;
 * melempar bila ada yang tidak konsisten agar ketahuan sebelum demo.
 */
export function cekDataContoh(): string[] {
  const masalah: string[] = [];

  for (const q of ANTRIAN) {
    if (
      !PENDAFTARAN.some(
        (p) =>
          p.eventId === "e-walikota" &&
          p.kategoriId === q.kategoriId &&
          p.atletId === q.atletId,
      )
    ) {
      masalah.push(`antrian ${q.id} tidak punya pendaftaran`);
    }
  }
  for (const h of HASIL) {
    if (
      h.sumber === "sistem" &&
      !NILAI.some(
        (n) =>
          n.eventId === h.eventId &&
          n.kategoriId === h.kategoriId &&
          n.atletId === h.atletId,
      )
    ) {
      masalah.push(`hasil ${h.id} tidak punya nilai juri`);
    }
  }
  const nomor = [
    ...HASIL.map((h) => h.nomorSertifikat),
    ...RIWAYAT_PRESTASI.map((x) => x.nomorSertifikat),
  ];
  const ganda = nomor.filter((n, i) => nomor.indexOf(n) !== i);
  if (ganda.length)
    masalah.push(`nomor sertifikat ganda: ${[...new Set(ganda)].join(", ")}`);

  if (!verifikasiUndian(UNDIAN_TERKUNCI))
    masalah.push("rekaman undian Matras A tidak bisa direproduksi");
  if (UNDIAN_TERKUNCI.urutan[4] !== "a-025")
    masalah.push("Andi Saputra tidak di nomor 025");

  return masalah;
}
