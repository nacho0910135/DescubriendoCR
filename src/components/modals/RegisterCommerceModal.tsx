import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Store, 
  ShieldCheck, 
  Leaf, 
  Crown, 
  Sparkles, 
  Image as ImageIcon, 
  DollarSign, 
  CreditCard, 
  Dog, 
  Car, 
  Smartphone, 
  MapPin, 
  Phone, 
  Globe 
} from 'lucide-react';
import { CostaRicaProvince, ICTRegion, CommerceCategory } from '../../types';

export const RegisterCommerceModal: React.FC = () => {
  const { 
    isRegisterCommerceModalOpen, 
    setIsRegisterCommerceModalOpen, 
    registerCommerce, 
    language, 
    user 
  } = useApp();

  const isEs = language === 'es';

  const [name, setName] = useState('');
  const [category, setCategory] = useState<CommerceCategory>('gastronomia');
  const [province, setProvince] = useState<CostaRicaProvince>('San José');
  const [region, setRegion] = useState<ICTRegion>('Valle Central');
  const [descriptionEs, setDescriptionEs] = useState('');
  const [cstLevel, setCstLevel] = useState<number>(3);
  const [priceRange, setPriceRange] = useState('$15 - $45');
  const [avgPrice, setAvgPrice] = useState<number>(30);
  const [whatsapp, setWhatsapp] = useState('+506 ');
  const [phone, setPhone] = useState('+506 ');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80');
  
  // Badges
  const [acceptsSinpe, setAcceptsSinpe] = useState(true);
  const [acceptsCards, setAcceptsCards] = useState(true);
  const [petFriendly, setPetFriendly] = useState(false);
  const [hasParking, setHasParking] = useState(true);

  // Plan Selection
  const [subscriptionTier, setSubscriptionTier] = useState<'standard' | 'sponsored_gold'>('standard');

  if (!isRegisterCommerceModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerCommerce({
      name,
      category,
      main_category: category as any,
      province,
      region,
      description_es: descriptionEs,
      description_en: descriptionEs,
      cst_level: cstLevel,
      price_range_usd: priceRange,
      avg_price_usd: avgPrice,
      image: imageUrl,
      photos: [imageUrl],
      whatsapp,
      phone,
      website,
      address,
      accepts_sinpe: acceptsSinpe,
      accepts_cards: acceptsCards,
      pet_friendly: petFriendly,
      has_parking: hasParking,
      subscription_tier: subscriptionTier,
      is_sponsored: subscriptionTier === 'sponsored_gold',
      sponsored_tier: subscriptionTier === 'sponsored_gold' ? 1 : 0
    });
    setIsRegisterCommerceModalOpen(false);
  };

  const sampleImages = [
    { label: isEs ? 'Eco-Lodge / Hotel' : 'Eco-Lodge / Hotel', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80' },
    { label: isEs ? 'Restaurante / Soda' : 'Restaurant / Soda', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80' },
    { label: isEs ? 'Aventura / Canopy' : 'Adventure / Canopy', url: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1000&q=80' },
    { label: isEs ? 'Tour / Guía' : 'Tour / Guide', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80' },
    { label: isEs ? 'Transporte / Rent a Car' : 'Transport / Car Rental', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80' }
  ];

  return (
    <div 
      id="register-commerce-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div 
        id="register-commerce-modal-content"
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-300/30">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black leading-tight">
                  {isEs ? 'Registro B2B de Comercio Turístico' : 'B2B Tourism Commerce Registration'}
                </h2>
                <p className="text-xs text-emerald-200/90">
                  {isEs ? 'Integra tu empresa al directorio verificado ICT & CST de Costa Rica' : 'List your enterprise on Costa Ricas verified ICT & CST directory'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRegisterCommerceModalOpen(false)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Plan Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {isEs ? '1. Selecciona tu Plan B2B' : '1. Select your B2B Tier'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Standard Tier */}
              <div 
                onClick={() => setSubscriptionTier('standard')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  subscriptionTier === 'standard'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-stone-900 dark:text-white">
                      {isEs ? 'Plan Comercio B2B' : 'Standard B2B Plan'}
                    </span>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                      $20 / mes
                    </span>
                  </div>
                  <ul className="text-xs text-stone-600 dark:text-stone-400 mt-2 space-y-1">
                    <li>✓ Ficha en directorio oficial</li>
                    <li>✓ Botón de WhatsApp directo</li>
                    <li>✓ Badges SINPE, Tarjetas, CST</li>
                    <li>✓ Dashboard con métricas básicas</li>
                  </ul>
                </div>
              </div>

              {/* Gold Sponsored Tier */}
              <div 
                onClick={() => setSubscriptionTier('sponsored_gold')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                  subscriptionTier === 'sponsored_gold'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-lg shadow-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-amber-400'
                }`}
              >
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-stone-950 font-black text-[9px] px-2 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" />
                  <span>Recomendado</span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {isEs ? 'Destacado Gold' : 'Gold Sponsored'}
                    </span>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-md">
                      $45 / mes
                    </span>
                  </div>
                  <ul className="text-xs text-stone-600 dark:text-stone-400 mt-2 space-y-1">
                    <li className="font-bold text-amber-800 dark:text-amber-300">★ Posicionamiento prioritario arriba</li>
                    <li className="font-bold text-amber-800 dark:text-amber-300">★ Borde dorado brillante en directorio</li>
                    <li>✓ Galería de hasta 10 fotos HD</li>
                    <li>✓ Métricas avanzadas de conversión</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Business Basic Data */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {isEs ? '2. Información General del Negocio' : '2. General Business Info'}
            </label>

            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                {isEs ? 'Nombre Comercial' : 'Business Name'} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEs ? 'Ej: Eco-Lodge Bosque Nuboso' : 'E.g., Cloud Forest Eco-Lodge'}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                  {isEs ? 'Categoría' : 'Category'} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CommerceCategory)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="gastronomia">{isEs ? 'Gastronomía & Sodas' : 'Gastronomy & Sodas'}</option>
                  <option value="hospedajes">{isEs ? 'Hospedajes & Eco-Lodges' : 'Lodging & Eco-Lodges'}</option>
                  <option value="transporte_rentacar">{isEs ? 'Transportes & Rent a Car' : 'Transport & Rent a Car'}</option>
                  <option value="guias_turisticos">{isEs ? 'Guías Turísticos' : 'Tourist Guides'}</option>
                  <option value="tours_actividades">{isEs ? 'Tours & Actividades' : 'Tours & Activities'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                  {isEs ? 'Provincia' : 'Province'} *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value as CostaRicaProvince)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value="San José">San José</option>
                  <option value="Alajuela">Alajuela</option>
                  <option value="Cartago">Cartago</option>
                  <option value="Heredia">Heredia</option>
                  <option value="Guanacaste">Guanacaste</option>
                  <option value="Puntarenas">Puntarenas</option>
                  <option value="Limón">Limón</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                  {isEs ? 'Nivel Sostenibilidad CST' : 'CST Sustainability Level'}
                </label>
                <select
                  value={cstLevel}
                  onChange={(e) => setCstLevel(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                >
                  <option value={1}>🍃 1 Hoja CST</option>
                  <option value={2}>🍃🍃 2 Hojas CST</option>
                  <option value={3}>🍃🍃🍃 3 Hojas CST</option>
                  <option value={4}>🍃🍃🍃🍃 4 Hojas CST</option>
                  <option value={5}>🍃🍃🍃🍃🍃 5 Hojas CST (Máximo)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                {isEs ? 'Descripción del Servicio' : 'Service Description'} *
              </label>
              <textarea
                required
                rows={2}
                value={descriptionEs}
                onChange={(e) => setDescriptionEs(e.target.value)}
                placeholder={isEs ? 'Describe tu propuesta de valor, ubicación y experiencia auténtica costarricense...' : 'Describe your services, location, and authentic Costa Rican experience...'}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          {/* Badges & Amenities */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {isEs ? '3. Sellos & Facilidades Disponibles' : '3. Service Badges & Facilities'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                acceptsSinpe ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-bold' : 'border-stone-200 dark:border-stone-700'
              }`}>
                <input
                  type="checkbox"
                  checked={acceptsSinpe}
                  onChange={(e) => setAcceptsSinpe(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs">{isEs ? 'SINPE Móvil' : 'SINPE Mobile'}</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                acceptsCards ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 font-bold' : 'border-stone-200 dark:border-stone-700'
              }`}>
                <input
                  type="checkbox"
                  checked={acceptsCards}
                  onChange={(e) => setAcceptsCards(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs">{isEs ? 'Tarjetas' : 'Credit Cards'}</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                petFriendly ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 font-bold' : 'border-stone-200 dark:border-stone-700'
              }`}>
                <input
                  type="checkbox"
                  checked={petFriendly}
                  onChange={(e) => setPetFriendly(e.target.checked)}
                  className="rounded text-purple-600"
                />
                <Dog className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-xs">Pet Friendly</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                hasParking ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 font-bold' : 'border-stone-200 dark:border-stone-700'
              }`}>
                <input
                  type="checkbox"
                  checked={hasParking}
                  onChange={(e) => setHasParking(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <Car className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs">{isEs ? 'Parqueo' : 'Parking'}</span>
              </label>

            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              {isEs ? '4. Contacto & Enlaces Directos' : '4. Contact & Direct Links'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                  {isEs ? 'Número de WhatsApp (Clientes)' : 'WhatsApp Number (Clients)'} *
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+506 8888 8888"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                  {isEs ? 'Dirección Exacta' : 'Exact Address'} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isEs ? '200m norte del parque central' : '200m north from central park'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Quick Photo Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                {isEs ? 'Fotografía Principal de Portada' : 'Cover Photo URL'}
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(s.url)}
                    className="text-[10px] px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 text-stone-700 dark:text-stone-300 cursor-pointer"
                  >
                    📷 {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsRegisterCommerceModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-lg cursor-pointer transition-all flex items-center gap-2 ${
                subscriptionTier === 'sponsored_gold'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>
                {subscriptionTier === 'sponsored_gold' 
                  ? (isEs ? 'Completar Registro Gold ($45/mes)' : 'Complete Gold Registration ($45/mo)')
                  : (isEs ? 'Completar Registro B2B ($20/mes)' : 'Complete B2B Registration ($20/mo)')}
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
