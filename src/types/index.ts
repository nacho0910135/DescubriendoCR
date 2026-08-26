export type Language = 'es' | 'en';
export type Currency = 'USD' | 'CRC';
export type ThemeMode = 'light' | 'dark' | 'system';

export type ICTRegion = 
  | 'Valle Central'
  | 'Guanacaste'
  | 'Llanuras del Norte'
  | 'Pacífico Central'
  | 'Pacífico Sur'
  | 'Caribe';

export type CostaRicaProvince = 
  | 'San José'
  | 'Alajuela'
  | 'Cartago'
  | 'Heredia'
  | 'Guanacaste'
  | 'Puntarenas'
  | 'Limón';

export interface ExchangeRate {
  usd_to_crc: number;
  crc_to_usd: number;
  last_updated: string;
  source: 'BCCR' | 'system_exchange_rates';
}

export interface PlaceSpot {
  id: string;
  name: string;
  category: 'parque_nacional' | 'volcan' | 'catarata' | 'playa' | 'sendero' | 'reserva';
  province: CostaRicaProvince;
  region: ICTRegion;
  description_es: string;
  description_en: string;
  image: string;
  gallery: string[];
  lat: number;
  lng: number;
  entry_fee_usd: number;
  cst_certified?: boolean;
  difficulty: 'Fácil' | 'Moderado' | 'Desafiante';
  rating: number;
  reviews_count: number;
  highlights_es: string[];
  highlights_en: string[];
  schedule: string;
  is_featured?: boolean;
  likes_count: number;
  liked_by_user?: boolean;
}

export interface FaunaSpecie {
  id: string;
  common_name_es: string;
  common_name_en: string;
  common_name?: { es: string; en: string };
  scientific_name: string;
  category: 'anfibios' | 'aves' | 'mamiferos' | 'reptiles' | 'marino' | 'insectos' | string;
  classification_tag?: 'tours' | 'endemica' | 'simbolos' | 'santuarios';
  is_endemic?: boolean;
  is_national_symbol?: boolean;
  is_tour_observable?: boolean;
  observable_in_tours?: boolean;
  national_symbol_law?: string; // e.g., "Ley N° 9997 (2021)"
  iucn_status: 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | string; // Critically Endangered, Endangered, Vulnerable, Near Threatened, Least Concern
  conservation_status?: string;
  description_es: string;
  description_en: string;
  description?: { es: string; en: string };
  image: string;
  image_url?: string;
  gallery?: string[];
  habitat_es?: string;
  habitat_en?: string;
  elevation_range?: string;
  best_places?: string[];
  location_names?: string[];
  sound_name: string;
  sound_url?: string;
  anti_poaching_buffer_km?: number; // e.g. 15 km
  fuzzy_hotspots: {
    name: string;
    region: ICTRegion | string;
    lat: number;
    lng: number;
    radius_km: number;
    density: 'Alta' | 'Media' | 'Baja' | string;
  }[];
  sightings_count: number;
  diet_es?: string;
  diet_en?: string;
  curious_fact_es?: string;
  curious_fact_en?: string;
}

export interface VerifiedSanctuary {
  id: string;
  name: string;
  province: CostaRicaProvince | string;
  canton?: string;
  region: ICTRegion | string;
  location_name: string;
  description_es: string;
  description_en: string;
  description?: { es: string; en: string };
  image: string;
  photo_url?: string;
  species_rescued: string[];
  featured_species?: string[];
  mission_es: string;
  mission_en: string;
  permit_license?: string;
  phone_whatsapp?: string;
  phone?: string;
  website: string;
  visiting_hours: string;
  admission_usd: number;
  cst_certified: boolean;
  lat: number;
  lng: number;
  responsible_tips_es: string[];
  responsible_tips_en: string[];
}

export interface SightingComment {
  id: string;
  author_id?: string;
  user_id?: string;
  author_name?: string;
  user_name?: string;
  author_avatar?: string;
  user_avatar?: string;
  comment: string;
  timestamp?: string;
  created_at?: string;
}

export interface CommunitySighting {
  id: string;
  specie_id: string;
  fauna_id?: string;
  specie_name: string;
  user_id?: string;
  user_name?: string;
  user_avatar?: string;
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
  user_role?: string;
  location?: string;
  location_name: string;
  province?: CostaRicaProvince | string;
  region: ICTRegion | string;
  latitude?: number;
  longitude?: number;
  fuzzy_lat?: number;
  fuzzy_lng?: number;
  image?: string;
  photo_url?: string;
  timestamp: string;
  notes?: string;
  description?: string;
  likes: number;
  liked_by_user?: boolean;
  is_verified: boolean;
  is_vulnerable?: boolean;
  is_sensitive_location?: boolean;
  comments?: SightingComment[];
}

export interface UserSeenFaunaRecord {
  specie_id: string;
  specie_name: string;
  seen_date: string;
  location: string;
  notes?: string;
}

export type CommerceCategory = 
  | 'gastronomia' 
  | 'hospedajes' 
  | 'transporte_rentacar' 
  | 'guias_turisticos' 
  | 'tours_actividades'
  | 'eco_lodge'
  | 'soda_restaurante'
  | 'tour_operador'
  | 'escuela_surf'
  | 'aventura_canopy'
  | 'rent_a_car';

export interface CommerceMetrics {
  impressions: number;
  whatsapp_clicks: number;
  phone_calls: number;
  profile_views: number;
}

export interface RatingBreakdown {
  avg_rating: number;
  total_reviews: number;
  count_5_stars: number;
  count_4_stars: number;
  count_3_stars: number;
  count_2_stars: number;
  count_1_stars: number;
}

export interface ICTCommerce {
  id: string;
  name: string;
  category: CommerceCategory;
  main_category?: 'gastronomia' | 'hospedajes' | 'transporte_rentacar' | 'guias_turisticos' | 'tours_actividades';
  province: CostaRicaProvince;
  region: ICTRegion;
  description_es: string;
  description_en: string;
  cst_level: number; // 0 to 5 leaves of sustainability
  ict_verified: boolean;
  rating: number; // calculated from vw_target_ratings
  reviews_count: number;
  rating_breakdown?: RatingBreakdown;
  price_range_usd: string; // e.g. "$15 - $45"
  avg_price_usd: number;
  image: string;
  photos?: string[];
  whatsapp: string;
  phone: string;
  website: string;
  address: string;
  lat?: number;
  lng?: number;
  
  // Specific Badges
  accepts_sinpe: boolean;
  accepts_cards: boolean;
  pet_friendly: boolean;
  has_parking: boolean;
  
  amenities_es: string[];
  amenities_en: string[];
  
  // B2B & Monetization
  claimed: boolean;
  owner_id?: string;
  is_sponsored?: boolean; // Gold highlighted border and priority pinning
  sponsored_tier?: number;
  subscription_tier?: 'standard' | 'sponsored_gold';
  subscription_status?: 'active' | 'pending' | 'expired';
  metrics?: CommerceMetrics;
}

export type Commerce = ICTCommerce;

export interface UserSubscription {
  is_no_ads: boolean;
  plan: 'free_admob' | 'no_ads_premium';
  monthly_price_usd: number;
  subscribed_since?: string;
}

export interface MerchantSubscription {
  commerce_id: string;
  plan: 'standard_b2b' | 'sponsored_gold';
  monthly_price_usd: number;
  status: 'active' | 'pending' | 'expired';
  next_billing_date: string;
}

export interface FerryFareCategory {
  category_name_es: string;
  category_name_en: string;
  fee_crc: number;
  fee_usd: number;
  icon?: string;
  notes_es?: string;
}

export interface FerryDeparture {
  route: string; // "Puntarenas ⇄ Paquera"
  operator: string; // "Naviera Tambor"
  departure_time: string;
  duration: string;
  status: 'A Tiempo' | 'Embarcando' | 'Retrasado';
  terminal: string;
  passenger_fee_usd: number;
  car_fee_usd: number;
  booking_url?: string;
  fares?: FerryFareCategory[];
  daily_schedule?: string[];
  notes_es: string;
  notes_en: string;
}

export interface CIMARTideData {
  beach: string;
  region: ICTRegion;
  high_tide: string;
  low_tide: string;
  swell_meters: number;
  water_temp_c: number;
  surf_condition: 'Excelente' | 'Bueno' | 'Picado' | 'Precaución';
  is_coastal_hazard?: boolean;
  hazard_warning_es?: string;
  hazard_warning_en?: string;
  safe_window_es?: string;
  safe_window_en?: string;
}

export interface LiveWeatherData {
  temp_c: number;
  temp_max_c: number;
  temp_min_c: number;
  feels_like_c: number;
  condition: string;
  condition_description: string;
  humidity: number;
  uv_index: number;
  rain_probability: number;
  wind_kmh: number;
  sunrise: string;
  sunset: string;
  icon: string;
  is_cached?: boolean;
  cached_at?: string;
}

export interface LiveTideData {
  current_height_m: number;
  tide_state: 'pleamar' | 'bajamar' | 'subiendo' | 'bajando';
  next_high_tide: { time: string; height_m: number };
  next_low_tide: { time: string; height_m: number };
  is_high_tide_hazard: boolean; // Warning for sandbar/isthmus submerged
  hazard_message_es?: string;
  hazard_message_en?: string;
  safe_crossing_hours_es?: string;
  safe_crossing_hours_en?: string;
  water_temp_c?: number;
  swell_height_m?: number;
  is_cached?: boolean;
  cached_at?: string;
}

export interface EmbassyContact {
  id: string;
  country_es: string;
  country_en: string;
  flag_emoji: string;
  ambassador?: string;
  address: string;
  phone_office: string;
  phone_emergency_24h: string;
  email: string;
  website: string;
  visiting_hours: string;
}

export interface EmergencyPhone {
  id: string;
  name_es: string;
  name_en: string;
  phone: string;
  phone_display: string;
  description_es: string;
  description_en: string;
  category: 'policia' | 'medica' | 'bomberos' | 'parques' | 'transito' | 'turismo';
  is_toll_free?: boolean;
  badge?: string;
}

export interface SmartRecommendationQuery {
  available_time: 'half_day' | 'full_day' | 'weekend' | 'extended';
  user_lat?: number;
  user_lng?: number;
  province_fallback?: CostaRicaProvince | 'todas';
  preferred_categories: ('parque_nacional' | 'volcan' | 'catarata' | 'playa' | 'sendero' | 'reserva' | 'fauna')[];
  budget_level: 'economic' | 'moderate' | 'luxury';
  travel_group: 'solo' | 'couple' | 'family' | 'friends';
}

export interface RecommendationItinerary {
  id: string;
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  match_score: number; // percentage
  estimated_distance_km: number;
  estimated_drive_time_hours: number;
  estimated_budget_usd: number;
  estimated_budget_crc: number;
  weather_status_es: string;
  stops: {
    spot: PlaceSpot;
    time_slot: string;
    activity_es: string;
    activity_en: string;
    budget_usd: number;
    tips_es: string;
    tips_en: string;
  }[];
}

export interface OfflineStoredSpot {
  spot: PlaceSpot;
  saved_at: string;
  offline_notes?: string;
}

export interface WeatherForecast {
  region: ICTRegion;
  zone: string;
  temp_c: number;
  condition: 'Soleado' | 'Parcialmente Nublado' | 'Lluvia Tropical' | 'Neblina Montañosa' | 'Tormenta Eléctrica';
  rain_probability: number;
  humidity: number;
  uv_index: number;
  icon_type: 'sun' | 'cloud-sun' | 'cloud-rain' | 'cloud-fog' | 'cloud-lightning';
}

export interface RoadAlert {
  id: string;
  road: string; // "Ruta 32 (Braulio Carrillo)"
  section: string;
  status: 'Abierto' | 'Paso Regulado' | 'Cierre Preventivo';
  reason_es: string;
  reason_en: string;
  last_updated: string;
  alternate_route_es: string;
  alternate_route_en: string;
}

export type TabType = 'explorar' | 'fauna' | 'comercios' | 'logistica' | 'perfil';
