import React from 'react';
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
  Navigation
} from 'lucide-react';

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

  if (!selectedPlace) return null;

  const isFav = favorites.includes(selectedPlace.id);
  const isEs = language === 'es';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(isEs ? '¡Enlace copiado al portapapeles!' : 'Link copied to clipboard!');
    }
  };

  return (
    <div 
      id="place-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              {selectedPlace.province} • {selectedPlace.region}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                title="Compartir"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedPlace(null)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
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

          {/* Schedule & PostGIS Location Info */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
                  {isEs ? 'Horario de Atención' : 'Operating Hours'}
                </span>
                <span className="text-xs text-emerald-800 dark:text-emerald-300">
                  {selectedPlace.schedule}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
              <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 font-mono">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>GPS: {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                <Navigation className="w-3 h-3" />
                <span>{isEs ? 'Abrir en Waze / Maps' : 'Open in Waze / Maps'}</span>
              </a>
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
