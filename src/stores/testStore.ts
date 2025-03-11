import { atom } from 'nanostores';
import { AdditionTest } from '../types/addition';
import { MultiplicationTest } from '../types/multiplication';
import { SubtractionTest } from '../types/subtraction';
import { updateRuleProgress } from './ruleProgressStore';

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
if (typeof window !== 'undefined') {
  const savedHistory = localStorage.getItem('testHistory');
  const savedStats = localStorage.getItem('testStats');

  if (savedHistory) {
    testHistory.set(JSON.parse(savedHistory));
  }
  if (savedStats) {
    stats.set(JSON.parse(savedStats));
  }
}

// Sauvegarder l'historique quand il change
testHistory.subscribe((history) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('testHistory', JSON.stringify(history));
  }
});

// Sauvegarder les stats quand elles changent
stats.subscribe((currentStats) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('testStats', JSON.stringify(currentStats));
  }
});

export function startNewTest(test: Test) {
  test.status = 'in_progress';
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

  // Ajouter à l'historique
  const history = testHistory.get();
  testHistory.set([test, ...history]);

  // Mettre à jour la progression des règles
  test.items.forEach(item => {
    const ruleId = `${test.type}-1`; // Pour l'instant, on utilise une règle par type
    updateRuleProgress(ruleId, item.isCorrect || false);
  });

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