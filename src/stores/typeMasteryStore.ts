import { atom } from 'nanostores';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/persistence';

export interface TypeMastery {
  type: number;
  category: 'addition' | 'subtraction' | 'multiplication' | 'comparison';
  mode: 'integer' | 'decimal';
  mastered: boolean;
  consecutiveSuccesses: number; // For future use if we want streak-based mastery
  lastScore: number;
}

export interface TypeMasteryState {
  mastery: Record<string, TypeMastery>; // Key format: "category-mode-type"
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
 * Met à jour la maîtrise d'une sous-compétence spécifique.
 */
export function updateTypeMastery(category: string, type: number, isMastered: boolean, score: number, mode: 'integer' | 'decimal' = 'decimal') {
  const key = `${category}-${mode}-${type}`;
  const current = typeMastery.get();
  
  const newState = {
    ...current,
    mastery: {
      ...current.mastery,
      [key]: {
        type,
        category: category as any,
        mode,
        mastered: isMastered,
        lastScore: score,
        consecutiveSuccesses: isMastered ? 1 : 0 // Simple implementation
      }
    }
  };
  
  typeMastery.set(newState);
}

/**
 * Retourne le nombre total de sous-compétences maîtrisées.
 */
export function getMasteredCount(): number {
  return Object.values(typeMastery.get().mastery).filter(m => m.mastered).length;
}

/**
 * Vérifie si toutes les sous-compétences d'une catégorie sont maîtrisées.
 * Ne compte que le mode décimal (les entiers ont un verdict binaire séparé).
 */
export function isCategoryMastered(category: string, totalTypes: number): boolean {
  const masteries = Object.values(typeMastery.get().mastery).filter(m => m.category === category && (m.mode ?? 'decimal') === 'decimal' && m.mastered);
  return masteries.length >= totalTypes;
}

/**
 * Verdict binaire : les entiers sont-ils maîtrisés pour une catégorie ?
 */
export function isIntegerMastered(category: string): boolean {
  return Object.values(typeMastery.get().mastery).some(
    m => m.category === category && m.mode === 'integer' && m.type === -1 && m.mastered
  );
}

/**
 * Enregistre le verdict binaire entier (type -1 = agrégat).
 */
export function updateIntegerMastery(category: string, isMastered: boolean, score: number) {
  updateTypeMastery(category, -1, isMastered, score, 'integer');
}
/**
 * Réinitialise toutes les données de maîtrise.
 */
export function resetTypeMastery() {
  typeMastery.set({ mastery: {} });
}
