import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Crown, Shield, Activity, Globe, Sparkles, Flame, Box } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getLeaderboard } from '../services/storage';
import { subscribeToLeaderboard } from '../services/firebase';
import { LoLLevelBorder } from './LoLLevelBorder';
import { LoLRankCrest, getRankTier, LoLTierId } from './LoLRankBadge';
import { LeaderboardEntry } from '../types';
import { t } from '../i18n/translations';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const { state, globalStats } = useGame();
  const [onlineEntries, setOnlineEntries] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'LEADERBOARD'>('LEADERBOARD');

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToLeaderboard((liveList) => {
      if (liveList && liveList.length > 0) {
        setOnlineEntries(liveList);
      }
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Merge Firestore live entries with local rivals & current user
  const fallbackList = getLeaderboard(state);
  
  // Build merged leaderboard list
  const userEntry: LeaderboardEntry = {
    id: state.playerId || 'current_user',
    username: state.username || (state.language === 'tr' ? 'Sen (Çağrıcı)' : 'You (Summoner)'),
    avatarUrl: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${state.avatarChampionId || 'MasterYi'}.png`,
    level: state.level,
    totalClicks: state.totalClicks,
    chestsOpened: state.totalChestsOpened,
    prestigeCount: state.inventory?.filter(s => s.rarity === 'Prestige' || s.isPrestige)?.length || 0,
    rankTitle: getRankTier(state.inventory?.length || 0).currentTier.name,
    isCurrentUser: true,
  };

  const combinedMap = new Map<string, LeaderboardEntry>();
  // 1. Add current user
  combinedMap.set(userEntry.id, userEntry);
  
  // 2. Add Firestore live entries
  onlineEntries.forEach(entry => {
    if (entry.id === userEntry.id) {
      combinedMap.set(userEntry.id, { ...entry, ...userEntry, isCurrentUser: true });
    } else {
      combinedMap.set(entry.id, entry);
    }
  });

  // 3. Fill up with default rivals if fewer than 10
  if (combinedMap.size < 10) {
    fallbackList.forEach(r => {
      if (!combinedMap.has(r.id) && !r.isCurrentUser) {
        combinedMap.set(r.id, r);
      }
    });
  }

  const sortedList = Array.from(combinedMap.values()).sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (b.prestigeCount !== a.prestigeCount) return b.prestigeCount - a.prestigeCount;
    return b.totalClicks - a.totalClicks;
  }).slice(0, 15);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md font-['Plus_Jakarta_Sans',sans-serif]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-3xl h-[90vh] max-h-[780px] bg-[#010a13] border border-[#c8aa6e] rounded-sm overflow-hidden shadow-2xl flex flex-col text-[#f0e6d2]"
        >
          {/* Header */}
          <div className="bg-[#0a1428] px-4 md:px-6 py-3.5 border-b border-[#1e2328] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-sm bg-[#010a13] border border-[#00c8c8] text-[#00c8c8] shadow-[0_0_10px_rgba(0,200,200,0.3)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base md:text-lg text-white uppercase tracking-wider font-['Cinzel',serif]">
                    {t('modal.leaderboard.title', state.language)}
                  </h2>
                  <span className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Firebase Canlı
                  </span>
                </div>
                <p className="text-xs text-[#00c8c8] font-medium">
                  {t('modal.leaderboard.subtitle', state.language)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-sm text-[#a09b8c] hover:text-white hover:bg-[#1e2328] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Real-time Global Live Ticker Banner from Firebase */}
          <div className="bg-[#030e1a] border-b border-[#1e2328] px-3 sm:px-6 py-2.5 grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {/* Global Clicks */}
            <div className="bg-[#010a13]/90 border border-[#00c8c8]/30 rounded-xs p-1.5 sm:p-2 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[10px] text-[#00c8c8] font-bold uppercase tracking-wider">
                <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
                <span>{state.language === 'tr' ? 'Küresel Tıklama' : 'Global Clicks'}</span>
              </div>
              <div className="text-xs sm:text-base md:text-lg font-black text-white font-mono mt-0.5">
                {(globalStats?.totalClicks || 0).toLocaleString()}
              </div>
            </div>

            {/* Global Chests */}
            <div className="bg-[#010a13]/90 border border-[#c8aa6e]/30 rounded-xs p-1.5 sm:p-2 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[10px] text-[#c8aa6e] font-bold uppercase tracking-wider">
                <Box className="w-3 h-3 text-[#c8aa6e]" />
                <span>{state.language === 'tr' ? 'Açılan Sandık' : 'Chests Opened'}</span>
              </div>
              <div className="text-xs sm:text-base md:text-lg font-black text-[#f0e6d2] font-mono mt-0.5">
                {(globalStats?.totalChestsOpened || 0).toLocaleString()}
              </div>
            </div>

            {/* Personal Clicks */}
            <div className="bg-[#010a13]/90 border border-[#d442f5]/30 rounded-xs p-1.5 sm:p-2 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[10px] text-[#d442f5] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#d442f5]" />
                <span>{state.language === 'tr' ? 'Senin Tıklaman' : 'Your Clicks'}</span>
              </div>
              <div className="text-xs sm:text-base md:text-lg font-black text-[#e879f9] font-mono mt-0.5">
                {state.totalClicks.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2">
            {sortedList.map((entry, index) => {
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;
              const isUser = entry.isCurrentUser;

              // Calculate tier ID from entry prestige/level
              let tierId: LoLTierId = 'iron';
              if (entry.level >= 500 || entry.prestigeCount >= 4) tierId = 'challenger';
              else if (entry.level >= 300 || entry.prestigeCount >= 3) tierId = 'grandmaster';
              else if (entry.level >= 200 || entry.prestigeCount >= 2) tierId = 'master';
              else if (entry.level >= 100 || entry.prestigeCount >= 1) tierId = 'diamond';
              else if (entry.level >= 50) tierId = 'emerald';
              else if (entry.level >= 25) tierId = 'platinum';
              else if (entry.level >= 10) tierId = 'gold';
              else if (entry.level >= 5) tierId = 'silver';
              else if (entry.level >= 2) tierId = 'bronze';

              if (isUser) {
                const userTier = getRankTier(state.inventory?.length || 0);
                tierId = userTier.currentTier.id;
              }

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-sm border transition-colors ${
                    isUser
                      ? 'bg-[#0a1428] border-[#c8aa6e] shadow-[0_0_15px_rgba(200,170,110,0.2)]'
                      : isFirst
                      ? 'bg-[#010a13] border-[#c89b3c]'
                      : 'bg-[#010a13] border-[#1e2328]'
                  }`}
                >
                  {/* Rank Position */}
                  <div className="w-6 sm:w-7 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                    {isFirst ? (
                      <Crown className="w-4 h-4 fill-[#c89b3c] text-[#c89b3c]" />
                    ) : isSecond ? (
                      <span className="text-slate-300">#2</span>
                    ) : isThird ? (
                      <span className="text-[#c8aa6e]">#3</span>
                    ) : (
                      <span className="text-[#a09b8c]">#{index + 1}</span>
                    )}
                  </div>

                  {/* LoL Dynamic Level Border Avatar */}
                  <div className="shrink-0">
                    <LoLLevelBorder
                      level={entry.level}
                      avatarUrl={entry.avatarUrl}
                      username={entry.username}
                      size="sm"
                    />
                  </div>

                  {/* Rank Crest Emblem */}
                  <div className="shrink-0 -mr-1">
                    <LoLRankCrest tierId={tierId} size="xs" />
                  </div>

                  {/* User info & stats */}
                  <div className="flex-1 min-w-0 pl-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white uppercase truncate">
                        {entry.username}
                      </span>
                      {isUser && (
                        <span className="bg-[#c89b3c] text-[#010a13] text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded-xs uppercase shrink-0">
                          {t('modal.leaderboard.you', state.language)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] text-[#a09b8c] mt-0.5">
                      <span className="text-[#00c8c8] font-semibold">{t(`rank.${tierId}`, state.language) || entry.rankTitle}</span>
                      <span>•</span>
                      <span className="font-mono text-white/90">{(entry.totalClicks || 0).toLocaleString()} {t('modal.leaderboard.clicks', state.language)}</span>
                      <span>•</span>
                      <span>{entry.chestsOpened} {t('modal.leaderboard.chests', state.language)}</span>
                    </div>
                  </div>

                  {/* Right: Level & Prestige */}
                  <div className="text-right flex flex-col items-end shrink-0 pl-1">
                    <div className="font-bold text-xs sm:text-base text-[#00c8c8] leading-tight font-mono">
                      Lv. {entry.level}
                    </div>
                    {entry.prestigeCount > 0 && (
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-[#c8aa6e]">
                        <Crown className="w-3 h-3 text-[#c8aa6e]" />
                        <span>{entry.prestigeCount} {t('modal.leaderboard.mythic', state.language)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note with Firebase status */}
          <div className="bg-[#020b14] border-t border-[#1e2328] px-4 py-2 flex items-center justify-between text-[11px] text-[#a09b8c]">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{state.language === 'tr' ? 'Firestore Tıklama Takip Sistemi Aktif' : 'Firestore Click Tracking Active'}</span>
            </div>
            <div className="text-[10px] text-[#00c8c8] font-mono">
              DB: kemaltk
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
