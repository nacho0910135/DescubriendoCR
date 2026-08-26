import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  DollarSign, 
  Moon, 
  Sun, 
  User as UserIcon, 
  TrendingUp, 
  Sparkles,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    currency, 
    toggleCurrency, 
    exchangeRate, 
    theme, 
    setTheme, 
    isDark, 
    user, 
    userProfile, 
    isGuest, 
    openAuthModal, 
    setActiveTab,
    setShowSplash
  } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 transition-colors shadow-xs">
      {/* Top micro banner for Costa Rica Exchange Rate Ticker */}
      <div className="w-full bg-emerald-900 text-emerald-100 text-xs px-3 py-1 flex items-center justify-between overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'T.C. BCCR / Oficial:' : 'BCCR Exch Rate:'}</span>
            </span>
            <span className="font-mono text-emerald-50 bg-emerald-950/60 px-2 py-0.5 rounded-sm border border-emerald-700/50">
              1 USD = ₡{exchangeRate.usd_to_crc.toFixed(2)}
            </span>
            <span className="hidden sm:inline text-emerald-300/80 text-[11px]">
              • {language === 'es' ? 'Precios adaptados en tiempo real' : 'Real-time price sync'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick 1-click currency converter toggle */}
            <button
              id="header-currency-toggle"
              onClick={toggleCurrency}
              title={language === 'es' ? 'Alternar entre Dólares y Colones' : 'Toggle between USD and CRC'}
              className="flex items-center gap-1 text-xs font-bold bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white px-2.5 py-0.5 rounded-full transition-transform cursor-pointer border border-emerald-400/40 shadow-xs"
            >
              <span>{currency === 'CRC' ? '₡ CRC (Colones)' : '$ USD (Dólares)'}</span>
              <span className="text-[10px] opacity-75">⇄</span>
            </button>

            {/* ICT Official Verification mark */}
            <span className="hidden md:flex items-center gap-1 text-emerald-300 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>ICT Sostenible CR</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('explorar')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🐸</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-lg font-black tracking-tight text-stone-900 dark:text-white">
                Descubriendo<span className="text-emerald-600 dark:text-emerald-400">CR</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Pura Vida
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-emerald-500" />
              <span>Costa Rica • Guest-First</span>
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Replay Splash / Animation Mascot Button */}
          <button
            id="replay-splash-button"
            onClick={() => setShowSplash(true)}
            title={language === 'es' ? 'Ver animación de la rana y bandera' : 'Watch mascot & flag animation'}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-xs flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="hidden xl:inline text-xs">{language === 'es' ? 'Intro CR' : 'Intro'}</span>
          </button>

          {/* Language Switcher (i18n) */}
          <button
            id="header-language-toggle"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-200 hover:border-emerald-500 text-xs font-semibold transition-all cursor-pointer"
            title={language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Switcher (Dark / Light) */}
          <button
            id="header-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-200 hover:text-amber-500 dark:hover:text-amber-400 transition-all cursor-pointer"
            title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Currency Toggle Icon Button */}
          <button
            id="currency-pill-btn"
            onClick={toggleCurrency}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{currency}</span>
          </button>

          {/* Auth State / Profile Action */}
          {isGuest ? (
            <button
              id="header-login-btn"
              onClick={() => openAuthModal(
                language === 'es' ? 'Bienvenido a Descubriendo CR' : 'Welcome to Discovering CR',
                language === 'es' ? 'Inicia sesión con Supabase o continúa explorando anónimamente.' : 'Sign in with Supabase or continue anonymous exploration.'
              )}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'es' ? 'Iniciar Sesión' : 'Sign In'}</span>
              <span className="sm:hidden">{language === 'es' ? 'Ingresar' : 'Login'}</span>
            </button>
          ) : (
            <button
              id="header-profile-btn"
              onClick={() => setActiveTab('perfil')}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <img 
                src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || 'tico'}`}
                alt="Avatar"
                className="w-6 h-6 rounded-full border border-emerald-500 bg-white"
              />
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 max-w-[90px] truncate">
                {userProfile?.full_name || 'Explorador'}
              </span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
