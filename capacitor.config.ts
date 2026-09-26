import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.airshield.app',
  appName: 'AirShield',
  webDir: 'out' // 👈 Wajib 'out' karena Next.js static export meletakkan hasilnya di folder out
};

export default config;