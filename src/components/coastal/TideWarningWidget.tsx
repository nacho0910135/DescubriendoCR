import React, { useState } from 'react';
import { 
  Waves, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  ChevronDown, 
  ChevronUp,
  Droplets
} from 'lucide-react';
import { LiveTideData, PlaceSpot } from '../../types';

export interface TideWarningWidgetProps {
  tideData: LiveTideData;
  placeName: string;
  isEs: boolean;
  place?: PlaceSpot;
}

export const TideWarningWidget: React.FC<TideWarningWidgetProps> = ({
  tideData,
  placeName,
  isEs,
  place
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const {
    current_height_m,
    tide_state,
    next_high_tide,
    next_low_tide,
    hazard_level,
    hazard_title_es,
    hazard_title_en,
    hazard_zone_name_es,
    hazard_zone_name_en,
    hazard_message_es,
    hazard_message_en,
    safe_crossing_hours_es,
    safe_crossing_hours_en,
    safe_window_start,
    safe_window_end,
    water_temp_c,
    swell_height_m,
    station_name,
    tide_curve_points,
    current_time_str
  } = tideData;

  const isDanger = hazard_level === 'danger';
  const isWarning = hazard_level === 'warning';

  // State text and visual indicators
  const getStateBadge = () => {
    switch (tide_state) {
      case 'subiendo':
        return {
          label: isEs ? 'Marea Subiendo' : 'Rising Tide',
          icon: <TrendingUp className="w-3.5 h-3.5" />,
          color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800'
        };
      case 'bajando':
        return {
          label: isEs ? 'Marea Bajando' : 'Falling Tide',
          icon: <TrendingDown className="w-3.5 h-3.5" />,
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800'
        };
      case 'pleamar':
        return {
          label: isEs ? 'Pleamar (Marea Alta)' : 'High Tide Peak',
          icon: <Waves className="w-3.5 h-3.5" />,
          color: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800'
        };
      case 'bajamar':
        return {
          label: isEs ? 'Bajamar (Marea Baja)' : 'Low Tide Peak',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          color: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/80 border-teal-300 dark:border-teal-800'
        };
    }
  };

  const stateBadge = getStateBadge();

  // Percentage calculation for visual water level gauge (0m to 3.2m range)
  const maxScaleHeight = 3.2;
  const fillPercentage = Math.min(100, Math.max(8, (current_height_m / maxScaleHeight) * 100));

  return (
    <div 
      id="tide-warning-widget"
      className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm ${
        isDanger
          ? 'bg-rose-50/85 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700/80'
          : isWarning
          ? 'bg-amber-50/85 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/80'
          : 'bg-emerald-50/85 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/80'
      }`}
    >
      {/* 1. Primary Alert Header Banner */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Status Beacon / Icon */}
            <div className={`p-2.5 rounded-2xl shrink-0 mt-0.5 shadow-xs ${
              isDanger
                ? 'bg-rose-600 text-white animate-pulse'
                : isWarning
                ? 'bg-amber-500 text-stone-950'
                : 'bg-emerald-600 text-white'
            }`}>
              {isDanger ? (
                <ShieldAlert className="w-5 h-5" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Waves className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                  isDanger
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                    : isWarning
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                    : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isDanger ? 'bg-rose-600 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span>
                    {isDanger 
                      ? (isEs ? 'Peligro de Mareas' : 'Tidal Hazard Danger') 
                      : isWarning 
                      ? (isEs ? 'Alerta de Marea Alta' : 'High Tide Warning') 
                      : (isEs ? 'Acceso Costero Seguro' : 'Safe Coastal Access')}
                  </span>
                </span>

                {hazard_zone_name_es && (
                  <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 truncate max-w-[220px]">
                    📍 {isEs ? hazard_zone_name_es : hazard_zone_name_en}
                  </span>
                )}
              </div>

              <h3 className={`text-sm sm:text-base font-black leading-snug ${
                isDanger
                  ? 'text-rose-950 dark:text-rose-200'
                  : isWarning
                  ? 'text-amber-950 dark:text-amber-200'
                  : 'text-emerald-950 dark:text-emerald-200'
              }`}>
                {isEs ? hazard_title_es : hazard_title_en}
              </h3>
            </div>
          </div>

          {/* Expand / Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
            aria-label={isExpanded ? 'Contraer widget de mareas' : 'Expandir widget de mareas'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Hazard Message Explanation */}
        {hazard_message_es && (
          <p className={`text-xs mt-2.5 font-medium leading-relaxed ${
            isDanger
              ? 'text-rose-900 dark:text-rose-200'
              : isWarning
              ? 'text-amber-900 dark:text-amber-200'
              : 'text-emerald-900 dark:text-emerald-200'
          }`}>
            {isEs ? hazard_message_es : hazard_message_en}
          </p>
        )}

        {/* Quick Highlights Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-black/10 dark:border-white/10">
          <div className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/70 border border-black/5 dark:border-white/5">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">
              {isEs ? 'Nivel de Marea Actual' : 'Current Tide Level'}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <strong className="text-base font-black text-stone-900 dark:text-white">
                {current_height_m} m
              </strong>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 ${stateBadge.color}`}>
                {stateBadge.icon}
                <span>{stateBadge.label}</span>
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/70 border border-black/5 dark:border-white/5">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">
              {isEs ? 'Próxima Bajamar (Ideal)' : 'Next Low Tide (Best)'}
            </span>
            <span className="text-xs font-black text-teal-700 dark:text-teal-300 block mt-0.5">
              {next_low_tide.time} ({next_low_tide.height_m}m)
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/70 border border-black/5 dark:border-white/5">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">
              {isEs ? 'Próxima Pleamar (Riesgo)' : 'Next High Tide (Risk)'}
            </span>
            <span className="text-xs font-black text-rose-700 dark:text-rose-300 block mt-0.5">
              {next_high_tide.time} ({next_high_tide.height_m}m)
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/80 dark:bg-stone-900/70 border border-black/5 dark:border-white/5">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">
              {isEs ? 'Oleaje & Temperatura' : 'Swell & Water'}
            </span>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block mt-0.5">
              {swell_height_m}m • {water_temp_c}°C
            </span>
          </div>
        </div>
      </div>

      {/* 2. Expandable Deep Insights Section */}
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-stone-900/50">
          
          {/* Safe Crossing Recommendation Callout */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-black text-stone-900 dark:text-white block">
                {isEs ? 'Ventana Óptima Recomendada por Guardaparques' : 'Optimal Crossing Window (Park Rangers)'}
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {isEs ? safe_crossing_hours_es : safe_crossing_hours_en}
              </p>
              {safe_window_start && safe_window_end && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-black mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Horario de Cruce Seguro: {safe_window_start} - {safe_window_end}</span>
                </div>
              )}
            </div>
          </div>

          {/* Visual Tide Level Gauge */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-sky-500" />
                <span>{isEs ? 'Indicador de Nivel de Marea en Tiempo Real' : 'Real-time Tide Level Gauge'}</span>
              </span>
              <span className="font-mono text-[11px] text-stone-500">
                {isEs ? 'Hora local' : 'Local time'}: {current_time_str}
              </span>
            </div>

            {/* Gauge Graphic Bar */}
            <div className="relative pt-2 pb-1">
              <div className="w-full h-3 rounded-full bg-gradient-to-r from-teal-400 via-amber-400 to-rose-500 relative overflow-hidden shadow-inner">
                {/* Safe zone indicator line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xs z-10"
                  style={{ left: '55%' }}
                  title="Límite seguro de cruce"
                />
              </div>

              {/* Needle / Marker Indicator */}
              <div 
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500"
                style={{ left: `${fillPercentage}%` }}
              >
                <span className="text-[10px] font-black text-stone-900 dark:text-white bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded shadow-xs border border-stone-200 dark:border-stone-600 whitespace-nowrap">
                  ▼ {current_height_m}m
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 font-mono">
              <span>0.0m (Bajamar)</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">~1.8m (Límite Seguro)</span>
              <span>3.2m (Pleamar Máx)</span>
            </div>
          </div>

          {/* 10-Hour Tide Timeline Forecast (Hourly Curve) */}
          {tide_curve_points && tide_curve_points.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {isEs ? 'Pronóstico Horario para las Próximas 10 Horas' : '10-Hour Coastal Tide Forecast'}
                </span>
                <span className="text-[10px] text-stone-500 flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> {isEs ? 'Seguro' : 'Safe'}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> {isEs ? 'Precaución' : 'Caution'}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"/> {isEs ? 'Peligro' : 'Danger'}</span>
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-11 gap-1.5 overflow-x-auto pb-1">
                {tide_curve_points.map((pt, idx) => (
                  <div 
                    key={idx}
                    className={`p-1.5 rounded-xl text-center flex flex-col items-center justify-between transition-all border ${
                      pt.is_current 
                        ? 'ring-2 ring-emerald-500 bg-stone-100 dark:bg-stone-800 shadow-xs' 
                        : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-100 dark:border-stone-800'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-stone-500 block">
                      {pt.hour}
                    </span>

                    <span className={`text-[11px] font-black my-1 ${
                      pt.status === 'danger'
                        ? 'text-rose-600 dark:text-rose-400'
                        : pt.status === 'caution'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {pt.height_m}m
                    </span>

                    <span className={`w-full h-1.5 rounded-full ${
                      pt.status === 'danger'
                        ? 'bg-rose-500'
                        : pt.status === 'caution'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`} />

                    {pt.is_current && (
                      <span className="text-[8px] font-black uppercase text-emerald-700 dark:text-emerald-300 mt-1">
                        {isEs ? 'Ahora' : 'Now'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Station Attribution & Marine Data Source */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-stone-400 pt-1 font-mono">
            <span>📡 {station_name}</span>
            <span>Powered by WorldTides™ & CIMAR-UCR</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default TideWarningWidget;
