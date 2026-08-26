import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MOCK_FERRIES, 
  MOCK_TIDES, 
  MOCK_WEATHER, 
  MOCK_ROAD_ALERTS 
} from '../../data/mockData';
import { 
  Navigation, 
  Waves, 
  CloudSun, 
  AlertTriangle, 
  Ship, 
  Clock, 
  DollarSign, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const LogisticaTab: React.FC = () => {
  const { formatPrice, language, t } = useApp();
  const [section, setSection] = useState<'all' | 'ferries' | 'tides' | 'weather' | 'roads'>('all');
  const isEs = language === 'es';

  return (
    <div id="tab-logistica" className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-900 p-6 text-white overflow-hidden shadow-xl border border-teal-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Navigation className="w-4 h-4 text-teal-400" />
            <span>{isEs ? 'Información Operativa en Tiempo Real' : 'Real-Time Travel Operations'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white mb-2">
            {t('logistics.title')}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            {t('logistics.subtitle')}
          </p>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800">
        {[
          { key: 'all', label_es: 'Todo', label_en: 'All Overview' },
          { key: 'ferries', label_es: '🚢 Ferries & Lanchas', label_en: '🚢 Ferries & Boats' },
          { key: 'tides', label_es: '🌊 Mareas CIMAR', label_en: '🌊 CIMAR Tides' },
          { key: 'weather', label_es: '☀️ Microclimas', label_en: '☀️ Weather Forecast' },
          { key: 'roads', label_es: '🛣️ Carreteras MOPT', label_en: '🛣️ Highway Alerts' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setSection(item.key as any)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              section === item.key
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {isEs ? item.label_es : item.label_en}
          </button>
        ))}
      </div>

      {/* 1. FERRIES SECTION */}
      {(section === 'all' || section === 'ferries') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Ship className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{t('logistics.ferries')}</span>
            </h2>
            <span className="text-[11px] text-stone-500 font-mono">
              {isEs ? 'Tarifas oficiales MOPT' : 'Official MOPT Fares'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_FERRIES.map((ferry, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                      {ferry.operator}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      ferry.status === 'Embarcando'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {ferry.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-stone-900 dark:text-white">
                    {ferry.route}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 mt-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t('logistics.departure')}: <strong>{ferry.departure_time}</strong></span>
                    <span className="text-stone-400">({ferry.duration})</span>
                  </div>
                </div>

                {/* Pricing in dynamic currency ($ / ₡) */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1.5 bg-stone-50 dark:bg-stone-800/40 p-3 rounded-2xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">{t('logistics.fare_passengers')}:</span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                      {formatPrice(ferry.passenger_fee_usd)}
                    </span>
                  </div>

                  {ferry.car_fee_usd > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">{t('logistics.fare_vehicle')}:</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                        {formatPrice(ferry.car_fee_usd)}
                      </span>
                    </div>
                  )}

                  <p className="text-[10px] text-stone-500 dark:text-stone-400 italic pt-1">
                    {isEs ? ferry.notes_es : ferry.notes_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CIMAR TIDES & SWELL */}
      {(section === 'all' || section === 'tides') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <Waves className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{t('logistics.tides')}</span>
            </h2>
            <span className="text-[11px] text-stone-500 font-mono">
              CIMAR - UCR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_TIDES.map((tide, i) => (
              <div
                key={i}
                className="bg-white dark:bg-stone-900 rounded-3xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-400">{tide.region}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                    {tide.surf_condition}
                  </span>
                </div>

                <h3 className="text-sm font-black text-stone-900 dark:text-white">
                  {tide.beach}
                </h3>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center justify-between">
                    <span>{t('logistics.high_tide')}:</span>
                    <span className="font-bold text-blue-700 dark:text-blue-300">{tide.high_tide}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('logistics.low_tide')}:</span>
                    <span className="font-bold text-stone-700 dark:text-stone-300">{tide.low_tide}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-blue-100 dark:border-blue-900/50">
                    <span>{t('logistics.swell')} / Temp:</span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                      {tide.swell_meters}m • {tide.water_temp_c}°C
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MICROCLIMATE WEATHER FORECAST */}
      {(section === 'all' || section === 'weather') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-500" />
              <span>{t('logistics.weather')}</span>
            </h2>
            <span className="text-[11px] text-stone-500 font-mono">
              IMN Costa Rica
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {MOCK_WEATHER.map((w, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 rounded-2xl p-3.5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-400">{w.region}</span>
                  {w.icon_type === 'sun' && <Sun className="w-4 h-4 text-amber-500" />}
                  {w.icon_type === 'cloud-sun' && <CloudSun className="w-4 h-4 text-amber-500" />}
                  {w.icon_type === 'cloud-rain' && <CloudRain className="w-4 h-4 text-blue-500" />}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-stone-900 dark:text-white">{w.zone}</h3>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl font-black text-stone-900 dark:text-white">{w.temp_c}°</span>
                    <span className="text-xs text-stone-500 font-medium">C</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium truncate">
                    {w.condition}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500 font-medium">
                  <span className="flex items-center gap-0.5">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>{w.rain_probability}% lluvia</span>
                  </span>
                  <span>UV: {w.uv_index}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HIGHWAY ALERTS MOPT */}
      {(section === 'all' || section === 'roads') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>{t('logistics.roads')}</span>
            </h2>
            <span className="text-[11px] text-stone-500 font-mono">
              MOPT / Policía de Tránsito
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_ROAD_ALERTS.map(alert => (
              <div
                key={alert.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      {alert.road}
                    </h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      alert.status === 'Abierto'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {alert.section}: {isEs ? alert.reason_es : alert.reason_en}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ↪ {isEs ? 'Ruta alterna recomendada:' : 'Recommended alternate:'} {isEs ? alert.alternate_route_es : alert.alternate_route_en}
                  </p>
                </div>

                <span className="text-[11px] text-stone-400 font-mono shrink-0">
                  {alert.last_updated}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
