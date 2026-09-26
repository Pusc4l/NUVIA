'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Eye, 
  MapPin, 
  Navigation, 
  Bell, 
  ShieldAlert, 
  Thermometer,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
  Sparkles,
  Search,
  Calendar,
  X,
  Building2,
  CloudRain,
  Cloud,
  SunMedium,
  Loader2,
  ShieldCheck,
  Flame,
  DoorClosed,
  DoorOpen,
  Footprints,
  Baby,
  SunDim,
  Info,
  Clock,
  Clock3,
  AlertOctagon
} from 'lucide-react';

interface HourlyItem {
  time: string;
  temp: number;
}

interface DailyItem {
  dayName: string;
  dateStr: string;
  desc: string;
  min: number;
  max: number;
  color: string;
  icon: any;
}

interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  ispu: number;
  pm25: number;
  pm10: number;
  so2: number;
  isRealLocation: boolean;
  hourly: HourlyItem[];
  daily: DailyItem[];
}

interface UrgentAlert {
  id: string;
  event: string;
  urgency: 'Tinggi' | 'Sedang';
  severityLevel: 'DARURAT' | 'WASPADA';
  affectedArea: string;
  validity: string;
  summary: string;
  actions: string[];
}

const INDONESIA_CITIES = [
  { name: 'Jakarta', province: 'DKI Jakarta', lat: -6.2088, lon: 106.8456 },
  { name: 'Surabaya', province: 'Jawa Timur', lat: -7.2575, lon: 112.7521 },
  { name: 'Bandung', province: 'Jawa Barat', lat: -6.9175, lon: 107.6191 },
  { name: 'Medan', province: 'Sumatera Utara', lat: 3.5952, lon: 98.6722 },
  { name: 'Semarang', province: 'Jawa Tengah', lat: -6.9667, lon: 110.4167 },
  { name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lon: 119.4327 },
  { name: 'Palembang', province: 'Sumatera Selatan', lat: -2.9761, lon: 104.7754 },
  { name: 'Tangerang', province: 'Banten', lat: -6.1783, lon: 106.6319 },
  { name: 'Depok', province: 'Jawa Barat', lat: -6.4025, lon: 106.7942 },
  { name: 'Bekasi', province: 'Jawa Barat', lat: -6.2383, lon: 106.9756 },
  { name: 'Jakarta Selatan', province: 'DKI Jakarta', lat: -6.2615, lon: 106.8106 },
  { name: 'Bogor', province: 'Jawa Barat', lat: -6.5971, lon: 106.7949 },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', lat: -7.7956, lon: 110.3695 },
  { name: 'Denpasar', province: 'Bali', lat: -8.6705, lon: 115.2126 },
  { name: 'Malang', province: 'Jawa Timur', lat: -7.9666, lon: 112.6326 },
  { name: 'Batam', province: 'Kepulauan Riau', lat: 1.1301, lon: 104.0529 },
  { name: 'Pekanbaru', province: 'Riau', lat: 0.5071, lon: 101.4478 },
  { name: 'Bandar Lampung', province: 'Lampung', lat: -5.4500, lon: 105.2667 },
  { name: 'Padang', province: 'Sumatera Barat', lat: -0.9471, lon: 100.4172 },
  { name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lon: 109.3425 },
  { name: 'Palangkaraya', province: 'Kalimantan Tengah', lat: -2.2083, lon: 113.9167 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3194, lon: 114.5908 },
  { name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.5022, lon: 117.1536 },
  { name: 'Manado', province: 'Sulawesi Utara', lat: 1.4748, lon: 124.8428 },
  { name: 'Mataram', province: 'Nusa Tenggara Barat', lat: -8.5833, lon: 116.1167 },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', lat: -10.1772, lon: 123.6070 },
  { name: 'Jayapura', province: 'Papua', lat: -2.5489, lon: 140.7182 },
  { name: 'Ambon', province: 'Maluku', lat: -3.6954, lon: 128.1814 },
];

function calculateIspuFromPM25(pm25: number): number {
  if (pm25 <= 15.5) {
    return Math.round((50 / 15.5) * pm25);
  } else if (pm25 <= 55.4) {
    return Math.round(((100 - 51) / (55.4 - 15.6)) * (pm25 - 15.6) + 51);
  } else if (pm25 <= 150.4) {
    return Math.round(((200 - 101) / (150.4 - 55.5)) * (pm25 - 55.5) + 101);
  } else if (pm25 <= 250.4) {
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  } else if (pm25 <= 500.0) {
    return Math.round(((500 - 301) / (500.0 - 250.5)) * (pm25 - 250.5) + 301);
  }
  return 500;
}

function getWeatherInfo(code: number) {
  if (code === 0) return { desc: 'Cerah Terang', icon: SunMedium, color: 'bg-amber-500' };
  if (code >= 1 && code <= 3) return { desc: 'Cerah Berawan', icon: CloudSun, color: 'bg-teal-400' };
  if (code >= 45 && code <= 48) return { desc: 'Berawan Tebal', icon: Cloud, color: 'bg-slate-400' };
  if (code >= 51 && code <= 67) return { desc: 'Hujan Ringan', icon: CloudRain, color: 'bg-cyan-400' };
  if (code >= 80 && code <= 99) return { desc: 'Hujan Lebat / Badai', icon: CloudRain, color: 'bg-indigo-500' };
  return { desc: 'Berawan', icon: Cloud, color: 'bg-teal-400' };
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOutSplash, setFadeOutSplash] = useState(false);

  const [activeTab, setActiveTab] = useState<'cuaca' | 'aqi' | 'alert'>('cuaca');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifActive, setNotifActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [activeCoords, setActiveCoords] = useState<{ lat: number; lon: number; name: string }>({
    lat: -6.2615, 
    lon: 106.8106, 
    name: 'Jakarta Selatan'
  });

  const [data, setData] = useState<WeatherData>({
    city: 'Jakarta Selatan',
    temp: 0,
    humidity: 0,
    windSpeed: 0,
    visibility: 10,
    uvIndex: 0,
    ispu: 0,
    pm25: 0,
    pm10: 0,
    so2: 0,
    isRealLocation: false,
    hourly: [],
    daily: []
  });

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOutSplash(true), 2000);
    const timer2 = setTimeout(() => setShowSplash(false), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const fetchRealData = useCallback(async (lat: number, lon: number, locationName?: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const resolvedName = locationName || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      let finalPm25: number | null = null;
      let isDataFromBMKG = false;

      try {
        const bmkgRes = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/kualitas_udara_pm25.json', {
          next: { revalidate: 300 }
        });
        if (bmkgRes.ok) {
          const bmkgData: any = await bmkgRes.json();
          const cleanName = resolvedName.toLowerCase();
          const matchStation = bmkgData?.stasiun?.find((s: any) => {
            const stName = s.nama_stasiun?.toLowerCase() || '';
            return stName.includes(cleanName) || cleanName.includes(stName);
          });

          if (matchStation && matchStation.pm25_val) {
            finalPm25 = parseFloat(matchStation.pm25_val);
            isDataFromBMKG = true;
          }
        }
      } catch (e) {
        console.warn('Menggunakan fallback Open-Meteo...', e);
      }

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,sulphur_dioxide,carbon_monoxide&timezone=auto`;

      const [weatherRes, airRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(airUrl)
      ]);

      const wData: any = await weatherRes.json();
      const aData: any = await airRes.json();

      const currentW = wData?.current ?? {};
      const currentA = aData?.current ?? {};

      const pm25Value: number = finalPm25 ?? currentA.pm2_5 ?? 15;
      const calculatedIspu = calculateIspuFromPM25(pm25Value);

      const utcOffsetSeconds = wData?.utc_offset_seconds || 0;
      const now = new Date();
      const localTimeMs = now.getTime() + (now.getTimezoneOffset() * 60000) + (utcOffsetSeconds * 1000);
      const cityLocalTime = new Date(localTimeMs);

      const allHourlyTimes: string[] = wData?.hourly?.time || [];
      const allHourlyTemps: number[] = wData?.hourly?.temperature_2m || [];

      // Cari indeks data waktu yang paling mendekati atau sama dengan waktu lokal saat ini
      const startIndex = allHourlyTimes.findIndex((timeStr: string) => {
        const itemDate = new Date(timeStr);
        return itemDate.getTime() >= cityLocalTime.getTime();
      });

      const effectiveStartIndex = startIndex !== -1 ? startIndex : 0;

      const hourlyList: HourlyItem[] = [];
      // Ambil 8 slot waktu ke depan secara aman
      for (let i = effectiveStartIndex; i < Math.min(effectiveStartIndex + 8, allHourlyTimes.length); i++) {
        const timeStr = allHourlyTimes[i];
        const itemDate = new Date(timeStr);
        const hour = itemDate.getHours();
        
        const isNow = i === effectiveStartIndex;
        hourlyList.push({
          time: isNow ? 'Sekarang' : `${String(hour).padStart(2, '0')}:00`,
          temp: Math.round(allHourlyTemps[i] ?? 30),
        });
      }

      const dailyList: DailyItem[] = [];
      if (wData?.daily?.time) {
        for (let i = 0; i < Math.min(7, wData.daily.time.length); i++) {
          const dateStr = wData.daily.time[i];
          const dateObj = new Date(dateStr);
          
          let dayName = '';
          if (i === 0) {
            dayName = 'Hari Ini';
          } else if (i === 1) {
            dayName = 'Besok';
          } else {
            dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(dateObj);
          }

          const weatherCode = wData.daily.weathercode[i] ?? 0;
          const info = getWeatherInfo(weatherCode);
          const maxTemp = Math.round(wData.daily.temperature_2m_max[i] ?? 30);
          const minTemp = Math.round(wData.daily.temperature_2m_min[i] ?? 23);

          dailyList.push({
            dayName,
            dateStr: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(dateObj),
            desc: info.desc,
            min: minTemp,
            max: maxTemp,
            color: info.color,
            icon: info.icon
          });
        }
      }

      const newCoords = { lat, lon, name: resolvedName };
      setActiveCoords(newCoords);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nuvia_last_city', JSON.stringify(newCoords));
      }

      const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setLastUpdated(nowTimeStr);

      setData({
        city: `${resolvedName}${isDataFromBMKG ? ' (BMKG)' : ''}`,
        temp: Math.round(currentW.temperature_2m ?? 30),
        humidity: currentW.relative_humidity_2m ?? 70,
        windSpeed: Math.round(currentW.wind_speed_10m ?? 10),
        visibility: 10,
        uvIndex: Math.round(currentW.uv_index ?? 3),
        ispu: calculatedIspu,
        pm25: pm25Value,
        pm10: Math.round(currentA.pm10 ?? 25),
        so2: Math.round(currentA.sulphur_dioxide ?? 5),
        isRealLocation: true,
        hourly: hourlyList,
        daily: dailyList
      });
      setIsCityModalOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal mengambil data cuaca real-time.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nuvia_last_city');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setActiveCoords(parsed);
          fetchRealData(parsed.lat, parsed.lon, parsed.name);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetchRealData(activeCoords.lat, activeCoords.lon, activeCoords.name);
  }, [fetchRealData]);

  useEffect(() => {
    const TEN_MINUTES = 10 * 60 * 1000;
    const intervalId = setInterval(() => {
      fetchRealData(activeCoords.lat, activeCoords.lon, activeCoords.name);
    }, TEN_MINUTES);

    return () => clearInterval(intervalId);
  }, [activeCoords.lat, activeCoords.lon, activeCoords.name, fetchRealData]);

  const handleSearchCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=id&format=json`);
      const geoData = await geoRes.json();

      if (geoData.results && geoData.results.length > 0) {
        const target = geoData.results[0];
        await fetchRealData(target.latitude, target.longitude, target.name);
        setSearchQuery('');
      } else {
        setErrorMsg(`Kota "${searchQuery}" tidak ditemukan.`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal mencari lokasi kota.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('GPS tidak didukung oleh browser Anda.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchRealData(pos.coords.latitude, pos.coords.longitude, 'Lokasi Anda (GPS)');
      },
      () => {
        setLoading(false);
        setErrorMsg('Izin lokasi ditolak atau tidak ditemukan.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleNotifToggle = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotifActive(true);
        new Notification('Nuvia Alert Aktif', { 
          body: 'Notifikasi siap memberi tahu kondisi cuaca & kualitas udara buruk.' 
        });
      }
    }
  };

  const getIspuStatus = (ispu: number) => {
    if (ispu <= 50) return { label: 'Baik', color: 'bg-emerald-500', text: 'text-emerald-500', cardBg: 'from-emerald-500/15 to-teal-500/5 border-emerald-500/30' };
    if (ispu <= 100) return { label: 'Sedang', color: 'bg-teal-500', text: 'text-teal-500', cardBg: 'from-teal-500/15 to-cyan-500/5 border-teal-500/30' };
    if (ispu <= 200) return { label: 'Tidak Sehat', color: 'bg-amber-500', text: 'text-amber-500', cardBg: 'from-amber-500/15 to-orange-500/5 border-amber-500/30' };
    if (ispu <= 300) return { label: 'Sangat Tidak Sehat', color: 'bg-rose-500', text: 'text-rose-500', cardBg: 'from-rose-500/15 to-pink-500/5 border-rose-500/30' };
    return { label: 'Berbahaya', color: 'bg-purple-600', text: 'text-purple-600', cardBg: 'from-purple-600/20 to-pink-600/10 border-purple-500/40' };
  };

  const getUvCategory = (uv: number) => {
    if (uv <= 2) return { label: 'Rendah', color: 'text-emerald-500' };
    if (uv <= 5) return { label: 'Sedang', color: 'text-amber-500' };
    if (uv <= 7) return { label: 'Tinggi', color: 'text-orange-500' };
    return { label: 'Extrem', color: 'text-rose-500' };
  };

  const ispuStatus = getIspuStatus(data.ispu);
  const uvCat = getUvCategory(data.uvIndex);

  const filteredCities = INDONESIA_CITIES.filter(c => 
    c.name.toLowerCase().includes(cityFilter.toLowerCase()) || 
    c.province.toLowerCase().includes(cityFilter.toLowerCase())
  );

  const activeAlerts = useMemo<UrgentAlert[]>(() => {
    const alerts: UrgentAlert[] = [];
    const cleanCityName = data.city.replace(/\s*\(BMKG\)$/i, '');

    if (data.ispu > 300) {
      alerts.push({
        id: 'ispu-darurat',
        event: 'Kualitas Udara Berbahaya (ISPU > 300)',
        urgency: 'Tinggi',
        severityLevel: 'DARURAT',
        affectedArea: cleanCityName,
        validity: 'Hingga kualitas udara membaik',
        summary: `Tingkat polusi udara berada pada level krisis (${data.ispu} ISPU). Berpotensi merusak fungsi pernapasan populasi umum secara serius.`,
        actions: [
          'Gunakan masker medis / N95 wajib saat membuka pintu.',
          'Nyalakan Pemurni Udara (Air Purifier) di dalam rumah.',
          'Batasi aktivitas luar ruangan bagi anak-anak dan lansia.'
        ]
      });
    } else if (data.ispu > 150) {
      alerts.push({
        id: 'ispu-waspada',
        event: 'Polusi Udara Tidak Sehat (ISPU > 150)',
        urgency: 'Sedang',
        severityLevel: 'WASPADA',
        affectedArea: cleanCityName,
        validity: '24 Jam Ke Depan',
        summary: `Kandungan konsentrasi partikel PM2.5 tinggi (${data.pm25} µg/m³). Berisiko bagi kelompok sensitif dan penderita asma.`,
        actions: [
          'Pakai masker pelindung standar saat bepergian.',
          'Gunakan filter udara / tutup ventilasi jika asap tebal.'
        ]
      });
    }

    if (data.uvIndex >= 8) {
      alerts.push({
        id: 'uv-ekstrem',
        event: 'Paparan Sinar UV Sangat Tinggi',
        urgency: 'Tinggi',
        severityLevel: 'WASPADA',
        affectedArea: cleanCityName,
        validity: '10:00 - 15:00 WIB',
        summary: `Indeks ultraviolet mencapai angka ${data.uvIndex}. Kerusakan kulit dan mata dapat terjadi dalam waktu singkat.`,
        actions: [
          'Gunakan Tabir Surya (Sunscreen) minimal SPF 30+.',
          'Gunakan kacamata hitam pelindung UV dan topi lebar.'
        ]
      });
    }

    if (data.windSpeed >= 40) {
      alerts.push({
        id: 'angin-kencang',
        event: 'Peringatan Dini Angin Kencang',
        urgency: 'Tinggi',
        severityLevel: 'DARURAT',
        affectedArea: cleanCityName,
        validity: 'Sore - Malam Hari',
        summary: `Kecepatan angin terdeteksi mencapai ${data.windSpeed} km/h. Berpotensi menumbangkan baliho atau dahan pohon tua.`,
        actions: [
          'Hindari berteduh di bawah baliho, baliho iklan, atau pohon besar.',
          'Amankan benda ringan yang mudah terbang di teras rumah.'
        ]
      });
    }

    return alerts.sort((a, b) => {
      if (a.severityLevel === 'DARURAT' && b.severityLevel !== 'DARURAT') return -1;
      if (a.severityLevel !== 'DARURAT' && b.severityLevel === 'DARURAT') return 1;
      return 0;
    });
  }, [data, data.city]);

  const overallStatus = useMemo<'AMAN' | 'WASPADA' | 'DARURAT'>(() => {
    if (activeAlerts.some(a => a.severityLevel === 'DARURAT')) return 'DARURAT';
    if (activeAlerts.some(a => a.severityLevel === 'WASPADA')) return 'WASPADA';
    return 'AMAN';
  }, [activeAlerts]);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans flex justify-center antialiased ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-200 text-slate-800'
    }`}>
      
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
          fadeOutSplash ? 'opacity-0' : 'opacity-100'
        } bg-gradient-to-br from-teal-600 via-cyan-500 to-indigo-800 text-white`}>
          <div className="text-center px-6 flex flex-col items-center">
            {/* Custom Logo NUVIA */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-teal-300/20 rounded-full blur-2xl animate-ping"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center">
                <div className="relative">
                  <CloudSun className="w-16 h-16 text-teal-200" />
                  <Sparkles className="w-6 h-6 text-cyan-300 absolute -top-2 -right-2 animate-bounce" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-widest flex items-center justify-center space-x-2">
              <span>NUVIA</span>
            </h1>
            <p className="text-xs text-teal-100 mt-2 font-medium tracking-wide">
              Smart Weather & Air Quality Monitor
            </p>

            <div className="mt-8 flex items-center space-x-2 text-xs font-semibold text-teal-100/80">
              <Loader2 className="w-4 h-4 animate-spin text-teal-300" />
              <span>Menyiapkan atmosfer bersih...</span>
            </div>
          </div>
        </div>
      )}

      <div className={`w-full max-w-md min-h-screen flex flex-col justify-between shadow-2xl relative transition-colors duration-300 border-x pb-20 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        
        <div>
          {/* Header Card dengan Tema Nuansa Teal & Cyan */}
          <div className={`p-5 rounded-b-[2.5rem] shadow-xl transition-all duration-500 relative overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border-b border-teal-900/50' 
              : 'bg-gradient-to-br from-teal-600 via-cyan-600 to-indigo-700 text-white'
          }`}>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleGetLocation} 
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2.5 rounded-full transition-all duration-200 active:scale-90 flex items-center justify-center shadow-inner"
                  title="Deteksi Lokasi GPS"
                >
                  <Navigation className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-teal-300 animate-bounce" />
                    <span className="text-base font-bold tracking-wide">{data.city}</span>
                  </div>
                  <p className="text-[10px] text-teal-100/90 font-medium">
                    {data.isRealLocation ? '• Data Real-Time Nuvia' : '• Memuat Data...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Logo Mini Branding NUVIA di Header */}
                <div className="hidden sm:flex items-center space-x-1 bg-white/15 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider backdrop-blur-xs border border-white/20">
                  <Sparkles className="w-3 h-3 text-teal-200" />
                  <span>NUVIA</span>
                </div>

                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full transition-all duration-200 active:scale-90 text-white"
                  title="Ganti Mode Tampilan"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-teal-300" /> : <Moon className="w-4 h-4 text-slate-100" />}
                </button>

                <button 
                  onClick={handleNotifToggle}
                  className={`p-2 rounded-full border transition-all duration-200 active:scale-90 ${
                    notifActive ? 'bg-white text-teal-700 border-white shadow-md' : 'bg-white/10 border-white/20 text-white'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSearchCity} className="relative z-10 mb-3">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari wilayah/kota di Nuvia..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white/15 text-white placeholder-teal-100/70 border border-white/20 focus:outline-none focus:bg-white/25 backdrop-blur-md transition-all shadow-inner"
                />
                <Search className="w-3.5 h-3.5 text-teal-100 absolute left-3 pointer-events-none" />
                {loading && <Loader2 className="w-3.5 h-3.5 text-white animate-spin absolute right-3" />}
              </div>
            </form>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shadow-lg relative z-10 transition-all duration-300">
              {loading ? (
                <div className="py-8 flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 text-teal-300 animate-spin" />
                  <span className="text-xs font-medium text-teal-100">Memuat cuaca {data.city}...</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-center items-center space-x-5 my-1">
                    <CloudSun className="w-20 h-20 text-teal-200 drop-shadow-xl animate-pulse duration-[3000ms]" />
                    <div className="text-left">
                      <div className="text-5xl font-black tracking-tight drop-shadow-md">{data.temp}°</div>
                      <p className="text-xs text-teal-100 font-semibold tracking-wide flex items-center space-x-1 mt-0.5">
                        <span>Cerah Berawan</span>
                        <Sparkles className="w-3 h-3 text-teal-200" />
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-white/15 text-xs">
                    <div className="bg-black/15 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[9px] text-teal-100/80 block font-medium">ISPU (Indo)</span>
                      <span className="font-bold text-teal-200">{data.ispu}</span>
                    </div>
                    <div className="bg-black/15 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[9px] text-teal-100/80 block font-medium">Indeks UV</span>
                      <span className="font-bold text-teal-300">{data.uvIndex}</span>
                    </div>
                    <div className="bg-black/15 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[9px] text-teal-100/80 block font-medium">Kelembapan</span>
                      <span className="font-bold">{data.humidity}%</span>
                    </div>
                    <div className="bg-black/15 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[9px] text-teal-100/80 block font-medium">Laju Angin</span>
                      <span className="font-bold">{data.windSpeed} km/h</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-4 space-y-5">
            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900 text-center">
                {errorMsg}
              </p>
            )}

            {activeTab === 'cuaca' && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prakiraan Per-Jam</h3>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Hari Ini</span>
                  </div>
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                    {data.hourly.map((item, idx) => {
                      const isNow = item.time === 'Sekarang' || idx === 0;
                      return (
                        <div 
                          key={idx} 
                          className={`flex-shrink-0 p-3 rounded-2xl border w-20 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 ${
                            isNow 
                              ? 'bg-gradient-to-b from-teal-600 to-cyan-700 border-teal-500 text-white shadow-teal-500/20' 
                              : isDarkMode 
                                ? 'bg-slate-800/80 border-slate-700/80 text-slate-200' 
                                : 'bg-white border-slate-200/80 text-slate-700'
                          }`}
                        >
                          <span className={`text-[10px] font-medium block ${isNow ? 'text-teal-100' : 'text-slate-400'}`}>
                            {item.time}
                          </span>
                          <CloudSun className={`w-6 h-6 mx-auto my-2 ${isNow ? 'text-teal-200' : 'text-teal-500'}`} />
                          <span className="text-xs font-bold">{item.temp}°</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prakiraan 7 Hari Ke Depan</h3>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className={`p-4 rounded-2xl border space-y-3 shadow-sm ${
                    isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                  }`}>
                    {data.daily.map((d, i) => {
                      const IconComponent = d.icon;
                      return (
                        <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b last:border-b-0 border-slate-100 dark:border-slate-700/50">
                          <div className="w-28 font-bold flex items-center space-x-2">
                            <IconComponent className="w-4 h-4 text-teal-500 flex-shrink-0" />
                            <div>
                              <span>{d.dayName}</span>
                              <span className="block text-[9px] text-slate-400 font-normal">{d.dateStr}</span>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 w-28 truncate">{d.desc}</span>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-slate-400">{d.min}°</span>
                            <div className="w-12 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-full ${d.color} rounded-full`} style={{ width: '70%' }}></div>
                            </div>
                            <span className="font-bold">{d.max}°</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Rincian Detail</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center space-x-3 transition-all hover:scale-[1.02] ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                    }`}>
                      <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                        <SunDim className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Indeks UV</span>
                        <span className="text-sm font-bold">{data.uvIndex} <span className={`text-[10px] ${uvCat.color}`}>({uvCat.label})</span></span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center space-x-3 transition-all hover:scale-[1.02] ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                    }`}>
                      <div className="p-2.5 bg-cyan-500/10 text-cyan-500 rounded-xl">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Kelembapan</span>
                        <span className="text-sm font-bold">{data.humidity}%</span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center space-x-3 transition-all hover:scale-[1.02] ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                    }`}>
                      <div className="p-2.5 bg-teal-500/10 text-teal-500 rounded-xl">
                        <Wind className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Laju Angin</span>
                        <span className="text-sm font-bold">{data.windSpeed} km/h</span>
                      </div>
                    </div>

                    <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center space-x-3 transition-all hover:scale-[1.02] ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                    }`}>
                      <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Jarak Pandang</span>
                        <span className="text-sm font-bold">{data.visibility} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsCityModalOpen(true)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all active:scale-95 shadow-md ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-700 border-teal-500 text-white hover:brightness-110' 
                      : 'bg-gradient-to-r from-teal-600 to-cyan-600 border-teal-500 text-white hover:brightness-105'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Cek Kota Lain di Indonesia ({INDONESIA_CITIES.length}+ Kota)</span>
                </button>

              </div>
            )}

            {activeTab === 'aqi' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`p-4 rounded-2xl border shadow-md bg-gradient-to-br ${ispuStatus.cardBg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Indeks ISPU (Standar Indonesia)</span>
                    <span className={`text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full ${ispuStatus.color}`}>
                      {ispuStatus.label}
                    </span>
                  </div>
                  <div className="text-4xl font-black mb-1">{data.ispu} <span className="text-xs font-normal opacity-70">ISPU (BMKG / KLHK)</span></div>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {data.ispu > 100 
                      ? 'Kualitas udara bersifat tidak sehat. Disarankan memakai masker N95 dan membatasi kegiatan luar ruangan.'
                      : data.ispu > 50 
                        ? 'Kualitas udara dalam kategori sedang. Masih relatif aman namun perhatikan jika sensitif terhadap polusi.'
                        : 'Kualitas udara sangat bersih dan segar untuk seluruh aktivitas.'}
                  </p>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rekomendasi Aktivitas</h3>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className={`p-3 rounded-2xl border flex items-center space-x-2.5 ${isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
                    <Footprints className={`w-4 h-4 flex-shrink-0 ${data.ispu > 100 ? 'text-rose-500' : 'text-teal-500'}`} />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Olahraga Luar</span>
                      <span className="font-bold text-[11px]">{data.ispu > 100 ? 'Sebaiknya Hindari' : 'Aman Beraktivitas'}</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-center space-x-2.5 ${isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
                    {data.ispu > 100 ? <DoorClosed className="w-4 h-4 flex-shrink-0 text-rose-500" /> : <DoorOpen className="w-4 h-4 flex-shrink-0 text-teal-500" />}
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Ventilasi Jendela</span>
                      <span className="font-bold text-[11px]">{data.ispu > 100 ? 'Tutup Rapat' : 'Buka Ventilasi'}</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-center space-x-2.5 ${isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
                    <ShieldAlert className={`w-4 h-4 flex-shrink-0 ${data.ispu > 100 ? 'text-rose-500' : 'text-teal-500'}`} />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Penggunaan Masker</span>
                      <span className="font-bold text-[11px]">{data.ispu > 100 ? 'Wajib Masker N95' : 'Opsional / Bebas'}</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-center space-x-2.5 ${isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
                    <Baby className={`w-4 h-4 flex-shrink-0 ${data.ispu > 50 ? 'text-amber-500' : 'text-teal-500'}`} />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Kelompok Sensitif</span>
                      <span className="font-bold text-[11px]">{data.ispu > 50 ? 'Tetap di Ruangan' : 'Aman Bermain'}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rincian Polutan</h3>
                <div className={`p-4 rounded-2xl border space-y-4 shadow-xs ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                }`}>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold flex items-center space-x-1">
                        <span>PM2.5 (Debu Halus / Asap)</span>
                        {data.pm25 > 55 && <Flame className="w-3 h-3 text-rose-500 animate-pulse" />}
                      </span>
                      <span className="font-bold">{data.pm25} µg/m³</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-700 ${data.pm25 > 55 ? 'bg-rose-500' : data.pm25 > 15 ? 'bg-amber-500' : 'bg-teal-500'}`} 
                        style={{ width: `${Math.min((data.pm25 / 150) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold">PM10 (Abu/Debu Kasar)</span>
                      <span className="font-bold">{data.pm10} µg/m³</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min((data.pm10 / 250) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold">SO2 (Sulfur Gas)</span>
                      <span className="font-bold">{data.so2} µg/m³</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min((data.so2 / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border space-y-2 text-xs leading-relaxed ${
                  isDarkMode ? 'bg-slate-800/40 border-slate-700/50 text-slate-300' : 'bg-teal-50/60 border-teal-100 text-slate-600'
                }`}>
                  <div className="flex items-center space-x-1.5 font-bold text-teal-600 dark:text-teal-400">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Tentang Indeks Standar Pencemar Udara (ISPU)</span>
                  </div>
                  <p className="text-[11px]">
                    Sistem Nuvia dikalkulasi berdasarkan parameter resmi BMKG dan Permen LHK No. P.14/2020.
                  </p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1 text-[11px]">
                    <p><strong className="text-emerald-500">0 - 50 (Baik):</strong> Tidak memberikan dampak buruk bagi kesehatan.</p>
                    <p><strong className="text-teal-500">51 - 100 (Sedang):</strong> Masih aman bagi manusia, namun peka untuk tanaman sensitif.</p>
                    <p><strong className="text-amber-500">101 - 200 (Tidak Sehat):</strong> Merugikan kelompok sensitif.</p>
                    <p><strong className="text-rose-500">201 - 300 (Sangat Tidak Sehat):</strong> Risiko kesehatan serius bagi seluruh populasi.</p>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'alert' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`p-4 rounded-2xl border shadow-md transition-all ${
                  overallStatus === 'DARURAT'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                    : overallStatus === 'WASPADA'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      : 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {overallStatus === 'DARURAT' && <AlertOctagon className="w-5 h-5 text-rose-500 animate-pulse" />}
                      {overallStatus === 'WASPADA' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                      {overallStatus === 'AMAN' && <ShieldCheck className="w-5 h-5 text-teal-500" />}
                      <span className="font-extrabold text-sm tracking-wide">
                        STATUS UTAMA: STATUS {overallStatus}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                      overallStatus === 'DARURAT' ? 'bg-rose-600' : overallStatus === 'WASPADA' ? 'bg-amber-500' : 'bg-teal-600'
                    }`}>
                      {overallStatus}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{data.city.replace(/\s*\(BMKG\)$/i, '')}</span>
                      <div className="flex items-center space-x-1 text-[10px] opacity-75">
                        <Clock className="w-3 h-3" />
                        <span>Diperbarui: {lastUpdated || 'Baru Saja'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {activeAlerts.length === 0 ? (
                  <div className={`p-8 rounded-2xl border text-center space-y-3 ${
                    isDarkMode ? 'bg-slate-800/40 border-slate-700/60 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <div className="w-12 h-12 bg-teal-500/10 text-teal-500 rounded-full flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Tidak ada peringatan aktif</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto font-medium">
                        Kondisi udara dan cuaca di wilayah Anda tergolong bersih & aman. Nikmati harimu dengan tenang!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Peringatan Aktif Perlu Perhatian ({activeAlerts.length})
                      </h3>
                      <span className="text-[10px] font-semibold text-rose-500 animate-pulse">Prioritas Urgent</span>
                    </div>

                    {activeAlerts.map((alert) => {
                      const isHigh = alert.severityLevel === 'DARURAT';
                      return (
                        <div 
                          key={alert.id}
                          className={`p-4 rounded-2xl border shadow-sm transition-all space-y-3 ${
                            isHigh 
                              ? isDarkMode 
                                ? 'bg-rose-950/20 border-rose-800/40 text-rose-200' 
                                : 'bg-rose-50/80 border-rose-200 text-rose-900'
                              : isDarkMode 
                                ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' 
                                : 'bg-amber-50/80 border-amber-200 text-amber-900'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {isHigh ? (
                                <AlertOctagon className="w-5 h-5 text-rose-500 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                              )}
                              <h4 className="font-bold text-sm leading-snug">{alert.event}</h4>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ml-2 ${
                              isHigh ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                            }`}>
                              Urgensi: {alert.urgency}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-black/5 dark:border-white/10 opacity-90">
                            <div>
                              <span className="block opacity-70 font-medium">Wilayah Terdampak:</span>
                              <span className="font-bold">{alert.affectedArea}</span>
                            </div>
                            <div>
                              <span className="block opacity-70 font-medium">Waktu Berlaku:</span>
                              <span className="font-bold">{alert.validity}</span>
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed opacity-90 font-medium">
                            {alert.summary}
                          </p>

                          <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-1.5">
                            <span className="text-[11px] font-bold block uppercase tracking-wide opacity-80">
                              Tindakan Direkomendasikan:
                            </span>
                            <ul className="text-xs space-y-1">
                              {alert.actions.map((act, i) => (
                                <li key={i} className="flex items-start space-x-2 font-medium">
                                  <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isHigh ? 'text-rose-500' : 'text-amber-500'}`} />
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

{isCityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className={`w-full max-w-md h-[80vh] rounded-t-[2rem] p-5 flex flex-col justify-between shadow-2xl transition-all ${
              isDarkMode ? 'bg-slate-900 text-slate-100 border-t border-slate-800' : 'bg-white text-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base">Pilih Kota Indonesia</h3>
                    <p className="text-[11px] text-slate-400">Pilih dari puluhan kota besar di bawah</p>
                  </div>
                  <button 
                    onClick={() => setIsCityModalOpen(false)}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:opacity-80 text-slate-600 dark:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative mb-3">
                  <input 
                    type="text" 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    placeholder="Filter nama kota atau provinsi..."
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>

                <div className="overflow-y-auto max-h-[55vh] pr-1 space-y-2">
                  {filteredCities.map((city, idx) => (
                    <div 
                      key={idx}
                      onClick={() => fetchRealData(city.lat, city.lon, city.name)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-98 ${
                        isDarkMode 
                          ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/80 hover:border-teal-500' 
                          : 'bg-slate-50 border-slate-200/80 hover:bg-teal-50 hover:border-teal-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs block">{city.name}</span>
                        <span className="text-[10px] text-slate-400">{city.province}</span>
                      </div>
                      <MapPin className="w-3.5 h-3.5 text-teal-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`fixed bottom-0 w-full max-w-md border-t px-6 py-3 flex justify-between items-center z-40 transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900/95 border-slate-800 backdrop-blur-md' : 'bg-white/95 border-slate-200 backdrop-blur-md'
        }`}>
          <button 
            onClick={() => setActiveTab('cuaca')}
            className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${
              activeTab === 'cuaca' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-400'
            }`}
          >
            <CloudSun className="w-5 h-5" />
            <span className="text-[10px]">Cuaca</span>
          </button>

          <button 
            onClick={() => setActiveTab('aqi')}
            className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${
              activeTab === 'aqi' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px]">ISPU Udara</span>
          </button>

          <button 
            onClick={() => setActiveTab('alert')}
            className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${
              activeTab === 'alert' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-400'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px]">Peringatan</span>
          </button>
        </div>

      </div>
    </div>
  );
}