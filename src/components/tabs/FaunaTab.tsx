import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FaunaSpecie, VerifiedSanctuary } from '../../types';
import { 
  Camera, 
  Volume2, 
  ShieldAlert, 
  MapPin, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  Eye, 
  Search, 
  Compass, 
  Feather, 
  Info,
  Share2,
  Plus,
  Building2,
  Bookmark,
  MessageCircle,
  UserPlus,
  UserCheck,
  Send,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';

export const FaunaTab: React.FC = () => {
  const { 
    fauna, 
    sanctuaries,
    sightings, 
    likeSighting, 
    addSightingComment,
    toggleFollowUser,
    isUserFollowed,
    setSelectedFauna, 
    setSelectedSanctuary,
    setIsNewSightingModalOpen, 
    userSeenFauna,
    requireAuth, 
    language, 
    t 
  } = useApp();

  const [subTab, setSubTab] = useState<'catalog' | 'sanctuaries' | 'fuzzy_map' | 'album'>('catalog');
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'tours' | 'endemic' | 'national_symbols'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const isEs = language === 'es';

  // 4 Primary Request Categories for the Catalog
  const groupFilters = [
    { key: 'all', label_es: 'Toda la Fauna', label_en: 'All Wildlife', icon: '🌿' },
    { key: 'tours', label_es: 'Observable en Tours 🦥', label_en: 'Tour Sightings 🦥', icon: '🐾' },
    { key: 'endemic', label_es: 'Especies Endémicas 🐸', label_en: 'Endemic Species 🐸', icon: '✨' },
    { key: 'national_symbols', label_es: 'Símbolos Nacionales 🇨🇷', label_en: 'National Symbols 🇨🇷', icon: '🏛️' },
  ];

  const filteredFauna = fauna.filter(f => {
    // Group filter
    if (selectedGroup === 'tours' && !(f.is_tour_observable || f.observable_in_tours || f.classification_tag === 'tours')) return false;
    if (selectedGroup === 'endemic' && !(f.is_endemic || f.classification_tag === 'endemica')) return false;
    if (selectedGroup === 'national_symbols' && !(f.is_national_symbol || f.classification_tag === 'simbolos')) return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameEs = f.common_name_es || f.common_name?.es || '';
    const nameEn = f.common_name_en || f.common_name?.en || '';
    const scientific = f.scientific_name || '';
    const category = f.category || '';
    const places = f.best_places || f.location_names || [];

    return (
      nameEs.toLowerCase().includes(q) ||
      nameEn.toLowerCase().includes(q) ||
      scientific.toLowerCase().includes(q) ||
      category.toLowerCase().includes(q) ||
      places.some(loc => (loc || '').toLowerCase().includes(q))
    );
  });

  const handleOpenReportModal = () => {
    requireAuth(
      isEs ? 'Reportar Avistamiento' : 'Report Wildlife Sighting',
      isEs ? 'Inicia sesión para subir fotos de fauna al álbum colaborativo.' : 'Sign in to upload wildlife photos to the community album.',
      () => {
        setIsNewSightingModalOpen(true);
      }
    );
  };

  const handleSendComment = (sightingId: string) => {
    const text = commentInput[sightingId];
    if (!text?.trim()) return;
    addSightingComment(sightingId, text.trim());
    setCommentInput(prev => ({ ...prev, [sightingId]: '' }));
  };

  const seenPercentage = Math.round((userSeenFauna.length / Math.max(1, fauna.length)) * 100);

  return (
    <div id="tab-fauna" className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-stone-900 p-6 sm:p-8 text-white overflow-hidden shadow-2xl border border-emerald-800/80">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="p-1 rounded-md bg-emerald-500/20 border border-emerald-400/30">🌿</span>
            <span>MINAE / SINAC • Biodiversidad de Costa Rica</span>
            <span className="bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
              PostGIS 4326
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight text-white mb-2">
            {isEs ? 'Fauna CR & Ciencia Ciudadana' : 'CR Wildlife & Citizen Science'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4 max-w-xl">
            {isEs 
              ? 'Catálogo oficial de especies, santuarios certificados, álbum colaborativo con protección anti-caza furtiva y registro de avistamientos en campo.'
              : 'Official species catalog, certified sanctuaries, collaborative album with anti-poaching safeguards and field sighting tracking.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenReportModal}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-stone-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{isEs ? 'Subir Foto de Avistamiento' : 'Submit Wildlife Photo'}</span>
            </button>

            <button
              onClick={() => setSubTab('sanctuaries')}
              className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white font-bold px-4 py-2.5 rounded-2xl text-xs border border-white/20 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{isEs ? 'Santuarios Verificados' : 'Verified Sanctuaries'}</span>
            </button>
          </div>
        </div>

        {/* Life list progress badge in banner */}
        <div className="mt-5 sm:mt-0 sm:absolute sm:right-6 sm:top-6 sm:w-64 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              {isEs ? 'Mi Lista de Vida Silvestre' : 'My Wildlife Life-List'}
            </span>
            <span className="text-amber-300 font-extrabold text-[11px]">{userSeenFauna.length} / {fauna.length}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, Math.max(8, seenPercentage))}%` }}
            />
          </div>
          <p className="text-[10px] text-emerald-200 mt-1.5 opacity-90">
            {isEs 
              ? `${userSeenFauna.length} especies observadas en territorio costarricense` 
              : `${userSeenFauna.length} species spotted across Costa Rica`}
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 rounded-2xl shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full">
          <button
            onClick={() => setSubTab('catalog')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>🌿</span>
            <span>{isEs ? 'Catálogo de Especies' : 'Species Catalog'}</span>
          </button>

          <button
            onClick={() => setSubTab('sanctuaries')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'sanctuaries'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>🏛️</span>
            <span>{isEs ? 'Santuarios Verificados' : 'Sanctuaries'}</span>
          </button>

          <button
            onClick={() => setSubTab('fuzzy_map')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'fuzzy_map'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>🛡️</span>
            <span>{isEs ? 'Mapa Anti-Caza' : 'Anti-Poaching Map'}</span>
          </button>

          <button
            onClick={() => setSubTab('album')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'album'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>📸</span>
            <span>{isEs ? 'Álbum Colaborativo' : 'Community Album'} ({sightings.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: SPECIES CATALOG */}
      {subTab === 'catalog' && (
        <div className="space-y-4">
          
          {/* Search bar & 4 Classifications */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEs ? 'Buscar por especie, nombre científico, hábitat...' : 'Search species, scientific name, habitat...'}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            {/* 4 Classification Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {groupFilters.map(grp => (
                <button
                  key={grp.key}
                  onClick={() => setSelectedGroup(grp.key as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    selectedGroup === grp.key
                      ? 'bg-emerald-800 text-white dark:bg-emerald-500 dark:text-stone-950 font-extrabold shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <span>{isEs ? grp.label_es : grp.label_en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Species Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFauna.map((animal) => {
              const isSeen = userSeenFauna.some(item => item.specie_id === animal.id);
              return (
                <div
                  key={animal.id}
                  onClick={() => setSelectedFauna(animal)}
                  className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Photo */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={animal.image_url || animal.image}
                      alt={animal.common_name_es || animal.common_name?.es || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase">
                          UICN: {animal.conservation_status || animal.iucn_status || 'LC'}
                        </span>
                        {animal.is_national_symbol && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            {isEs ? 'Símbolo' : 'Symbol'}
                          </span>
                        )}
                        {animal.is_endemic && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase">
                            {isEs ? 'Endémica' : 'Endemic'}
                          </span>
                        )}
                      </div>

                      {isSeen && (
                        <span className="p-1 rounded-full bg-emerald-500 text-white shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* Nomenclature */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] font-mono italic text-emerald-300 block">
                        {animal.scientific_name}
                      </span>
                      <h3 className="text-lg font-black leading-tight drop-shadow-sm">
                        {isEs ? (animal.common_name_es || animal.common_name?.es) : (animal.common_name_en || animal.common_name?.en)}
                      </h3>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {isEs ? (animal.description_es || animal.description?.es) : (animal.description_en || animal.description?.en)}
                    </p>

                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[120px]">{animal.sound_name}</span>
                      </div>

                      <span className="text-stone-400 text-[11px] font-semibold">
                        {animal.sightings_count || 12} {isEs ? 'avistamientos' : 'sightings'}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUBTAB 2: VERIFIED SANCTUARIES */}
      {subTab === 'sanctuaries' && (
        <div className="space-y-5">
          <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                {isEs ? 'Santuarios y Centros de Rescate Animal Certificados por MINAE/SINAC' : 'MINAE/SINAC Certified Animal Rescue Sanctuaries'}
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 leading-relaxed">
                {isEs 
                  ? 'Apoya el turismo responsable. Estos centros están formalmente regulados bajo la Ley de Conservación de la Vida Silvestre (Ley N° 7317), rehabilitando y protegiendo fauna rescatada sin fines de lucro.'
                  : 'Support responsible wildlife tourism. These centers operate strictly under Costa Rica Wildlife Conservation Law N° 7317, rehabilitating rescued species.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sanctuaries.map(sanc => {
              const speciesList = sanc.featured_species || sanc.species_rescued || [];
              const desc = isEs ? (sanc.description_es || sanc.description?.es) : (sanc.description_en || sanc.description?.en);
              const photo = sanc.photo_url || sanc.image;
              const phone = sanc.phone || sanc.phone_whatsapp;
              const permit = sanc.permit_license || 'MINAE / SINAC Certificado';
              return (
                <div 
                  key={sanc.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full">
                      <img 
                        src={photo} 
                        alt={sanc.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />
                      
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {permit}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {sanc.canton ? `${sanc.canton}, ` : ''}{sanc.province}
                        </span>
                        <h3 className="text-lg font-black">{sanc.name}</h3>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {desc}
                      </p>

                      <div>
                        <span className="text-[11px] font-bold uppercase text-stone-400 block mb-1">
                          {isEs ? 'Especies en Rehabilitación:' : 'Species in Care:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {speciesList.map((sp, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold"
                            >
                              {sp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                      📞 {phone}
                    </span>
                    <a 
                      href={sanc.website} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      <span>{isEs ? 'Sitio Oficial' : 'Official Site'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: FUZZY ANTI-POACHING SIGHTING MAP */}
      {subTab === 'fuzzy_map' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block mb-1">
                {isEs ? 'Protocolo de Protección Anti-Caza Furtiva (Anti-Poaching Buffer)' : 'Anti-Poaching Spatial Protection Protocol'}
              </span>
              <p className="text-xs leading-relaxed opacity-90">
                {isEs
                  ? 'Para salvaguardar las especies endémicas y vulnerables de Costa Rica, las coordenadas exactas de avistamientos no son publicadas. El motor geoespacial de Descubriendo CR calcula una zona difusa de amortiguamiento (buffer de 8 a 25 km).'
                  : 'To protect endangered and endemic species, exact coordinates are obfuscated. Descubriendo CR applies randomized buffer zones (8 to 25 km radius).'}
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
                    src={animal.image_url || animal.image} 
                    alt={animal.common_name_es || animal.common_name?.es || ''}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                      {isEs ? (animal.common_name_es || animal.common_name?.es) : (animal.common_name_en || animal.common_name?.en)}
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
                  {(animal.fuzzy_hotspots || []).map((spot, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                        <div>
                          <span className="font-bold text-emerald-950 dark:text-emerald-200">{spot.name}</span>
                          <span className="text-emerald-700/80 dark:text-emerald-400/80 text-[11px] block">
                            {spot.region} • Radio difuso: ~{spot.radius_km} km
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

      {/* SUBTAB 4: COLLABORATIVE COMMUNITY ALBUM */}
      {subTab === 'album' && (
        <div className="space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>{isEs ? 'Álbum Colaborativo de Biodiversidad' : 'Collaborative Biodiversity Album'}</span>
              </h2>
              <p className="text-xs text-stone-500">
                {isEs 
                  ? 'Fotografías subidas a Supabase Storage con validación de hábitat seguro' 
                  : 'Wildlife photos stored in Supabase Storage with anti-poaching validation'}
              </p>
            </div>

            <button
              onClick={handleOpenReportModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isEs ? 'Publicar Mi Fotografía' : 'Publish My Photo'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sightings.map(s => {
              const isFollowing = isUserFollowed(s.author_id || s.user_id || 'usr-1');
              const showAllComments = expandedComments[s.id];
              const commentsList = s.comments || [];

              return (
                <div 
                  key={s.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Author Header Bar */}
                    <div className="p-3.5 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={s.author_avatar || s.user_avatar} 
                          alt={s.author_name || s.user_name}
                          className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                        />
                        <div>
                          <span className="font-bold text-xs text-stone-900 dark:text-white block">
                            {s.author_name || s.user_name}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {s.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Follow Photographer Button */}
                      <button
                        onClick={() => toggleFollowUser(s.author_id || s.user_id || 'usr-1', s.author_name || s.user_name)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          isFollowing
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
                        }`}
                      >
                        {isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                        <span>{isFollowing ? (isEs ? 'Siguiendo' : 'Following') : (isEs ? 'Seguir' : 'Follow')}</span>
                      </button>
                    </div>

                    {/* Photo */}
                    <div className="relative h-60 w-full">
                      <img 
                        src={s.photo_url || s.image} 
                        alt={s.specie_name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Safe Location Tag */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{s.location || s.location_name}</span>
                        </span>
                        <h3 className="text-base font-black">
                          {s.specie_name}
                        </h3>
                      </div>
                    </div>

                    {/* Notes & Badges */}
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-stone-700 dark:text-stone-300 italic leading-relaxed">
                        "{s.notes || s.description}"
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{isEs ? 'Ubicación Difusa Segura' : 'Protected Fuzzy Location'}</span>
                        </span>

                        {/* Upvote / Like Button */}
                        <button
                          onClick={() => likeSighting(s.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            s.liked_by_user
                              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 border border-rose-300 dark:border-rose-800'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${s.liked_by_user ? 'fill-current text-rose-600' : 'text-rose-500'}`} />
                          <span>{s.likes}</span>
                        </button>
                      </div>

                      {/* Comments Thread */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <span className="font-bold flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {commentsList.length} {isEs ? 'comentarios' : 'comments'}
                          </span>
                          {commentsList.length > 2 && (
                            <button
                              onClick={() => setExpandedComments(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                            >
                              {showAllComments ? (isEs ? 'Ver menos' : 'Show less') : (isEs ? 'Ver todos' : 'Show all')}
                            </button>
                          )}
                        </div>

                        {/* Display comments */}
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {(showAllComments ? commentsList : commentsList.slice(0, 2)).map(c => (
                            <div key={c.id} className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 text-[11px] space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-800 dark:text-stone-200">{c.author_name}</span>
                                <span className="text-[10px] text-stone-400">{c.timestamp}</span>
                              </div>
                              <p className="text-stone-600 dark:text-stone-300">{c.comment}</p>
                            </div>
                          ))}
                        </div>

                        {/* Add comment input */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <input
                            type="text"
                            value={commentInput[s.id] || ''}
                            onChange={(e) => setCommentInput(prev => ({ ...prev, [s.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(s.id); }}
                            placeholder={isEs ? 'Escribe un comentario...' : 'Add a comment...'}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleSendComment(s.id)}
                            className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
