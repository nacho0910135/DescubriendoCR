import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CostaRicaProvince, ICTRegion, PlaceSpot } from '../../types';
import { MOCK_ROAD_ALERTS } from '../../data/mockData';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Heart, 
  Bookmark, 
  Filter, 
  Layers, 
  Compass, 
  Clock, 
  DollarSign, 
  ChevronRight,
  Sun,
  Waves,
  Mountain,
  Trees,
  CheckCircle2
} from 'lucide-react';

const PROVINCES: ('Todas' | CostaRicaProvince)[] = [
  'Todas',
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
];

const REGIONS: ('Todas' | ICTRegion)[] = [
  'Todas',
  'Valle Central',
  'Guanacaste',
  'Llanuras del Norte',
  'Pacífico Central',
  'Pacífico Sur',
  'Caribe',
];

export const ExplorarTab: React.FC = () => {
  const { 
    places, 
    formatPrice, 
    setSelectedPlace, 
    favorites, 
    toggleFavoritePlace, 
    likePlace, 
    language,
    t 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<'Todas' | CostaRicaProvince>('Todas');
  const [selectedRegion, setSelectedRegion] = useState<'Todas' | ICTRegion>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const isEs = language === 'es';

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      const matchSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (isEs ? p.description_es : p.description_en).toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchProvince = selectedProvince === 'Todas' || p.province === selectedProvince;
      const matchRegion = selectedRegion === 'Todas' || p.region === selectedRegion;
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;

      return matchSearch && matchProvince && matchRegion && matchCat;
    });
  }, [places, searchQuery, selectedProvince, selectedRegion, selectedCategory, isEs]);

  const featuredSpot = places.find(p => p.id === 'spot-1') || places[0];

  return (
    <div id="tab-explorar" className="space-y-6 pb-12">
      
      {/* Live MOPT / Waze Road Alert Ticker */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
            <span>{t('explore.road_alerts')}</span>
          </div>
          <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-mono">
            {isEs ? 'Actualizado en vivo' : 'Live Sync'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {MOCK_ROAD_ALERTS.map(alert => (
            <div 
              key={alert.id}
              className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-100 dark:border-amber-950 text-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-stone-900 dark:text-white truncate max-w-[170px]">
                  {alert.road}
                </span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  alert.status === 'Abierto' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {alert.status}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                {isEs ? alert.reason_es : alert.reason_en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hero "Qué hacer hoy" / Curated Destination */}
      {featuredSpot && (
        <div 
          onClick={() => setSelectedPlace(featuredSpot)}
          className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200 dark:border-stone-800 cursor-pointer group transition-all"
        >
          <div className="relative h-64 sm:h-80 w-full">
            <img 
              src={featuredSpot.image} 
              alt={featuredSpot.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('explore.what_to_do_today')}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                {featuredSpot.region}
              </span>
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{featuredSpot.province}, Costa Rica</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">★ {featuredSpot.rating.toFixed(1)}</span>
              </div>
              
              <h2 className="text-xl sm:text-3xl font-black leading-tight drop-shadow-md">
                {featuredSpot.name}
              </h2>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-300">{isEs ? 'Entrada:' : 'Entrance:'}</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {formatPrice(featuredSpot.entry_fee_usd)}
                  </span>
                </div>

                <span className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t('explore.view_details')}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="space-y-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        
        {/* Search Bar & View Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="search-destinations-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('explore.search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 w-full sm:w-auto justify-center">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              {t('explore.cards_view')}
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              {t('explore.map_view')}
            </button>
          </div>
        </div>

        {/* ICT Regions Horizontal Scroll Pill Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-stone-400 shrink-0 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isEs ? 'Región:' : 'Region:'}</span>
          </span>
          {REGIONS.map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {reg === 'Todas' ? t('explore.filter_all') : reg}
            </button>
          ))}
        </div>

        {/* Province Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-stone-400 shrink-0 mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isEs ? 'Provincia:' : 'Province:'}</span>
          </span>
          {PROVINCES.map(prov => (
            <button
              key={prov}
              onClick={() => setSelectedProvince(prov)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedProvince === prov
                  ? 'bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>

      </div>

      {/* MAP VIEW MODE (Interactive PostGIS / Vector Map Simulation) */}
      {viewMode === 'map' ? (
        <div className="relative rounded-3xl bg-emerald-950 border border-emerald-800 overflow-hidden shadow-xl min-h-[440px] flex flex-col justify-between p-4 text-white">
          {/* Map Top Bar */}
          <div className="flex items-center justify-between z-10 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  PostGIS Spatial GIS Layer • Costa Rica
                </h3>
                <p className="text-[11px] text-stone-300">
                  {filteredPlaces.length} {isEs ? 'geopuntos activos cargados' : 'active geopoints loaded'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono bg-emerald-900/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-600">
              EPSG: 4326 (WGS 84)
            </span>
          </div>

          {/* Simulated Interactive Map Canvas */}
          <div className="relative w-full h-80 my-4 flex items-center justify-center">
            {/* Costa Rica Geographic Silhouette Background */}
            <svg viewBox="0 0 500 300" className="w-full h-full opacity-40">
              <path 
                d="M 50,120 Q 120,40 220,50 Q 300,40 420,130 Q 480,180 430,240 Q 320,250 250,210 Q 180,240 120,200 Z" 
                fill="#065f46" 
                stroke="#10b981" 
                strokeWidth="3"
              />
              <path d="M 120,200 Q 180,280 260,260" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" fill="none" />
              <text x="70" y="80" fill="#a7f3d0" fontSize="12" fontWeight="bold">GUANACASTE</text>
              <text x="210" y="90" fill="#a7f3d0" fontSize="12" fontWeight="bold">ARENAL / NORTE</text>
              <text x="220" y="160" fill="#a7f3d0" fontSize="12" fontWeight="bold">VALLE CENTRAL</text>
              <text x="360" y="120" fill="#a7f3d0" fontSize="12" fontWeight="bold">CARIBE</text>
              <text x="300" y="260" fill="#a7f3d0" fontSize="12" fontWeight="bold">OSA / PACÍFICO SUR</text>
            </svg>

            {/* Geopoint Pins mapped across CR */}
            {filteredPlaces.map((place, idx) => {
              // Map lat/lng roughly to coordinates in the visual map
              // CR Lat range: 8.5 to 11.0 (~2.5 deg)
              // CR Lng range: -86.0 to -82.5 (~3.5 deg)
              const posX = Math.min(Math.max(((place.lng - (-86.0)) / 3.5) * 100, 10), 88);
              const posY = Math.min(Math.max(((11.0 - place.lat) / 2.5) * 100, 15), 85);
              const isActive = activePinId === place.id;

              return (
                <div
                  key={place.id}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  onClick={() => {
                    setActivePinId(place.id);
                    setSelectedPlace(place);
                  }}
                >
                  <div className="relative cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-125 transition-transform">
                      <span className="text-xs font-bold">📍</span>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xl border border-emerald-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      {place.name} ({formatPrice(place.entry_fee_usd)})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="z-10 bg-black/50 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-stone-300">
              💡 {isEs ? 'Toca cualquier pin para abrir la ficha de parque o sendero.' : 'Tap any pin to open national park details.'}
            </span>
            <button 
              onClick={() => setViewMode('cards')}
              className="text-emerald-400 font-bold underline cursor-pointer"
            >
              {isEs ? 'Volver a lista' : 'Back to cards'}
            </button>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaces.map((place) => {
            const isFav = favorites.includes(place.id);

            return (
              <div
                key={place.id}
                id={`spot-card-${place.id}`}
                className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Card Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                  {/* Top Tags */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {place.province}
                    </span>

                    {/* Bookmark Favorite button (Auth Guarded) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoritePlace(place.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isFav
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-300">
                      {place.region}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                      {place.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 
                        onClick={() => setSelectedPlace(place)}
                        className="font-extrabold text-base text-stone-900 dark:text-white group-hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {place.name}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {isEs ? place.description_es : place.description_en}
                    </p>
                  </div>

                  {/* Pricing, Likes & Details Button */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        {t('explore.entry_fee')}
                      </span>
                      <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                        {formatPrice(place.entry_fee_usd)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Like button (Auth guarded) */}
                      <button
                        onClick={() => likePlace(place.id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          place.liked_by_user
                            ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                            : 'text-stone-500 hover:text-rose-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${place.liked_by_user ? 'fill-current text-rose-600' : ''}`} />
                        <span>{place.likes_count}</span>
                      </button>

                      {/* Detail CTA */}
                      <button
                        onClick={() => setSelectedPlace(place)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        {isEs ? 'Ver' : 'View'}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {filteredPlaces.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <Trees className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            {isEs ? 'No se encontraron destinos' : 'No destinations found'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isEs ? 'Intenta modificar tus filtros o término de búsqueda.' : 'Try changing your search filters.'}
          </p>
        </div>
      )}

    </div>
  );
};
