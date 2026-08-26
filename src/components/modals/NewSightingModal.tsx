import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera, MapPin, Sparkles, UploadCloud, Info } from 'lucide-react';
import { ICTRegion } from '../../types';

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
];

export const NewSightingModal: React.FC = () => {
  const { 
    isNewSightingModalOpen, 
    setIsNewSightingModalOpen, 
    fauna, 
    addCommunitySighting, 
    userProfile, 
    user,
    language 
  } = useApp();

  const [specieId, setSpecieId] = useState(fauna[0]?.id || 'fauna-1');
  const [locationName, setLocationName] = useState('');
  const [region, setRegion] = useState<ICTRegion>('Llanuras del Norte');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTO_PRESETS[0]);
  const [notes, setNotes] = useState('');
  const isEs = language === 'es';

  if (!isNewSightingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selected = fauna.find(f => f.id === specieId);

    addCommunitySighting({
      specie_id: specieId,
      specie_name: isEs ? (selected?.common_name_es || 'Fauna CR') : (selected?.common_name_en || 'CR Wildlife'),
      user_name: userProfile?.full_name || user?.email?.split('@')[0] || 'Explorador Tico',
      user_avatar: userProfile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || 'tico'}`,
      location_name: locationName || 'Corredor Biológico Costa Rica',
      region: region,
      fuzzy_lat: 10.0 + (Math.random() * 0.5 - 0.25),
      fuzzy_lng: -84.0 + (Math.random() * 0.5 - 0.25),
      image: imageUrl,
      notes: notes || (isEs ? 'Avistamiento verificado en campo durante caminata guiada.' : 'Field verified sighting during guided trail walk.'),
    });

    setIsNewSightingModalOpen(false);
  };

  return (
    <div 
      id="new-sighting-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div 
        id="new-sighting-modal-content"
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">
                  {isEs ? 'Reportar Avistamiento Colaborativo' : 'Submit Community Sighting'}
                </h2>
                <p className="text-xs text-emerald-200">
                  {isEs ? 'Ciencia ciudadana & álbum de biodiversidad' : 'Citizen science & biodiversity album'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNewSightingModalOpen(false)}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-emerald-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Specie Select */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {isEs ? 'Especie Observada' : 'Observed Specie'}
            </label>
            <select
              value={specieId}
              onChange={(e) => {
                setSpecieId(e.target.value);
                const match = fauna.find(f => f.id === e.target.value);
                if (match) setImageUrl(match.image);
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            >
              {fauna.map(f => (
                <option key={f.id} value={f.id}>
                  {isEs ? f.common_name_es : f.common_name_en} ({f.scientific_name})
                </option>
              ))}
            </select>
          </div>

          {/* Location & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEs ? 'Lugar / Sendero' : 'Place / Trail Name'}
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Ej. Bosque de la Hoja"
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEs ? 'Región ICT' : 'ICT Region'}
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as ICTRegion)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Valle Central">Valle Central</option>
                <option value="Guanacaste">Guanacaste</option>
                <option value="Llanuras del Norte">Llanuras del Norte</option>
                <option value="Pacífico Central">Pacífico Central</option>
                <option value="Pacífico Sur">Pacífico Sur</option>
                <option value="Caribe">Caribe</option>
              </select>
            </div>
          </div>

          {/* Photo Selection / Preset */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {isEs ? 'Fotografía del Avistamiento' : 'Sighting Photo URL'}
            </label>
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
              {SAMPLE_PHOTO_PRESETS.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Preset"
                  onClick={() => setImageUrl(img)}
                  className={`w-14 h-14 rounded-lg object-cover cursor-pointer border-2 transition-all shrink-0 ${
                    imageUrl === img ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {isEs ? 'Notas del Comportamiento / Hábitat' : 'Behavior & Observation Notes'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isEs ? 'Comportamiento observado, hora del día...' : 'Observed behavior, time of day...'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          {/* Anti-poaching badge info */}
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {isEs 
                ? 'Tus coordenadas se difuminarán automáticamente en el mapa para resguardar a la especie.' 
                : 'GPS coordinates will be automatically blurred on public maps to protect the wildlife.'}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewSightingModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEs ? 'Publicar en Álbum' : 'Publish Sighting'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
