# 🛡️ Nuvia — Air Quality & Hazard Tracker

**Nuvia** is a real-time air quality monitoring and environmental hazard alert application. Designed with a modern responsive interface, high performance, and a cross-platform architecture supporting Web access, Progressive Web App (PWA), and Native Android applications.

---

## 🚀 Access & Live Demo

* **Web Live (Vercel):** [nuvia-zeta.vercel.app](https://nuvia-zeta.vercel.app)
* **PWA Experience:** Open the link above via mobile browser (Google Chrome / Safari), then select **"Add to Home Screen"** or **"Install Application"** to install it directly on your phone without downloading from an app store.

---

## ✨ Key Features

* 🌬️ **Real-Time Air Quality Index (AQI):** Displays accurate air quality indexes automatically based on the user's location.
* ⚠️ **Hazard Alerts & Risk Analysis:** Notifications and health risk criteria related to air pollution.
* 📱 **PWA & Android Native Support:** Access the app flexibly as a static website, an installed web app, or an Android package file (`.apk`).
* ⚡ **High Performance & Responsive UI:** Built with a modern design scheme using Next.js App Router and Tailwind CSS for a lightweight and fast experience.

---

## 🛠️ Tech Stack & Architecture

| Category | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router, TypeScript) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) |
| **PWA Engine** | `@ducanh2912/next-pwa` |
| **Mobile Integration** | [Capacitor](https://capacitorjs.com/) (Android Bridge) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Automated Build (CI/CD)** | [GitHub Actions](https://github.com/features/actions) |

---

## 💻 Local Development Guide

For those who want to clone and run this project locally:

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (version 18.x or newer)
* `npm` / `pnpm` / `yarn`

### 2. Clone Repository & Installation
```bash
# Clone the repository
git clone [https://github.com/Pusc4l/nuvia.git](https://github.com/Pusc4l/nuvia.git)
cd nuvia

# Install dependencies
npm install
