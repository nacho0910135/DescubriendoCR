import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FaunaSpecie } from '../../types';
import { 
  Camera, 
  Volume2, 
  ShieldAlert, 
  MapPin, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  Eye, 
  Compass, 
  Feather, 
  Info,
  Share2,
  Plus
} from 'lucide-react';

export const FaunaTab: React.FC = () => {
  const { 
    fauna, 
    sightings, 
    likeSighting, 
    setSelectedFauna, 
    setIsNewSightingModalOpen, 
    requireAuth, 
    language, 
    t 
  } = useApp();

  const [subTab, setSubTab] = useState<'catalog' | 'fuzzy_map' | 'album'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const isEs = language === 'es';

  const categories = [
    { key: 'all', label_es: 'Todas', label_en: 'All' },
    { key: 'anfibios', label_es: 'Anfibios 🐸', label_en: 'Amphibians 🐸' },
    { key: 'aves', label_es: 'Aves 🦜', label_en: 'Birds 🦜' },
    { key: 'mamiferos', label_es: 'Mamíferos 🦥', label_en: 'Mammals 🦥' },
    { key: 'marino', label_es: 'Vida Marina 🐋', label_en: 'Marine Life 🐋' },
  ];

  const filteredFauna = fauna.filter(f => 
    selectedCategory === 'all' || f.category === selectedCategory
  );

  const handleOpenReportModal = () => {
    requireAuth(
      isEs ? 'Reportar Avistamiento' : 'Report Wildlife Sighting',
      isEs ? 'Inicia sesión para subir fotos de fauna al álbum colaborativo.' : 'Sign in to upload wildlife photos to the community album.',
      () => {
        setIsNewSightingModalOpen(true);
      }
    );
  };

  return (
    <div id="tab-fauna" className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 p-6 text-white overflow-hidden shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="p-1 rounded-md bg-emerald-500/20 border border-emerald-400/30">🌿</span>
            <span>SINAC / MINAE Biodiversidad Tropical</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white mb-2">
            {t('fauna.title')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
            {t('fauna.subtitle')}
          </p>

          <button
            onClick={handleOpenReportModal}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>{t('fauna.upload_btn')}</span>
          </button>
        </div>

        {/* Floating Mascot icon watermark */}
        <div className="absolute -right-6 -bottom-8 opacity-20 pointer-events-none text-9xl">
          🐸
        </div>
      </div>

      {/* Sub-Tabs: Catálogo / Mapa Difuso / Álbum */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setSubTab('catalog')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('fauna.tab_catalog')}
          </button>

          <button
            onClick={() => setSubTab('fuzzy_map')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'fuzzy_map'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('fauna.tab_fuzzy_map')}
          </button>

          <button
            onClick={() => setSubTab('album')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'album'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('fauna.tab_album')} ({sightings.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CATALOG */}
      {subTab === 'catalog' && (
        <div className="space-y-4">
          
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-stone-900 text-white dark:bg-emerald-400 dark:text-stone-950 font-extrabold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {isEs ? cat.label_es : cat.label_en}
              </button>
            ))}
          </div>

          {/* Species Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFauna.map((animal) => (
              <div
                key={animal.id}
                onClick={() => setSelectedFauna(animal)}
                className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Photo */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={animal.image}
                    alt={animal.common_name_es}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase">
                      UICN: {animal.iucn_status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/60 text-emerald-300 text-[11px] font-bold">
                      {animal.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-mono italic text-emerald-300 block">
                      {animal.scientific_name}
                    </span>
                    <h3 className="text-lg font-black leading-tight drop-shadow-sm">
                      {isEs ? animal.common_name_es : animal.common_name_en}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {isEs ? animal.description_es : animal.description_en}
                  </p>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{animal.sound_name}</span>
                    </div>

                    <span className="text-stone-400 text-[11px] font-semibold">
                      {animal.sightings_count} {isEs ? 'avistamientos' : 'sightings'}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUBTAB 2: FUZZY ANTI-POACHING SIGHTING MAP */}
      {subTab === 'fuzzy_map' && (
        <div className="space-y-4">
          
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">
                {isEs ? 'Protocolo de Protección de Fauna Silvestre' : 'Wildlife Protection Protocol'}
              </span>
              <p className="text-[11px] leading-relaxed">
                {t('fauna.fuzzy_notice')}
              </p>
            </div>
          </div>

          {/* Fuzzy Spatial Buffer Hotspots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fauna.map(animal => (
              <div 
                key={animal.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={animal.image} 
                    alt={animal.common_name_es}
                    className="w-12 h-12 rounded-2xl object-cover border border-emerald-500"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      {isEs ? animal.common_name_es : animal.common_name_en}
                    </h3>
                    <p className="text-xs font-mono italic text-stone-500">
                      {animal.scientific_name}
                    </p>
                  </div>
                </div>

                {/* Hotspots Zones */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    {isEs ? 'Zonas de Amortiguamiento Activas:' : 'Active Buffer Zones:'}
                  </span>
                  {animal.fuzzy_hotspots.map((spot, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
                        <div>
                          <span className="font-bold text-emerald-950 dark:text-emerald-200">{spot.name}</span>
                          <span className="text-emerald-700/80 dark:text-emerald-400/80 text-[11px] block">
                            {spot.region} • Radio de seguridad: ~{spot.radius_km} km
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[11px]">
                        {spot.density}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUBTAB 3: COMMUNITY ALBUM */}
      {subTab === 'album' && (
        <div className="space-y-5">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white">
                {isEs ? 'Fotografías de la Comunidad' : 'Community Wildlife Photography'}
              </h2>
              <p className="text-xs text-stone-500">
                {isEs ? 'Reportes verificados por biólogos y guías certificados ICT' : 'Verified by local field biologists and ICT guides'}
              </p>
            </div>

            <button
              onClick={handleOpenReportModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isEs ? 'Nuevo Reporte' : 'New Report'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sightings.map(s => (
              <div 
                key={s.id}
                className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
              >
                {/* Photo */}
                <div className="relative h-56 w-full">
                  <img 
                    src={s.image} 
                    alt={s.specie_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <img 
                      src={s.user_avatar} 
                      alt={s.user_name}
                      className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    />
                    <div className="text-white text-xs leading-none">
                      <span className="font-bold block drop-shadow-sm">{s.user_name}</span>
                      <span className="text-[10px] text-stone-300">{s.timestamp}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{s.location_name} ({s.region})</span>
                    </span>
                    <h3 className="text-base font-black">
                      {s.specie_name}
                    </h3>
                  </div>
                </div>

                {/* Notes & Like */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-stone-700 dark:text-stone-300 italic">
                    "{s.notes}"
                  </p>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isEs ? 'Verificado en campo' : 'Field verified'}</span>
                    </span>

                    {/* Upvote Button (Auth Guarded) */}
                    <button
                      onClick={() => likeSighting(s.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 text-stone-700 dark:text-stone-300 hover:text-rose-600 font-bold transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                      <span>{s.likes}</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
