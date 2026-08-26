import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  Currency, 
  ThemeMode, 
  TabType, 
  PlaceSpot, 
  FaunaSpecie, 
  VerifiedSanctuary,
  ICTCommerce, 
  CommunitySighting,
  UserSeenFaunaRecord,
  ExchangeRate
} from '../types';
import { 
  MOCK_PLACES, 
  MOCK_FAUNA, 
  MOCK_SANCTUARIES,
  MOCK_COMMERCES, 
  MOCK_COMMUNITY_SIGHTINGS, 
  INITIAL_EXCHANGE_RATE 
} from '../data/mockData';
import { 
  supabase, 
  SupabaseUserProfile, 
  getOrCreateUserProfile,
  uploadFaunaPhotoToStorage,
  recordUserFaunaSightingInDB,
  toggleLikeInDB,
  toggleFollowUserInDB
} from '../lib/supabase';
import confetti from 'canvas-confetti';

interface AuthModalConfig {
  isOpen: boolean;
  actionTitle?: string;
  actionDesc?: string;
  onSuccessCallback?: () => void;
}

interface AppContextType {
  // Navigation & Splash
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  
  // Theme & i18n
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  
  // Currency & Exchange Rate
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  exchangeRate: ExchangeRate;
  formatPrice: (usdAmount: number, forceCurrency?: Currency) => string;
  
  // Auth & Profile (Guest-First)
  user: any | null;
  userProfile: SupabaseUserProfile | null;
  isGuest: boolean;
  authModal: AuthModalConfig;
  openAuthModal: (title?: string, desc?: string, onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  requireAuth: (title: string, desc: string, callback: () => void) => void;
  signOutUser: () => Promise<void>;
  
  // App Data & Interactive State
  places: PlaceSpot[];
  fauna: FaunaSpecie[];
  sanctuaries: VerifiedSanctuary[];
  commerces: ICTCommerce[];
  sightings: CommunitySighting[];
  favorites: string[]; // place IDs
  userSeenFauna: UserSeenFaunaRecord[];
  followedUsers: string[]; // User IDs followed
  
  toggleFavoritePlace: (placeId: string) => void;
  likePlace: (placeId: string) => void;
  likeSighting: (sightingId: string) => void;
  toggleMarkAsSeenFauna: (faunaId: string, notes?: string) => void;
  isFaunaSeenByUser: (faunaId: string) => boolean;
  toggleFollowUser: (userId: string, userName?: string) => void;
  isUserFollowed: (userId: string) => boolean;
  addSightingComment: (sightingId: string, commentText: string) => void;
  addCommunitySighting: (newSighting: Omit<CommunitySighting, 'id' | 'likes' | 'timestamp' | 'is_verified'>) => void;
  uploadAndPublishSighting: (
    data: Omit<CommunitySighting, 'id' | 'likes' | 'timestamp' | 'is_verified'>, 
    file?: File | Blob
  ) => Promise<boolean>;
  claimCommerce: (commerceId: string, legalName: string, phone: string) => boolean;
  
  // Modal Overlays
  selectedPlace: PlaceSpot | null;
  setSelectedPlace: (place: PlaceSpot | null) => void;
  selectedFauna: FaunaSpecie | null;
  setSelectedFauna: (fauna: FaunaSpecie | null) => void;
  selectedSanctuary: VerifiedSanctuary | null;
  setSelectedSanctuary: (sanc: VerifiedSanctuary | null) => void;
  selectedCommerce: ICTCommerce | null;
  setSelectedCommerce: (commerce: ICTCommerce | null) => void;
  isNewSightingModalOpen: boolean;
  setIsNewSightingModalOpen: (open: boolean) => void;
  isClaimModalOpen: boolean;
  setIsClaimModalOpen: (open: boolean) => void;
  commerceToClaim: ICTCommerce | null;
  setCommerceToClaim: (commerce: ICTCommerce | null) => void;
  
  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Comprehensive dictionary for i18n
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header & Global
    'app.title': 'Descubriendo CR',
    'app.subtitle': 'Pura Vida Explorer',
    'header.exchange': 'T.C. BCCR:',
    'header.currency_btn': 'Cambiar moneda',
    'header.login_btn': 'Iniciar Sesión',
    'header.guest': 'Modo Explorador Anónimo',
    
    // Tabs
    'tab.explore': 'Explorar',
    'tab.fauna': 'Fauna CR',
    'tab.commerces': 'Comercios ICT',
    'tab.logistics': 'Logística & Clima',
    'tab.profile': 'Perfil',
    
    // Explorar Tab
    'explore.hero_title': 'Explora la magia natural de Costa Rica',
    'explore.hero_subtitle': 'Parques nacionales, volcanes, cataratas y senderos protegidos.',
    'explore.search_placeholder': 'Buscar parques, cataratas, playas o provincias...',
    'explore.filter_all': 'Todas las Regiones',
    'explore.filter_province': 'Provincia',
    'explore.filter_region': 'Región ICT',
    'explore.what_to_do_today': '¿Qué hacer hoy en Costa Rica?',
    'explore.road_alerts': 'Alertas Viales en Tiempo Real (MOPT / Waze)',
    'explore.map_view': 'Mapa Interactivo PostGIS',
    'explore.cards_view': 'Lista de Destinos',
    'explore.entry_fee': 'Entrada SINAC',
    'explore.difficulty': 'Dificultad',
    'explore.cst_certified': 'Certificado Sostenible CST',
    'explore.view_details': 'Ver Detalles',
    
    // Fauna Tab
    'fauna.title': 'Biodiversidad de Costa Rica',
    'fauna.subtitle': 'Catálogo de especies, mapa difuso anti-caza y álbum comunitario.',
    'fauna.tab_catalog': 'Catálogo de Especies',
    'fauna.tab_fuzzy_map': 'Mapa Difuso de Avistamientos',
    'fauna.tab_album': 'Álbum Colaborativo',
    'fauna.upload_btn': 'Reportar Avistamiento',
    'fauna.iucn_status': 'Estado de Conservación',
    'fauna.habitat': 'Hábitat Natural',
    'fauna.elevation': 'Rango de Altitud',
    'fauna.best_places': 'Mejores Zonas de Observación',
    'fauna.fuzzy_notice': 'Aviso de Protección: Las coordenadas mostradas son difusas por seguridad de la fauna silvestre.',
    'fauna.sound_sample': 'Escuchar canto / sonido',
    
    // Comercios Tab
    'commerces.title': 'Directorio Turístico ICT / CST',
    'commerces.subtitle': 'Alojamientos ecológicos, sodas auténticas, guías y operadores certificados.',
    'commerces.category_all': 'Todos',
    'commerces.category_lodge': 'Eco-Lodges',
    'commerces.category_soda': 'Sodas & Gastronomía',
    'commerces.category_tour': 'Tours & Guías',
    'commerces.category_surf': 'Escuelas de Surf',
    'commerces.category_canopy': 'Canopy & Aventura',
    'commerces.cst_level': 'Nivel CST',
    'commerces.ict_badge': 'Verificado ICT',
    'commerces.whatsapp_btn': 'Contactar por WhatsApp',
    'commerces.claim_btn': 'Reclamar Comercio (B2B)',
    'commerces.register_new': 'Registrar mi Empresa Turística',
    
    // Logística Tab
    'logistics.title': 'Logística, Ferries, Mareas & Clima',
    'logistics.subtitle': 'Información crucial para viajar seguro por todo el territorio nacional.',
    'logistics.ferries': 'Horarios de Ferries & Lanchas',
    'logistics.tides': 'Mareas & Oleaje (CIMAR)',
    'logistics.weather': 'Pronóstico Meteorológico por Microclimas',
    'logistics.roads': 'Estado de Rutas Nacionales',
    'logistics.departure': 'Próxima Salida',
    'logistics.fare_passengers': 'Tarifa Pasajeros',
    'logistics.fare_vehicle': 'Tarifa Vehículo Liviano',
    'logistics.high_tide': 'Pleamar (Marea Alta)',
    'logistics.low_tide': 'Bajamar (Marea Baja)',
    'logistics.swell': 'Oleaje',
    'logistics.surf_status': 'Condición Surf',
    
    // Perfil Tab
    'profile.title': 'Mi Perfil & Ajustes',
    'profile.guest_banner_title': 'Estás explorando en Modo Anónimo',
    'profile.guest_banner_desc': 'Crea tu cuenta gratis con Supabase para sincronizar tus sitios favoritos, subir fotos al álbum de fauna, recibir alertas y gestionar comercios.',
    'profile.login_btn': 'Ingresar con Correo',
    'profile.signup_btn': 'Crear Cuenta',
    'profile.google_btn': 'Continuar con Google',
    'profile.badge': 'Rango de Explorador',
    'profile.favorites': 'Mis Destinos Guardados',
    'profile.my_photos': 'Mis Avistamientos Reportados',
    'profile.b2b_portal': 'Portal para Empresas Turísticas (B2B)',
    'profile.settings': 'Preferencias de la App',
    'profile.dark_mode': 'Modo Oscuro',
    'profile.currency': 'Moneda Predeterminada',
    'profile.language': 'Idioma / Language',
    'profile.logout': 'Cerrar Sesión',
    'profile.session_active': 'Sesión Activa en Supabase',
    
    // Auth Modal
    'auth_modal.title': 'Acción de la Comunidad',
    'auth_modal.desc': 'Para realizar esta acción interactiva, inicia sesión o regístrate en Descubriendo CR.',
    'auth_modal.email': 'Correo Electrónico',
    'auth_modal.password': 'Contraseña',
    'auth_modal.name': 'Nombre Completo',
    'auth_modal.submit_login': 'Iniciar Sesión',
    'auth_modal.submit_signup': 'Registrarme Gratis',
    'auth_modal.switch_to_signup': '¿No tienes cuenta? Regístrate aquí',
    'auth_modal.switch_to_login': '¿Ya tienes cuenta? Inicia sesión aquí',
    'auth_modal.google_continue': 'Continuar con Google OAuth',
    'auth_modal.guest_continue': 'Continuar explorando como invitado',
  },
  en: {
    // Header & Global
    'app.title': 'Discovering CR',
    'app.subtitle': 'Pura Vida Explorer',
    'header.exchange': 'BCCR Exch:',
    'header.currency_btn': 'Change currency',
    'header.login_btn': 'Log In',
    'header.guest': 'Guest Explorer Mode',
    
    // Tabs
    'tab.explore': 'Explore',
    'tab.fauna': 'CR Wildlife',
    'tab.commerces': 'ICT Directory',
    'tab.logistics': 'Logistics & Weather',
    'tab.profile': 'Profile',
    
    // Explorar Tab
    'explore.hero_title': 'Explore the natural wonders of Costa Rica',
    'explore.hero_subtitle': 'National parks, volcanoes, waterfalls, and protected trails.',
    'explore.search_placeholder': 'Search parks, waterfalls, beaches or provinces...',
    'explore.filter_all': 'All Regions',
    'explore.filter_province': 'Province',
    'explore.filter_region': 'ICT Region',
    'explore.what_to_do_today': 'What to do today in Costa Rica?',
    'explore.road_alerts': 'Live Road Alerts (MOPT / Waze)',
    'explore.map_view': 'Interactive PostGIS Map',
    'explore.cards_view': 'Destinations List',
    'explore.entry_fee': 'SINAC Entrance Fee',
    'explore.difficulty': 'Difficulty',
    'explore.cst_certified': 'CST Certified Sustainable',
    'explore.view_details': 'View Details',
    
    // Fauna Tab
    'fauna.title': 'Costa Rica Biodiversity',
    'fauna.subtitle': 'Species catalog, anti-poaching fuzzy map, and community album.',
    'fauna.tab_catalog': 'Species Catalog',
    'fauna.tab_fuzzy_map': 'Fuzzy Sighting Map',
    'fauna.tab_album': 'Collaborative Album',
    'fauna.upload_btn': 'Report Sighting',
    'fauna.iucn_status': 'Conservation Status',
    'fauna.habitat': 'Natural Habitat',
    'fauna.elevation': 'Elevation Range',
    'fauna.best_places': 'Top Sightings Zones',
    'fauna.fuzzy_notice': 'Wildlife Protection Notice: Coordinates are obfuscated to protect wildlife from illegal poaching.',
    'fauna.sound_sample': 'Listen to wildlife call',
    
    // Comercios Tab
    'commerces.title': 'ICT / CST Tourism Directory',
    'commerces.subtitle': 'Eco-lodges, authentic local sodas, certified guides and adventure operators.',
    'commerces.category_all': 'All',
    'commerces.category_lodge': 'Eco-Lodges',
    'commerces.category_soda': 'Sodas & Local Food',
    'commerces.category_tour': 'Tours & Guides',
    'commerces.category_surf': 'Surf Schools',
    'commerces.category_canopy': 'Canopy & Adventure',
    'commerces.cst_level': 'CST Level',
    'commerces.ict_badge': 'ICT Verified',
    'commerces.whatsapp_btn': 'WhatsApp Contact',
    'commerces.claim_btn': 'Claim Business (B2B)',
    'commerces.register_new': 'Register My Tourism Enterprise',
    
    // Logística Tab
    'logistics.title': 'Logistics, Ferries, Tides & Weather',
    'logistics.subtitle': 'Essential travel intelligence for smooth transit across Costa Rica.',
    'logistics.ferries': 'Ferry & Boat Schedules',
    'logistics.tides': 'Tides & Ocean Swell (CIMAR)',
    'logistics.weather': 'Microclimate Weather Forecast',
    'logistics.roads': 'National Highway Status',
    'logistics.departure': 'Next Departure',
    'logistics.fare_passengers': 'Passenger Fare',
    'logistics.fare_vehicle': 'Standard Vehicle Fare',
    'logistics.high_tide': 'High Tide (Pleamar)',
    'logistics.low_tide': 'Low Tide (Bajamar)',
    'logistics.swell': 'Swell Height',
    'logistics.surf_status': 'Surf Condition',
    
    // Perfil Tab
    'profile.title': 'My Profile & Settings',
    'profile.guest_banner_title': 'You are browsing in Guest Mode',
    'profile.guest_banner_desc': 'Create a free account with Supabase to sync your favorite spots, contribute wildlife photos, receive notifications, and manage B2B business profiles.',
    'profile.login_btn': 'Sign In with Email',
    'profile.signup_btn': 'Sign Up',
    'profile.google_btn': 'Continue with Google',
    'profile.badge': 'Explorer Tier',
    'profile.favorites': 'My Saved Spots',
    'profile.my_photos': 'My Reported Sightings',
    'profile.b2b_portal': 'Tourism Business Portal (B2B)',
    'profile.settings': 'App Preferences',
    'profile.dark_mode': 'Dark Mode',
    'profile.currency': 'Default Currency',
    'profile.language': 'Language / Idioma',
    'profile.logout': 'Sign Out',
    'profile.session_active': 'Active Supabase Session',
    
    // Auth Modal
    'auth_modal.title': 'Community Action',
    'auth_modal.desc': 'To participate in this interactive feature, please sign in or register with Descubriendo CR.',
    'auth_modal.email': 'Email Address',
    'auth_modal.password': 'Password',
    'auth_modal.name': 'Full Name',
    'auth_modal.submit_login': 'Sign In',
    'auth_modal.submit_signup': 'Sign Up Free',
    'auth_modal.switch_to_signup': 'Don\'t have an account? Sign up here',
    'auth_modal.switch_to_login': 'Already have an account? Sign in here',
    'auth_modal.google_continue': 'Continue with Google OAuth',
    'auth_modal.guest_continue': 'Continue browsing as guest',
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Splash Screen (2 seconds timer as requested)
  const [showSplash, setShowSplash] = useState<boolean>(true);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<TabType>('explorar');
  
  // Theme & Language
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('es');
  
  // Currency & Exchange rate
  const [currency, setCurrency] = useState<Currency>('CRC');
  const [exchangeRate] = useState<ExchangeRate>(INITIAL_EXCHANGE_RATE);
  
  // Auth state
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(null);
  const isGuest = !user;
  
  // Data state
  const [places, setPlaces] = useState<PlaceSpot[]>(MOCK_PLACES);
  const [fauna] = useState<FaunaSpecie[]>(MOCK_FAUNA);
  const [sanctuaries] = useState<VerifiedSanctuary[]>(MOCK_SANCTUARIES);
  const [commerces, setCommerces] = useState<ICTCommerce[]>(MOCK_COMMERCES);
  const [sightings, setSightings] = useState<CommunitySighting[]>(MOCK_COMMUNITY_SIGHTINGS);
  const [favorites, setFavorites] = useState<string[]>(['spot-1', 'spot-3']);
  const [userSeenFauna, setUserSeenFauna] = useState<UserSeenFaunaRecord[]>([
    { specie_id: 'fauna-3', specie_name: 'Perezoso de Tres Dedos', seen_date: '2025-01-14', location: 'Manuel Antonio' },
    { specie_id: 'fauna-12', specie_name: 'Yigüirro', seen_date: '2025-02-01', location: 'Valle Central' }
  ]);
  const [followedUsers, setFollowedUsers] = useState<string[]>(['usr-1', 'usr-2']);
  
  // Modals state
  const [authModal, setAuthModal] = useState<AuthModalConfig>({ isOpen: false });
  const [selectedPlace, setSelectedPlace] = useState<PlaceSpot | null>(null);
  const [selectedFauna, setSelectedFauna] = useState<FaunaSpecie | null>(null);
  const [selectedSanctuary, setSelectedSanctuary] = useState<VerifiedSanctuary | null>(null);
  const [selectedCommerce, setSelectedCommerce] = useState<ICTCommerce | null>(null);
  const [isNewSightingModalOpen, setIsNewSightingModalOpen] = useState<boolean>(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const [commerceToClaim, setCommerceToClaim] = useState<ICTCommerce | null>(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Splash screen 2-second timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Theme synchronization with document class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      setIsDark(true);
    } else if (theme === 'light') {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        setIsDark(true);
      } else {
        root.classList.remove('dark');
        setIsDark(false);
      }
    }
  }, [theme]);

  // Supabase Auth listener
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        getOrCreateUserProfile(session.user).then(setUserProfile);
      }
    }).catch(err => console.warn('Supabase session load info:', err));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        getOrCreateUserProfile(session.user).then(setUserProfile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Translation helper
  const t = (key: string): string => {
    const dict = translations[language];
    return dict[key] || key;
  };

  // 1-Click Currency toggle
  const toggleCurrency = () => {
    setCurrency(prev => (prev === 'USD' ? 'CRC' : 'USD'));
    showToast(language === 'es' ? `Moneda cambiada a ${currency === 'USD' ? 'Colones Costarricenses (₡)' : 'Dólares ($)'}` : `Currency changed to ${currency === 'USD' ? 'Costa Rican Colones (₡)' : 'US Dollars ($)'}`);
  };

  // Format price dynamically in selected currency
  const formatPrice = (usdAmount: number, forceCurrency?: Currency): string => {
    const activeCurr = forceCurrency || currency;
    if (activeCurr === 'CRC') {
      const crcAmount = Math.round(usdAmount * exchangeRate.usd_to_crc);
      return `₡${crcAmount.toLocaleString('es-CR')}`;
    }
    return `$${usdAmount.toFixed(2)}`;
  };

  // Auth Guard interceptor
  const requireAuth = (title: string, desc: string, callback: () => void) => {
    if (user) {
      callback();
    } else {
      setAuthModal({
        isOpen: true,
        actionTitle: title,
        actionDesc: desc,
        onSuccessCallback: callback,
      });
    }
  };

  const openAuthModal = (title?: string, desc?: string, onSuccess?: () => void) => {
    setAuthModal({
      isOpen: true,
      actionTitle: title,
      actionDesc: desc,
      onSuccessCallback: onSuccess,
    });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false });
  };

  const signOutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    showToast(language === 'es' ? 'Has cerrado sesión. Modo explorador anónimo activado.' : 'Signed out. Guest mode active.');
  };

  // Toggle favorite place (Auth protected)
  const toggleFavoritePlace = (placeId: string) => {
    requireAuth(
      language === 'es' ? 'Guardar en Favoritos' : 'Save to Favorites',
      language === 'es' ? 'Inicia sesión para sincronizar tus destinos favoritos en la nube.' : 'Sign in to sync your favorite spots across devices.',
      () => {
        setFavorites(prev => {
          const exists = prev.includes(placeId);
          const next = exists ? prev.filter(id => id !== placeId) : [...prev, placeId];
          showToast(
            exists 
              ? (language === 'es' ? 'Eliminado de tus favoritos' : 'Removed from favorites')
              : (language === 'es' ? '¡Guardado en tus favoritos!' : 'Saved to your favorites!')
          );
          return next;
        });
      }
    );
  };

  // Like a spot (Auth protected)
  const likePlace = (placeId: string) => {
    requireAuth(
      language === 'es' ? 'Dar Me Gusta' : 'Like Spot',
      language === 'es' ? 'Inicia sesión para interactuar con la comunidad tica.' : 'Sign in to like spots and interact with the community.',
      () => {
        setPlaces(prev => prev.map(p => {
          if (p.id === placeId) {
            const nextLiked = !p.liked_by_user;
            return {
              ...p,
              liked_by_user: nextLiked,
              likes_count: nextLiked ? p.likes_count + 1 : p.likes_count - 1
            };
          }
          return p;
        }));
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      }
    );
  };

  // Like a sighting (Auth protected)
  const likeSighting = (sightingId: string) => {
    requireAuth(
      language === 'es' ? 'Votar Avistamiento' : 'Upvote Sighting',
      language === 'es' ? 'Inicia sesión para apoyar a los fotógrafos de fauna.' : 'Sign in to support wildlife photographers.',
      async () => {
        let isNowLiked = false;
        setSightings(prev => prev.map(s => {
          if (s.id === sightingId) {
            const hasLiked = s.liked_by_user || false;
            isNowLiked = !hasLiked;
            return { 
              ...s, 
              liked_by_user: !hasLiked,
              likes: hasLiked ? Math.max(0, s.likes - 1) : s.likes + 1 
            };
          }
          return s;
        }));
        
        // Sync to Supabase if connected
        if (user?.id) {
          toggleLikeInDB(user.id, 'sighting', sightingId).catch(err => console.log('Like DB sync note:', err));
        }

        if (isNowLiked) {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
          showToast(language === 'es' ? '¡Gracias por apoyar este reporte de fauna!' : 'Thanks for upvoting this wildlife report!');
        }
      }
    );
  };

  // Add comment to a sighting (Auth protected)
  const addSightingComment = (sightingId: string, commentText: string) => {
    if (!commentText.trim()) return;

    requireAuth(
      language === 'es' ? 'Comentar Avistamiento' : 'Comment on Sighting',
      language === 'es' ? 'Inicia sesión para participar en la discusión comunitaria.' : 'Sign in to participate in the community discussion.',
      () => {
        const authorName = userProfile?.full_name || user?.email?.split('@')[0] || 'Explorador CR';
        const newComment = {
          id: `cmt-${Date.now()}`,
          author_id: user?.id || 'usr-me',
          author_name: authorName,
          author_avatar: userProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          comment: commentText.trim(),
          timestamp: language === 'es' ? 'Hace un instante' : 'Just now'
        };

        setSightings(prev => prev.map(s => {
          if (s.id === sightingId) {
            return {
              ...s,
              comments: [...(s.comments || []), newComment]
            };
          }
          return s;
        }));
        showToast(language === 'es' ? 'Comentario publicado con éxito' : 'Comment published successfully');
      }
    );
  };

  // Follow / Unfollow user photographer (Auth protected)
  const toggleFollowUser = (targetUserId: string, targetUserName?: string) => {
    requireAuth(
      language === 'es' ? 'Seguir Explorador' : 'Follow Explorer',
      language === 'es' ? 'Inicia sesión para seguir a fotógrafos y naturalistas.' : 'Sign in to follow wildlife photographers and naturalists.',
      async () => {
        const isCurrentlyFollowed = followedUsers.includes(targetUserId);
        const nextList = isCurrentlyFollowed 
          ? followedUsers.filter(id => id !== targetUserId)
          : [...followedUsers, targetUserId];
        
        setFollowedUsers(nextList);

        if (user?.id) {
          toggleFollowUserInDB(user.id, targetUserId).catch(err => console.log('Follow sync note:', err));
        }

        const name = targetUserName || 'este explorador';
        showToast(
          isCurrentlyFollowed
            ? (language === 'es' ? `Dejaste de seguir a ${name}` : `Unfollowed ${name}`)
            : (language === 'es' ? `¡Ahora sigues a ${name}!` : `You are now following ${name}!`)
        );
      }
    );
  };

  const isUserFollowed = (targetUserId: string): boolean => {
    return followedUsers.includes(targetUserId);
  };

  // Life-list: mark species as seen in the wild
  const toggleMarkAsSeenFauna = (faunaId: string, notes?: string) => {
    requireAuth(
      language === 'es' ? 'Mi Lista de Vida Silvestre' : 'My Wildlife Life-List',
      language === 'es' ? 'Inicia sesión para registrar las especies que has avistado en Costa Rica.' : 'Sign in to record the species you have spotted in Costa Rica.',
      () => {
        const specieObj = fauna.find(f => f.id === faunaId);
        const isSeen = userSeenFauna.some(item => item.specie_id === faunaId);

        if (isSeen) {
          setUserSeenFauna(prev => prev.filter(item => item.specie_id !== faunaId));
          showToast(language === 'es' ? 'Especie removida de tu lista de vida' : 'Species removed from your life list');
        } else {
          const commonName = specieObj 
            ? (language === 'es' ? (specieObj.common_name_es || specieObj.common_name?.es) : (specieObj.common_name_en || specieObj.common_name?.en)) 
            : 'Especie';
          const newRecord: UserSeenFaunaRecord = {
            specie_id: faunaId,
            specie_name: commonName || 'Especie CR',
            seen_date: new Date().toISOString().split('T')[0],
            location: (specieObj?.location_names && specieObj.location_names[0]) || 'Costa Rica',
            notes: notes || undefined
          };
          setUserSeenFauna(prev => [newRecord, ...prev]);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          showToast(language === 'es' ? '¡Especie agregada a tu lista de avistamientos!' : 'Species added to your life list!');
        }
      }
    );
  };

  const isFaunaSeenByUser = (faunaId: string): boolean => {
    return userSeenFauna.some(item => item.specie_id === faunaId);
  };

  // Add new sighting (Direct or via file upload)
  const addCommunitySighting = (newSightingData: Omit<CommunitySighting, 'id' | 'likes' | 'timestamp' | 'is_verified'>) => {
    const newEntry: CommunitySighting = {
      ...newSightingData,
      id: `sight-${Date.now()}`,
      likes: 1,
      timestamp: language === 'es' ? 'Hace unos momentos' : 'Just now',
      is_verified: true,
      comments: []
    };
    setSightings(prev => [newEntry, ...prev]);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(language === 'es' ? '¡Avistamiento registrado con éxito en el álbum!' : 'Sighting published successfully!');
  };

  // Upload photo to Supabase Storage and publish sighting
  const uploadAndPublishSighting = async (
    sightingData: Omit<CommunitySighting, 'id' | 'likes' | 'timestamp' | 'is_verified'>,
    photoFile?: File | Blob
  ): Promise<boolean> => {
    let finalPhotoUrl = sightingData.photo_url || sightingData.image || '';

    if (photoFile) {
      showToast(language === 'es' ? 'Subiendo fotografía a Supabase Storage...' : 'Uploading photo to Supabase Storage...');
      const uploadRes = await uploadFaunaPhotoToStorage(photoFile, `fauna_${user?.id || 'usr'}_${Date.now()}.jpg`);
      if (uploadRes?.url) {
        finalPhotoUrl = uploadRes.url;
      }
    }

    const newEntry: CommunitySighting = {
      ...sightingData,
      image: finalPhotoUrl,
      photo_url: finalPhotoUrl,
      id: `sight-${Date.now()}`,
      likes: 1,
      timestamp: language === 'es' ? 'Hace unos momentos' : 'Just now',
      is_verified: true,
      comments: []
    };

    setSightings(prev => [newEntry, ...prev]);

    // Also persist in Supabase if user is logged in
    if (user?.id) {
      recordUserFaunaSightingInDB(
        user.id, 
        sightingData.specie_id || sightingData.fauna_id || 'fauna-1', 
        sightingData.notes || sightingData.description,
        sightingData.latitude || sightingData.fuzzy_lat,
        sightingData.longitude || sightingData.fuzzy_lng
      ).catch(err => console.log('DB sighting record note:', err));
    }

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(language === 'es' ? '¡Avistamiento publicado en el álbum colaborativo!' : 'Sighting published to collaborative album!');
    return true;
  };

  // Claim commerce B2B (Auth protected)
  const claimCommerce = (commerceId: string, legalName: string, phone: string): boolean => {
    setCommerces(prev => prev.map(c => {
      if (c.id === commerceId) {
        return { ...c, claimed: true, phone: phone || c.phone };
      }
      return c;
    }));
    showToast(language === 'es' ? `¡Solicitud de verificación B2B recibida para ${legalName}!` : `B2B verification requested for ${legalName}!`);
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        showSplash,
        setShowSplash,
        theme,
        setTheme,
        isDark,
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        toggleCurrency,
        exchangeRate,
        formatPrice,
        user,
        userProfile,
        isGuest,
        authModal,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        signOutUser,
        places,
        fauna,
        sanctuaries,
        commerces,
        sightings,
        favorites,
        userSeenFauna,
        followedUsers,
        toggleFavoritePlace,
        likePlace,
        likeSighting,
        toggleMarkAsSeenFauna,
        isFaunaSeenByUser,
        toggleFollowUser,
        isUserFollowed,
        addSightingComment,
        addCommunitySighting,
        uploadAndPublishSighting,
        claimCommerce,
        selectedPlace,
        setSelectedPlace,
        selectedFauna,
        setSelectedFauna,
        selectedSanctuary,
        setSelectedSanctuary,
        selectedCommerce,
        setSelectedCommerce,
        isNewSightingModalOpen,
        setIsNewSightingModalOpen,
        isClaimModalOpen,
        setIsClaimModalOpen,
        commerceToClaim,
        setCommerceToClaim,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
