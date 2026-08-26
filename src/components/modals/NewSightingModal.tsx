import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Camera, MapPin, Sparkles, UploadCloud, Info, ShieldAlert, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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
    uploadAndPublishSighting,
    userProfile, 
    user,
    language 
  } = useApp();

  const [specieId, setSpecieId] = useState(fauna[0]?.id || 'fauna-1');
  const [locationName, setLocationName] = useState('');
  const [region, setRegion] = useState<ICTRegion>('Valle Central');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTO_PRESETS[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isEs = language === 'es';
  const selectedSpecie = fauna.find(f => f.id === specieId) || fauna[0];
  const isVulnerable = Boolean(
    selectedSpecie?.anti_poaching_protection || 
    (selectedSpecie?.conservation_status && (selectedSpecie.conservation_status.includes('Endangered') || selectedSpecie.conservation_status.includes('Peligro'))) || 
    (selectedSpecie?.iucn_status && ['CR', 'EN', 'VU'].includes(selectedSpecie.iucn_status)) ||
    selectedSpecie?.is_endemic
  );

  if (!isNewSightingModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
      setImageUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create fuzzy coordinates (PostGIS anti-poaching security radius)
      const baseLat = 9.9333;
      const baseLng = -84.0833;
      const fuzzFactor = isVulnerable ? 0.08 : 0.02; // ~8km buffer for vulnerable fauna
      const randomizedLat = baseLat + (Math.random() * (fuzzFactor * 2) - fuzzFactor);
      const randomizedLng = baseLng + (Math.random() * (fuzzFactor * 2) - fuzzFactor);

      const authorName = userProfile?.full_name || user?.email?.split('@')[0] || (isEs ? 'Explorador Tico' : 'Tico Explorer');
      const authorAvatar = userProfile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || 'tico'}`;

      await uploadAndPublishSighting(
        {
          fauna_id: specieId,
          specie_id: specieId,
          specie_name: isEs 
            ? (selectedSpecie?.common_name_es || selectedSpecie?.common_name?.es || 'Fauna CR') 
            : (selectedSpecie?.common_name_en || selectedSpecie?.common_name?.en || 'CR Wildlife'),
          user_id: user?.id || 'usr-guest',
          user_name: authorName,
          author_id: user?.id || 'usr-guest',
          author_name: authorName,
          author_avatar: authorAvatar,
          author_role: userProfile?.role || 'user',
          user_avatar: authorAvatar,
          location: locationName || 'Corredor Biológico Mesoamericano',
          location_name: locationName || 'Corredor Biológico Mesoamericano',
          region: region,
          latitude: randomizedLat,
          longitude: randomizedLng,
          fuzzy_lat: randomizedLat,
          fuzzy_lng: randomizedLng,
          is_sensitive_location: !!isVulnerable,
          anti_poaching_buffered: !!isVulnerable,
          photo_url: imageUrl,
          image: imageUrl,
          notes: notes || (isEs ? 'Avistamiento verificado en campo con respeto a la vida silvestre.' : 'Verified field sighting with strict wildlife respect.'),
          liked_by_user: false,
          comments: []
        },
        selectedFile || undefined
      );

      setIsNewSightingModalOpen(false);
    } catch (err) {
      console.error('Error submitting sighting:', err);
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">
                  {isEs ? 'Reportar Avistamiento Silvestre' : 'Submit Wildlife Sighting'}
                </h2>
                <p className="text-xs text-emerald-200">
                  {isEs ? 'Álbum Colaborativo & Ciencia Ciudadana' : 'Collaborative Album & Citizen Science'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNewSightingModalOpen(false)}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-emerald-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Specie Select with Conservation badge */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                {isEs ? 'Especie de Fauna Observada' : 'Observed Wildlife Species'}
              </label>
              {isVulnerable && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  {isEs ? 'Especie Protegida' : 'Protected Species'}
                </span>
              )}
            </div>
            <select
              value={specieId}
              onChange={(e) => {
                setSpecieId(e.target.value);
                const match = fauna.find(f => f.id === e.target.value);
                if (match && !selectedFile) setImageUrl(match.image_url || match.image);
              }}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
            >
              {fauna.map(f => (
                <option key={f.id} value={f.id}>
                  {isEs ? (f.common_name_es || f.common_name?.es) : (f.common_name_en || f.common_name?.en)} ({f.scientific_name}) — {f.category}
                </option>
              ))}
            </select>
          </div>

          {/* Location & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEs ? 'Lugar / Sendero / Sector' : 'Place / Trail / Area'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder={isEs ? 'Ej. Sendero Los Patos' : 'e.g. Los Patos Trail'}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEs ? 'Región Turística ICT' : 'ICT Tourism Region'}
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as ICTRegion)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Valle Central">Valle Central</option>
                <option value="Guanacaste">Guanacaste</option>
                <option value="Llanuras del Norte">Llanuras del Norte / Zona Norte</option>
                <option value="Pacífico Central">Pacífico Central / Puntarenas</option>
                <option value="Pacífico Sur">Pacífico Sur / Osa</option>
                <option value="Caribe">Caribe / Limón</option>
              </select>
            </div>
          </div>

          {/* Native Photo Capture & Storage Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              {isEs ? 'Fotografía del Avistamiento (Cámara o Galería)' : 'Sighting Photo (Camera or Gallery)'}
            </label>

            {/* Hidden native inputs for mobile / desktop */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <input 
              type="file" 
              ref={cameraInputRef} 
              accept="image/*" 
              capture="environment" 
              onChange={handleFileChange} 
              className="hidden" 
            />

            {/* Action buttons for photo */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>{isEs ? 'Tomar Foto' : 'Take Photo'}</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isEs ? 'Subir Archivo' : 'Upload File'}</span>
              </button>
            </div>

            {/* Photo preview or preset picker */}
            {filePreview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 aspect-video">
                <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                    setImageUrl(SAMPLE_PHOTO_PRESETS[0]);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {isEs ? 'Foto lista para subir a Supabase Storage' : 'Photo ready for Supabase Storage'}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-1.5">
                  {isEs ? 'O elige una foto de muestra:' : 'Or choose a sample photo:'}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {SAMPLE_PHOTO_PRESETS.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Preset"
                      onClick={() => setImageUrl(img)}
                      className={`w-14 h-14 rounded-xl object-cover cursor-pointer border-2 transition-all shrink-0 ${
                        imageUrl === img ? 'border-emerald-500 scale-105 shadow-md ring-2 ring-emerald-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {isEs ? 'Notas de Observación & Comportamiento' : 'Observation & Behavior Notes'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isEs ? 'Ej. Ejemplar adulto alimentándose de brotes en la copa de un árbol.' : 'e.g. Adult specimen feeding in the canopy at sunrise.'}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          {/* Anti-poaching protection notice */}
          <div className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs ${
            isVulnerable 
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          }`}>
            <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${isVulnerable ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}`} />
            <div>
              <p className="font-bold text-[11px]">
                {isEs ? 'Protocolo de Seguridad Anti-Caza Furtiva (Anti-Poaching)' : 'Anti-Poaching Wildlife Protection Protocol'}
              </p>
              <p className="text-[11px] leading-relaxed opacity-90 mt-0.5">
                {isEs 
                  ? 'Las coordenadas exactas no se revelarán al público. El mapa mostrará una zona difusa de ~8km de radio para proteger el hábitat de esta especie.' 
                  : 'Exact GPS coordinates are protected. Public maps will display a randomized ~8km fuzzy buffer to preserve habitat integrity.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsNewSightingModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? (isEs ? 'Publicando...' : 'Publishing...') : (isEs ? 'Publicar en Álbum' : 'Publish Sighting')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
