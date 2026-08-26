import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ICTCommerce, CommerceCategory } from '../../types';
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
  Plus,
  Crown,
  Sparkles,
  Smartphone,
  CreditCard,
  Dog,
  Car,
  Award,
  Zap,
  Info,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const ComerciosTab: React.FC = () => {
  const { 
    commerces, 
    formatPrice, 
    setCommerceToClaim, 
    setIsClaimModalOpen, 
    setIsRegisterCommerceModalOpen,
    trackCommerceClick,
    isNoAdsSubscriber,
    toggleNoAdsSubscription,
    requireAuth, 
    language, 
    t 
  } = useApp();

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cstFilter, setCstFilter] = useState<number>(0);
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>('all');
  const [selectedCommerceDetails, setSelectedCommerceDetails] = useState<ICTCommerce | null>(null);

  const isEs = language === 'es';

  const categories = [
    { key: 'all', label_es: 'Todos los Comercios', label_en: 'All Commerces', icon: '🇨🇷' },
    { key: 'gastronomia', label_es: 'Gastronomía & Sodas', label_en: 'Gastronomy & Sodas', icon: '🍲' },
    { key: 'hospedajes', label_es: 'Hospedajes & Eco-Lodges', label_en: 'Lodging & Eco-Lodges', icon: '🏡' },
    { key: 'transporte_rentacar', label_es: 'Transportes & Rent a Car', label_en: 'Transport & Car Rental', icon: '🚙' },
    { key: 'guias_turisticos', label_es: 'Guías Turísticos Certificados', label_en: 'Certified Tourist Guides', icon: '🥾' },
    { key: 'tours_actividades', label_es: 'Tours & Actividades', label_en: 'Tours & Activities', icon: '🛶' },
  ];

  // Map legacy category keys to main categories if necessary
  const matchesCategory = (commerce: ICTCommerce, catKey: string) => {
    if (catKey === 'all') return true;
    if (commerce.main_category === catKey || commerce.category === catKey) return true;
    if (catKey === 'gastronomia' && (commerce.category === 'soda_restaurante' || commerce.category === 'gastronomia')) return true;
    if (catKey === 'hospedajes' && (commerce.category === 'eco_lodge' || commerce.category === 'hospedajes')) return true;
    if (catKey === 'transporte_rentacar' && (commerce.category === 'rent_a_car' || commerce.category === 'transporte_rentacar')) return true;
    if (catKey === 'guias_turisticos' && (commerce.category === 'guias_turisticos')) return true;
    if (catKey === 'tours_actividades' && (commerce.category === 'tour_operador' || commerce.category === 'aventura_canopy' || commerce.category === 'escuela_surf' || commerce.category === 'tours_actividades')) return true;
    return false;
  };

  // Strictly sorted according to organic rating (vw_target_ratings) with Sponsored Gold pinned at top
  const sortedAndFiltered = useMemo(() => {
    return commerces
      .filter(c => {
        const matchCat = matchesCategory(c, selectedCat);
        const matchSearch = 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (isEs ? c.description_es : c.description_en).toLowerCase().includes(searchQuery.toLowerCase());
        const matchCst = cstFilter === 0 || c.cst_level >= cstFilter;
        
        let matchBadge = true;
        if (selectedBadgeFilter === 'sinpe') matchBadge = c.accepts_sinpe;
        if (selectedBadgeFilter === 'cards') matchBadge = c.accepts_cards;
        if (selectedBadgeFilter === 'pet') matchBadge = c.pet_friendly;
        if (selectedBadgeFilter === 'parking') matchBadge = c.has_parking;

        return matchCat && matchSearch && matchCst && matchBadge;
      })
      .sort((a, b) => {
        // Priority 1: Sponsored Gold pinning
        const aSponsored = a.is_sponsored || a.subscription_tier === 'sponsored_gold' ? 1 : 0;
        const bSponsored = b.is_sponsored || b.subscription_tier === 'sponsored_gold' ? 1 : 0;
        if (aSponsored !== bSponsored) {
          return bSponsored - aSponsored;
        }
        // Priority 2: Strict Organic Rating from real user reviews (vw_target_ratings)
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // Priority 3: Reviews count
        return (b.reviews_count || 0) - (a.reviews_count || 0);
      });
  }, [commerces, selectedCat, searchQuery, cstFilter, selectedBadgeFilter, isEs]);

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

  const handleWhatsApp = (commerce: ICTCommerce) => {
    trackCommerceClick(commerce.id, 'whatsapp');
    const text = encodeURIComponent(
      isEs 
        ? `¡Hola! Los vi en la aplicación Descubriendo CR y deseo consultar disponibilidad para ${commerce.name}. Pura Vida!` 
        : `Hello! I found your business on Discovering CR and would like to inquire about availability for ${commerce.name}.`
    );
    window.open(`https://wa.me/${commerce.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const handleCall = (commerce: ICTCommerce) => {
    trackCommerceClick(commerce.id, 'phone');
    window.location.href = `tel:${commerce.phone}`;
  };

  return (
    <div id="tab-comercios" className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-stone-900 p-6 text-white overflow-hidden shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Instituto Costarricense de Turismo (ICT) & Sellos CST Oficiales</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white">
            {t('commerces.title')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {isEs 
              ? 'Directorio de comercios, gastronomía típica, guías locales certificados y eco-lodges ordenados por calificación real de usuarios y sellos de sostenibilidad.' 
              : 'Official directory of Costa Rican sustainable hospitality, gastronomy, certified local guides, and eco-lodges.'}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="flex items-center gap-1.5 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEs ? '1 a 5 Hojas de Sostenibilidad CST' : '1 to 5 CST Sustainability Leaves'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEs ? 'Acepta SINPE Móvil & Tarjetas' : 'Accepts SINPE Mobile & Cards'}</span>
            </span>
            <button
              onClick={() => setIsRegisterCommerceModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 px-3.5 py-1.5 rounded-xl shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-stone-950" />
              <span>{isEs ? 'Registrar Mi Negocio ($20/mes)' : 'Register Enterprise ($20/mo)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google AdMob Non-Invasive Banner (Only shown if NOT subscribed to No-Ads) */}
      {!isNoAdsSubscriber ? (
        <div 
          id="admob-banner-top"
          className="rounded-2xl p-4 bg-stone-100 dark:bg-stone-850 border border-dashed border-stone-300 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-stone-300 dark:bg-stone-700 text-[10px] font-mono text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider">
              Anuncio AdMob
            </span>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {isEs 
                ? '¿Planeando viaje a Manuel Antonio o Arenal? Reserva shuttles y guías locales con descuento.' 
                : 'Planning a trip to Manuel Antonio or Arenal? Book certified local shuttles with special rates.'}
            </p>
          </div>

          <button
            onClick={toggleNoAdsSubscription}
            className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{isEs ? 'Quitar anuncios ($10/mes)' : 'Remove ads ($10/mo)'}</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isEs ? 'Suscripción No-Ads Activa ($10/mes)' : 'No-Ads Subscription Active ($10/mo)'}</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {isEs ? 'Navegación 100% limpia sin publicidad' : '100% clean ad-free browsing'}
          </span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="space-y-4 bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEs ? 'Buscar por nombre, soda tradicional, hotel ecológico, guía o provincia...' : 'Search by name, local soda, eco-lodge, guide or province...'}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categories Bar */}
        <div>
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
            {isEs ? 'Categorías Oficiales:' : 'Official Categories:'}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCat(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCat === cat.key
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isEs ? cat.label_es : cat.label_en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter: CST Sustainability & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
          
          {/* CST Leaves */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 font-bold shrink-0">{isEs ? 'Nivel CST:' : 'CST Level:'}</span>
            {[0, 4, 5].map(lvl => (
              <button
                key={lvl}
                onClick={() => setCstFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  cstFilter === lvl
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {lvl === 0 ? (isEs ? 'Todos' : 'All') : `🍃 ${lvl} Hojas`}
              </button>
            ))}
          </div>

          {/* Service Badges Filter */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
            <span className="text-stone-400 font-bold shrink-0">{isEs ? 'Servicios:' : 'Amenities:'}</span>
            
            <button
              onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'sinpe' ? 'all' : 'sinpe')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                selectedBadgeFilter === 'sinpe'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <Smartphone className="w-3 h-3 text-emerald-500" />
              <span>SINPE</span>
            </button>

            <button
              onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'cards' ? 'all' : 'cards')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                selectedBadgeFilter === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <CreditCard className="w-3 h-3 text-blue-500" />
              <span>{isEs ? 'Tarjetas' : 'Cards'}</span>
            </button>

            <button
              onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'pet' ? 'all' : 'pet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                selectedBadgeFilter === 'pet'
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <Dog className="w-3 h-3 text-purple-500" />
              <span>Pet Friendly</span>
            </button>

            <button
              onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'parking' ? 'all' : 'parking')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                selectedBadgeFilter === 'parking'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              <Car className="w-3 h-3 text-amber-500" />
              <span>{isEs ? 'Parqueo' : 'Parking'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Organic Ranking Notice */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-2">
        <div className="flex items-center gap-1.5 font-bold">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isEs 
              ? `Mostrando ${sortedAndFiltered.length} comercios (Orden orgánico por calificación promedio vw_target_ratings)` 
              : `Showing ${sortedAndFiltered.length} commerces (Organic ranking by average rating)`}
          </span>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sortedAndFiltered.map((comm) => {
          const isGold = comm.is_sponsored || comm.subscription_tier === 'sponsored_gold';
          return (
            <div
              key={comm.id}
              id={`commerce-card-${comm.id}`}
              className={`bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative ${
                isGold 
                  ? 'border-2 border-amber-400 dark:border-amber-500/80 shadow-amber-500/10' 
                  : 'border border-stone-200 dark:border-stone-800'
              }`}
            >
              {/* Sponsored Gold Ribbon if applicable */}
              {isGold && (
                <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 px-4 py-1 flex items-center justify-between font-black text-[11px] uppercase tracking-wider shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-stone-950 fill-stone-950" />
                    <span>{isEs ? 'Comercio Destacado Gold' : 'Gold Sponsored Merchant'}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-black/20 px-2 py-0.5 rounded-full">
                    {isEs ? 'Prioridad ICT' : 'ICT Priority'}
                  </span>
                </div>
              )}

              {/* Image & Badges */}
              <div className="relative h-48 w-full">
                <img
                  src={comm.image}
                  alt={comm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Badges Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-800/90 backdrop-blur-md text-white text-xs font-bold border border-emerald-400/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>ICT Verificado</span>
                  </span>

                  {/* CST Sustainability Leaves */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-300 text-xs font-black border border-emerald-500/30">
                    <span>🍃</span>
                    <span>{comm.cst_level}/5 CST</span>
                  </div>
                </div>

                {/* Bottom Image Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{comm.province}</span>
                  </span>
                  
                  {/* Rating with review count */}
                  <div className="flex items-center gap-1 bg-amber-500/90 text-stone-950 px-2 py-0.5 rounded-lg text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{comm.rating.toFixed(2)}</span>
                    <span className="text-[10px] opacity-80">({comm.reviews_count})</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-black text-stone-900 dark:text-white leading-snug">
                      {comm.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {isEs ? comm.description_es : comm.description_en}
                  </p>

                  {/* Specific Service Badges: SINPE, Tarjetas, Pet Friendly, Parqueo */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {comm.accepts_sinpe && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Smartphone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Acepta SINPE Móvil</span>
                      </span>
                    )}

                    {comm.accepts_cards && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <CreditCard className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>{isEs ? 'Tarjetas' : 'Credit Cards'}</span>
                      </span>
                    )}

                    {comm.pet_friendly && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        <Dog className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>Pet Friendly</span>
                      </span>
                    )}

                    {comm.has_parking && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Car className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>{isEs ? 'Parqueo' : 'Parking'}</span>
                      </span>
                    )}
                  </div>

                  {/* Amenities pills */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {(isEs ? comm.amenities_es : comm.amenities_en).slice(0, 3).map((am, i) => (
                      <span 
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
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
                        {isEs ? 'Tarifa Promedio Estimada:' : 'Estimated Price Range:'}
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

                  {/* Direct Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWhatsApp(comm)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span>{isEs ? 'Contactar por WhatsApp' : 'WhatsApp Contact'}</span>
                    </button>

                    <button
                      onClick={() => handleCall(comm)}
                      className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer"
                      title={comm.phone}
                    >
                      <Phone className="w-4 h-4" />
                    </button>

                    {comm.website && (
                      <a
                        href={comm.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                        title={comm.website}
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

