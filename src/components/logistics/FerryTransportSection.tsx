import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_FERRIES } from '../../data/mockData';
import { 
  Ship, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  AlertCircle, 
  Car, 
  Bike, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const FerryTransportSection: React.FC = () => {
  const { formatPrice, language } = useApp();
  const isEs = language === 'es';
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);

  const activeFerry = MOCK_FERRIES[selectedRouteIdx] || MOCK_FERRIES[0];

  return (
    <div id="ferry-transport-section" className="space-y-6">
      
      {/* Route Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {MOCK_FERRIES.map((ferry, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedRouteIdx(idx)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer ${
              selectedRouteIdx === idx
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-teal-400'
            }`}
          >
            {ferry.route}
          </button>
        ))}
      </div>

      {/* Main Ferry Route Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
        
        {/* Header with Operator and Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-black text-teal-600 dark:text-teal-400">
                {activeFerry.operator}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeFerry.status === 'Embarcando'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {activeFerry.status}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              {activeFerry.route}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Terminal: {activeFerry.terminal}
            </p>
          </div>

          {activeFerry.booking_url && (
            <a
              href={activeFerry.booking_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 shrink-0 transition-colors"
            >
              <span>{isEs ? 'Comprar Tiquetes Online' : 'Buy Online Tickets'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Boarding Advisory Warning */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>{isEs ? 'Alerta de Abordaje & Anticipación:' : 'Boarding & Arrival Advisory:'}</strong>{' '}
            <span>{isEs ? activeFerry.notes_es : activeFerry.notes_en}</span>
          </div>
        </div>

        {/* Daily Schedule Timetable */}
        {activeFerry.daily_schedule && (
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>{isEs ? 'Horarios Diarios de Salida' : 'Daily Departure Timetable'}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {activeFerry.daily_schedule.map((time, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center"
                >
                  <span className="text-xs font-black text-stone-900 dark:text-white block">
                    {time}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {activeFerry.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Fares Breakdown Table */}
        {activeFerry.fares && activeFerry.fares.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEs ? 'Tarifario Oficial MOPT (Colones & Dólares)' : 'Official MOPT Fares (CRC & USD)'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {activeFerry.fares.map((fare, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      {isEs ? fare.category_name_es : fare.category_name_en}
                    </span>
                    {fare.notes_es && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                        {fare.notes_es}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 block">
                      {formatPrice(fare.fee_usd)}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      ₡{fare.fee_crc.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
