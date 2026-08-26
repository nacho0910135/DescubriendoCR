import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Volume2, 
  ShieldAlert, 
  MapPin, 
  Camera, 
  CheckCircle2,
  Bookmark,
  Building2,
  Sparkles,
  Heart,
  Calendar,
  Layers,
  Leaf,
  Sun
} from 'lucide-react';

export const FaunaDetailModal: React.FC = () => {
  const { 
    selectedFauna, 
    setSelectedFauna, 
    sanctuaries,
    language, 
    setIsNewSightingModalOpen, 
    requireAuth,
    toggleMarkAsSeenFauna,
    isFaunaSeenByUser,
    showToast 
  } = useApp();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isEs = language === 'es';

  if (!selectedFauna) return null;

  const isSeen = isFaunaSeenByUser(selectedFauna.id);

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

  // Find relevant sanctuaries where this species is present
  const esName = (selectedFauna.common_name_es || selectedFauna.common_name?.es || '').toLowerCase();
  const enName = (selectedFauna.common_name_en || selectedFauna.common_name?.en || '').toLowerCase();
  
  const relatedSanctuaries = sanctuaries.filter(s => {
    const speciesList = s.featured_species || s.species_rescued || [];
    return speciesList.some(specieName => {
      const target = (specieName || '').toLowerCase();
      return (esName && (esName.includes(target) || target.includes(esName.split(' ')[0]))) || 
             (enName && (enName.includes(target) || target.includes(enName.split(' ')[0])));
    });
  });

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
            src={selectedFauna.image_url || selectedFauna.image} 
            alt={selectedFauna.common_name_es || selectedFauna.common_name?.es || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

          {/* Close & Category Tag */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                {selectedFauna.category}
              </span>
              {selectedFauna.is_national_symbol && (
                <span className="px-3 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isEs ? 'Símbolo Nacional' : 'National Symbol'}
                </span>
              )}
              {selectedFauna.is_endemic && (
                <span className="px-3 py-1 rounded-full bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  {isEs ? 'Endémica CR' : 'Endemic'}
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedFauna(null)}
              className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Species Nomenclature */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-black uppercase shadow-xs">
                UICN: {selectedFauna.conservation_status || selectedFauna.iucn_status || 'LC'}
              </span>
              <span className="text-xs text-stone-200 font-mono italic">
                {selectedFauna.scientific_name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-md">
              {isEs ? (selectedFauna.common_name_es || selectedFauna.common_name?.es) : (selectedFauna.common_name_en || selectedFauna.common_name?.en)}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Life-List and Sound Player Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Audio sound button */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
                    {selectedFauna.sound_name || (isEs ? 'Canto / Vocalización' : 'Call / Vocalization')}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    {isEs ? 'Bioacústica' : 'Bioacoustics'}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaySound}
                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                {isPlayingAudio ? (isEs ? '...' : '...') : (isEs ? 'Escuchar' : 'Play')}
              </button>
            </div>

            {/* Life list mark button */}
            <button
              onClick={() => toggleMarkAsSeenFauna(selectedFauna.id)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                isSeen
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                  : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-2 text-left">
                <div className={`p-2 rounded-xl text-white ${isSeen ? 'bg-amber-500' : 'bg-stone-400 dark:bg-stone-600'}`}>
                  {isSeen ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold block">
                    {isSeen ? (isEs ? '¡En mi Lista de Vida!' : 'In My Life-List!') : (isEs ? 'Marcar como Avistado' : 'Mark as Seen')}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {isSeen ? (isEs ? 'Registrado en tu perfil' : 'Saved in your profile') : (isEs ? '¿Lo has visto en CR?' : 'Have you seen it in CR?')}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 mb-1.5">
              {isEs ? 'Ficha Biológica & Historia Natural' : 'Biological Overview & Natural History'}
            </h3>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {isEs ? (selectedFauna.description_es || selectedFauna.description?.es) : (selectedFauna.description_en || selectedFauna.description?.en)}
            </p>
          </div>

          {/* Bio Quick Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 uppercase font-bold flex items-center gap-1 mb-1">
                <Leaf className="w-3 h-3 text-emerald-600" />
                {isEs ? 'Dieta' : 'Diet'}
              </span>
              <p className="text-xs text-stone-800 dark:text-stone-200 font-semibold">
                {selectedFauna.diet_es || (selectedFauna.diet ? (isEs ? selectedFauna.diet.es : selectedFauna.diet.en) : (isEs ? 'Frugívoro / Herbívoro' : 'Frugivore / Herbivore'))}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 uppercase font-bold flex items-center gap-1 mb-1">
                <Sun className="w-3 h-3 text-amber-500" />
                {isEs ? 'Actividad' : 'Activity'}
              </span>
              <p className="text-xs text-stone-800 dark:text-stone-200 font-semibold">
                {selectedFauna.activity_es || (selectedFauna.activity_period ? (isEs ? selectedFauna.activity_period.es : selectedFauna.activity_period.en) : (isEs ? 'Diurno' : 'Diurnal'))}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-stone-400 uppercase font-bold flex items-center gap-1 mb-1">
                <Layers className="w-3 h-3 text-blue-500" />
                {isEs ? 'Altitud' : 'Elevation'}
              </span>
              <p className="text-xs text-stone-800 dark:text-stone-200 font-semibold">
                {selectedFauna.elevation_range || '0 - 2,200 msnm'}
              </p>
            </div>
          </div>

          {/* Verified Sanctuaries & Legal Rescue Centers */}
          {relatedSanctuaries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                {isEs ? 'Santuarios Oficiales para Observación Ética' : 'Verified Sanctuaries for Ethical Viewing'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedSanctuaries.map(sanc => (
                  <div 
                    key={sanc.id}
                    className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-2.5"
                  >
                    <img 
                      src={sanc.photo_url || sanc.image} 
                      alt={sanc.name} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-emerald-300 dark:border-emerald-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white leading-tight">
                        {sanc.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {sanc.canton ? `${sanc.canton}, ` : ''}{sanc.province}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                        MINAE / SINAC Certificado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fuzzy Hotspots with Anti-Poaching Notice */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-stone-400">
                {isEs ? 'Zonas de Hábitat Silvestre (Mapa Difuso)' : 'Wild Habitat Zones (Fuzzy Map)'}
              </h3>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isEs ? 'Protección Anti-Caza' : 'Anti-Poaching Shield'}</span>
              </span>
            </div>

            <div className="space-y-1.5">
              {(selectedFauna.fuzzy_hotspots || []).map((spot, i) => (
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
                    {isEs ? `Densidad ${spot.density}` : `Density ${spot.density}`}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
              {isEs 
                ? '* Por normativa del MINAE/SINAC, las coordenadas exactas de especies silvestres se ofuscan en un radio de 8-15 km para proteger la fauna.'
                : '* According to MINAE/SINAC conservation standards, exact coordinates of wild fauna are obfuscated within an 8-15 km buffer.'}
            </p>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/90 flex items-center justify-between gap-3">
          <button
            onClick={handleReportSighting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{isEs ? 'Reportar Avistamiento' : 'Report Sighting'}</span>
          </button>

          <button
            onClick={() => setSelectedFauna(null)}
            className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            {isEs ? 'Cerrar' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
