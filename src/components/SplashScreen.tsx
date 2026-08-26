import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Sparkles, Compass } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { showSplash, setShowSplash, isDark } = useApp();
  const [blink, setBlink] = useState(false);

  // Periodic blinking effect for the Agalychnis callidryas frog eyes
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 240);
    }, 1600);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          id="splash-screen-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.45, ease: 'easeInOut' } }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-950 text-emerald-50' 
              : 'bg-gradient-to-b from-emerald-900 via-teal-900 to-emerald-950 text-white'
          }`}
          onClick={() => setShowSplash(false)}
        >
          {/* Subtle tropical rain forest background ambient particles */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="jungle-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M30 5 C20 15, 20 30, 30 40 C40 30, 40 15, 30 5" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M5 30 C15 20, 30 20, 40 30 C30 40, 15 40, 5 30" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#jungle-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            
            {/* Animated Mascot Illustration: Red-Eyed Tree Frog + Waving CR Flag */}
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
              
              {/* Glowing Aura */}
              <motion.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
              />

              <svg 
                viewBox="0 0 240 220" 
                className="w-full h-full drop-shadow-2xl overflow-visible"
              >
                <defs>
                  {/* Gradients for Frog body & leaf */}
                  <linearGradient id="frogGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="50%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                  <linearGradient id="frogEyeRed" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ff3333" />
                    <stop offset="60%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </linearGradient>
                  <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#166534" />
                    <stop offset="100%" stopColor="#14532d" />
                  </linearGradient>
                </defs>

                {/* Tropical Rainforest Monstera / Palm Leaf Base */}
                <path 
                  d="M20,180 C50,130 190,130 220,180 C200,210 40,210 20,180 Z" 
                  fill="url(#leafGrad)" 
                  stroke="#15803d" 
                  strokeWidth="2"
                />
                <path d="M120,140 Q120,180 120,200" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
                <path d="M60,165 Q120,175 180,165" stroke="#22c55e" strokeWidth="1.5" opacity="0.4" />

                {/* --- COSTA RICA FLAG (Waving next to the frog) --- */}
                <g transform="translate(145, 25)">
                  {/* Flagpole */}
                  <line x1="0" y1="0" x2="0" y2="120" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="4" fill="#fbbf24" />
                  
                  {/* Dynamic Waving Flag Cloth with SVG Motion */}
                  <motion.g
                    animate={{
                      skewY: [0, 3, -3, 0],
                      scaleX: [1, 0.96, 1.02, 1],
                    }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  >
                    {/* Stripe 1: Blue */}
                    <path d="M 0,5 Q 30,0 60,6 Q 70,8 75,5 L 75,15 Q 60,18 30,12 Q 10,10 0,15 Z" fill="#002b7f" />
                    {/* Stripe 2: White */}
                    <path d="M 0,15 Q 30,12 60,18 Q 70,20 75,15 L 75,25 Q 60,28 30,22 Q 10,20 0,25 Z" fill="#ffffff" />
                    {/* Stripe 3: Red (Double width Costa Rica National Flag) */}
                    <path d="M 0,25 Q 30,22 60,28 Q 70,30 75,25 L 75,45 Q 60,48 30,42 Q 10,40 0,45 Z" fill="#ce1126" />
                    {/* Stripe 4: White */}
                    <path d="M 0,45 Q 30,42 60,48 Q 70,50 75,45 L 75,55 Q 60,58 30,52 Q 10,50 0,55 Z" fill="#ffffff" />
                    {/* Stripe 5: Blue */}
                    <path d="M 0,55 Q 30,52 60,58 Q 70,60 75,55 L 75,65 Q 60,68 30,62 Q 10,60 0,65 Z" fill="#002b7f" />
                  </motion.g>
                </g>

                {/* --- AGALYCHNIS CALLIDRYAS (Red-Eyed Tree Frog) --- */}
                {/* Back / Body */}
                <motion.g
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  {/* Flank blue & yellow stripes */}
                  <path d="M 48,125 C 44,140 50,158 60,165" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 52,130 C 50,142 54,152 62,158" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
                  
                  <path d="M 132,125 C 136,140 130,158 120,165" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 128,130 C 130,142 126,152 118,158" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />

                  {/* Feet with orange suction pads */}
                  {/* Left hand */}
                  <path d="M 45,155 Q 30,165 25,175" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="24" cy="176" r="4.5" fill="#f97316" />
                  <circle cx="30" cy="180" r="4" fill="#f97316" />
                  <circle cx="20" cy="170" r="4" fill="#f97316" />

                  {/* Right hand */}
                  <path d="M 135,155 Q 150,165 155,175" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="156" cy="176" r="4.5" fill="#f97316" />
                  <circle cx="150" cy="180" r="4" fill="#f97316" />
                  <circle cx="160" cy="170" r="4" fill="#f97316" />

                  {/* Main Green Body */}
                  <ellipse cx="90" cy="140" rx="38" ry="32" fill="url(#frogGreen)" />
                  <ellipse cx="90" cy="115" rx="32" ry="24" fill="url(#frogGreen)" />

                  {/* Frog Nostrils & Gentle smile */}
                  <circle cx="86" cy="108" r="1.5" fill="#14532d" />
                  <circle cx="94" cy="108" r="1.5" fill="#14532d" />
                  <path d="M 82,118 Q 90,123 98,118" stroke="#14532d" strokeWidth="2" fill="none" strokeLinecap="round" />

                  {/* LEFT RED EYE */}
                  <g transform="translate(62, 88)">
                    {/* Eye Bulb green socket */}
                    <circle cx="0" cy="0" r="18" fill="#22c55e" />
                    {/* Scarlet Iris */}
                    <circle cx="0" cy="0" r="14" fill="url(#frogEyeRed)" />
                    {/* Eyelid / Blink Animation */}
                    {blink ? (
                      <ellipse cx="0" cy="0" rx="14" ry="2" fill="#15803d" />
                    ) : (
                      <>
                        {/* Vertical Slit Pupil */}
                        <ellipse cx="0" cy="0" rx="2.5" ry="10" fill="#0f172a" />
                        {/* Eye catchlight */}
                        <circle cx="-4" cy="-4" r="3" fill="#ffffff" opacity="0.9" />
                      </>
                    )}
                  </g>

                  {/* RIGHT RED EYE */}
                  <g transform="translate(118, 88)">
                    {/* Eye Bulb green socket */}
                    <circle cx="0" cy="0" r="18" fill="#22c55e" />
                    {/* Scarlet Iris */}
                    <circle cx="0" cy="0" r="14" fill="url(#frogEyeRed)" />
                    {/* Eyelid / Blink Animation */}
                    {blink ? (
                      <ellipse cx="0" cy="0" rx="14" ry="2" fill="#15803d" />
                    ) : (
                      <>
                        {/* Vertical Slit Pupil */}
                        <ellipse cx="0" cy="0" rx="2.5" ry="10" fill="#0f172a" />
                        {/* Eye catchlight */}
                        <circle cx="-4" cy="-4" r="3" fill="#ffffff" opacity="0.9" />
                      </>
                    )}
                  </g>
                </motion.g>
              </svg>
            </div>

            {/* Logo Typography & Branding */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-6 h-6 text-emerald-400 animate-pulse" />
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                  Descubriendo <span className="text-emerald-400">CR</span>
                </h1>
              </div>
              <p className="text-emerald-200 text-sm font-medium tracking-wide flex items-center gap-1.5">
                <span>Pura Vida Explorer</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Costa Rica</span>
              </p>
            </motion.div>

            {/* 2-Second Progress Bar */}
            <div className="w-48 h-1.5 bg-emerald-950/60 rounded-full mt-6 overflow-hidden border border-emerald-500/30">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.0, ease: "linear" }}
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"
              />
            </div>

            <p className="text-xs text-emerald-300/70 mt-3 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Iniciando experiencia sin fronteras...</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
