import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Heart, 
  Bookmark, 
  MapPin, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Star, 
  Share2, 
  Compass,
  CheckCircle2,
  Navigation,
  CloudSun,
  Sun,
  CloudRain,
  Cloud,
  CloudLightning,
  Waves,
  AlertTriangle,
  Download,
  Check,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { fetchSpotWeather, fetchSpotTides, getCoastalHazardInfo } from '../../lib/weatherTidesService';
import { openWazeWithFallback, openGoogleMaps, openAppleMaps } from '../../lib/navigationDeepLinks';
import { isSpotSavedOffline, saveSpotForOffline, removeOfflineSpot } from '../../lib/offlineStorage';
import { LiveWeatherData, LiveTideData } from '../../types';

export const PlaceDetailModal: React.FC = () => {
  const { 
    selectedPlace, 
    setSelectedPlace, 
    language, 
    formatPrice, 
    favorites, 
    toggleFavoritePlace, 
    likePlace, 
    showToast 
  } = useApp();

  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [tideData, setTideData] = useState<LiveTideData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [isOfflineSaved, setIsOfflineSaved] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);

  const isEs = language === 'es';

  // Load weather and tides specifically when destination modal opens (lazy TanStack/cache pattern)
  useEffect(() => {
    if (!selectedPlace) {
      setWeatherData(null);
      setTideData(null);
      return;
    }

    setIsOfflineSaved(isSpotSavedOffline(selectedPlace.id));
    setLoadingWeather(true);

    // 1. Fetch live weather using destination PostGIS coordinates
    fetchSpotWeather(selectedPlace.lat, selectedPlace.lng)
      .then(data => setWeatherData(data))
      .catch(err => console.warn('Modal weather fetch:', err))
      .finally(() => setLoadingWeather(false));

    // 2. Fetch live tides if coastal
    const hazard = getCoastalHazardInfo(selectedPlace);
    const isCoastal = Boolean(
      hazard || 
      selectedPlace.category === 'playa' || 
      selectedPlace.region === 'Pacífico Central' || 
      selectedPlace.region === 'Pacífico Sur' || 
      selectedPlace.region === 'Guanacaste' || 
      selectedPlace.region === 'Caribe'
    );

    if (isCoastal) {
      fetchSpotTides(selectedPlace.lat, selectedPlace.lng, selectedPlace)
        .then(tides => setTideData(tides))
        .catch(err => console.warn('Modal tides fetch:', err));
    } else {
      setTideData(null);
    }
  }, [selectedPlace]);

  if (!selectedPlace) return null;

  const isFav = favorites.includes(selectedPlace.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(isEs ? '¡Enlace copiado al portapapeles!' : 'Link copied to clipboard!');
    }
  };

  const handleToggleOffline = () => {
    if (isOfflineSaved) {
      removeOfflineSpot(selectedPlace.id);
      setIsOfflineSaved(false);
      showToast(isEs ? 'Destino eliminado de almacenamiento offline' : 'Destination removed from offline storage');
    } else {
      saveSpotForOffline(selectedPlace);
      setIsOfflineSaved(true);
      showToast(isEs ? '✅ Destino guardado para consulta offline sin señal' : '✅ Destination saved for offline consultation');
    }
  };

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'cloud-sun': return <CloudSun className="w-5 h-5 text-amber-400" />;
      case 'cloud-rain': return <CloudRain className="w-5 h-5 text-sky-500" />;
      case 'cloud-lightning': return <CloudLightning className="w-5 h-5 text-purple-500" />;
      default: return <Cloud className="w-5 h-5 text-stone-400" />;
    }
  };

  return (
    <div 
      id="place-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div 
        id="place-detail-modal-content"
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Hero Image & Floating Controls */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <img 
            src={selectedPlace.image} 
            alt={selectedPlace.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              {selectedPlace.province} • {selectedPlace.region}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleOffline}
                className={`p-2 rounded-full backdrop-blur-md text-white transition-all ${
                  isOfflineSaved 
                    ? 'bg-emerald-600 border border-emerald-400' 
                    : 'bg-black/50 hover:bg-black/70 border border-white/20'
                }`}
                title={isOfflineSaved ? (isEs ? 'Guardado Offline' : 'Saved Offline') : (isEs ? 'Guardar Offline' : 'Save Offline')}
              >
                {isOfflineSaved ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4 text-white" />}
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors border border-white/20"
                title="Compartir"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedPlace(null)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title & Quick Badges over Hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              {selectedPlace.cst_certified && (
                <span className="flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-600/90 text-white backdrop-blur-xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>CST Sostenible</span>
                </span>
              )}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 text-white flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>{selectedPlace.rating.toFixed(1)} ({selectedPlace.reviews_count})</span>
              </span>
              {isOfflineSaved && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-700/90 text-white flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>Offline Ready</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
              {selectedPlace.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-center">
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-medium">
                {isEs ? 'Entrada SINAC' : 'Entrance Fee'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                {formatPrice(selectedPlace.entry_fee_usd)}
              </span>
            </div>
            <div className="border-x border-stone-200 dark:border-stone-700">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-medium">
                {isEs ? 'Dificultad' : 'Difficulty'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                {selectedPlace.difficulty}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 block font-medium">
                {isEs ? 'Comunidad' : 'Community'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{selectedPlace.likes_count}</span>
              </span>
            </div>
          </div>

          {/* Coastal Tide Hazard Alert (e.g. Marino Ballena Whale's Tail / Paso de Moisés) */}
          {tideData && (
            <div className={`p-4 rounded-2xl border ${
              tideData.is_high_tide_hazard 
                ? 'bg-amber-500/10 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200' 
                : 'bg-sky-500/10 border-sky-300 dark:border-sky-700 text-sky-950 dark:text-sky-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                  <Waves className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {isEs ? 'Estado de Mareas en Vivo' : 'Live Coastal Tide Status'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 font-bold shadow-xs">
                      Altura: {tideData.current_height_m}m ({tideData.tide_state.toUpperCase()})
                    </span>
                  </div>

                  {tideData.is_high_tide_hazard && (
                    <div className="flex items-start gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{isEs ? (tideData.hazard_message_es || '⚠️ Marea alta activa. Senderos de playa y tómbolos pueden estar sumergidos.') : (tideData.hazard_message_en || '⚠️ High tide active. Beach trails and sandbars may be submerged.')}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1.5 border-t border-sky-200/50 dark:border-sky-800/40">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block">{isEs ? 'Próxima Bajamar (Ideal caminata)' : 'Next Low Tide (Ideal for walk)'}:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">{tideData.next_low_tide.time} ({tideData.next_low_tide.height_m}m)</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 block">{isEs ? 'Próxima Pleamar (Marea alta)' : 'Next High Tide'}:</span>
                      <strong className="text-rose-700 dark:text-rose-400">{tideData.next_high_tide.time} ({tideData.next_high_tide.height_m}m)</strong>
                    </div>
                  </div>

                  {tideData.safe_crossing_hours_es && (
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold mt-2">
                      {isEs ? tideData.safe_crossing_hours_es : tideData.safe_crossing_hours_en}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Live Weather Box with TanStack Cache */}
          {weatherData && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50/50 dark:from-stone-800/80 dark:to-stone-800/40 border border-sky-200/80 dark:border-stone-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(weatherData.icon)}
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block leading-tight">
                      {weatherData.condition}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {weatherData.condition_description}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-stone-900 dark:text-stone-100">
                    {weatherData.temp_c}°C
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {isEs ? 'Sensación' : 'Feels like'} {weatherData.feels_like_c}°C
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-200 dark:border-stone-700/60 text-center text-[10px]">
                <div>
                  <span className="text-stone-500 block">{isEs ? 'Lluvia' : 'Rain'}</span>
                  <strong className="text-sky-600 dark:text-sky-400">{weatherData.rain_probability}%</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">{isEs ? 'Humedad' : 'Humidity'}</span>
                  <strong className="text-stone-700 dark:text-stone-300">{weatherData.humidity}%</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">{isEs ? 'Índice UV' : 'UV Index'}</span>
                  <strong className="text-amber-600 dark:text-amber-400">{weatherData.uv_index}/12</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">{isEs ? 'Viento' : 'Wind'}</span>
                  <strong className="text-stone-700 dark:text-stone-300">{weatherData.wind_kmh} km/h</strong>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 mb-1.5">
              {isEs ? 'Acerca de este destino' : 'About this destination'}
            </h3>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {isEs ? selectedPlace.description_es : selectedPlace.description_en}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 mb-2">
              {isEs ? 'Atracciones principales & Senderos' : 'Highlights & Trails'}
            </h3>
            <div className="space-y-1.5">
              {(isEs ? selectedPlace.highlights_es : selectedPlace.highlights_en).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule & PostGIS Location Info + Deep Linking Bar */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-200 block">
                  {isEs ? 'Horario de Atención' : 'Operating Hours'}
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-400">
                  {selectedPlace.schedule}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 font-mono">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>GPS: {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}</span>
              </div>

              {/* Navigation Deep Link Triggers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openWazeWithFallback(selectedPlace.lat, selectedPlace.lng, selectedPlace.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                  title="Navegar con Waze"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Ir con Waze</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowNavMenu(!showNavMenu)}
                    className="p-1.5 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200 text-xs font-medium flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showNavMenu && (
                    <div className="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 p-1 z-30 space-y-1">
                      <button
                        onClick={() => {
                          openGoogleMaps(selectedPlace.lat, selectedPlace.lng, selectedPlace.name);
                          setShowNavMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>Google Maps</span>
                      </button>
                      <button
                        onClick={() => {
                          openAppleMaps(selectedPlace.lat, selectedPlace.lng, selectedPlace.name);
                          setShowNavMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-1.5"
                      >
                        <Compass className="w-3.5 h-3.5 text-blue-500" />
                        <span>Apple Maps</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/90 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {/* Like Button (Auth Guarded) */}
            <button
              onClick={() => likePlace(selectedPlace.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedPlace.liked_by_user
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${selectedPlace.liked_by_user ? 'fill-current text-rose-600' : ''}`} />
              <span>{selectedPlace.likes_count}</span>
            </button>

            {/* Favorite / Bookmark Button (Auth Guarded) */}
            <button
              onClick={() => toggleFavoritePlace(selectedPlace.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isFav
                  ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current text-amber-500' : ''}`} />
              <span>{isFav ? (isEs ? 'Guardado' : 'Saved') : (isEs ? 'Guardar' : 'Save')}</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedPlace(null)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            {isEs ? 'Cerrar Ficha' : 'Close Spot'}
          </button>

        </div>

      </div>
    </div>
  );
};

