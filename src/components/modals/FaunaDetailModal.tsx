import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  MapPin, 
  Camera, 
  Compass, 
  Layers, 
  Share2,
  Sparkles
} from 'lucide-react';

export const FaunaDetailModal: React.FC = () => {
  const { 
    selectedFauna, 
    setSelectedFauna, 
    language, 
    setIsNewSightingModalOpen, 
    requireAuth,
    showToast 
  } = useApp();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isEs = language === 'es';

  if (!selectedFauna) return null;

  // Sound synthesis / audio simulation
  const handlePlaySound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = selectedFauna.category === 'anfibios' ? 'sawtooth' : selectedFauna.category === 'aves' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(selectedFauna.category === 'aves' ? 880 : 320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(selectedFauna.category === 'aves' ? 1400 : 180, audioCtx.currentTime + 0.6);
      
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);

      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 700);
    } catch (e) {
      console.warn('AudioContext notice:', e);
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 700);
    }
  };

  const handleReportSighting = () => {
    requireAuth(
      isEs ? 'Reportar Avistamiento' : 'Report Wildlife Sighting',
      isEs ? 'Inicia sesión para contribuir con fotos al álbum científico de Costa Rica.' : 'Sign in to contribute photos to the biodiversity community album.',
      () => {
        setSelectedFauna(null);
        setIsNewSightingModalOpen(true);
      }
    );
  };

  return (
    <div 
      id="fauna-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div 
        id="fauna-detail-modal-content"
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <img 
            src={selectedFauna.image} 
            alt={selectedFauna.common_name_es}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

          {/* Close & Category Tag */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              {selectedFauna.category}
            </span>

            <button
              onClick={() => setSelectedFauna(null)}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Species Nomenclature */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-black uppercase">
                UICN: {selectedFauna.iucn_status}
              </span>
              <span className="text-xs text-stone-300 font-mono italic">
                {selectedFauna.scientific_name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-md">
              {isEs ? selectedFauna.common_name_es : selectedFauna.common_name_en}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Audio & Quick Audio Frequency Player */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
                  {selectedFauna.sound_name}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {isEs ? 'Registro sonoro silvestre de CR' : 'Wild acoustic recording sample'}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaySound}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isPlayingAudio ? (isEs ? 'Reproduciendo...' : 'Playing...') : (isEs ? 'Escuchar' : 'Play')}
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 mb-1.5">
              {isEs ? 'Ficha Biológica' : 'Biological Overview'}
            </h3>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {isEs ? selectedFauna.description_es : selectedFauna.description_en}
            </p>
          </div>

          {/* Habitat & Elevation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-[11px] text-stone-400 uppercase font-bold block mb-1">
                {isEs ? 'Hábitat' : 'Habitat'}
              </span>
              <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                {isEs ? selectedFauna.habitat_es : selectedFauna.habitat_en}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-[11px] text-stone-400 uppercase font-bold block mb-1">
                {isEs ? 'Rango Altitudinal' : 'Elevation Range'}
              </span>
              <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                {selectedFauna.elevation_range}
              </p>
            </div>
          </div>

          {/* Fuzzy Hotspots with Anti-Poaching Notice */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-400">
                {isEs ? 'Zonas de Avistamiento Frecuente (Mapa Difuso)' : 'Frequent Sighting Zones (Fuzzy Map)'}
              </h3>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>Anti-Caza Furtiva</span>
              </span>
            </div>

            <div className="space-y-1.5">
              {selectedFauna.fuzzy_hotspots.map((spot, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{spot.name}</span>
                      <span className="text-stone-400 text-[11px] ml-1.5">({spot.region})</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                    Densidad {spot.density}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
              * Por ley nacional de vida silvestre (MINAE/SINAC), las coordenadas geográficas exactas de especies vulnerables se ofuscan en un radio de amortiguamiento de 10-25 km.
            </p>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/90 flex items-center justify-between gap-3">
          <button
            onClick={handleReportSighting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{isEs ? 'Reportar Avistamiento' : 'Report Sighting'}</span>
          </button>

          <button
            onClick={() => setSelectedFauna(null)}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {isEs ? 'Cerrar' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
