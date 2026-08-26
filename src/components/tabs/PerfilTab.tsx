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
  Trash2
} from 'lucide-react';

export const PerfilTab: React.FC = () => {
  const { 
    user, 
    userProfile, 
    isGuest, 
    openAuthModal, 
    signOutUser, 
    favorites, 
    places, 
    setSelectedPlace,
    toggleFavoritePlace,
    sightings, 
    commerces,
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
    t 
  } = useApp();

  const [activeSection, setActiveSection] = useState<'favorites' | 'sightings' | 'b2b' | 'settings'>('favorites');
  const isEs = language === 'es';

  // Saved favorite spots
  const favoriteSpots = places.filter(p => favorites.includes(p.id));

  // User sightings
  const userSightings = sightings.filter(s => 
    (s.user_name || s.author_name || '').toLowerCase().includes((userProfile?.full_name || 'Explorador').toLowerCase()) || 
    s.id.startsWith('sight-')
  );

  // Claimed or manageable B2B commerces
  const myCommerces = commerces.filter(c => c.claimed);

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
                  {isEs ? 'Verificado' : 'Verified'}
                </span>
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

          <button
            onClick={signOutUser}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('profile.logout')}</span>
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-1.5 rounded-2xl shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setActiveSection('favorites')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'favorites'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('profile.favorites')} ({favorites.length})
          </button>

          <button
            onClick={() => setActiveSection('sightings')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'sightings'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('profile.my_photos')}
          </button>

          <button
            onClick={() => setActiveSection('b2b')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'b2b'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {t('profile.b2b_portal')}
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === 'settings'
                ? 'bg-emerald-600 text-white shadow-sm'
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
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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

      {/* 3. B2B PORTAL SECTION */}
      {activeSection === 'b2b' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                  {isEs ? 'Directorio Oficial ICT para Operadores' : 'Official ICT Operator Directory'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isEs ? 'Reclama tu comercio o registra una nueva empresa turística en Costa Rica' : 'Claim your tourism business or register a new venture in Costa Rica'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                {isEs ? 'Comercios Gestionados:' : 'Managed Businesses:'}
              </span>
              <div className="space-y-2">
                {myCommerces.map(comm => (
                  <div 
                    key={comm.id}
                    className="p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">{comm.name}</span>
                      <span className="text-stone-500">{comm.province} • Nivel CST {comm.cst_level}/5</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                      {isEs ? 'Verificado B2B' : 'Verified B2B'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SETTINGS SECTION */}
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
