# 🛡️ AirShield — Air Quality & Hazard Tracker

**AirShield** adalah aplikasi pemantau kualitas udara dan peringatan bahaya lingkungan secara *real-time*. Didesain dengan antarmuka modern yang responsif, performa tinggi, serta arsitektur *cross-platform* yang mendukung akses Web, Progressive Web App (PWA), hingga Aplikasi Android Native.

---

## 🚀 Akses & Demo Aplikasi

* **Web Live (Vercel):** [airshield-app.vercel.app](https://airshield-app.vercel.app)
* **PWA Experience:** Buka tautan di atas melalui browser mobile (Google Chrome / Safari), lalu pilih **"Add to Home Screen"** atau **"Install Application"** untuk memasangnya di menu HP tanpa perlu mengunduh dari toko aplikasi.

---

## ✨ Fitur Unggulan

* 🌬️ **Real-Time Air Quality Index (AQI):** Menampilkan indeks kualitas udara akurat berbasis lokasi pengguna secara otomatis.
* ⚠️ **Hazard Alerts & Risk Analysis:** Notifikasi dan kriteria risiko kesehatan terkait polusi udara.
* 📱 **PWA & Android Native Support:** Aplikasi dapat diakses fleksibel sebagai situs web statis, aplikasi web terinstal, maupun file paket Android (`.apk`).
* ⚡ **High Performance & Responsive UI:** Menggunakan skema desain modern berbasis Next.js App Router dan Tailwind CSS yang ringan dan cepat.

---

## 🛠️ Tech Stack & Arsitektur

| Kategori | Teknologi / Library |
| :--- | :--- |
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router, TypeScript) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) |
| **PWA Engine** | `@ducanh2912/next-pwa` |
| **Mobile Integration** | [Capacitor](https://capacitorjs.com/) (Android Bridge) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Automated Build (CI/CD)** | [GitHub Actions](https://github.com/features/actions) |

---

## 💻 Panduan Pengembangan Lokal (Development)

Bagi yang ingin mengkloning dan menjalankan proyek ini di lingkungan lokal:

### 1. Prasyarat
* [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
* `npm` / `pnpm` / `yarn`

### 2. Kloning Repositori & Instalasi
```bash
# Clone repositori
git clone [https://github.com/Pusc4l/airshield-app.git](https://github.com/Pusc4l/airshield-app.git)
cd airshield-app

# Install dependensi
npm install