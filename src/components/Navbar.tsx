import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DDRAGON_ICONS } from '../services/dataDragon';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Coins,
  Trophy,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Package,
  Hammer
} from 'lucide-react';
import { HextechCurrenciesBar, OrangeEssenceIcon, MythicEssenceIcon } from './HextechIcons';
import { LoLLevelBorder } from './LoLLevelBorder';
import { LoLRankBadge, LoLRankTiersModal } from './LoLRankBadge';
import { t } from '../i18n/translations';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenInventory: (tab?: 'CRAFTING' | 'INVENTORY') => void;
  onOpenPrestigeShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenRankModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenInventory,
  onOpenPrestigeShop,
  onOpenLeaderboard,
  onOpenRankModal,
}) => {
  const { state, toggleSound, toggleThemeTone, toggleLanguage, resetProgress } = useGame();
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isLightBlue = state.themeTone === 'light_blue';
  const skinCount = state.inventory?.length || 0;
  const shardCount = state.shards?.length || 0;

  const handleRankClick = () => {
    if (onOpenRankModal) {
      onOpenRankModal();
    } else {
      setIsRankModalOpen(true);
    }
  };

  const confirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full border-b select-none font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 ${
        isLightBlue
          ? 'bg-[#041527]/95 border-[#00c8c8]/30 shadow-[0_4px_20px_rgba(0,120,180,0.15)]'
          : 'bg-[#010a13] border-[#1e2328]'
      }`}>
      {/* Top Gold & Hextech Accent Bar */}
      <div className={`w-full h-[2px] ${
        isLightBlue
          ? 'bg-gradient-to-r from-[#00c8c8] via-[#c8aa6e] to-[#00c8c8]'
          : 'bg-gradient-to-r from-[#c8aa6e] via-[#f0e6d2] to-[#c8aa6e]'
      }`}></div>

      {/* Main Top Header Bar */}
      <div className="flex items-center justify-between px-2 sm:px-4 h-14 md:h-16 relative">
        {/* ======================= LEFT SECTION ======================= */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 h-full">
          {/* User Profile Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dynamic League of Legends Level Border */}
            <LoLLevelBorder
              level={state.level}
              avatarUrl={`${DDRAGON_ICONS}/${state.avatarChampionId || 'MasterYi'}.png`}
              username={state.username}
              size="md"
            />

            {/* User Info & LoL Rank Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:flex flex-col justify-center">
                <span className="text-[#f0e6d2] font-bold text-xs md:text-sm leading-none drop-shadow-md truncate max-w-[110px]">
                  {state.username || 'Summoner'}
                </span>
              </div>

              {/* LoL Ranked Tier Badge */}
              <LoLRankBadge
                skinCount={skinCount}
                onClick={handleRankClick}
              />
            </div>
          </div>
        </div>

        {/* ======================= RIGHT SECTION ======================= */}
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 h-full">
          {/* Settings: Reset, Language, Sound, Theme */}
          <div className="flex items-center gap-1 bg-[#010a13]/80 border border-[#1e2328] rounded-sm px-1 py-0.5">
            {/* Reset Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 text-rose-500 hover:text-white hover:bg-rose-500/20"
              title={t('nav.reset', state.language)}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1 text-[#a09b8c] hover:text-[#f0e6d2] hover:bg-[#1e2328]"
              title={t('nav.lang.switch', state.language)}
            >
              <span className="text-xs sm:text-sm leading-none font-bold">
                {state.language === 'tr' ? 'TR' : 'EN'}
              </span>
            </button>

            {/* Sound Mute / Unmute Button */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1 ${
                state.soundEnabled
                  ? 'text-[#00c8c8] hover:bg-[#00c8c8]/15'
                  : 'text-[#5c5b57] hover:text-[#a09b8c] hover:bg-[#1e2328]'
              }`}
              title={state.soundEnabled ? t('nav.sound.on', state.language) : t('nav.sound.off', state.language)}
            >
              {state.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400/80" />
              )}
            </button>

            {/* Theme Tone Toggle (Açık Mavi / Koyu Ton) */}
            <button
              onClick={toggleThemeTone}
              className={`p-1.5 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isLightBlue
                  ? 'text-[#00c8c8] hover:bg-[#00c8c8]/15'
                  : 'text-[#a09b8c] hover:text-[#f0e6d2] hover:bg-[#1e2328]'
              }`}
              title={isLightBlue ? t('nav.theme.light', state.language) : t('nav.theme.dark', state.language)}
            >
              {isLightBlue ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00c8c8] animate-spin-slow" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8aa6e]" />
              )}
              <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-bold">
                {isLightBlue ? t('nav.theme.text_light', state.language) : t('nav.theme.text_dark', state.language)}
              </span>
            </button>
          </div>

          {/* Desktop Only: Top Navbar Icons (Leaderboard, Crafting, Inventory, Store) */}
          <div className="hidden md:flex items-center h-full">
            {/* Leaderboard Button */}
            <button
              onClick={onOpenLeaderboard}
              className="h-full px-2.5 sm:px-3 flex items-center border-r border-[#1e2328] text-[#a09b8c] hover:text-[#f0e6d2] transition-colors cursor-pointer"
              title={t('nav.leaderboard', state.language)}
            >
              <Trophy className="w-4 h-4" />
            </button>

            {/* Crafting Button */}
            <button
              onClick={() => onOpenInventory('CRAFTING')}
              className="h-full px-2.5 sm:px-3 flex items-center border-r border-[#1e2328] text-[#a09b8c] hover:text-[#00c8c8] transition-colors cursor-pointer relative"
              title={t('nav.crafting', state.language)}
            >
              <Hammer className="w-4 h-4" />
              {shardCount > 0 && (
                <div className="absolute top-3.5 right-1.5 w-2 h-2 bg-[#00c8c8] rounded-full shadow-[0_0_8px_#00c8c8]"></div>
              )}
            </button>

            {/* Inventory Button */}
            <button
              onClick={() => onOpenInventory('INVENTORY')}
              className="h-full px-2.5 sm:px-3 flex items-center border-r border-[#1e2328] text-[#a09b8c] hover:text-[#c8aa6e] transition-colors cursor-pointer relative"
              title={t('nav.inventory', state.language)}
            >
              <Package className="w-4 h-4" />
              {skinCount > 0 && (
                <div className="absolute top-3.5 right-1.5 w-2 h-2 bg-[#ff9900] rounded-full shadow-[0_0_8px_#ff9900]"></div>
              )}
            </button>

            {/* Prestige / Mythic Shop Button */}
            <button
              onClick={onOpenPrestigeShop}
              className="h-full px-3 sm:px-4 flex items-center border-r border-[#1e2328] text-[#a09b8c] hover:text-[#d442f5] transition-colors cursor-pointer"
              title={t('nav.store', state.language)}
            >
              <Coins className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Only: Currencies Display */}
          <div className="hidden md:flex bg-[#030d17]/80 border border-[#1e2328] rounded-sm px-2.5 sm:px-3.5 py-1 items-center">
            <HextechCurrenciesBar
              orangeEssence={state.orangeEssence}
              gemstones={state.gemstones}
              keys={state.keys}
              chests={Math.max(1, state.keys)}
              onOpenCrafting={() => onOpenInventory('CRAFTING')}
            />
          </div>
        </div>
      </div>

      {/* ======================= MOBILE HEXTECH ACTION & CURRENCY RIBBON ======================= */}
      {/* Visible on Mobile/Tablet (< md screens) directly above the arena/game screen */}
      <div className="md:hidden w-full bg-[#020b14]/95 border-t border-[#00c8c8]/20 px-3 py-1.5 flex items-center justify-around gap-1.5 overflow-x-auto no-scrollbar shadow-inner">
        {/* 1. Envanter (Kalıcı Kostümler) */}
        <button
          onClick={() => onOpenInventory('INVENTORY')}
          className="flex items-center justify-center relative p-2 bg-[#010a13]/90 hover:bg-[#c8aa6e]/15 border border-[#c8aa6e]/40 rounded-xs text-[#c8aa6e] hover:text-[#f0e6d2] transition-all cursor-pointer shrink-0 active:scale-95"
          title={t('nav.inventory', state.language)}
        >
          <Package className="w-4 h-4 text-[#c8aa6e]" />
          {skinCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#c8aa6e] text-[#010a13] font-mono text-[9px] px-1 rounded-full font-extrabold shadow-[0_0_6px_#c8aa6e]">
              {skinCount}
            </span>
          )}
        </button>

        {/* 2. Zanaatkârlık (Crafting / Kristaller) */}
        <button
          onClick={() => onOpenInventory('CRAFTING')}
          className="flex items-center justify-center relative p-2 bg-[#010a13]/90 hover:bg-[#00c8c8]/15 border border-[#00c8c8]/40 rounded-xs text-[#00c8c8] hover:text-white transition-all cursor-pointer shrink-0 active:scale-95"
          title={t('nav.crafting', state.language)}
        >
          <Hammer className="w-4 h-4 text-[#00c8c8]" />
          {shardCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#00c8c8] text-[#010a13] font-mono text-[9px] px-1 rounded-full font-extrabold shadow-[0_0_6px_#00c8c8]">
              {shardCount}
            </span>
          )}
        </button>

        {/* 3. Liderlik Tablosu (Leaderboard) */}
        <button
          onClick={onOpenLeaderboard}
          className="flex items-center justify-center p-2 bg-[#010a13]/90 hover:bg-[#f0e6d2]/15 border border-[#1e2328] hover:border-[#c8aa6e]/40 rounded-xs text-[#ffd700] hover:text-[#f0e6d2] transition-all cursor-pointer shrink-0 active:scale-95"
          title={t('nav.leaderboard', state.language)}
        >
          <Trophy className="w-4 h-4 text-[#ffd700]" />
        </button>

        {/* 4. İhtişamlı Mağaza (Mythic / Prestige Shop) */}
        <button
          onClick={onOpenPrestigeShop}
          className="flex items-center justify-center p-2 bg-[#010a13]/90 hover:bg-[#d442f5]/15 border border-[#d442f5]/40 rounded-xs text-[#d442f5] hover:text-white transition-all cursor-pointer shrink-0 active:scale-95"
          title={t('nav.store', state.language)}
        >
          <Sparkles className="w-4 h-4 text-[#d442f5]" />
        </button>

        <div className="h-4 w-px bg-[#1e2328] shrink-0 mx-0.5"></div>

        {/* 5. Turuncu Öz (Orange Essence) Currency */}
        <button
          onClick={() => onOpenInventory('CRAFTING')}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-black/60 border border-[#ff8400]/40 rounded-xs hover:border-[#ff8400] transition-all cursor-pointer shrink-0 active:scale-95"
          title="Turuncu Öz (Zanaatkarlıkta Kullan)"
        >
          <OrangeEssenceIcon className="w-4 h-4 drop-shadow-[0_0_4px_#ff8400]" />
          <span className="text-[11px] font-bold font-mono text-[#f0e6d2]">
            {state.orangeEssence}
          </span>
        </button>

        {/* 6. Mor Cevher / İhtişamlı Öz (Mythic Essence) Currency */}
        <button
          onClick={onOpenPrestigeShop}
          className="flex items-center gap-1.5 px-2 py-1.5 bg-black/60 border border-[#c084fc]/40 rounded-xs hover:border-[#c084fc] transition-all cursor-pointer shrink-0 active:scale-95"
          title="Mor Cevher (İhtişamlı Mağazada Kullan)"
        >
          <MythicEssenceIcon className="w-4 h-4 drop-shadow-[0_0_4px_#c084fc]" />
          <span className="text-[11px] font-bold font-mono text-[#e879f9]">
            {state.gemstones}
          </span>
        </button>
      </div>

      {/* LoL Ranked Tiers List Modal */}
      <LoLRankTiersModal
        isOpen={isRankModalOpen}
        onClose={() => setIsRankModalOpen(false)}
        currentSkinCount={skinCount}
      />

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#010a13] border border-[#c8aa6e] rounded-sm max-w-sm w-full shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="bg-[#0a1428] px-4 py-3 border-b border-[#1e2328] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-white font-bold text-sm tracking-wider uppercase">
                  {t('reset.confirm.title', state.language)}
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-[#a09b8c] leading-relaxed">
                  {t('reset.confirm.desc', state.language)}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 bg-[#1e2328] hover:bg-[#2a3038] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                  >
                    {t('reset.confirm.no', state.language)}
                  </button>
                  <button
                    onClick={confirmReset}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-[0_0_10px_rgba(225,29,72,0.3)] cursor-pointer"
                  >
                    {t('reset.confirm.yes', state.language)}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};

