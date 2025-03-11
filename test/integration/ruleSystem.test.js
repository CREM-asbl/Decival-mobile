import { beforeEach, describe, expect, test } from 'vitest';
import { validateRule } from '../../src/logic/ruleValidation';
import { getRuleProgress, resetProgress, updateRuleProgress } from '../../src/stores/ruleProgressStore';
import { loadRuleProgress } from '../../src/utils/persistence';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Rule System Integration', () => {
  beforeEach(() => {
    localStorageMock.clear();
    resetProgress();
  });

  test('devrait suivre la progression à travers plusieurs exercices', () => {
    // Premier exercice : addition correcte
    const validation1 = validateRule({
      ruleId: 'add-1',
      answer: 37,
      expectedAnswer: 37,
      details: {
        firstNumber: 24,
        secondNumber: 13
      }
    });

    updateRuleProgress('add-1', validation1.isValid);
    let progress = getRuleProgress('add-1');

    expect(validation1.isValid).toBe(true);
    expect(progress?.successCount).toBe(1);

    // Deuxième exercice : addition incorrecte
    const validation2 = validateRule({
      ruleId: 'add-1',
      answer: 35,
      expectedAnswer: 37,
      details: {
        firstNumber: 24,
        secondNumber: 13
      }
    });

    updateRuleProgress('add-1', validation2.isValid);
    progress = getRuleProgress('add-1');

    expect(validation2.isValid).toBe(false);
    expect(progress?.failureCount).toBe(1);

    // Vérifier que les données sont persistées
    const savedData = loadRuleProgress();
    expect(savedData).toBeDefined();

    // Convertir la date en chaîne pour la comparaison
    const expectedProgress = { ...progress };
    if (expectedProgress.lastAttemptDate) {
      expectedProgress.lastAttemptDate = expectedProgress.lastAttemptDate.toISOString();
    }

    expect(savedData.progress['add-1']).toEqual(expectedProgress);
  });

  test('devrait détecter la maîtrise d\'une règle après plusieurs succès', () => {
    // 5 exercices réussis consécutifs
    for (let i = 0; i < 5; i++) {
      const validation = validateRule({
        ruleId: 'add-1',
        answer: 37,
        expectedAnswer: 37,
        details: {
          firstNumber: 24,
          secondNumber: 13
        }
      });

      updateRuleProgress('add-1', validation.isValid);
    }

    const progress = getRuleProgress('add-1');
    expect(progress?.mastered).toBe(true);

    // Vérifier la persistance
    const savedData = loadRuleProgress();
    expect(savedData.progress['add-1'].mastered).toBe(true);
  });

  test('devrait fournir des feedbacks appropriés selon les erreurs', () => {
    // Test avec une retenue oubliée
    const validation1 = validateRule({
      ruleId: 'add-1',
      answer: 52,
      expectedAnswer: 62,
      details: {
        firstNumber: 28,
        secondNumber: 34
      }
    });

    expect(validation1.feedback).toContain('retenue');
    expect(validation1.suggestedStep).toBeDefined();

    // Test avec une inversion dans la soustraction
    const validation2 = validateRule({
      ruleId: 'sub-1',
      answer: -21,
      expectedAnswer: 21,
      details: {
        firstNumber: 52,
        secondNumber: 31
      }
    });

    expect(validation2.feedback).toContain('ordre');
    expect(validation2.suggestedStep).toBeDefined();
  });
});