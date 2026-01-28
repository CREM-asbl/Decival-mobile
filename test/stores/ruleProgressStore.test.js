import { beforeEach, describe, expect, test } from 'vitest';
import { getAllProgress, getRuleProgress, ruleProgress, updateRuleProgress, updateTypeStreak } from '../../src/stores/ruleProgressStore';

describe('Rule Progress Store', () => {
  beforeEach(() => {
    // Réinitialiser le store avant chaque test
    ruleProgress.set({
      progress: {},
      currentStreak: {
        addition: 0,
        subtraction: 0,
        multiplication: 0,
        comparison: 0,
        decimal: 0
      }
    });
  });

  test('devrait initialiser une nouvelle progression de règle', () => {
    const progress = updateRuleProgress('add-1', true);

    expect(progress).toEqual({
      ruleId: 'add-1',
      successCount: 1,
      failureCount: 0,
      lastAttemptDate: expect.any(Date),
      consecutiveSuccesses: 1,
      mastered: false
    });
  });

  test('devrait mettre à jour une progression existante', () => {
    updateRuleProgress('add-1', true);
    const progress = updateRuleProgress('add-1', true);

    expect(progress.successCount).toBe(2);
    expect(progress.failureCount).toBe(0);
  });

  test('devrait marquer une règle comme maîtrisée après avoir atteint le seuil', () => {
    for (let i = 0; i < 3; i++) {
      updateRuleProgress('add-1', true);
    }

    const progress = getRuleProgress('add-1');
    expect(progress?.mastered).toBe(true);
  });

  test('devrait incrémenter le nombre d\'échecs', () => {
    updateRuleProgress('add-1', false);
    const progress = getRuleProgress('add-1');

    expect(progress?.failureCount).toBe(1);
    expect(progress?.successCount).toBe(0);
  });

  test('devrait mettre à jour la série de succès par type', () => {
    updateTypeStreak('addition', true);
    updateTypeStreak('addition', true);
    const state = getAllProgress();

    expect(state.currentStreak.addition).toBe(2);
  });

  test('devrait réinitialiser la série en cas d\'échec', () => {
    updateTypeStreak('addition', true);
    updateTypeStreak('addition', true);
    updateTypeStreak('addition', false);
    const state = getAllProgress();

    expect(state.currentStreak.addition).toBe(0);
  });

  test('devrait gérer plusieurs règles indépendamment', () => {
    updateRuleProgress('add-1', true);
    updateRuleProgress('sub-1', false);

    const addProgress = getRuleProgress('add-1');
    const subProgress = getRuleProgress('sub-1');

    expect(addProgress?.successCount).toBe(1);
    expect(subProgress?.failureCount).toBe(1);
  });
});