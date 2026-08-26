import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calculator, 
  DollarSign, 
  Users, 
  Smartphone, 
  CreditCard, 
  HelpCircle, 
  CheckCircle2, 
  Info, 
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';

export const TipSinpeCalculatorSection: React.FC = () => {
  const { language } = useApp();
  const isEs = language === 'es';

  // Calculator State
  const [billAmount, setBillAmount] = useState<number>(15000);
  const [currency, setCurrency] = useState<'CRC' | 'USD'>('CRC');
  const [includeServiceLaw, setIncludeServiceLaw] = useState<boolean>(true); // 10% Propina de Ley
  const [includeIVA, setIncludeIVA] = useState<boolean>(true); // 13% IVA
  const [extraTipPercent, setExtraTipPercent] = useState<number>(0); // Voluntaria
  const [splitCount, setSplitCount] = useState<number>(2);

  // Conversion rate approx 1 USD = 518 CRC
  const EXCHANGE_RATE = 518;

  // Calculation logic
  const rawAmountCRC = currency === 'CRC' ? billAmount : billAmount * EXCHANGE_RATE;
  const serviceLawCRC = includeServiceLaw ? rawAmountCRC * 0.10 : 0;
  const ivaCRC = includeIVA ? rawAmountCRC * 0.13 : 0;
  const extraTipCRC = rawAmountCRC * (extraTipPercent / 100);
  const totalCRC = rawAmountCRC + serviceLawCRC + ivaCRC + extraTipCRC;
  const perPersonCRC = totalCRC / (splitCount || 1);

  const totalUSD = totalCRC / EXCHANGE_RATE;
  const perPersonUSD = perPersonCRC / EXCHANGE_RATE;

  return (
    <div id="tip-sinpe-section" className="space-y-6">
      
      {/* 1. CALCULATOR TOOL */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
              {isEs ? 'Calculadora de Propina & Impuestos Costa Rica' : 'Costa Rica Tip & Tax Calculator'}
            </h3>
            <p className="text-xs text-stone-500">
              {isEs ? '10% de Servicio de Ley (Art. 49 Ley Laboral) + 13% IVA con división de cuenta' : '10% Legal Service Tip + 13% VAT with split bill functionality'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Controls */}
          <div className="space-y-4">
            
            {/* Amount input & currency toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {isEs ? 'Monto Base del Consumo (Subtotal)' : 'Base Bill Amount (Subtotal)'}
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">
                    {currency === 'CRC' ? '₡' : '$'}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={billAmount || ''}
                    onChange={e => setBillAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-bold text-stone-900 dark:text-white"
                  />
                </div>

                <div className="flex rounded-xl bg-stone-100 dark:bg-stone-800 p-1 border border-stone-200 dark:border-stone-700">
                  <button
                    onClick={() => setCurrency('CRC')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currency === 'CRC'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    ₡ CRC
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currency === 'USD'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeServiceLaw}
                  onChange={e => setIncludeServiceLaw(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{isEs ? 'Incluir 10% Propina de Servicio de Ley (Restaurantes)' : 'Include 10% Legal Service Charge (Restaurants)'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeIVA}
                  onChange={e => setIncludeIVA(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{isEs ? 'Incluir 13% IVA (Impuesto al Valor Agregado)' : 'Include 13% VAT (Value Added Tax)'}</span>
              </label>
            </div>

            {/* Extra Voluntary Tip */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>{isEs ? 'Propina Adicional Voluntaria' : 'Extra Voluntary Tip'}</span>
                <span className="text-emerald-600 font-extrabold">{extraTipPercent}%</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 5, 10, 15].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setExtraTipPercent(pct)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      extraTipPercent === pct
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    +{pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Split count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>{isEs ? 'Dividir cuenta entre personas' : 'Split bill across people'}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={splitCount}
                  onChange={e => setSplitCount(parseInt(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="text-xs font-black text-stone-900 dark:text-white px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  {splitCount} {splitCount === 1 ? (isEs ? 'persona' : 'person') : (isEs ? 'personas' : 'people')}
                </span>
              </div>
            </div>

          </div>

          {/* Real-Time Calculation Breakdown Summary */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-stone-200 dark:border-stone-700/60 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-stone-400 block mb-3">
                {isEs ? 'Desglose Detallado' : 'Detailed Calculation'}
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span>{isEs ? 'Subtotal Base:' : 'Base Subtotal:'}</span>
                  <span className="font-mono font-bold">₡{Math.round(rawAmountCRC).toLocaleString()} (${(rawAmountCRC / EXCHANGE_RATE).toFixed(2)})</span>
                </div>

                {includeServiceLaw && (
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                    <span>10% {isEs ? 'Servicio de Ley:' : 'Legal Tip:'}</span>
                    <span className="font-mono font-bold">+₡{Math.round(serviceLawCRC).toLocaleString()}</span>
                  </div>
                )}

                {includeIVA && (
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span>13% IVA:</span>
                    <span className="font-mono font-bold">+₡{Math.round(ivaCRC).toLocaleString()}</span>
                  </div>
                )}

                {extraTipPercent > 0 && (
                  <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                    <span>+{extraTipPercent}% {isEs ? 'Propina Extra:' : 'Extra Tip:'}</span>
                    <span className="font-mono font-bold">+₡{Math.round(extraTipCRC).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Final Totals */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase">{isEs ? 'Total a Pagar:' : 'Total Due:'}</span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white block">
                    ₡{Math.round(totalCRC).toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ~${totalUSD.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {splitCount > 1 && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">
                    {isEs ? 'Por Persona:' : 'Per Person:'}
                  </span>
                  <div className="text-right">
                    <strong className="text-sm text-emerald-700 dark:text-emerald-300 font-mono block">
                      ₡{Math.round(perPersonCRC).toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-400">
                      ${perPersonUSD.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 2. SINPE MOVIL GUIDE FOR TOURISTS */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
              {isEs ? 'Guía de SINPE Móvil para Turistas & Extranjeros' : 'SINPE Móvil Guide for Tourists & Travelers'}
            </h3>
            <p className="text-xs text-stone-500">
              {isEs ? 'Cómo funciona el sistema de pagos instantáneos del BCCR en todo Costa Rica' : 'How the Central Bank instant mobile payment system works nationwide'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-white">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>{isEs ? '¿Qué es SINPE Móvil?' : 'What is SINPE Móvil?'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {isEs 
                ? 'Es el protocolo oficial de transferencias interbancarias inmediatas 24/7 de Costa Rica. Requiere solo el número de teléfono celular (8 dígitos) del comercio o persona.'
                : 'Costa Rica’s official 24/7 instant interbank mobile payment network. Transactions settle in seconds via an 8-digit phone number.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-white">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>{isEs ? '¿Dónde se utiliza?' : 'Where is it accepted?'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {isEs 
                ? 'En el 98% de comercios locales: sodas típicas, ferias del agricultor, taxis rojos y artesanos. Es el método predilecto frente al efectivo.'
                : 'At 98% of local spots: traditional sodas, farmers markets, red taxis, and artisans. It is widely preferred over physical cash.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-white">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>{isEs ? 'Alternativas para Turistas' : 'Alternatives for Tourists'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {isEs 
                ? 'Si no tienes cuenta bancaria de Costa Rica: puedes pagar con tarjeta de crédito/débito contactless, efectivo en colones/dólares, o abrir una cuenta digital de no-residente en Wink/BAC.'
                : 'If you do not hold a Costa Rican bank account: use contactless Visa/Mastercard (widely accepted with dataphones), cash in Colones/USD, or digital tourist wallets.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
