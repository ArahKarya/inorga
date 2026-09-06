<div align="center">

# INORGA — Ekosistem Digital Pemanduan Bakat Pencak Silat

**Satu aplikasi, empat sudut pandang — atlet, panitia, perguruan, dan Pemkot melihat data yang sama, secara real-time.**

[![Status](https://img.shields.io/badge/Status-Prototype%20Demo-16C79A?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/Next.js%2016-React%2019%20+%20Tailwind%204-0F3460?style=flat-square&logo=next.js&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-0F3460?style=flat-square)](LICENSE)

</div>

> Produk **Arah Karya Sinergi (AKS)**.

Pencak silat tradisi di Kota Palembang punya ribuan atlet aktif, puluhan
perguruan, dan event rutin lintas kecamatan — tapi selama ini **tidak pernah
terdata**. Siapa bertanding di matras mana, kapan giliran naik, siapa yang
sudah verifikasi identitas, siapa yang butuh rapor perkembangan: semua masih
di kertas dan grup WhatsApp. **INORGA** adalah prototipe demo untuk tahap
penawaran ke Pemkot Palembang dan KORMI — satu sumber data, empat peran yang
melihatnya dari sudut berbeda.

## ✨ Kenapa INORGA

| Masalah | Solusi |
|---|---|
| 1.063 atlet & 74 perguruan tak pernah terdata terpusat | Basis data tunggal per atlet: identitas, perguruan, riwayat event |
| Panitia panggil peserta lewat pengeras suara/manual | Panel panitia: antrian matras + tombol panggil, status berubah langsung di layar atlet |
| Pengurus perguruan kumpulkan fotokopi berkas manual | Pendaftaran kolektif per perguruan, kelengkapan data terpantau |
| Pemkot & KORMI tak punya gambaran sebaran bakat | Dashboard kota: peta sebaran, peringkat kecamatan, statistik event |
| Anak di bawah umur ikut event tanpa jalur consent | Model atlet menyertakan wali — sesuai kewajiban UU PDP |
| Koneksi GOR tidak bisa diandalkan | Mode luring di panel panitia — simulasi putus-sambung sudah dirancang dari awal |

## 🏛️ Arsitektur

```
                     ┌────────────────────────┐
                     │   src/data/  (contoh)  │
                     │  atlet · perguruan     │
                     │  event · penilaian     │
                     │  wilayah               │
                     └───────────┬────────────┘
                                 │  (produksi → Postgres + Prisma)
              ┌──────────────────┼──────────────────┬──────────────────┐
              ▼                  ▼                   ▼                  ▼
        ┌───────────┐     ┌────────────┐      ┌────────────┐    ┌────────────┐
        │  Beranda  │     │   Atlet    │      │  Panitia   │    │  Perguruan │
        │  skala &  │     │ QR, rapor, │      │  antrian   │    │  binaan &  │
        │  ringkasan│     │ portofolio │      │  & panggil │    │  daftar    │
        └───────────┘     └────────────┘      └─────┬──────┘    └────────────┘
                                                      │ status real-time
                                                      ▼
                                              ┌────────────────┐
                                              │ Pemkot & KORMI │
                                              │ peta sebaran & │
                                              │ peringkat kec. │
                                              └────────────────┘
```

Pengalih peran (`DemoBar.tsx`) di bilah atas memungkinkan lompat antar-peran
kapan saja di depan audiens, tanpa logout/login.

## 🔁 Pipeline — alur presentasi

Urutan disengaja: pengalaman individu dulu, dampak kelembagaan terakhir.
Pengambil keputusan baru percaya pada peta setelah melihat dari mana datanya berasal.

| # | Layar | Yang ditunjukkan | Kalimat pembuka |
|---|-------|------------------|-----------------|
| 1 | **Beranda** | Skala: 1.063 atlet, 74 perguruan, 18 kecamatan | "Ini yang selama ini tidak pernah terdata." |
| 2 | **Atlet** | Panggilan arena real-time, kartu QR, daftar 1 klik, rapor, portofolio | "Andi, 16 tahun, sedang menunggu giliran di Jakabaring." |
| 3 | **Panitia** | Antrian matras, tombol panggil, mode luring, check-in QR | "Panitia menekan satu tombol — Andi langsung tahu." |
| 4 | **Perguruan** | Binaan, kelengkapan data, pendaftaran kolektif | "Pengurus tidak perlu lagi mengumpulkan fotokopi." |
| 5 | **Pemkot & KORMI** | Peta sebaran bakat, peringkat kecamatan, statistik event | "Dan inilah yang selama ini tidak bisa dilihat siapa pun." |

**Momen paling kuat:** buka layar Atlet dan Panitia berdampingan di dua
perangkat. Tekan "Panggil peserta berikutnya" di panel panitia — status di
layar atlet berubah.

## ⚠️ Yang disimulasikan (belum sungguhan)

Seluruh data adalah **data contoh**. Nama atlet fiktif. Nama perguruan
nasional dipakai karena organisasi itu memang ada di Palembang, tetapi
seluruh atributnya — pengurus, tahun berdiri, jumlah anggota, kecamatan
kedudukan — dikarang untuk keperluan demo dan tidak berasal dari sumber
resmi organisasi mana pun. Bilah atas menandai ini secara permanen agar
tidak ada salah paham saat presentasi.

| Fitur | Status demo |
|---|---|
| Verifikasi Dukcapil | Lencana "terverifikasi" masih simulasi — akses via Pemkot sudah dipastikan tersedia, PKS belum berjalan |
| OTP WhatsApp | Belum ada — login dilewati untuk demo |
| Basis data | Statik di `src/data/`, belum di Postgres |
| Sinkronisasi luring | Tombol "Simulasikan koneksi putus" memperagakan perilaku, belum ada lapisan sinkronisasi sungguhan |

Jangan menjanjikan keempatnya sebagai sudah jalan. Tunjukkan sebagai alur.

## 🧭 Keputusan desain dari bedah kelayakan

Prototipe ini bukan sekadar tampilan — beberapa keputusan struktural sudah
mengikuti temuan dokumen bedah kelayakan, supaya bisa dilanjutkan ke
produksi tanpa ditulis ulang.

- **NIK tidak disimpan** (`src/lib/types.ts`). Karena akses verifikasi
  Dukcapil tersedia, yang perlu disimpan hanya status verifikasi dan hash
  untuk deteksi duplikat. Aset paling berisiko hilang tanpa kehilangan manfaatnya.
- **Wali sebagai bagian model atlet**. Umur minimum 12 tahun berarti
  mayoritas pengguna adalah anak; UU PDP mewajibkan persetujuan wali.
- **Penilaian sebagai baris, bukan kolom** (`src/data/penilaian.ts`). Aspek
  inti wajib sama di semua event agar tren lintas-event mungkin; aspek
  ekstensi bebas per penyelenggara. Tanpa pemisahan ini, janji "tren nilai
  historis" tidak bisa ditepati.
- **Pendaftaran dibantu** (`didaftarkanOleh`). Karena semua event diwajibkan
  pindah ke aplikasi, harus ada jalur bagi atlet tanpa ponsel.
- **Mode luring pada panel panitia**. Koneksi di GOR tidak bisa diandalkan.

## 📁 Struktur Repo

```
src/
├── app/
│   ├── page.tsx          # beranda & pengalih peran
│   ├── atlet/            # kartu anggota, event, rapor, portofolio
│   ├── perguruan/        # binaan & pendaftaran kolektif
│   ├── panitia/          # antrian arena & check-in
│   └── pemkot/           # dashboard kota
├── components/
│   ├── DemoBar.tsx       # pengalih peran
│   ├── charts.tsx        # grafik tren & peta sebaran
│   └── ui.tsx            # komponen bersama
├── data/                 # data contoh (atlet, perguruan, event, penilaian, wilayah)
└── lib/types.ts          # model data
```

## 🚀 Quickstart

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## ✅ Status

- [x] Empat peran (Atlet, Panitia, Perguruan, Pemkot/KORMI) dengan pengalih demo
- [x] Model data mengikuti temuan bedah kelayakan (NIK, wali, penilaian per-baris)
- [x] Palet grafik tervalidasi buta warna
- [ ] Verifikasi Dukcapil (PKS belum berjalan)
- [ ] OTP WhatsApp
- [ ] Backend Postgres + Prisma (masih statik di `src/data/`)
- [ ] Sinkronisasi luring sungguhan
- [ ] Hosting produksi di wilayah Indonesia (wajib — status PSE Lingkup Publik, PP 71/2019 Pasal 20)

## 🧱 Stack

Next.js 16 · React 19 · Tailwind 4 · TypeScript · qrcode.react

**Catatan teknis:**
- Palet seri grafik divalidasi untuk buta warna (ΔE 15,5 pada deuteranopia).
- Peta melabeli 15 dari 18 kecamatan; tiga terkecil muncul saat kursor
  diarahkan, agar label tidak bertumpuk di kluster tengah.
- Saat masuk produksi, `src/data/` diganti Postgres + Prisma, dan **hosting
  wajib di wilayah Indonesia** karena sistem ini akan berstatus PSE Lingkup
  Publik (PP 71/2019 Pasal 20).

---

<div align="center">
<sub>© 2026 Arah Karya Sinergi (AKS)</sub>
</div>
