/**
 * Costa Rica Smart Trip Recommender Engine ("Qué Hacer Hoy")
 * Uses PostGIS distance computation (st_distance / Haversine) and multi-factor
 * scoring (budget, time availability, category affinity, pace) to assemble optimized itineraries.
 */

import { PlaceSpot, SmartRecommendationQuery, RecommendationItinerary, CostaRicaProvince } from '../types';
import { MOCK_PLACES } from '../data/mockData';

// Coordinates for Province Centroids in Costa Rica
export const PROVINCE_CENTROIDS: Record<CostaRicaProvince, { lat: number; lng: number }> = {
  'San José': { lat: 9.9281, lng: -84.0907 },
  'Alajuela': { lat: 10.0163, lng: -84.2116 },
  'Cartago': { lat: 9.8644, lng: -83.9194 },
  'Heredia': { lat: 9.9989, lng: -84.1165 },
  'Guanacaste': { lat: 10.6346, lng: -85.4407 },
  'Puntarenas': { lat: 9.9763, lng: -84.8384 },
  'Limón': { lat: 9.9911, lng: -83.0360 },
};

/**
 * Calculates Haversine distance in kilometers between two GPS points (PostGIS st_distance equivalent)
 */
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Generates custom itineraries based on user's GPS position, time, categories, and budget.
 */
export function generateSmartRecommendations(
  query: SmartRecommendationQuery,
  availablePlaces: PlaceSpot[] = MOCK_PLACES
): RecommendationItinerary[] {
  // 1. Resolve starting GPS coordinate
  let startLat = query.user_lat;
  let startLng = query.user_lng;

  if (startLat === undefined || startLng === undefined) {
    const prov = (query.province_fallback && query.province_fallback !== 'todas') 
      ? query.province_fallback 
      : 'San José';
    const centroid = PROVINCE_CENTROIDS[prov as CostaRicaProvince] || PROVINCE_CENTROIDS['San José'];
    startLat = centroid.lat;
    startLng = centroid.lng;
  }

  // 2. Score and rank all places relative to user
  const scoredPlaces = availablePlaces.map(place => {
    const distKm = calculateHaversineDistanceKm(startLat!, startLng!, place.lat, place.lng);
    let score = 50;

    // Category preference boost
    if (query.preferred_categories.length > 0) {
      if (query.preferred_categories.includes(place.category as any)) {
        score += 35;
      }
    } else {
      score += 20;
    }

    // Distance appropriateness
    if (query.available_time === 'half_day') {
      if (distKm < 50) score += 30;
      else if (distKm < 90) score += 10;
      else score -= 40; // Too far for half day
    } else if (query.available_time === 'full_day') {
      if (distKm < 130) score += 25;
      else score -= 15;
    } else {
      // Weekend or extended
      score += 20; // Long distance is fine
    }

    // Rating & sustainability boost
    score += (place.rating - 4.0) * 15;
    if (place.cst_certified) score += 5;

    // Budget match
    if (query.budget_level === 'economic' && place.entry_fee_usd <= 15) score += 15;
    if (query.budget_level === 'moderate' && place.entry_fee_usd <= 30) score += 10;

    return {
      place,
      distKm,
      score,
    };
  });

  // Sort descending by score
  scoredPlaces.sort((a, b) => b.score - a.score);

  const topPlaces = scoredPlaces.slice(0, 6);
  if (topPlaces.length === 0) return [];

  const itineraries: RecommendationItinerary[] = [];

  // Plan A: Main Highlight Itinerary
  const mainCandidate = topPlaces[0];
  const secondCandidate = topPlaces[1] || topPlaces[0];
  const thirdCandidate = topPlaces[2] || topPlaces[0];

  if (query.available_time === 'half_day') {
    itineraries.push({
      id: 'itin-half-day-1',
      title_es: `Escape Express a ${mainCandidate.place.name}`,
      title_en: `Express Getaway to ${mainCandidate.place.name}`,
      summary_es: `Circuito de medio día optimizado para explorar ${mainCandidate.place.region} sin prisas, con tiempo de almuerzo en soda típica.`,
      summary_en: `Half-day circuit optimized to explore ${mainCandidate.place.region} at a leisurely pace, with lunch at a local soda.`,
      match_score: 96,
      estimated_distance_km: mainCandidate.distKm,
      estimated_drive_time_hours: Math.round((mainCandidate.distKm / 45) * 10) / 10,
      estimated_budget_usd: Math.round(mainCandidate.place.entry_fee_usd + 15),
      estimated_budget_crc: Math.round((mainCandidate.place.entry_fee_usd + 15) * 518),
      weather_status_es: 'Condiciones climáticas favorables en la mañana',
      stops: [
        {
          spot: mainCandidate.place,
          time_slot: '08:00 AM - 11:30 AM',
          activity_es: `Recorrido guiado y caminata por senderos principales de ${mainCandidate.place.name}.`,
          activity_en: `Guided hike and exploration of main trails at ${mainCandidate.place.name}.`,
          budget_usd: mainCandidate.place.entry_fee_usd,
          tips_es: 'Llegar temprano para evitar aglomeraciones y aprovechar avistamientos de fauna matutina.',
          tips_en: 'Arrive early to avoid queues and catch active morning wildlife.',
        },
        {
          spot: secondCandidate.place,
          time_slot: '12:00 PM - 02:00 PM',
          activity_es: 'Almuerzo en soda tradicional costarricense (Casado con fresco natural) y mirador fotográfico.',
          activity_en: 'Traditional Costa Rican lunch (Casado plate with tropical juice) and scenic photo viewpoint.',
          budget_usd: 15,
          tips_es: 'Pagar con SINPE Móvil o colones en efectivo.',
          tips_en: 'Pay with SINPE Mobile or cash in Colones.',
        }
      ]
    });
  } else if (query.available_time === 'full_day') {
    itineraries.push({
      id: 'itin-full-day-1',
      title_es: `Día Completo de Aventura en ${mainCandidate.place.province}`,
      title_en: `Full Day Adventure in ${mainCandidate.place.province}`,
      summary_es: `Ruta completa combinando naturaleza virgen en ${mainCandidate.place.name}, gastronomía local y relajación en ${secondCandidate.place.name}.`,
      summary_en: `Full-day route combining pristine nature at ${mainCandidate.place.name}, local cuisine, and relaxation at ${secondCandidate.place.name}.`,
      match_score: 98,
      estimated_distance_km: Math.round(mainCandidate.distKm + secondCandidate.distKm),
      estimated_drive_time_hours: Math.round(((mainCandidate.distKm + secondCandidate.distKm) / 45) * 10) / 10,
      estimated_budget_usd: Math.round(mainCandidate.place.entry_fee_usd + secondCandidate.place.entry_fee_usd + 28),
      estimated_budget_crc: Math.round((mainCandidate.place.entry_fee_usd + secondCandidate.place.entry_fee_usd + 28) * 518),
      weather_status_es: 'Mañanas soleadas con posibles chubascos aislados en la tarde',
      stops: [
        {
          spot: mainCandidate.place,
          time_slot: '07:30 AM - 11:30 AM',
          activity_es: `Exploración de ${mainCandidate.place.name} y miradores escénicos.`,
          activity_en: `Exploration of ${mainCandidate.place.name} and scenic lookouts.`,
          budget_usd: mainCandidate.place.entry_fee_usd,
          tips_es: 'Llevar repelente biodegradable, bloqueador solar y calzado con buen agarre.',
          tips_en: 'Bring biodegradable insect repellent, sunscreen, and hiking shoes with solid grip.',
        },
        {
          spot: secondCandidate.place,
          time_slot: '01:00 PM - 04:30 PM',
          activity_es: `Segunda parada escénica en ${secondCandidate.place.name}, baño en aguas naturales o senderismo.`,
          activity_en: `Second scenic stop at ${secondCandidate.place.name}, natural swimming or hiking.`,
          budget_usd: secondCandidate.place.entry_fee_usd,
          tips_es: 'Consultar estado del tiempo antes de cruzar ríos o senderos empinados.',
          tips_en: 'Check weather conditions before crossing rivers or steep sections.',
        }
      ]
    });
  } else {
    // Weekend / Multi-day
    itineraries.push({
      id: 'itin-weekend-1',
      title_es: `Expedición Fin de Semana: Esencia de ${mainCandidate.place.region}`,
      title_en: `Weekend Expedition: Essence of ${mainCandidate.place.region}`,
      summary_es: `Itinerario inmersivo de 2 días recorriendo ${mainCandidate.place.name}, ${secondCandidate.place.name} y ${thirdCandidate.place.name} con hospedaje sostenible.`,
      summary_en: `2-day immersive itinerary covering ${mainCandidate.place.name}, ${secondCandidate.place.name} and ${thirdCandidate.place.name} with sustainable eco-lodging.`,
      match_score: 95,
      estimated_distance_km: Math.round(mainCandidate.distKm + secondCandidate.distKm + 45),
      estimated_drive_time_hours: Math.round(((mainCandidate.distKm + secondCandidate.distKm + 45) / 50) * 10) / 10,
      estimated_budget_usd: Math.round(mainCandidate.place.entry_fee_usd + secondCandidate.place.entry_fee_usd + 110),
      estimated_budget_crc: Math.round((mainCandidate.place.entry_fee_usd + secondCandidate.place.entry_fee_usd + 110) * 518),
      weather_status_es: 'Excelente visibilidad matutina en volcanes y costas',
      stops: [
        {
          spot: mainCandidate.place,
          time_slot: 'Día 1 • Mañana',
          activity_es: `Ingreso matutino a ${mainCandidate.place.name}.`,
          activity_en: `Morning entrance to ${mainCandidate.place.name}.`,
          budget_usd: mainCandidate.place.entry_fee_usd,
          tips_es: 'Reservar tiquetes SINAC con antelación si aplica.',
          tips_en: 'Book SINAC national park tickets online in advance.',
        },
        {
          spot: secondCandidate.place,
          time_slot: 'Día 1 • Tarde / Noche',
          activity_es: `Hospedaje ecológico, tour nocturno de ranas y aguas termales en ${secondCandidate.place.name}.`,
          activity_en: `Eco-lodge check-in, night frog tour, and thermal springs at ${secondCandidate.place.name}.`,
          budget_usd: 65,
          tips_es: 'Llevar linterna frontal para caminatas nocturnas.',
          tips_en: 'Bring a headlamp for night wildlife walks.',
        },
        {
          spot: thirdCandidate.place,
          time_slot: 'Día 2 • Mañana & Cierre',
          activity_es: `Senderismo final y cataratas en ${thirdCandidate.place.name} antes de retornar.`,
          activity_en: `Final hiking and waterfalls at ${thirdCandidate.place.name} before returning.`,
          budget_usd: thirdCandidate.place.entry_fee_usd,
          tips_es: 'Revisar estado de carreteras en Ruta 27 o Ruta 32 para el regreso.',
          tips_en: 'Check MOPT traffic alerts on Highway 27 or 32 for the return drive.',
        }
      ]
    });
  }

  return itineraries;
}
