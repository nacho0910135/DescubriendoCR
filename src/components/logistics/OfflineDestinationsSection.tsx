import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getOfflineSavedSpots, removeOfflineSpot } from '../../lib/offlineStorage';
import { OfflineStoredSpot } from '../../types';
import { openWazeWithFallback } from '../../lib/navigationDeepLinks';
import { 
  Download, 
  Trash2, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  SignalZero,
  AlertTriangle
} from 'lucide-react';

export const OfflineDestinationsSection: React.FC = () => {
  const { language, setSelectedPlace, formatPrice } = useApp();
  const isEs = language === 'es';
  const [offlineSpots, setOfflineSpots] = useState<OfflineStoredSpot[]>([]);

  useEffect(() => {
    setOfflineSpots(getOfflineSavedSpots());
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeOfflineSpot(id);
    setOfflineSpots(getOfflineSavedSpots());
  };

  return (
    <div id="offline-destinations-section" className="space-y-6">
      
      {/* Offline Status Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 p-5 sm:p-6 text-white border border-emerald-800 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
          <SignalZero className="w-4 h-4 text-emerald-400" />
          <span>{isEs ? 'Modo Exploración Offline (Sin Señal Celular)' : 'Offline Exploration Mode (No Cell Signal)'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black">
          {isEs ? 'Fichas Guardadas en Memoria Local' : 'Destinations Saved in Local Storage'}
        </h3>
        <p className="text-xs text-emerald-100/90 max-w-xl mt-1">
          {isEs
            ? 'Los destinos guardados están disponibles de forma instantánea sin conexión a internet durante expediciones en Corcovado, Chirripó, Monteverde o Tortuguero.'
            : 'Saved spots are immediately accessible offline during jungle treks in Corcovado, Chirripó, Monteverde, or Tortuguero.'}
        </p>
      </div>

      {/* List of Offline Spots */}
      {offlineSpots.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
            <Download className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-black text-stone-900 dark:text-white">
            {isEs ? 'No tienes destinos guardados offline' : 'No offline spots saved yet'}
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {isEs
              ? 'Abre cualquier ficha de destino en el catálogo y presiona el botón de descarga para guardar las coordenadas y detalles en tu dispositivo.'
              : 'Open any destination card and click the download button to save GPS coordinates and trail details on your device.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offlineSpots.map(item => (
            <div
              key={item.spot.id}
              onClick={() => setSelectedPlace(item.spot)}
              className="bg-white dark:bg-stone-900 rounded-3xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer space-y-3"
            >
              <div className="flex gap-3">
                <img
                  src={item.spot.image}
                  alt={item.spot.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {item.spot.province}
                    </span>
                    <button
                      onClick={e => handleRemove(item.spot.id, e)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Eliminar de almacenamiento offline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h5 className="text-sm font-black text-stone-900 dark:text-white truncate mt-1">
                    {item.spot.name}
                  </h5>

                  <p className="text-xs text-stone-500 font-mono">
                    GPS: {item.spot.lat.toFixed(4)}, {item.spot.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatPrice(item.spot.entry_fee_usd)}
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    openWazeWithFallback(item.spot.lat, item.spot.lng, item.spot.name);
                  }}
                  className="px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Waze</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jungle Survival Tips */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{isEs ? 'Recomendaciones de Seguridad en Zonas Silvestres:' : 'Wilderness Safety Guidelines:'}</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-amber-900 dark:text-amber-300">
          <li>{isEs ? 'En senderos de Corcovado y Chirripó, nunca te desvíes del sendero demarcado.' : 'On Corcovado and Chirripó trails, never leave designated marked paths.'}</li>
          <li>{isEs ? 'Descarga los mapas y contactos de emergencia antes de ingresar al parque.' : 'Download offline guides and emergency contacts prior to entering park boundaries.'}</li>
          <li>{isEs ? 'Guarda siempre el número 911 y el destacamento de guardaparques en tus notas locales.' : 'Keep 911 and local park ranger phone contacts saved locally on your phone.'}</li>
        </ul>
      </div>

    </div>
  );
};
