/**
 * Costa Rica Native Navigation & Deep Linking Helper
 * Provides seamless navigation launches for Waze, Google Maps, and Apple Maps
 * with native schema protocols.
 */

export interface NavigationLinks {
  wazeScheme: string;
  wazeWeb: string;
  googleMaps: string;
  appleMaps: string;
}

export function getNavigationLinks(lat: number, lng: number, placeName?: string): NavigationLinks {
  const encodedName = encodeURIComponent(placeName || 'Destino Costa Rica');

  return {
    // Native iOS URL Scheme
    wazeScheme: `waze://?ll=${lat},${lng}&navigate=yes`,
    // Android / Universal Web Intent
    wazeWeb: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    // Google Maps universal web / app intent
    googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodedName}`,
    // Apple Maps intent
    appleMaps: `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}`,
  };
}

/**
 * Intelligent launcher that attempts Waze native scheme first, then falls back safely to web navigation
 */
export function openWazeWithFallback(lat: number, lng: number, placeName?: string): void {
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);

  const links = getNavigationLinks(lat, lng, placeName);

  if (isIOS) {
    // Attempt iOS native scheme
    window.location.href = links.wazeScheme;
    // Fallback if app is not installed after timeout
    setTimeout(() => {
      window.open(links.googleMaps, '_blank');
    }, 1500);
  } else if (isAndroid) {
    // Android intent or universal web link
    window.location.href = links.wazeWeb;
  } else {
    // Desktop or standard browser: open Waze Web in new tab
    window.open(links.wazeWeb, '_blank', 'noopener,noreferrer');
  }
}

export function openGoogleMaps(lat: number, lng: number, placeName?: string): void {
  const links = getNavigationLinks(lat, lng, placeName);
  window.open(links.googleMaps, '_blank', 'noopener,noreferrer');
}

export function openAppleMaps(lat: number, lng: number, placeName?: string): void {
  const links = getNavigationLinks(lat, lng, placeName);
  window.open(links.appleMaps, '_blank', 'noopener,noreferrer');
}
