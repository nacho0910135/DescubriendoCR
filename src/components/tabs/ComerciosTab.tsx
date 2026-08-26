import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ICTCommerce } from '../../types';
import { 
  Store, 
  ShieldCheck, 
  Leaf, 
  Star, 
  Phone, 
  MessageCircle, 
  Globe, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Building2, 
  Search,
  Filter,
  ExternalLink,
  Plus
} from 'lucide-react';

export const ComerciosTab: React.FC = () => {
  const { 
    commerces, 
    formatPrice, 
    setCommerceToClaim, 
    setIsClaimModalOpen, 
    requireAuth, 
    language, 
    t 
  } = useApp();

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cstFilter, setCstFilter] = useState<number>(0);
  const isEs = language === 'es';

  const categories = [
    { key: 'all', label_es: 'Todos', label_en: 'All' },
    { key: 'eco_lodge', label_es: 'Eco-Lodges 🏡', label_en: 'Eco-Lodges 🏡' },
    { key: 'soda_restaurante', label_es: 'Sodas & Gastronomía 🍲', label_en: 'Sodas & Local Food 🍲' },
    { key: 'tour_operador', label_es: 'Tours & Guías 🛶', label_en: 'Tours & Guides 🛶' },
    { key: 'aventura_canopy', label_es: 'Canopy & Aventura 🧗', label_en: 'Canopy & Adventure 🧗' },
  ];

  const filtered = commerces.filter(c => {
    const matchCat = selectedCat === 'all' || c.category === selectedCat;
    const matchSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isEs ? c.description_es : c.description_en).toLowerCase().includes(searchQuery.toLowerCase());
    const matchCst = cstFilter === 0 || c.cst_level >= cstFilter;
    return matchCat && matchSearch && matchCst;
  });

  const handleClaim = (commerce: ICTCommerce) => {
    requireAuth(
      isEs ? 'Portal B2B: Reclamar Comercio' : 'B2B: Claim Business',
      isEs ? 'Inicia sesión como representante o propietario para administrar este perfil comercial.' : 'Sign in as a business representative to manage this tourism profile.',
      () => {
        setCommerceToClaim(commerce);
        setIsClaimModalOpen(true);
      }
    );
  };

  const handleWhatsApp = (whatsapp: string, commerceName: string) => {
    const text = encodeURIComponent(
      isEs 
        ? `¡Hola! Los vi en la aplicación Descubriendo CR y deseo consultar disponibilidad para ${commerceName}. Pura Vida!` 
        : `Hello! I found your business on Discovering CR and would like to inquire about availability for ${commerceName}.`
    );
    window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div id="tab-comercios" className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-stone-900 p-6 text-white overflow-hidden shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Instituto Costarricense de Turismo (ICT) & CST</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white mb-2">
            {t('commerces.title')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
            {t('commerces.subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEs ? '1 a 5 Hojas de Sostenibilidad' : '1 to 5 Sustainability Leaves'}</span>
            </span>
            <span className="flex items-center gap-1 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEs ? 'Portal B2B & Pymes Ticas' : 'B2B & Local MSMEs'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEs ? 'Buscar hoteles ecológicos, sodas, tours o cantones...' : 'Search eco-lodges, sodas, tours, or locations...'}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCat(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat.key
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {isEs ? cat.label_es : cat.label_en}
            </button>
          ))}
        </div>

        {/* CST Level Filter */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-stone-400 font-bold shrink-0">{isEs ? 'Filtrar por CST:' : 'Filter by CST:'}</span>
          {[0, 3, 4, 5].map(lvl => (
            <button
              key={lvl}
              onClick={() => setCstFilter(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                cstFilter === lvl
                  ? 'bg-amber-500 text-white font-bold'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {lvl === 0 ? (isEs ? 'Todos los niveles' : 'All levels') : `🍃 ${lvl}+ Hojas`}
            </button>
          ))}
        </div>

      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((comm) => (
          <div
            key={comm.id}
            id={`commerce-card-${comm.id}`}
            className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image & CST Badges */}
            <div className="relative h-48 w-full">
              <img
                src={comm.image}
                alt={comm.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Badges Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-700/90 backdrop-blur-md text-white text-xs font-bold border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>ICT Oficial</span>
                </span>

                {/* CST Sustainability Leaves */}
                <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-xs font-black">
                  <span>🍃</span>
                  <span>{comm.cst_level}/5 CST</span>
                </div>
              </div>

              {/* Bottom Image Overlay */}
              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{comm.address} ({comm.province})</span>
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{comm.rating.toFixed(1)}</span>
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-black text-stone-900 dark:text-white leading-snug">
                  {comm.name}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {isEs ? comm.description_es : comm.description_en}
                </p>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(isEs ? comm.amenities_es : comm.amenities_en).map((am, i) => (
                    <span 
                      key={i}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    >
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & B2B/B2C Actions */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold">
                      {isEs ? 'Rango Tarifario Promedio:' : 'Average Price Range:'}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {comm.price_range_usd} ({formatPrice(comm.avg_price_usd)})
                    </span>
                  </div>

                  {/* B2B Claim status */}
                  <button
                    onClick={() => handleClaim(comm)}
                    className="text-[11px] text-stone-500 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-400 font-bold underline cursor-pointer"
                  >
                    {comm.claimed ? (isEs ? '✓ Verificado B2B' : '✓ Verified B2B') : t('commerces.claim_btn')}
                  </button>
                </div>

                {/* Direct WhatsApp Contact Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWhatsApp(comm.whatsapp, comm.name)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>{t('commerces.whatsapp_btn')}</span>
                  </button>

                  <a
                    href={`tel:${comm.phone}`}
                    className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                    title={comm.phone}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
