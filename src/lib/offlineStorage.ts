/**
 * Offline-First Storage Manager for Remote Zones in Costa Rica
 * (Corcovado, Sirena, Chirripó, Tortuguero, Barra del Colorado)
 */

import { PlaceSpot, OfflineStoredSpot } from '../types';

const OFFLINE_SPOTS_KEY = 'cr_explorer_offline_spots';

export function getOfflineSavedSpots(): OfflineStoredSpot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_SPOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load offline spots:', e);
    return [];
  }
}

export function saveSpotForOffline(spot: PlaceSpot, notes?: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getOfflineSavedSpots();
    const filtered = existing.filter(item => item.spot.id !== spot.id);
    const newEntry: OfflineStoredSpot = {
      spot,
      saved_at: new Date().toISOString(),
      offline_notes: notes || 'Descargado para consulta en zonas sin cobertura celular.',
    };
    filtered.unshift(newEntry);
    localStorage.setItem(OFFLINE_SPOTS_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.warn('Failed to save spot offline:', e);
    return false;
  }
}

export function removeOfflineSpot(spotId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getOfflineSavedSpots();
    const updated = existing.filter(item => item.spot.id !== spotId);
    localStorage.setItem(OFFLINE_SPOTS_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.warn('Failed to remove offline spot:', e);
    return false;
  }
}

export function isSpotSavedOffline(spotId: string): boolean {
  const existing = getOfflineSavedSpots();
  return existing.some(item => item.spot.id === spotId);
}
