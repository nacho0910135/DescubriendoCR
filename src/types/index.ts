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
  scientific_name: string;
  category: 'anfibios' | 'aves' | 'mamiferos' | 'reptiles' | 'marino';
  iucn_status: 'CR' | 'EN' | 'VU' | 'NT' | 'LC'; // Critically Endangered, Endangered, Vulnerable, Near Threatened, Least Concern
  description_es: string;
  description_en: string;
  image: string;
  habitat_es: string;
  habitat_en: string;
  elevation_range: string;
  best_places: string[];
  sound_name: string;
  fuzzy_hotspots: {
    name: string;
    region: ICTRegion;
    lat: number;
    lng: number;
    radius_km: number;
    density: 'Alta' | 'Media' | 'Baja';
  }[];
  sightings_count: number;
}

export interface CommunitySighting {
  id: string;
  specie_id: string;
  specie_name: string;
  user_name: string;
  user_avatar: string;
  location_name: string;
  region: ICTRegion;
  fuzzy_lat: number;
  fuzzy_lng: number;
  image: string;
  timestamp: string;
  notes: string;
  likes: number;
  is_verified: boolean;
}

export interface ICTCommerce {
  id: string;
  name: string;
  category: 'eco_lodge' | 'soda_restaurante' | 'tour_operador' | 'escuela_surf' | 'aventura_canopy' | 'rent_a_car';
  province: CostaRicaProvince;
  region: ICTRegion;
  description_es: string;
  description_en: string;
  cst_level: number; // 1 to 5 leaves of sustainability
  ict_verified: boolean;
  rating: number;
  reviews_count: number;
  price_range_usd: string; // e.g. "$15 - $45"
  avg_price_usd: number;
  image: string;
  whatsapp: string;
  phone: string;
  website: string;
  address: string;
  amenities_es: string[];
  amenities_en: string[];
  claimed: boolean;
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
