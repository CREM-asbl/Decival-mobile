import { atom } from 'nanostores';
import { XP_PER_CORRECT_ANSWER, XP_BONUS_PERFECT_SCORE, XP_PER_LEVEL } from '../config/constants';
import { type AdditionTest } from '../types/addition';
import { type MultiplicationTest } from '../types/multiplication';
import { type SubtractionTest } from '../types/subtraction';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/persistence';
import { updateRuleProgress, updateTypeStreak, ruleProgress } from './ruleProgressStore';
import { unlockBadge } from './badgeStore';
import { rules } from './rulesStore';

type Test = AdditionTest | SubtractionTest | MultiplicationTest;

interface TestStats {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  xp: number;
  level: number;
  dailyStreak: number;
  lastPracticeDate?: string;
}

// Store pour le test en cours
export const currentTest = atom<Test | null>(null);

// Store pour l'historique des tests
export const testHistory = atom<Test[]>([]);

// Store pour les statistiques
export const stats = atom<TestStats>({
  totalTests: 0,
  averageScore: 0,
  bestScore: 0,
  xp: 0,
  level: 1,
  dailyStreak: 0
});

// Charger les données sauvegardées
function initializeStores() {
  if (typeof window === 'undefined') return;

  try {
    // Charger l'historique
    const savedHistory = loadFromStorage<Test[]>(STORAGE_KEYS.TEST_HISTORY);
    if (savedHistory) {
      // Convertir les dates
      const historyWithDates = savedHistory.map((test: Test) => ({
        ...test,
        startTime: new Date(test.startTime),
        endTime: test.endTime ? new Date(test.endTime) : undefined
      }));
      testHistory.set(historyWithDates);
    }

    // Charger les stats
    const savedStats = loadFromStorage<TestStats>(STORAGE_KEYS.TEST_STATS);
    if (savedStats) {
      stats.set(savedStats);
    }
  } catch (e) {
    console.error("Erreur lors de l'initialisation des stores de test:", e);
  }
}

// Initialiser les stores
initializeStores();

// Sauvegarder l'historique quand il change
testHistory.subscribe((history) => {
  if (typeof window !== 'undefined') {
    saveToStorage(STORAGE_KEYS.TEST_HISTORY, history);
  }
});

// Sauvegarder les stats quand elles changent
stats.subscribe((currentStats) => {
  if (typeof window !== 'undefined') {
    saveToStorage(STORAGE_KEYS.TEST_STATS, currentStats);
  }
});

export function startNewTest(test: Test) {
  test.status = 'in_progress';
  test.startTime = new Date();
  currentTest.set(test);
}

/**
 * Calcule les statistiques d'un test complété
 * @param test Test à analyser
 * @returns Statistiques du test (nombre de réponses correctes, score, succès du test)
 */
function calculateTestStatistics(test: Test) {
  const correctAnswers = test.items.filter(item => item.isCorrect).length;
  const totalItems = test.items.length;
  // Protection contre la division par zéro
  const score = totalItems > 0 ? (correctAnswers / totalItems) * 100 : 0;
  // Un test est considéré comme réussi si au moins 60% des réponses sont correctes
  const isSuccessful = totalItems > 0 ? (correctAnswers / totalItems) >= 0.6 : false;

  return { correctAnswers, totalItems, score, isSuccessful };
}

export function completeTest(test: Test) {
  // Calculer les statistiques du test
  const { correctAnswers, score, isSuccessful } = calculateTestStatistics(test);

  // Mettre à jour les stats
  const currentStats = stats.get();

  // Calculer l'XP gagnée (10 pts par réponse correcte + 20 bonus pour un sans-faute)
  const xpGained = (correctAnswers * XP_PER_CORRECT_ANSWER) + (score === 100 ? XP_BONUS_PERFECT_SCORE : 0);
  const newTotalXp = (currentStats.xp || 0) + xpGained;
  const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
  const leveledUp = newLevel > (currentStats.level || 1);

  // Calculer la série journalière
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let newDailyStreak = currentStats.dailyStreak || 0;
  if (!currentStats.lastPracticeDate) {
    newDailyStreak = 1;
  } else {
    const lastDate = new Date(currentStats.lastPracticeDate);
    lastDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      newDailyStreak += 1;
    } else if (diffDays > 1) {
      newDailyStreak = 1;
    } else if (diffDays === 0 && newDailyStreak === 0) {
      newDailyStreak = 1;
    }
  }

  const newStats = {
    totalTests: currentStats.totalTests + 1,
    averageScore: (currentStats.averageScore * currentStats.totalTests + score) / (currentStats.totalTests + 1),
    bestScore: Math.max(currentStats.bestScore, score),
    xp: newTotalXp,
    level: newLevel,
    dailyStreak: newDailyStreak,
    lastPracticeDate: new Date().toISOString()
  };
  stats.set(newStats);

  // Mettre à jour le statut et l'horodatage
  test.status = 'completed';
  test.endTime = new Date();

  // Ajouter à l'historique
  const history = testHistory.get();
  testHistory.set([test, ...history]);

  // Mettre à jour la progression des règles
  test.items.forEach(item => {
    updateRuleProgress(item.rule.id, item.isCorrect || false);
  });

  // Mettre à jour la série du type de règle
  updateTypeStreak(test.type, isSuccessful);

  // Badges
  const newlyUnlockedBadges = [];
  if (currentStats.totalTests === 0) {
    if (unlockBadge('FIRST_TEST')) newlyUnlockedBadges.push('FIRST_TEST');
  }
  if (score === 100) {
    if (unlockBadge('PERFECT_SCORE')) newlyUnlockedBadges.push('PERFECT_SCORE');
  }
  if (newLevel >= 5) {
    if (unlockBadge('LEVEL_5')) newlyUnlockedBadges.push('LEVEL_5');
  }
  if (newLevel >= 50) {
    if (unlockBadge('LEVEL_50')) newlyUnlockedBadges.push('LEVEL_50');
  }
  if (newDailyStreak >= 3) {
    if (unlockBadge('STREAK_3')) newlyUnlockedBadges.push('STREAK_3');
  }

  // Logique de maîtrise des règles
  const progressState = ruleProgress.get();
  const allMasteredRules = Object.values(progressState.progress).filter(p => p.mastered);
  const masteredCount = allMasteredRules.length;

  if (masteredCount >= 1) {
    if (unlockBadge('MASTERY_REACHED')) newlyUnlockedBadges.push('MASTERY_REACHED');
  }
  if (masteredCount >= 5) {
    if (unlockBadge('MASTERY_5')) newlyUnlockedBadges.push('MASTERY_5');
  }
  if (masteredCount >= 10) {
    if (unlockBadge('MASTERY_10')) newlyUnlockedBadges.push('MASTERY_10');
  }

  // Vérifier la maîtrise des catégories
  const allRulesData = rules.get();

  // Addition
  const additionRules = allRulesData.addition || [];
  if (additionRules.length > 0 && additionRules.every(r => progressState.progress[r.id]?.mastered)) {
    if (unlockBadge('MASTERY_ADDITION')) newlyUnlockedBadges.push('MASTERY_ADDITION');
  }

  // Soustraction
  const subtractionRules = allRulesData.subtraction || [];
  if (subtractionRules.length > 0 && subtractionRules.every(r => progressState.progress[r.id]?.mastered)) {
    if (unlockBadge('MASTERY_SUBTRACTION')) newlyUnlockedBadges.push('MASTERY_SUBTRACTION');
  }

  // Multiplication
  const multiplicationRules = allRulesData.multiplication || [];
  if (multiplicationRules.length > 0 && multiplicationRules.every(r => progressState.progress[r.id]?.mastered)) {
    if (unlockBadge('MASTERY_MULTIPLICATION')) newlyUnlockedBadges.push('MASTERY_MULTIPLICATION');
  }

  // Comparaison
  const comparisonRules = allRulesData.comparison || [];
  if (comparisonRules.length > 0 && comparisonRules.every(r => progressState.progress[r.id]?.mastered)) {
    if (unlockBadge('MASTERY_COMPARISON')) newlyUnlockedBadges.push('MASTERY_COMPARISON');
  }

  // Réinitialiser le test en cours
  currentTest.set(null);

  return { score, xpGained, leveledUp, newLevel, newlyUnlockedBadges };
}

export function getTestStats(): TestStats {
  return stats.get();
}

export function getRecentTests(limit: number = 5): Test[] {
  const history = testHistory.get();
  return history.slice(0, limit);
}

// Fonction utilitaire pour réinitialiser les données de test (utilisée pour les tests unitaires)
export function resetTestData() {
  testHistory.set([]);
  stats.set({
    totalTests: 0,
    averageScore: 0,
    bestScore: 0,
    xp: 0,
    level: 1,
    dailyStreak: 0
  });
  currentTest.set(null);
}