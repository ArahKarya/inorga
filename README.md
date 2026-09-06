# INORGA — Prototipe Demo

Ekosistem digital pemanduan bakat pencak silat tradisi Kota Palembang.
Prototipe untuk tahap penawaran ke Pemkot Palembang dan KORMI.

## Menjalankan

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Alur presentasi

Satu aplikasi, satu set data, empat sudut pandang. Pengalih peran ada di bilah
atas sehingga bisa dilompati kapan saja di depan audiens.

| # | Layar | Yang ditunjukkan | Kalimat pembuka |
|---|-------|------------------|-----------------|
| 1 | **Beranda** | Skala: 1.063 atlet, 74 perguruan, 18 kecamatan | "Ini yang selama ini tidak pernah terdata." |
| 2 | **Atlet** | Panggilan arena real-time, kartu QR, daftar 1 klik, rapor, portofolio | "Andi, 16 tahun, sedang menunggu giliran di Jakabaring." |
| 3 | **Panitia** | Antrian matras, tombol panggil, mode luring, check-in QR | "Panitia menekan satu tombol — Andi langsung tahu." |
| 4 | **Perguruan** | Binaan, kelengkapan data, pendaftaran kolektif | "Pengurus tidak perlu lagi mengumpulkan fotokopi." |
| 5 | **Pemkot & KORMI** | Peta sebaran bakat, peringkat kecamatan, statistik event | "Dan inilah yang selama ini tidak bisa dilihat siapa pun." |

Urutan ini disengaja: pengalaman individu dulu, dampak kelembagaan terakhir.
Pengambil keputusan baru percaya pada peta setelah melihat dari mana datanya berasal.

**Momen paling kuat:** buka layar Atlet dan Panitia berdampingan di dua perangkat.
Tekan "Panggil peserta berikutnya" di panel panitia — status di layar atlet berubah.

## Yang disimulasikan

Seluruh data adalah **data contoh**. Nama atlet fiktif. Nama perguruan nasional
dipakai karena organisasi itu memang ada di Palembang, tetapi seluruh atributnya —
pengurus, tahun berdiri, jumlah anggota, kecamatan kedudukan — dikarang untuk
keperluan demo dan tidak berasal dari sumber resmi organisasi mana pun.
Bilah atas menandai ini secara permanen agar tidak ada salah paham saat presentasi.

Belum tersambung ke sistem sungguhan:

- **Verifikasi Dukcapil** — lencana "terverifikasi" masih simulasi. Akses sudah
  dipastikan tersedia lewat Pemkot, tetapi PKS belum berjalan.
- **OTP WhatsApp** — belum ada; login dilewati untuk keperluan demo.
- **Basis data** — data ada di `src/data/`, belum di Postgres.
- **Sinkronisasi luring** — tombol "Simulasikan koneksi putus" memperagakan
  perilakunya, belum ada lapisan sinkronisasi sungguhan.

Jangan menjanjikan keempatnya sebagai sudah jalan. Tunjukkan sebagai alur.

## Keputusan desain yang dibawa dari bedah kelayakan

Prototipe ini bukan sekadar tampilan — beberapa keputusan struktural sudah
mengikuti temuan dokumen bedah kelayakan, supaya bisa dilanjutkan ke produksi
tanpa ditulis ulang.

- **NIK tidak disimpan** (`src/lib/types.ts`). Karena akses verifikasi Dukcapil
  tersedia, yang perlu disimpan hanya status verifikasi dan hash untuk deteksi
  duplikat. Aset paling berisiko hilang tanpa kehilangan manfaatnya.
- **Wali sebagai bagian model atlet**. Umur minimum 12 tahun berarti mayoritas
  pengguna adalah anak; UU PDP mewajibkan persetujuan wali.
- **Penilaian sebagai baris, bukan kolom** (`src/data/penilaian.ts`). Aspek inti
  wajib sama di semua event agar tren lintas-event mungkin; aspek ekstensi bebas
  per penyelenggara. Tanpa pemisahan ini, janji "tren nilai historis" tidak bisa
  ditepati.
- **Pendaftaran dibantu** (`didaftarkanOleh`). Karena semua event diwajibkan
  pindah ke aplikasi, harus ada jalur bagi atlet tanpa ponsel.
- **Mode luring pada panel panitia**. Koneksi di GOR tidak bisa diandalkan.

## Struktur

```
src/
├── app/
│   ├── page.tsx          beranda & pengalih peran
│   ├── atlet/            kartu anggota, event, rapor, portofolio
│   ├── perguruan/        binaan & pendaftaran kolektif
│   ├── panitia/          antrian arena & check-in
│   └── pemkot/           dashboard kota
├── components/
│   ├── DemoBar.tsx       pengalih peran
│   ├── charts.tsx        grafik tren & peta sebaran
│   └── ui.tsx            komponen bersama
├── data/                 data contoh
└── lib/types.ts          model data
```

## Catatan teknis

- Next.js 16, React 19, Tailwind 4, TypeScript.
- Palet seri grafik sudah divalidasi untuk buta warna (ΔE 15,5 pada deuteranopia).
- Peta melabeli 15 dari 18 kecamatan; tiga terkecil muncul saat kursor diarahkan,
  agar label tidak bertumpuk di kluster tengah.
- Belum ada backend. Saat masuk produksi, `src/data/` diganti Postgres + Prisma,
  dan **hosting wajib di wilayah Indonesia** karena sistem ini akan berstatus
  PSE Lingkup Publik (PP 71/2019 Pasal 20).
