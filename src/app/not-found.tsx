import Link from "next/link";

/** Halaman untuk alamat yang tidak dikenal — termasuk nomor sertifikat yang tidak tercatat. */
export default function TidakDitemukan() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-5 py-16">
      <span className="label">Tidak ditemukan</span>
      <h1 className="judul text-[clamp(30px,6vw,64px)] text-paper">
        Alamat ini tidak tercatat
      </h1>
      <p className="max-w-[52ch] text-[14px] leading-relaxed text-paper-dim">
        Halaman yang Anda tuju tidak ada. Bila Anda sedang memeriksa keaslian
        sebuah sertifikat, periksa kembali ejaan nomornya — nomor yang sah
        selalu tercatat pada hasil bersistem atau arsip penyelenggara.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/" className="cta">
          Kembali ke beranda
        </Link>
        <Link href="/klasemen" className="tombol-garis">
          Lihat klasemen
        </Link>
      </div>
      <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
        Prototipe demo INORGA · data contoh
      </p>
    </main>
  );
}
