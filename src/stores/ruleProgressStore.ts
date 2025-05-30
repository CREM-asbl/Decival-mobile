import { atom } from 'nanostores';
import { type RuleType } from '../types/rules';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/persistence';

interface RuleProgress {
  ruleId: string;
  successCount: number;
  failureCount: number;
  lastAttemptDate: Date;
  consecutiveSuccesses: number;
  mastered: boolean;
}

interface RuleProgressState {
  progress: Record<string, RuleProgress>;
  currentStreak: Record<RuleType, number>;
}

const defaultState: RuleProgressState = {
  progress: {},
  currentStreak: {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    comparison: 0
  }
};

// Conversion des dates lors du chargement des données
function convertDates(state: RuleProgressState): RuleProgressState {
  if (!state || !state.progress) {
    console.warn("État de progression invalide:", state);
    return defaultState;
  }

  const progress: Record<string, RuleProgress> = {};

  for (const [key, value] of Object.entries(state.progress)) {
    progress[key] = {
      ...value,
      lastAttemptDate: new Date(value.lastAttemptDate),
      consecutiveSuccesses: value.consecutiveSuccesses || 0
    };
  }

  return {
    ...state,
    progress
  };
}

// Initialiser avec les données sauvegardées ou l'état par défaut
function initializeStore() {
  try {
    const savedProgress = loadFromStorage<RuleProgressState>(STORAGE_KEYS.RULE_PROGRESS);
    console.log("Données de progression chargées:", savedProgress);

    const initialState = savedProgress ? convertDates(savedProgress) : defaultState;
    ruleProgress.set(initialState);
  } catch (e) {
    console.error("Erreur lors de l'initialisation du store de progression:", e);
    ruleProgress.set(defaultState);
  }
}

// Créer le store avec un état vide initialement
export const ruleProgress = atom<RuleProgressState>(defaultState);

// Initialiser le store d'abord
if (typeof window !== 'undefined') {
  initializeStore();
}

// Ensuite, s'assurer que les changements futurs sont persistés
// en excluant l'événement initial de chargement
let isInitialLoad = true;
ruleProgress.subscribe((state) => {
  if (typeof window !== 'undefined') {
    // Ne sauvegarde pas lors du chargement initial pour éviter les écrasements accidentels
    if (!isInitialLoad) {
      console.log("Sauvegarde des changements de progression:", state);
      saveToStorage(STORAGE_KEYS.RULE_PROGRESS, state);
    } else {
      console.log("Chargement initial, pas de sauvegarde");
      isInitialLoad = false;
    }
  }
});

export function resetProgress() {
  ruleProgress.set(defaultState);
  console.log("Progression réinitialisée");
}

export function updateRuleProgress(ruleId: string, isSuccess: boolean, details?: {
  firstNumber?: number;
  secondNumber?: number;
  operation?: string;
}) {
  // Créer un identifiant spécifique si des détails sont fournis
  const specificRuleId = details ?
    `${ruleId}-${details.firstNumber || ''}-${details.secondNumber || ''}-${details.operation || ''}` :
    ruleId;

  const state = ruleProgress.get();
  const currentProgress = state.progress[specificRuleId] || {
    ruleId: specificRuleId,
    successCount: 0,
    failureCount: 0,
    lastAttemptDate: new Date(),
    consecutiveSuccesses: 0,
    mastered: false
  };

  const consecutiveSuccesses = isSuccess ? currentProgress.consecutiveSuccesses + 1 : 0;

  const updatedProgress = {
    ...currentProgress,
    successCount: isSuccess ? currentProgress.successCount + 1 : currentProgress.successCount,
    failureCount: isSuccess ? currentProgress.failureCount : currentProgress.failureCount + 1,
    lastAttemptDate: new Date(),
    consecutiveSuccesses,
    // Une règle est maîtrisée après 5 succès consécutifs
    mastered: isSuccess && (consecutiveSuccesses >= 5 || currentProgress.mastered)
  };

  console.log(`Mise à jour de la progression pour ${ruleId}:`, updatedProgress);

  const newState = {
    ...state,
    progress: {
      ...state.progress,
      [ruleId]: updatedProgress
    }
  };

  ruleProgress.set(newState);
  return updatedProgress;
}

export function getRuleProgress(ruleId: string): RuleProgress | undefined {
  const state = ruleProgress.get();
  return state.progress[ruleId];
}

export function updateTypeStreak(type: RuleType, isSuccess: boolean) {
  const state = ruleProgress.get();
  const currentStreak = state.currentStreak[type];

  const newState = {
    ...state,
    currentStreak: {
      ...state.currentStreak,
      [type]: isSuccess ? currentStreak + 1 : 0
    }
  };

  ruleProgress.set(newState);
}

export function getAllProgress(): RuleProgressState {
  return ruleProgress.get();
}