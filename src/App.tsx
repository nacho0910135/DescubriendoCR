import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { AuthModal } from './components/AuthModal';
import { PlaceDetailModal } from './components/modals/PlaceDetailModal';
import { FaunaDetailModal } from './components/modals/FaunaDetailModal';
import { NewSightingModal } from './components/modals/NewSightingModal';
import { ClaimCommerceModal } from './components/modals/ClaimCommerceModal';

// Tab Views
import { ExplorarTab } from './components/tabs/ExplorarTab';
import { FaunaTab } from './components/tabs/FaunaTab';
import { ComerciosTab } from './components/tabs/ComerciosTab';
import { LogisticaTab } from './components/tabs/LogisticaTab';
import { PerfilTab } from './components/tabs/PerfilTab';

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors selection:bg-emerald-500 selection:text-white">
      {/* 2-Second Animated Splash Screen (Agalychnis callidryas + Waving Flag) */}
      <SplashScreen />

      {/* Global Header with USD/CRC Exchange Rate Ticker & Currency Toggle */}
      <Header />

      {/* Main Responsive Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'explorar' && <ExplorarTab />}
            {activeTab === 'fauna' && <FaunaTab />}
            {activeTab === 'comercios' && <ComerciosTab />}
            {activeTab === 'logistica' && <LogisticaTab />}
            {activeTab === 'perfil' && <PerfilTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5-Tab Navigation Bar (Expo Router / Native Tab Bar) */}
      <TabBar />

      {/* Modals & Overlays */}
      <AuthModal />
      <PlaceDetailModal />
      <FaunaDetailModal />
      <NewSightingModal />
      <ClaimCommerceModal />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 dark:bg-emerald-950/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2 max-w-sm backdrop-blur-md"
          >
            <span className="text-emerald-400">✨</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
