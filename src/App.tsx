import React, { useState, Suspense, lazy } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Navbar } from './components/Navbar';
import { LeftStatsPanel } from './components/LeftStatsPanel';
import { BaronCenterArena } from './components/BaronCenterArena';
import { RightHextechPanel } from './components/RightHextechPanel';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

// Code-split heavy modals with React.lazy so mobile devices load the game arena instantly
const ChestOpenModal = lazy(() => import('./components/ChestOpenModal').then(m => ({ default: m.ChestOpenModal })));
const InventoryModal = lazy(() => import('./components/InventoryModal').then(m => ({ default: m.InventoryModal })));
const PrestigeShopModal = lazy(() => import('./components/PrestigeShopModal').then(m => ({ default: m.PrestigeShopModal })));
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal').then(m => ({ default: m.LeaderboardModal })));
const SkinUnlockModal = lazy(() => import('./components/SkinUnlockModal').then(m => ({ default: m.SkinUnlockModal })));

export function GameApp() {
  const { state, unlockedSkinModal, confirmAddUnlockedSkin, closeUnlockedSkinModal } = useGame();
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [inventoryTab, setInventoryTab] = useState<'CRAFTING' | 'INVENTORY'>('CRAFTING');
  const [isPrestigeShopOpen, setIsPrestigeShopOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const handleOpenInventory = (tab: 'CRAFTING' | 'INVENTORY' = 'CRAFTING') => {
    setInventoryTab(tab);
    setIsInventoryOpen(true);
  };

  const isLightBlue = state.themeTone === 'light_blue';

  return (
    <div className={`min-h-screen text-[#f0e6d2] flex flex-col selection:bg-[#c8aa6e]/30 selection:text-[#f0e6d2] relative transition-colors duration-500 ${
      isLightBlue
        ? 'bg-gradient-to-b from-[#031526] via-[#08223d] to-[#041527]'
        : 'bg-[#010a13]'
    }`}>
      {/* Background ambient lighting for Light Blue Mode */}
      {isLightBlue && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#00c8c8]/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#0ac8b9]/5 rounded-full blur-[160px]" />
        </div>
      )}

      {/* 1. Mandatory Disclaimer & Username Modal */}
      <DisclaimerModal />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenInventory={handleOpenInventory}
        onOpenPrestigeShop={() => setIsPrestigeShopOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      {/* 3. Main 3-Column Game Area */}
      <div className="flex-1 w-full mx-auto p-0 pb-4 md:p-4 max-w-7xl flex flex-col lg:flex-row items-stretch justify-center gap-0 md:gap-4">
        {/* Left Panel: Statistics & Upgrades */}
        <LeftStatsPanel
          onOpenInventory={() => handleOpenInventory('INVENTORY')}
          onOpenPrestigeShop={() => setIsPrestigeShopOpen(true)}
        />

        {/* Center Panel: Baron Arena */}
        <BaronCenterArena />

        {/* Right Panel: Hextech Chest Crafting & Live Loot */}
        <RightHextechPanel onOpenCrafting={() => handleOpenInventory('CRAFTING')} />
      </div>

      {/* 4. Modals & Overlays (Code-split with Suspense) */}
      <Suspense fallback={null}>
        <ChestOpenModal />
        {isInventoryOpen && (
          <InventoryModal
            isOpen={isInventoryOpen}
            onClose={() => setIsInventoryOpen(false)}
            onOpenPrestigeShop={() => setIsPrestigeShopOpen(true)}
            initialTab={inventoryTab}
          />
        )}
        {isPrestigeShopOpen && (
          <PrestigeShopModal isOpen={isPrestigeShopOpen} onClose={() => setIsPrestigeShopOpen(false)} />
        )}
        {isLeaderboardOpen && (
          <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
        )}
        
        {/* 5. Permanent Skin Unlock Celebration Reveal Modal */}
        {unlockedSkinModal && (
          <SkinUnlockModal
            unlockedSkin={unlockedSkinModal}
            onConfirm={confirmAddUnlockedSkin}
            onClose={closeUnlockedSkinModal}
          />
        )}
      </Suspense>

      <ToastContainer />

      {/* 6. Website Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
