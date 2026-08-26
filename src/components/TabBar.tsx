import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { 
  Compass, 
  Leaf, 
  Store, 
  Navigation, 
  User, 
  Flame
} from 'lucide-react';

interface TabItem {
  key: TabType;
  label_es: string;
  label_en: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const TABS: TabItem[] = [
  {
    key: 'explorar',
    label_es: 'Explorar',
    label_en: 'Explore',
    icon: Compass,
  },
  {
    key: 'fauna',
    label_es: 'Fauna CR',
    label_en: 'CR Wildlife',
    icon: Leaf,
    badge: 'Bio',
  },
  {
    key: 'comercios',
    label_es: 'Comercios ICT',
    label_en: 'ICT Directory',
    icon: Store,
    badge: 'CST',
  },
  {
    key: 'logistica',
    label_es: 'Logística & Clima',
    label_en: 'Logistics & Weather',
    icon: Navigation,
  },
  {
    key: 'perfil',
    label_es: 'Perfil',
    label_en: 'Profile',
    icon: User,
  },
];

export const TabBar: React.FC = () => {
  const { activeTab, setActiveTab, language, favorites } = useApp();

  return (
    <nav 
      id="main-app-tabbar"
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 px-2 py-1.5 shadow-lg transition-colors md:relative md:border-t-0 md:bg-transparent md:backdrop-blur-none md:shadow-none"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-around md:justify-center md:gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const label = language === 'es' ? tab.label_es : tab.label_en;
          const isProfileWithBadge = tab.key === 'perfil' && favorites.length > 0;

          return (
            <button
              key={tab.key}
              id={`tab-btn-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex flex-col md:flex-row items-center justify-center gap-1 py-1.5 px-3 md:px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold md:bg-emerald-50 md:dark:bg-emerald-950/60'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {/* Active indicator dot on mobile */}
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-emerald-500 md:hidden animate-pulse" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-emerald-600 dark:text-emerald-400' : ''}`} />
                
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[9px] font-black px-1 rounded-full leading-none py-0.5">
                    {tab.badge}
                  </span>
                )}
                
                {isProfileWithBadge && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </div>

              <span className="text-[11px] md:text-sm tracking-tight whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
