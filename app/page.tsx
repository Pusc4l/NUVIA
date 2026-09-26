'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheck
} from 'lucide-react';

interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  aqi: number;
  pm25: number;
  pm10: number;
  so2: number;
  isRealLocation: boolean;
}

// Daftar Puluhan Kota Besar Indonesia
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
  { name: 'South Jakarta', province: 'DKI Jakarta', lat: -6.2615, lon: 106.8106 },
  { name: 'Bogor', province: 'Jawa Barat', lat: -6.5971, lon: 106.7949 },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', lat: -7.7956, lon: 110.3695 },
  { name: 'Denpasar', province: 'Bali', lat: -8.6705, lon: 115.2126 },
  { name: 'Malang', province: 'Jawa Timur', lat: -7.9666, lon: 112.6326 },
  { name: 'Batam', province: 'Kepulauan Riau', lat: 1.1301, lon: 104.0529 },
  { name: 'Pekanbaru', province: 'Riau', lat: 0.5071, lon: 101.4478 },
  { name: 'Bandar Lampung', province: 'Lampung', lat: -5.4500, lon: 105.2667 },
  { name: 'Padang', province: 'Sumatera Barat', lat: -0.9471, lon: 100.4172 },
  { name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lon: 109.3425 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3194, lon: 114.5908 },
  { name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.5022, lon: 117.1536 },
  { name: 'Manado', province: 'Sulawesi Utara', lat: 1.4748, lon: 124.8428 },
  { name: 'Mataram', province: 'Nusa Tenggara Barat', lat: -8.5833, lon: 116.1167 },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', lat: -10.1772, lon: 123.6070 },
  { name: 'Jayapura', province: 'Papua', lat: -2.5489, lon: 140.7182 },
  { name: 'Ambon', province: 'Maluku', lat: -3.6954, lon: 128.1814 },
];

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

  const [data, setData] = useState<WeatherData>({
    city: 'Jakarta Selatan',
    temp: 31,
    humidity: 68,
    windSpeed: 12,
    visibility: 9,
    aqi: 88,
    pm25: 32.4,
    pm10: 54.1,
    so2: 14.2,
    isRealLocation: false
  });

  // Effect untuk durasi Splash Screen
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOutSplash(true);
    }, 2000); // 2 Detik Tampil

    const timer2 = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 0.5 Detik Animasi Fade-out

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Fetch Open-Meteo Real-Time
  const fetchRealData = async (lat: number, lon: number, locationName?: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
      const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,sulphur_dioxide`;

      const [weatherRes, airRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(airUrl)
      ]);

      const wData = await weatherRes.json();
      const aData = await airRes.json();

      const currentW = wData.current || {};
      const currentA = aData.current || {};

      setData({
        city: locationName || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
        temp: Math.round(currentW.temperature_2m ?? 30),
        humidity: currentW.relative_humidity_2m ?? 70,
        windSpeed: Math.round(currentW.wind_speed_10m ?? 10),
        visibility: 10,
        aqi: currentA.us_aqi ?? 50,
        pm25: currentA.pm2_5 ?? 15,
        pm10: currentA.pm10 ?? 25,
        so2: currentA.sulphur_dioxide ?? 5,
        isRealLocation: true
      });
      setIsCityModalOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal mengambil data cuaca real-time.');
    } finally {
      setLoading(false);
    }
  };

  // Search Geocoding City
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

  // GPS Location Trigger
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
        new Notification('AirShield Alert Aktif', { 
          body: 'Notifikasi siap memberi tahu kondisi cuaca & kualitas udara buruk.' 
        });
      }
    }
  };

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Sangat Baik', color: 'bg-emerald-500', text: 'text-emerald-500', cardBg: 'from-emerald-500/15 to-teal-500/5 border-emerald-500/30' };
    if (aqi <= 100) return { label: 'Sedang', color: 'bg-sky-500', text: 'text-sky-500', cardBg: 'from-sky-500/15 to-blue-500/5 border-sky-500/30' };
    if (aqi <= 150) return { label: 'Tidak Sehat (Sensitif)', color: 'bg-amber-500', text: 'text-amber-500', cardBg: 'from-amber-500/15 to-orange-500/5 border-amber-500/30' };
    return { label: 'Sangat Tidak Sehat', color: 'bg-rose-500', text: 'text-rose-500', cardBg: 'from-rose-500/15 to-pink-500/5 border-rose-500/30' };
  };

  const aqiStatus = getAqiStatus(data.aqi);

  const filteredCities = INDONESIA_CITIES.filter(c => 
    c.name.toLowerCase().includes(cityFilter.toLowerCase()) || 
    c.province.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans flex justify-center antialiased ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-200 text-slate-800'
    }`}>
      
      {/* 🌟 INTRO SPLASH SCREEN SCENE 🌟 */}
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
          fadeOutSplash ? 'opacity-0' : 'opacity-100'
        } bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-700 text-white`}>
          <div className="text-center px-6 flex flex-col items-center">
            {/* Animated Logo Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-ping"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl">
                <CloudSun className="w-20 h-20 text-amber-300 animate-bounce duration-[2000ms]" />
              </div>
            </div>

            {/* App Name & Tagline */}
            <h1 className="text-3xl font-black tracking-wider flex items-center justify-center space-x-2">
              <span>AIRSHIELD</span>
              <ShieldCheck className="w-7 h-7 text-amber-300" />
            </h1>
            <p className="text-xs text-blue-100 mt-2 font-medium tracking-wide">
              Smart Weather & Air Quality Monitoring
            </p>

            {/* Loading Indicator */}
            <div className="mt-8 flex items-center space-x-2 text-xs font-semibold text-blue-100/80">
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>Memuat sistem cuaca...</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Frame Container */}
      <div className={`w-full max-w-md min-h-screen flex flex-col justify-between shadow-2xl relative transition-colors duration-300 border-x pb-20 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        
        {/* Top Header Card */}
        <div>
          <div className={`p-5 rounded-b-[2.5rem] shadow-xl transition-all duration-500 relative overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/50' 
              : 'bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 text-white'
          }`}>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

            {/* Header Action Bar */}
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
                    <MapPin className="w-4 h-4 text-amber-300 animate-bounce" />
                    <span className="text-base font-bold tracking-wide">{data.city}</span>
                  </div>
                  <p className="text-[10px] text-blue-100/90 font-medium">
                    {data.isRealLocation ? '• Data Real-Time Terhubung' : '• Lokasi Default'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full transition-all duration-200 active:scale-90 text-white"
                  title="Ganti Mode Tampilan"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-100" />}
                </button>

                <button 
                  onClick={handleNotifToggle}
                  className={`p-2 rounded-full border transition-all duration-200 active:scale-90 ${
                    notifActive ? 'bg-white text-blue-600 border-white shadow-md' : 'bg-white/10 border-white/20 text-white'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Pencarian Kota */}
            <form onSubmit={handleSearchCity} className="relative z-10 mb-3">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama kota/wilayah..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white/15 text-white placeholder-blue-100/70 border border-white/20 focus:outline-none focus:bg-white/25 backdrop-blur-md transition-all shadow-inner"
                />
                <Search className="w-3.5 h-3.5 text-blue-100 absolute left-3 pointer-events-none" />
                {loading && <Loader2 className="w-3.5 h-3.5 text-white animate-spin absolute right-3" />}
              </div>
            </form>

            {/* Hero Card Visual Cuaca */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shadow-lg relative z-10 transition-all duration-300">
              {loading ? (
                <div className="py-8 flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 text-amber-300 animate-spin" />
                  <span className="text-xs font-medium text-blue-100">Memuat data cuaca {data.city}...</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-center items-center space-x-5 my-1">
                    <CloudSun className="w-20 h-20 text-amber-300 drop-shadow-xl animate-pulse duration-[3000ms]" />
                    <div className="text-left">
                      <div className="text-5xl font-black tracking-tight drop-shadow-md">{data.temp}°</div>
                      <p className="text-xs text-blue-100 font-semibold tracking-wide flex items-center space-x-1 mt-0.5">
                        <span>Cerah Berawan</span>
                        <Sparkles className="w-3 h-3 text-amber-200" />
                      </p>
                    </div>
                  </div>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
                    <div className="bg-black/15 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[10px] text-blue-100/80 block font-medium">AQI Udara</span>
                      <span className="font-bold text-amber-200">{data.aqi}</span>
                    </div>
                    <div className="bg-black/15 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[10px] text-blue-100/80 block font-medium">Kelembapan</span>
                      <span className="font-bold">{data.humidity}%</span>
                    </div>
                    <div className="bg-black/15 rounded-xl p-2 backdrop-blur-xs">
                      <span className="text-[10px] text-blue-100/80 block font-medium">Laju Angin</span>
                      <span className="font-bold">{data.windSpeed} km/h</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="p-4 space-y-5">

            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900 text-center animate-shake">
                {errorMsg}
              </p>
            )}

            {/* TAB 1: PRAKIRAAN CUACA */}
            {activeTab === 'cuaca' && (
              <div className="space-y-5 animate-fadeIn">
                
                {/* Visual Hourly Forecast */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prakiraan Per-Jam</h3>
                    <span className="text-[10px] text-sky-500 font-semibold">Hari Ini</span>
                  </div>
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                    {[
                      { time: 'Sekarang', temp: `${data.temp}°`, icon: CloudSun, active: true },
                      { time: '13:00', temp: `${data.temp + 1}°`, icon: SunMedium, active: false },
                      { time: '15:00', temp: `${data.temp}°`, icon: Cloud, active: false },
                      { time: '17:00', temp: `${data.temp - 2}°`, icon: CloudRain, active: false },
                      { time: '19:00', temp: `${data.temp - 3}°`, icon: Cloud, active: false },
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`flex-shrink-0 p-3 rounded-2xl border w-20 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 ${
                          item.active 
                            ? 'bg-gradient-to-b from-sky-500 to-blue-600 border-sky-400 text-white shadow-sky-500/20' 
                            : isDarkMode 
                              ? 'bg-slate-800/80 border-slate-700/80 text-slate-200' 
                              : 'bg-white border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <span className={`text-[10px] font-medium block ${item.active ? 'text-blue-100' : 'text-slate-400'}`}>
                          {item.time}
                        </span>
                        <item.icon className={`w-6 h-6 mx-auto my-2 ${item.active ? 'text-amber-300' : 'text-sky-500'}`} />
                        <span className="text-xs font-bold">{item.temp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prakiraan 5 Hari - Visual Card Baru */}
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prakiraan 5 Hari Ke Depan</h3>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className={`p-4 rounded-2xl border space-y-3 shadow-sm ${
                    isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                  }`}>
                    {[
                      { day: 'Besok', desc: 'Cerah Berawan', min: data.temp - 2, max: data.temp + 2, color: 'bg-amber-400', icon: CloudSun },
                      { day: 'Lusa', desc: 'Hujan Ringan', min: data.temp - 3, max: data.temp, color: 'bg-blue-400', icon: CloudRain },
                      { day: 'Sabtu', desc: 'Berawan Tebal', min: data.temp - 4, max: data.temp - 1, color: 'bg-slate-400', icon: Cloud },
                      { day: 'Minggu', desc: 'Cerah Terang', min: data.temp - 1, max: data.temp + 3, color: 'bg-amber-500', icon: SunMedium },
                    ].map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b last:border-b-0 border-slate-100 dark:border-slate-700/50">
                        <div className="w-20 font-bold flex items-center space-x-2">
                          <d.icon className="w-4 h-4 text-sky-500 flex-shrink-0" />
                          <span>{d.day}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 w-28">{d.desc}</span>
                        
                        {/* Visual Range Bar Suhu */}
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400">{d.min}°</span>
                          <div className="w-12 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full ${d.color} rounded-full`} style={{ width: '70%' }}></div>
                          </div>
                          <span className="font-bold">{d.max}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rincian Cuaca Cards */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Rincian Detail</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center space-x-3 transition-all hover:scale-[1.02] ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                    }`}>
                      <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
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

                    <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center space-x-3 transition-all hover:scale-[1.02] ${
                      isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                    }`}>
                      <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                        <Thermometer className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Sensasi Suhu</span>
                        <span className="text-sm font-bold">{data.temp + 2}°C</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tombol Cek Kota Lain Baru */}
                <button
                  onClick={() => setIsCityModalOpen(true)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all active:scale-95 shadow-md ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 border-sky-500 text-white hover:brightness-110' 
                      : 'bg-gradient-to-r from-blue-600 to-sky-500 border-blue-400 text-white hover:brightness-105'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Cek Kota Lain di Indonesia ({INDONESIA_CITIES.length}+ Kota)</span>
                </button>

              </div>
            )}

            {/* TAB 2: KUALITAS UDARA */}
            {activeTab === 'aqi' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`p-4 rounded-2xl border shadow-md bg-gradient-to-br ${aqiStatus.cardBg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Status Air Quality Index</span>
                    <span className={`text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full ${aqiStatus.color}`}>
                      {aqiStatus.label}
                    </span>
                  </div>
                  <div className="text-4xl font-black mb-1">{data.aqi} <span className="text-xs font-normal opacity-70">AQI</span></div>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {data.aqi > 100 
                      ? 'Terdapat konsentrasi polutan tinggi. Disarankan memakai masker N95 apabila beraktivitas di luar rumah.'
                      : 'Kualitas udara sangat baik, aman dan sehat untuk aktivitas luar ruangan.'}
                  </p>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rincian Polutan</h3>
                <div className={`p-4 rounded-2xl border space-y-4 shadow-xs ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200/80'
                }`}>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold">PM2.5 (Debu Halus)</span>
                      <span className="font-bold">{data.pm25} µg/m³</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(data.pm25 * 2, 100)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold">PM10 (Abu/Debu Kasar)</span>
                      <span className="font-bold">{data.pm10} µg/m³</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(data.pm10, 100)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold">SO2 (Sulfur Gas)</span>
                      <span className="font-bold">{data.so2} µg/m³</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(data.so2 * 3, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PERINGATAN DINI */}
            {activeTab === 'alert' && (
              <div className="space-y-4 animate-fadeIn">
                <div className={`border rounded-2xl p-4 shadow-sm ${
                  isDarkMode 
                    ? 'bg-amber-950/30 border-amber-800/50 text-amber-200' 
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h4 className="font-bold text-sm">Panduan Keselamatan Udara</h4>
                  </div>
                  <ul className="text-xs space-y-2.5 opacity-90 pl-1">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Gunakan masker saat berada di luar ruangan jika AQI berada di atas 100.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Gunakan pemurni udara (Air Purifier) di dalam ruangan jika perlu.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Aktifkan lonceng notifikasi untuk mendapatkan peringatan bahaya polusi otomatis.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL BOTTOM SHEET DAFTAR KOTA */}
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
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:opacity-80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Input inside Modal */}
                <div className="relative mb-3">
                  <input 
                    type="text" 
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    placeholder="Filter nama kota atau provinsi..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>

                {/* City List Grid */}
                <div className="overflow-y-auto max-h-[55vh] pr-1 space-y-2">
                  {filteredCities.map((city, idx) => (
                    <div 
                      key={idx}
                      onClick={() => fetchRealData(city.lat, city.lon, city.name)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-98 ${
                        isDarkMode 
                          ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/80 hover:border-sky-500' 
                          : 'bg-slate-50 border-slate-200/80 hover:bg-sky-50 hover:border-sky-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs block">{city.name}</span>
                        <span className="text-[10px] text-slate-400">{city.province}</span>
                      </div>
                      <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Mobile Navigation Bar */}
        <div className={`fixed bottom-0 w-full max-w-md border-t px-6 py-3 flex justify-between items-center z-40 transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900/95 border-slate-800 backdrop-blur-md' : 'bg-white/95 border-slate-200 backdrop-blur-md'
        }`}>
          <button 
            onClick={() => setActiveTab('cuaca')}
            className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${
              activeTab === 'cuaca' ? 'text-sky-500 font-bold' : 'text-slate-400'
            }`}
          >
            <CloudSun className="w-5 h-5" />
            <span className="text-[10px]">Cuaca</span>
          </button>

          <button 
            onClick={() => setActiveTab('aqi')}
            className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${
              activeTab === 'aqi' ? 'text-sky-500 font-bold' : 'text-slate-400'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px]">Kualitas Udara</span>
          </button>

          <button 
            onClick={() => setActiveTab('alert')}
            className={`flex flex-col items-center space-y-1 transition-all active:scale-95 ${
              activeTab === 'alert' ? 'text-sky-500 font-bold' : 'text-slate-400'
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