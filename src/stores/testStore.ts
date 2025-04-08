import { atom } from 'nanostores';
import { type AdditionTest } from '../types/addition';
import { type MultiplicationTest } from '../types/multiplication';
import { type SubtractionTest } from '../types/subtraction';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/persistence';
import { updateRuleProgress, updateTypeStreak } from './ruleProgressStore';

type Test = AdditionTest | SubtractionTest | MultiplicationTest;

interface TestStats {
  totalTests: number;
  averageScore: number;
  bestScore: number;
}

// Store pour le test en cours
export const currentTest = atom<Test | null>(null);

// Store pour l'historique des tests
export const testHistory = atom<Test[]>([]);

// Store pour les statistiques
export const stats = atom<TestStats>({
  totalTests: 0,
  averageScore: 0,
  bestScore: 0
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

export function completeTest(test: Test) {
  // Calculer le score
  const correctAnswers = test.items.filter(item => item.isCorrect).length;
  const score = (correctAnswers / test.items.length) * 100;

  // Mettre à jour les stats
  const currentStats = stats.get();
  const newStats = {
    totalTests: currentStats.totalTests + 1,
    averageScore: (currentStats.averageScore * currentStats.totalTests + score) / (currentStats.totalTests + 1),
    bestScore: Math.max(currentStats.bestScore, score)
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
    if (item.ruleId) {
      // Utiliser l'ID de règle spécifique s'il existe
      updateRuleProgress(item.ruleId, item.isCorrect || false);
    } else {
      // Fallback sur le type de test pour la compatibilité
      const ruleId = `${test.type}-1`;
      updateRuleProgress(ruleId, item.isCorrect || false);
    }
  });

  // Mettre à jour la série du type de règle
  // Considérer le test comme réussi si au moins 60% des réponses sont correctes
  const isTestSuccessful = (correctAnswers / test.items.length) >= 0.6;
  updateTypeStreak(test.type, isTestSuccessful);

  // Réinitialiser le test en cours
  currentTest.set(null);

  return score;
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
    bestScore: 0
  });
  currentTest.set(null);
}