import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Store, ShieldCheck, CheckCircle2, Building, Phone, Mail } from 'lucide-react';

export const ClaimCommerceModal: React.FC = () => {
  const { 
    isClaimModalOpen, 
    setIsClaimModalOpen, 
    commerceToClaim, 
    claimCommerce, 
    language, 
    user 
  } = useApp();

  const [legalName, setLegalName] = useState(commerceToClaim?.name || '');
  const [legalId, setLegalId] = useState('3-101-');
  const [managerPhone, setManagerPhone] = useState(commerceToClaim?.phone || '+506 ');
  const [managerEmail, setManagerEmail] = useState(user?.email || '');
  const [cstLicenseNumber, setCstLicenseNumber] = useState('CST-ICT-2026-');

  const isEs = language === 'es';

  if (!isClaimModalOpen || !commerceToClaim) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    claimCommerce(commerceToClaim.id, legalName, managerPhone);
    setIsClaimModalOpen(false);
  };

  return (
    <div 
      id="claim-commerce-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div 
        id="claim-commerce-modal-content"
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-300/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold">
                  {isEs ? 'Portal B2B: Reclamar Comercio' : 'B2B Portal: Claim Business'}
                </h2>
                <p className="text-xs text-emerald-200">
                  {isEs ? 'Verificación de personería jurídica & sello CST' : 'Legal entity verification & CST accreditation'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsClaimModalOpen(false)}
              className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-emerald-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center gap-3">
            <img 
              src={commerceToClaim.image} 
              alt={commerceToClaim.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                {commerceToClaim.name}
              </h3>
              <p className="text-xs text-stone-500">
                {commerceToClaim.province} • Nivel CST {commerceToClaim.cst_level}/5
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {isEs ? 'Razón Social / Nombre Comercial' : 'Legal Company Name'}
            </label>
            <input
              type="text"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEs ? 'Cédula Jurídica / Física' : 'Costa Rica Tax ID (Cédula)'}
              </label>
              <input
                type="text"
                required
                value={legalId}
                onChange={(e) => setLegalId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEs ? 'Licencia CST / ICT' : 'CST / ICT License Code'}
              </label>
              <input
                type="text"
                value={cstLicenseNumber}
                onChange={(e) => setCstLicenseNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEs ? 'Teléfono Directo / WhatsApp' : 'Direct Phone / WhatsApp'}
              </label>
              <input
                type="text"
                required
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                {isEs ? 'Correo de Facturación / Contacto' : 'Corporate Email'}
              </label>
              <input
                type="email"
                required
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsClaimModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{isEs ? 'Verificar Comercio B2B' : 'Verify B2B Commerce'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
