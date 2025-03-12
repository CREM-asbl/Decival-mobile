import { atom } from 'nanostores';
import { type RuleType } from '../types/rules';
import { loadRuleProgress, saveRuleProgress } from '../utils/persistence';

interface RuleProgress {
  ruleId: string;
  successCount: number;
  failureCount: number;
  lastAttemptDate: Date;
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

// Initialiser avec les données sauvegardées ou l'état par défaut
const initialState = loadRuleProgress<RuleProgressState>() || defaultState;
export const ruleProgress = atom<RuleProgressState>(initialState);

export function resetProgress() {
  ruleProgress.set(defaultState);
  saveRuleProgress(defaultState);
}

export function updateRuleProgress(ruleId: string, isSuccess: boolean) {
  const state = ruleProgress.get();
  const currentProgress = state.progress[ruleId] || {
    ruleId,
    successCount: 0,
    failureCount: 0,
    lastAttemptDate: new Date(),
    mastered: false
  };

  const updatedProgress = {
    ...currentProgress,
    successCount: isSuccess ? currentProgress.successCount + 1 : currentProgress.successCount,
    failureCount: isSuccess ? currentProgress.failureCount : currentProgress.failureCount + 1,
    lastAttemptDate: new Date(),
    mastered: isSuccess && currentProgress.successCount >= 4
  };

  const newState = {
    ...state,
    progress: {
      ...state.progress,
      [ruleId]: updatedProgress
    }
  };

  ruleProgress.set(newState);
  saveRuleProgress(newState);
  return updatedProgress;
}

export function getRuleProgress(ruleId: string): RuleProgress | undefined {
  return ruleProgress.get().progress[ruleId];
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
  saveRuleProgress(newState);
}

export function getAllProgress(): RuleProgressState {
  return ruleProgress.get();
}