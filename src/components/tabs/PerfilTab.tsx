import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Bookmark, 
  Camera, 
  Building2, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Globe, 
  DollarSign, 
  Moon, 
  Sun, 
  Sparkles, 
  Heart, 
  ArrowRight,
  MapPin,
  Trash2,
  Crown,
  Eye,
  MessageCircle,
  Phone,
  BarChart3,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Zap,
  Smartphone,
  Star,
  ExternalLink
} from 'lucide-react';
import { ICTCommerce } from '../../types';

export const PerfilTab: React.FC = () => {
  const { 
    user, 
    userProfile, 
    isGuest, 
    userRole,
    setUserRole,
    isNoAdsSubscriber,
    toggleNoAdsSubscription,
    openAuthModal, 
    signOutUser, 
    favorites, 
    places, 
    setSelectedPlace,
    toggleFavoritePlace,
    sightings, 
    commerces,
    registerCommerce,
    upgradeCommerceTier,
    updateCommercePhotos,
    setIsRegisterCommerceModalOpen,
    activeMerchantCommerceId,
    setActiveMerchantCommerceId,
    setCommerceToClaim,
    setIsClaimModalOpen,
    currency, 
    toggleCurrency, 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    isDark,
    formatPrice,
    showToast,
    t 
  } = useApp();

  const [activeSection, setActiveSection] = useState<'favorites' | 'sightings' | 'noads' | 'b2b_dashboard' | 'settings'>('favorites');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const isEs = language === 'es';

  // Saved favorite spots
  const favoriteSpots = places.filter(p => favorites.includes(p.id));

  // User sightings
  const userSightings = sightings.filter(s => 
    (s.user_name || s.author_name || '').toLowerCase().includes((userProfile?.full_name || 'Explorador').toLowerCase()) || 
    s.id.startsWith('sight-')
  );

  // Managed B2B commerces
  const myCommerces = commerces.filter(c => c.claimed || c.owner_id === (user?.id || 'usr-merchant'));
  const currentCommerce: ICTCommerce = myCommerces.find(c => c.id === activeMerchantCommerceId) || myCommerces[0] || commerces[0];

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    const currentPhotos = currentCommerce.photos || [currentCommerce.image];
    updateCommercePhotos(currentCommerce.id, [...currentPhotos, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (photoUrl: string) => {
    const currentPhotos = currentCommerce.photos || [currentCommerce.image];
    if (currentPhotos.length <= 1) {
      showToast(isEs ? 'El comercio debe tener al menos una fotografía.' : 'Commerce must have at least one photo.');
      return;
    }
    updateCommercePhotos(currentCommerce.id, currentPhotos.filter(p => p !== photoUrl));
  };

  return (
    <div id="tab-perfil" className="space-y-6 pb-12">
      
      {/* Top Profile Card or Guest Welcome Banner */}
      {isGuest ? (
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 p-6 text-white shadow-xl border border-emerald-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl">
              🐸
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                {t('profile.guest_banner_title')}
              </span>
              <h2 className="text-xl font-black text-white">
                {isEs ? '¡Bienvenido a Costa Rica!' : 'Welcome to Costa Rica!'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            {t('profile.guest_banner_desc')}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              id="perfil-guest-login-btn"
              onClick={() => openAuthModal(
                isEs ? 'Iniciar Sesión en Supabase' : 'Sign in to Supabase',
                isEs ? 'Conecta tu cuenta para sincronizar tus viajes por Costa Rica.' : 'Connect your account to sync your Costa Rica travels.'
              )}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-black shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <User className="w-4 h-4" />
              <span>{t('profile.login_btn')}</span>
            </button>

            <button
              onClick={() => openAuthModal(
                isEs ? 'Crear Cuenta en Supabase' : 'Register with Supabase',
                isEs ? 'Regístrate gratis con tu correo o Google.' : 'Sign up free with email or Google.'
              )}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 cursor-pointer"
            >
              {t('profile.signup_btn')}
            </button>
          </div>
        </div>
      ) : (
        /* Logged in Profile Card */
        <div className="rounded-3xl bg-white dark:bg-stone-900 p-6 shadow-xs border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img 
              src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || 'tico'}`}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl border-2 border-emerald-500 p-0.5 bg-emerald-50 object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-lg font-black text-stone-900 dark:text-white">
                  {userProfile?.full_name || 'Explorador Tico'}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black uppercase">
                  {userRole === 'verified_merchant' ? 'Comerciante B2B' : (isEs ? 'Explorador B2C' : 'B2C Explorer')}
                </span>
                {isNoAdsSubscriber && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black uppercase flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>No-Ads</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 font-mono">
                {user?.email || 'explorador@puravida.com'}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEs ? 'Rango: Guardián de la Biodiversidad CR' : 'Rank: CR Biodiversity Guardian'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextRole = userRole === 'user' ? 'verified_merchant' : 'user';
                setUserRole(nextRole);
                setActiveSection(nextRole === 'verified_merchant' ? 'b2b_dashboard' : 'favorites');
                showToast(nextRole === 'verified_merchant' 
                  ? (isEs ? 'Modo Comerciante B2B activado.' : 'B2B Merchant Mode activated.') 
                  : (isEs ? 'Modo Explorador Turista activado.' : 'Tourist Explorer Mode activated.'));
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                userRole === 'verified_merchant'
                  ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-black shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{userRole === 'verified_merchant' ? (isEs ? 'Portal B2B Activo' : 'B2B Portal') : (isEs ? 'Ir a Modo B2B' : 'Switch to B2B')}</span>
            </button>

            <button
              onClick={signOutUser}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('profile.logout')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 rounded-2xl shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setActiveSection('favorites')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'favorites'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('profile.favorites')} ({favorites.length})
          </button>

          <button
            onClick={() => setActiveSection('sightings')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'sightings'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('profile.my_photos')} ({userSightings.length})
          </button>

          <button
            onClick={() => setActiveSection('noads')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeSection === 'noads'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>No-Ads ($10)</span>
          </button>

          <button
            onClick={() => setActiveSection('b2b_dashboard')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeSection === 'b2b_dashboard'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEs ? 'Panel B2B' : 'B2B Panel'}</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'settings'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('profile.settings')}
          </button>
        </div>
      </div>

      {/* 1. FAVORITES SECTION */}
      {activeSection === 'favorites' && (
        <div className="space-y-4">
          {favoriteSpots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteSpots.map(place => (
                <div
                  key={place.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center gap-3.5 justify-between"
                >
                  <div 
                    onClick={() => setSelectedPlace(place)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white line-clamp-1">
                        {place.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {place.province} • {formatPrice(place.entry_fee_usd)}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {place.region}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavoritePlace(place.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Eliminar de guardados"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <Bookmark className="w-10 h-10 text-stone-400 mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">
                {isEs ? 'No tienes destinos guardados aún' : 'No saved destinations yet'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {isEs ? 'Explora parques y senderos en la pestaña Explorar y toca el ícono de marcador para guardarlos.' : 'Browse spots in the Explore tab and tap the bookmark icon to save them.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. SIGHTINGS / PHOTOS SECTION */}
      {activeSection === 'sightings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSightings.map(s => (
              <div
                key={s.id}
                className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs"
              >
                <div className="relative h-40 w-full">
                  <img src={s.image} alt={s.specie_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <span className="text-xs font-bold text-emerald-300">{s.location_name}</span>
                    <h4 className="text-sm font-black">{s.specie_name}</h4>
                  </div>
                </div>
                <div className="p-3 text-xs text-stone-600 dark:text-stone-300 flex items-center justify-between">
                  <span className="italic">"{s.notes}"</span>
                  <span className="text-rose-500 font-bold flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>{s.likes}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MONETIZATION FREEMIUM B2C: NO-ADS SUBSCRIPTION */}
      {activeSection === 'noads' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 p-6 text-white border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-300/30">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black">
                    {isEs ? 'Suscripción No-Ads (Sin Anuncios)' : 'No-Ads Subscription'}
                  </h3>
                  <p className="text-xs text-stone-300">
                    {isEs ? '$10 USD / mes • Facturación mensual flexible' : '$10 USD / mo • Flexible monthly billing'}
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                isNoAdsSubscriber ? 'bg-emerald-500 text-stone-950' : 'bg-stone-700 text-stone-300'
              }`}>
                {isNoAdsSubscriber ? (isEs ? 'Plan Activo' : 'Active') : (isEs ? 'Plan Gratuito' : 'Free Mode')}
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {isEs 
                ? 'Disfruta de Descubriendo Costa Rica sin interrupciones publicitarias de Google AdMob en el directorio de comercios y fichas turísticas.' 
                : 'Enjoy Discovering Costa Rica with 100% ad-free experience, removing all Google AdMob banners across directories.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <span className="font-bold text-amber-300 block mb-1">🚫 Cero Publicidad</span>
                <span className="text-stone-300">Sin banners ni anuncios en toda la aplicación.</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <span className="font-bold text-emerald-300 block mb-1">⚡ Mayor Velocidad</span>
                <span className="text-stone-300">Carga instantánea de clima, mareas y fichas de destino.</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <span className="font-bold text-teal-300 block mb-1">🌿 Apoyo Conservación</span>
                <span className="text-stone-300">Tu suscripción financia la catalogación de biodiversidad.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                {isEs ? 'Estado: ' : 'Status: '}
                <span className={isNoAdsSubscriber ? 'text-emerald-400' : 'text-amber-400'}>
                  {isNoAdsSubscriber ? (isEs ? 'Suscrito ($10/mes)' : 'Subscribed ($10/mo)') : (isEs ? 'Modo Gratuito con Anuncios' : 'Free Mode with Ads')}
                </span>
              </span>

              <button
                onClick={toggleNoAdsSubscription}
                className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-lg cursor-pointer transition-all ${
                  isNoAdsSubscriber
                    ? 'bg-stone-700 hover:bg-stone-600 text-stone-200'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/30 active:scale-95'
                }`}
              >
                {isNoAdsSubscriber ? (isEs ? 'Pausar Suscripción' : 'Pause Subscription') : (isEs ? 'Activar No-Ads ($10/mes)' : 'Activate No-Ads ($10/mo)')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. B2B MERCHANT DASHBOARD SECTION */}
      {activeSection === 'b2b_dashboard' && (
        <div className="space-y-6">
          
          {/* Header & Business Switcher */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={currentCommerce.image} 
                alt={currentCommerce.name} 
                className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-stone-900 dark:text-white">
                    {currentCommerce.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black">
                    🍃 CST {currentCommerce.cst_level}/5
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  {currentCommerce.province} • {currentCommerce.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRegisterCommerceModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEs ? 'Registrar Otro Negocio' : 'Register New Business'}</span>
              </button>
            </div>
          </div>

          {/* Real-time B2B Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>{isEs ? 'Métricas de Tráfico & Conversión en Tiempo Real' : 'Real-time Traffic & Conversion Metrics'}</span>
              </h4>
              <span className="text-[11px] text-emerald-600 font-bold">
                {isEs ? 'Actualizado hoy' : 'Updated today'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-xs font-bold">{isEs ? 'Impresiones' : 'Impressions'}</span>
                  <Eye className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-2xl font-black text-stone-900 dark:text-white">
                  {currentCommerce.metrics?.impressions || 142}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-1">↑ +18% este mes</span>
              </div>

              <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-xs font-bold">WhatsApp Clics</span>
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {currentCommerce.metrics?.whatsapp_clicks || 24}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-1">Directo al chat</span>
              </div>

              <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-xs font-bold">{isEs ? 'Llamadas' : 'Phone Calls'}</span>
                  <Phone className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-2xl font-black text-stone-900 dark:text-white">
                  {currentCommerce.metrics?.phone_calls || 9}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">{currentCommerce.phone}</span>
              </div>

              <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-xs font-bold">{isEs ? 'Calificación' : 'Rating'}</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-2xl font-black text-amber-500">
                  {currentCommerce.rating.toFixed(1)} / 5.0
                </span>
                <span className="text-[10px] text-stone-400 block mt-1">{currentCommerce.reviews_count} reseñas</span>
              </div>
            </div>
          </div>

          {/* Subscription Tier Management */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-stone-900 dark:text-white">
                  {isEs ? 'Plan de Suscripción B2B' : 'B2B Subscription Plan'}
                </h4>
                <p className="text-xs text-stone-500">
                  {currentCommerce.subscription_tier === 'sponsored_gold'
                    ? (isEs ? 'Plan Destacado Gold Activo ($45/mes)' : 'Gold Sponsored Plan Active ($45/mo)')
                    : (isEs ? 'Plan Comercio Estándar Activo ($20/mes)' : 'Standard Commerce Plan Active ($20/mo)')}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                currentCommerce.subscription_tier === 'sponsored_gold'
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {currentCommerce.subscription_tier === 'sponsored_gold' ? '★ Destacado Gold' : 'B2B Estándar'}
              </span>
            </div>

            {currentCommerce.subscription_tier !== 'sponsored_gold' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1">
                    <Crown className="w-4 h-4 text-amber-600" />
                    {isEs ? 'Mejorar a Destacado Patrocinado Gold ($45/mes)' : 'Upgrade to Gold Sponsored Tier ($45/mo)'}
                  </span>
                  <p className="text-xs text-amber-800 dark:text-amber-400">
                    {isEs 
                      ? 'Obtén el borde dorado brillante y posiciónate de primero en el directorio para maximizar tus reservas de WhatsApp.' 
                      : 'Get the glowing gold border and top directory positioning to maximize your WhatsApp leads.'}
                  </p>
                </div>

                <button
                  onClick={() => upgradeCommerceTier(currentCommerce.id, 'sponsored_gold')}
                  className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {isEs ? 'Mejorar a Gold ($45/mes)' : 'Upgrade to Gold ($45/mo)'}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>✓ Tu comercio cuenta con la máxima visibilidad en el directorio oficial ICT.</span>
                <button
                  onClick={() => upgradeCommerceTier(currentCommerce.id, 'standard')}
                  className="text-stone-500 hover:text-stone-700 text-[11px] underline cursor-pointer"
                >
                  {isEs ? 'Cambiar a Plan Estándar ($20/mes)' : 'Switch to Standard ($20/mo)'}
                </button>
              </div>
            )}
          </div>

          {/* Photo Gallery Management */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>{isEs ? 'Gestión de Fotos del Negocio' : 'Business Photos Management'}</span>
                </h4>
                <p className="text-xs text-stone-500">
                  {isEs ? 'Administra las imágenes que ven los turistas en tu ficha comercial' : 'Manage images displayed to tourists on your commerce card'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(currentCommerce.photos || [currentCommerce.image]).map((imgUrl, index) => (
                <div key={index} className="relative group rounded-2xl overflow-hidden aspect-video border border-stone-200 dark:border-stone-700">
                  <img src={imgUrl} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleRemovePhoto(imgUrl)}
                      className="p-1.5 rounded-full bg-rose-600 text-white cursor-pointer hover:bg-rose-700"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add Photo Input */}
            <form onSubmit={handleAddPhoto} className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder={isEs ? 'Pegar URL de foto HD (Unsplash o imagen propia)...' : 'Paste photo URL (Unsplash or custom image)...'}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                {isEs ? 'Agregar Foto' : 'Add Photo'}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 5. SETTINGS SECTION */}
      {activeSection === 'settings' && (
        <div className="space-y-4 bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-2">
            {t('profile.settings')}
          </h3>

          <div className="space-y-3 divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            
            {/* Currency */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {t('profile.currency')}
                </span>
                <span className="text-stone-500">
                  {currency === 'CRC' ? 'Colones Costarricenses (₡)' : 'US Dollars ($)'}
                </span>
              </div>

              <button
                onClick={toggleCurrency}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700 cursor-pointer"
              >
                {currency === 'CRC' ? 'Cambiar a USD ($)' : 'Cambiar a CRC (₡)'}
              </button>
            </div>

            {/* Language */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {t('profile.language')}
                </span>
                <span className="text-stone-500">
                  {language === 'es' ? 'Español (Costa Rica)' : 'English (US)'}
                </span>
              </div>

              <button
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              </button>
            </div>

            {/* Dark Mode */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {t('profile.dark_mode')}
                </span>
                <span className="text-stone-500">
                  {isDark ? (isEs ? 'Modo Oscuro Activo' : 'Dark Mode Enabled') : (isEs ? 'Modo Claro Activo' : 'Light Mode Enabled')}
                </span>
              </div>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
              </button>
            </div>

            {/* Supabase connection indicator */}
            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-800 dark:text-stone-200 block">
                  {isEs ? 'Base de Datos Supabase' : 'Supabase Backend Database'}
                </span>
                <span className="text-stone-500 font-mono text-[10px]">
                  dxqezvkguswleoisxikz.supabase.co
                </span>
              </div>

              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

