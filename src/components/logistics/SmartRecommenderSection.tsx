import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SmartRecommendationQuery, RecommendationItinerary, CostaRicaProvince } from '../../types';
import { generateSmartRecommendations, PROVINCE_CENTROIDS } from '../../lib/recommenderEngine';
import { MOCK_PLACES } from '../../data/mockData';
import { openWazeWithFallback } from '../../lib/navigationDeepLinks';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  DollarSign, 
  Navigation, 
  Compass, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Flame, 
  Palmtree, 
  Mountain, 
  RefreshCw,
  Award,
  ChevronRight
} from 'lucide-react';

export const SmartRecommenderSection: React.FC = () => {
  const { language, formatPrice, setSelectedPlace } = useApp();
  const isEs = language === 'es';

  // Query State
  const [availableTime, setAvailableTime] = useState<'half_day' | 'full_day' | 'weekend' | 'extended'>('full_day');
  const [selectedProvince, setSelectedProvince] = useState<CostaRicaProvince | 'todas'>('San José');
  const [selectedBudget, setSelectedBudget] = useState<'economic' | 'moderate' | 'luxury'>('moderate');
  const [selectedGroup, setSelectedGroup] = useState<'solo' | 'couple' | 'family' | 'friends'>('couple');
  const [selectedCategories, setSelectedCategories] = useState<('parque_nacional' | 'volcan' | 'catarata' | 'playa' | 'sendero' | 'reserva' | 'fauna')[]>([
    'parque_nacional',
    'playa',
    'volcan'
  ]);

  const [isGpsActive, setIsGpsActive] = useState(false);
  const [userLat, setUserLat] = useState<number | undefined>(undefined);
  const [userLng, setUserLng] = useState<number | undefined>(undefined);
  const [results, setResults] = useState<RecommendationItinerary[]>(() => {
    return generateSmartRecommendations({
      available_time: 'full_day',
      province_fallback: 'San José',
      preferred_categories: ['parque_nacional', 'playa', 'volcan'],
      budget_level: 'moderate',
      travel_group: 'couple',
    });
  });

  const toggleCategory = (cat: 'parque_nacional' | 'volcan' | 'catarata' | 'playa' | 'sendero' | 'reserva' | 'fauna') => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleDetectGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
          setIsGpsActive(true);
        },
        err => {
          console.warn('Geolocation denied or failed:', err);
          setIsGpsActive(false);
        }
      );
    }
  };

  const handleGenerate = () => {
    const query: SmartRecommendationQuery = {
      available_time: availableTime,
      user_lat: isGpsActive ? userLat : undefined,
      user_lng: isGpsActive ? userLng : undefined,
      province_fallback: selectedProvince,
      preferred_categories: selectedCategories,
      budget_level: selectedBudget,
      travel_group: selectedGroup,
    };
    const recommendations = generateSmartRecommendations(query, MOCK_PLACES);
    setResults(recommendations);
  };

  return (
    <div id="smart-recommender-section" className="space-y-6">
      
      {/* Interactive Matcher Wizard */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                {isEs ? 'Qué Hacer Hoy (Recomendador Inteligente)' : 'What to Do Today (Smart Matcher)'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isEs ? 'Calcula rutas por proximidad PostGIS, tiempo disponible y presupuesto' : 'Computes routes using PostGIS proximity, time, and budget'}
              </p>
            </div>
          </div>
        </div>

        {/* Wizard Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Time Available */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEs ? '¿Cuánto tiempo tienes?' : 'How much time do you have?'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'half_day', label_es: 'Medio Día (~4-5h)', label_en: 'Half Day (~4-5h)' },
                { id: 'full_day', label_es: 'Día Completo (8h)', label_en: 'Full Day (8h)' },
                { id: 'weekend', label_es: 'Fin de Semana (2d)', label_en: 'Weekend (2d)' },
                { id: 'extended', label_es: 'Expedición (3d+)', label_en: 'Expedition (3d+)' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setAvailableTime(t.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                    availableTime === t.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-500 dark:text-emerald-200'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-300'
                  }`}
                >
                  {isEs ? t.label_es : t.label_en}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Starting Point / GPS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEs ? 'Punto de Partida / GPS' : 'Starting Location / GPS'}</span>
              </label>
              <button
                onClick={handleDetectGPS}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                  isGpsActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50'
                }`}
              >
                <Navigation className="w-3 h-3" />
                <span>{isGpsActive ? (isEs ? 'GPS Activo' : 'GPS Active') : (isEs ? 'Usar mi GPS' : 'Use my GPS')}</span>
              </button>
            </div>

            <select
              disabled={isGpsActive}
              value={selectedProvince}
              onChange={e => setSelectedProvince(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 disabled:opacity-50"
            >
              <option value="San José">San José (Valle Central)</option>
              <option value="Alajuela">Alajuela (Arenal / Poás)</option>
              <option value="Puntarenas">Puntarenas (Manuel Antonio / Corcovado / Monteverde)</option>
              <option value="Guanacaste">Guanacaste (Liberia / Tamarindo / Papagayo)</option>
              <option value="Limón">Limón (Caribe Sur / Cahuita / Tortuguero)</option>
              <option value="Cartago">Cartago (Irazú / Turrialba)</option>
              <option value="Heredia">Heredia (Barva / Sarapiquí)</option>
            </select>
          </div>

          {/* 3. Preferred Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {isEs ? '¿Qué prefieres experimentar?' : 'What do you prefer to experience?'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'parque_nacional', label: 'Parques Nacionales' },
                { id: 'volcan', label: 'Volcanes Activos' },
                { id: 'playa', label: 'Playas & Océano' },
                { id: 'catarata', label: 'Cataratas' },
                { id: 'fauna', label: 'Avistamiento Fauna' },
                { id: 'sendero', label: 'Senderismo' },
              ].map(cat => {
                const isActive = selectedCategories.includes(cat.id as any);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Budget Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEs ? 'Nivel de Presupuesto' : 'Budget Level'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'economic', label_es: 'Económico (₡)', label_en: 'Budget ($)' },
                { id: 'moderate', label_es: 'Moderado (₡₡)', label_en: 'Moderate ($$)' },
                { id: 'luxury', label_es: 'Premium (₡₡₡)', label_en: 'Luxury ($$$)' },
              ].map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBudget(b.id as any)}
                  className={`p-2 rounded-xl text-xs font-bold text-center transition-all border ${
                    selectedBudget === b.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-500 dark:text-emerald-200'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isEs ? b.label_es : b.label_en}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer transition-all active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isEs ? 'Generar Itinerario Personalizado' : 'Generate Custom Itinerary'}</span>
        </button>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{isEs ? 'Rutas Sugeridas por el Algoritmo' : 'Algorithm Matched Routes'}</span>
          </h3>
          <span className="text-[11px] text-stone-500 font-mono">
            {results.length} {isEs ? 'itinerarios generados' : 'itineraries generated'}
          </span>
        </div>

        <div className="space-y-5">
          {results.map(itin => (
            <div
              key={itin.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {itin.match_score}% {isEs ? 'Coincidencia' : 'Match'}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {itin.weather_status_es}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                    {isEs ? itin.title_es : itin.title_en}
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-xs bg-stone-50 dark:bg-stone-800/80 px-3 py-2 rounded-2xl shrink-0">
                  <div>
                    <span className="text-[10px] text-stone-400 block">{isEs ? 'Distancia' : 'Distance'}</span>
                    <strong className="text-stone-800 dark:text-stone-200">~{itin.estimated_distance_km} km</strong>
                  </div>
                  <div className="border-l border-stone-200 dark:border-stone-700 pl-3">
                    <span className="text-[10px] text-stone-400 block">{isEs ? 'Manejo' : 'Drive'}</span>
                    <strong className="text-stone-800 dark:text-stone-200">{itin.estimated_drive_time_hours}h</strong>
                  </div>
                  <div className="border-l border-stone-200 dark:border-stone-700 pl-3">
                    <span className="text-[10px] text-stone-400 block">{isEs ? 'Presupuesto' : 'Budget'}</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{formatPrice(itin.estimated_budget_usd)}</strong>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {isEs ? itin.summary_es : itin.summary_en}
              </p>

              {/* Step by step stops */}
              <div className="space-y-3 pt-1">
                {itin.stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <button
                            onClick={() => setSelectedPlace(stop.spot)}
                            className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-white hover:text-emerald-600 transition-colors text-left"
                          >
                            {stop.spot.name}
                          </button>
                          <span className="text-[11px] text-stone-500 block">
                            {stop.time_slot} • {stop.spot.province}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openWazeWithFallback(stop.spot.lat, stop.spot.lng, stop.spot.name)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold shadow-xs cursor-pointer"
                          title="Navegar a esta parada"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Waze</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 pl-7">
                      {isEs ? stop.activity_es : stop.activity_en}
                    </p>

                    <div className="pl-7 flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                      <span>💡 <strong>{isEs ? 'Tip:' : 'Tip:'}</strong> {isEs ? stop.tips_es : stop.tips_en}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
