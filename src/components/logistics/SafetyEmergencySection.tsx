import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_EMERGENCY_PHONES, MOCK_EMBASSIES } from '../../data/mockData';
import { 
  ShieldAlert, 
  PhoneCall, 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Mail, 
  Search, 
  ShieldCheck,
  AlertOctagon,
  Phone
} from 'lucide-react';

export const SafetyEmergencySection: React.FC = () => {
  const { language } = useApp();
  const isEs = language === 'es';

  const [searchEmbassy, setSearchEmbassy] = useState('');

  const filteredEmbassies = MOCK_EMBASSIES.filter(emb => {
    const term = searchEmbassy.toLowerCase();
    return (
      emb.country_es.toLowerCase().includes(term) ||
      emb.country_en.toLowerCase().includes(term) ||
      emb.address.toLowerCase().includes(term)
    );
  });

  return (
    <div id="safety-emergency-section" className="space-y-6">
      
      {/* Safe Travel SOS Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-red-900 to-stone-900 p-5 sm:p-6 text-white border border-rose-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{isEs ? 'Centro de Asistencia & Seguridad Turística' : 'Tourist Assistance & Safety Center'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Costa Rica Safe Travel SOS
            </h3>
            <p className="text-xs text-rose-100/90 max-w-xl">
              {isEs 
                ? 'Líneas directas de auxilio, investigación judicial para visitantes extranjeros y destacamentos consulares.'
                : 'Direct emergency hotlines, tourist judicial protection, and consular services in San José.'}
            </p>
          </div>

          <a
            href="tel:911"
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 shrink-0 transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Llamar al 9-1-1</span>
          </a>
        </div>
      </div>

      {/* Emergency Hotline Cards Grid */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-extrabold text-stone-400 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-rose-600" />
          <span>{isEs ? 'Líneas Directas de Emergencia Nacional' : 'National Emergency Hotlines'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {MOCK_EMERGENCY_PHONES.map(phone => (
            <div
              key={phone.id}
              className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-stone-900 dark:text-white">
                    {isEs ? phone.name_es : phone.name_en}
                  </span>
                  {phone.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {phone.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                  {isEs ? phone.description_es : phone.description_en}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-xs font-mono font-black text-stone-800 dark:text-stone-200">
                  {phone.phone_display}
                </span>
                <a
                  href={`tel:${phone.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-stone-700 dark:text-stone-300 hover:text-rose-600 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{isEs ? 'Llamar' : 'Call'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embassies Directory in San José */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>{isEs ? 'Directorio de Embajadas y Consulados en San José' : 'Embassies & Consulates in San José'}</span>
            </h4>
            <p className="text-xs text-stone-500">
              {isEs ? 'Asistencia consular 24/7 y pasaportes de emergencia para viajeros' : '24/7 consular assistance and emergency passports for international travelers'}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isEs ? 'Buscar país o embajada...' : 'Search country or embassy...'}
              value={searchEmbassy}
              onChange={e => setSearchEmbassy(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEmbassies.map(emb => (
            <div
              key={emb.id}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{emb.flag_emoji}</span>
                  <div>
                    <h5 className="text-sm font-black text-stone-900 dark:text-white">
                      {isEs ? emb.country_es : emb.country_en}
                    </h5>
                    <span className="text-[11px] text-stone-500">
                      {emb.visiting_hours}
                    </span>
                  </div>
                </div>

                <a
                  href={emb.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:text-emerald-600 transition-colors"
                  title="Sitio web oficial"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{emb.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Oficina: <strong>{emb.phone_office}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Emergencias 24h: {emb.phone_emergency_24h}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
