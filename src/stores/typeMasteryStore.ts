import { atom } from 'nanostores';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/persistence';

export interface TypeMastery {
  type: number;
  category: 'addition' | 'subtraction' | 'multiplication' | 'comparison';
  mastered: boolean;
  consecutiveSuccesses: number; // For future use if we want streak-based mastery
  lastScore: number;
}

export interface TypeMasteryState {
  mastery: Record<string, TypeMastery>; // Key format: "category-type"
}

export const typeMastery = atom<TypeMasteryState>({
  mastery: {}
});

// Initialisation
if (typeof window !== 'undefined') {
  const saved = loadFromStorage<TypeMasteryState>(STORAGE_KEYS.TYPE_MASTERY || 'decival_type_mastery');
  if (saved) typeMastery.set(saved);
}

// Persistance
typeMastery.subscribe(state => {
  if (typeof window !== 'undefined') {
    saveToStorage(STORAGE_KEYS.TYPE_MASTERY || 'decival_type_mastery', state);
  }
});

/**
 * Met à jour la maîtrise d'un type spécifique.
 */
export function updateTypeMastery(category: string, type: number, isMastered: boolean, score: number) {
  const key = `${category}-${type}`;
  const current = typeMastery.get();
  
  const newState = {
    ...current,
    mastery: {
      ...current.mastery,
      [key]: {
        type,
        category: category as any,
        mastered: isMastered,
        lastScore: score,
        consecutiveSuccesses: isMastered ? 1 : 0 // Simple implementation
      }
    }
  };
  
  typeMastery.set(newState);
}

/**
 * Retourne le nombre total de types maîtrisés.
 */
export function getMasteredCount(): number {
  return Object.values(typeMastery.get().mastery).filter(m => m.mastered).length;
}

/**
 * Vérifie si tous les types d'une catégorie sont maîtrisés.
 */
export function isCategoryMastered(category: string, totalTypes: number): boolean {
  const masteries = Object.values(typeMastery.get().mastery).filter(m => m.category === category && m.mastered);
  return masteries.length >= totalTypes;
}
/**
 * Réinitialise toutes les données de maîtrise.
 */
export function resetTypeMastery() {
  typeMastery.set({ mastery: {} });
}
