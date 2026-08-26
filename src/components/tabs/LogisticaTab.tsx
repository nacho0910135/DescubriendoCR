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
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Calculator,
  Download
} from 'lucide-react';
import { SmartRecommenderSection } from '../logistics/SmartRecommenderSection';
import { FerryTransportSection } from '../logistics/FerryTransportSection';
import { SafetyEmergencySection } from '../logistics/SafetyEmergencySection';
import { TipSinpeCalculatorSection } from '../logistics/TipSinpeCalculatorSection';
import { OfflineDestinationsSection } from '../logistics/OfflineDestinationsSection';

type LogisticsSection = 'recomendar' | 'ferries' | 'tides_weather' | 'seguridad' | 'sinpe_calc' | 'offline' | 'roads';

export const LogisticaTab: React.FC = () => {
  const { formatPrice, language, t } = useApp();
  const [section, setSection] = useState<LogisticsSection>('recomendar');
  const isEs = language === 'es';

  return (
    <div id="tab-logistica" className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-900 p-6 text-white overflow-hidden shadow-xl border border-teal-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Navigation className="w-4 h-4 text-teal-400" />
            <span>{isEs ? 'Logística, Clima & Recomendador Inteligente' : 'Logistics, Weather & Smart Recommender'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white mb-2">
            {t('logistics.title')}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            {isEs 
              ? 'Horarios oficiales de ferri, mareas CIMAR con alertas de cruce, microclimas, seguridad turística y planificador de rutas.'
              : 'Official ferry timetables, CIMAR tides with crossing alerts, weather forecasts, tourist safety, and route planner.'}
          </p>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800">
        {[
          { key: 'recomendar', label_es: '🎯 Qué Hacer Hoy (IA)', label_en: '🎯 What to Do Today (AI)' },
          { key: 'ferries', label_es: '🚢 Ferries & Transporte', label_en: '🚢 Ferries & Transport' },
          { key: 'tides_weather', label_es: '🌊 Mareas & Clima', label_en: '🌊 Tides & Weather' },
          { key: 'seguridad', label_es: '🛡️ Safe Travel & 911', label_en: '🛡️ Safe Travel & 911' },
          { key: 'sinpe_calc', label_es: '💵 Propina & SINPE', label_en: '💵 Tip & SINPE' },
          { key: 'offline', label_es: '📥 Guardados Offline', label_en: '📥 Offline Saved' },
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

      {/* 1. SMART RECOMMENDER SECTION */}
      {section === 'recomendar' && <SmartRecommenderSection />}

      {/* 2. FERRIES & TRANSPORT SECTION */}
      {section === 'ferries' && <FerryTransportSection />}

      {/* 3. TIDES & WEATHER SECTION */}
      {section === 'tides_weather' && (
        <div className="space-y-6">
          
          {/* CIMAR Tides */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{t('logistics.tides')}</span>
              </h2>
              <span className="text-[11px] text-stone-500 font-mono">
                CIMAR - UCR (Caché TanStack)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                  {tide.is_coastal_hazard && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 text-xs space-y-1">
                      <div className="flex items-start gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{isEs ? tide.hazard_warning_es : tide.hazard_warning_en}</span>
                      </div>
                      {tide.safe_window_es && (
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">
                          {isEs ? tide.safe_window_es : tide.safe_window_en}
                        </p>
                      )}
                    </div>
                  )}

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

          {/* Microclimates Weather Forecast */}
          <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-amber-500" />
                <span>{t('logistics.weather')}</span>
              </h2>
              <span className="text-[11px] text-stone-500 font-mono">
                IMN Costa Rica & Open-Meteo
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

        </div>
      )}

      {/* 4. SAFE TRAVEL & EMERGENCY SECTION */}
      {section === 'seguridad' && <SafetyEmergencySection />}

      {/* 5. TIP & SINPE SECTION */}
      {section === 'sinpe_calc' && <TipSinpeCalculatorSection />}

      {/* 6. OFFLINE SAVED DESTINATIONS */}
      {section === 'offline' && <OfflineDestinationsSection />}

      {/* 7. HIGHWAY ALERTS MOPT */}
      {section === 'roads' && (
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
