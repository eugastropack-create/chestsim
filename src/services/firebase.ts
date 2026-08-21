import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  increment,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { LeaderboardEntry } from '../types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Target provisioned database ID or default
export const db: Firestore = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined
);

export interface GlobalStats {
  totalClicks: number;
  totalKills: number;
  totalChestsOpened: number;
  lastUpdated?: any;
}

// -------------------------------------------------------------
// 1. REALTIME GLOBAL BARON CLICKS COUNTER & STATS
// -------------------------------------------------------------
let pendingClicks = 0;
let pendingKills = 0;
let pendingChests = 0;
let syncTimeout: any = null;
let lastPlayerPayload: {
  userId: string;
  username: string;
  avatarChampionId: string;
  level: number;
  totalClicks: number;
  chestsOpened: number;
  prestigeCount: number;
} | null = null;

async function flushPendingStats() {
  if (pendingClicks === 0 && pendingKills === 0 && pendingChests === 0 && !lastPlayerPayload) {
    return;
  }

  const clicksToFlush = pendingClicks;
  const killsToFlush = pendingKills;
  const chestsToFlush = pendingChests;
  const playerToFlush = lastPlayerPayload;

  pendingClicks = 0;
  pendingKills = 0;
  pendingChests = 0;
  lastPlayerPayload = null;

  try {
    // 1. Update Global Aggregate Stats Document
    const globalRef = doc(db, 'global_stats', 'baron_clicks');
    await setDoc(
      globalRef,
      {
        totalClicks: increment(clicksToFlush),
        totalKills: increment(killsToFlush),
        totalChestsOpened: increment(chestsToFlush),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    // 2. Update Leaderboard Entry if player has identifier
    if (playerToFlush && playerToFlush.userId) {
      const userRef = doc(db, 'leaderboard', playerToFlush.userId);
      await setDoc(
        userRef,
        {
          id: playerToFlush.userId,
          username: playerToFlush.username || 'Summoner',
          avatarUrl: `https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/${playerToFlush.avatarChampionId || 'MasterYi'}.png`,
          level: playerToFlush.level || 1,
          totalClicks: playerToFlush.totalClicks || 0,
          chestsOpened: playerToFlush.chestsOpened || 0,
          prestigeCount: playerToFlush.prestigeCount || 0,
          lastActive: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.warn('Firebase sync stats deferred:', err);
  }
}

/**
 * Buffers clicks and syncs to Firestore in efficient batches to reduce write frequency and maximize performance.
 */
export function recordBaronClickToFirebase(
  clicks: number = 1,
  playerData?: {
    userId: string;
    username: string;
    avatarChampionId: string;
    level: number;
    totalClicks: number;
    chestsOpened: number;
    prestigeCount: number;
  },
  kills: number = 0,
  chests: number = 0
) {
  pendingClicks += clicks;
  pendingKills += kills;
  pendingChests += chests;
  if (playerData) {
    lastPlayerPayload = playerData;
  }

  // Flush immediately if large batch, otherwise debounce to 2.5s
  if (pendingClicks >= 25) {
    if (syncTimeout) clearTimeout(syncTimeout);
    flushPendingStats();
  } else {
    if (!syncTimeout) {
      syncTimeout = setTimeout(() => {
        syncTimeout = null;
        flushPendingStats();
      }, 2500);
    }
  }
}

/**
 * Listens to global click numbers worldwide in real-time from Firestore.
 */
export function subscribeToGlobalClicks(callback: (stats: GlobalStats) => void): () => void {
  try {
    const globalRef = doc(db, 'global_stats', 'baron_clicks');
    return onSnapshot(
      globalRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as GlobalStats;
          callback({
            totalClicks: Number(data.totalClicks || 0),
            totalKills: Number(data.totalKills || 0),
            totalChestsOpened: Number(data.totalChestsOpened || 0),
            lastUpdated: data.lastUpdated,
          });
        } else {
          // Initialize document if first time
          setDoc(globalRef, {
            totalClicks: 10000,
            totalKills: 250,
            totalChestsOpened: 500,
            lastUpdated: serverTimestamp(),
          }, { merge: true }).catch(() => {});
          
          callback({
            totalClicks: 10000,
            totalKills: 250,
            totalChestsOpened: 500,
          });
        }
      },
      (error) => {
        console.warn('Firestore subscription fallback:', error);
      }
    );
  } catch (err) {
    console.warn('Firestore subscription failed to init:', err);
    return () => {};
  }
}

/**
 * Listens to top online players in the real Firestore Leaderboard.
 */
export function subscribeToLeaderboard(callback: (entries: LeaderboardEntry[]) => void): () => void {
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('level', 'desc'), limit(15));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: LeaderboardEntry[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            username: data.username || 'Summoner',
            avatarUrl: data.avatarUrl || 'https://ddragon.leagueoflegends.com/cdn/14.20.1/img/champion/MasterYi.png',
            level: Number(data.level || 1),
            totalClicks: Number(data.totalClicks || 0),
            chestsOpened: Number(data.chestsOpened || 0),
            prestigeCount: Number(data.prestigeCount || 0),
            rankTitle: data.rankTitle || 'Challenger',
            isCurrentUser: false,
          });
        });
        callback(list);
      },
      (err) => {
        console.warn('Leaderboard snapshot error:', err);
      }
    );
  } catch (err) {
    console.warn('Leaderboard subscription error:', err);
    return () => {};
  }
}
