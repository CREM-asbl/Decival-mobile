import { describe, expect, test, vi } from 'vitest';
import { generateComparisonItem } from '../../src/logic/comparisonLogic';
import { checkAnswer, createComparisonTest, evaluateTest, generateComparisonItem } from '../../src/logic/comparisonLogic';
import { ITEMS_COUNT_COMPARISON, DECIMAL_COMPARISON_TYPES } from '../../src/config/constants';

describe('Comparison Logic', () => {
  test('generateComparisonItem devrait créer un item de comparaison valide', () => {
    const item = generateComparisonItem();

    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('firstNumber');
    expect(item).toHaveProperty('secondNumber');
    expect(item).toHaveProperty('correctAnswer');
    expect(['<', '=', '>']).toContain(item.correctAnswer);

    // Vérifier que la réponse est correcte
    if (item.firstNumber < item.secondNumber) {
      expect(item.correctAnswer).toBe('<');
    } else if (item.firstNumber > item.secondNumber) {
      expect(item.correctAnswer).toBe('>');
    } else {
      expect(item.correctAnswer).toBe('=');
    }
  });

  test('createComparisonTest devrait créer un test avec le bon nombre d\'items et des items uniques', () => {
    const numberOfItems = 5;
    const test = createComparisonTest(numberOfItems);

    expect(test).toHaveProperty('id');
    expect(test.items).toHaveLength(numberOfItems);
    expect(test.currentItemIndex).toBe(0);
    expect(test.status).toBe('not_started');
    expect(test.startTime).toBeInstanceOf(Date);

    // Vérifier que tous les items ont des comparaisons valides
    test.items.forEach(item => {
      expect(['<', '=', '>']).toContain(item.correctAnswer);
    });
  });

  test('checkAnswer devrait correctement valider les réponses', () => {
    const items = [
      {
        id: '1',
        firstNumber: 5,
        secondNumber: 8,
        correctAnswer: '<'
      },
      {
        id: '2',
        firstNumber: 8,
        secondNumber: 5,
        correctAnswer: '>'
      },
      {
        id: '3',
        firstNumber: 5,
        secondNumber: 5,
        correctAnswer: '='
      }
    ];

    expect(checkAnswer(items[0], '<')).toBe(true);
    expect(checkAnswer(items[0], '>')).toBe(false);
    expect(checkAnswer(items[1], '>')).toBe(true);
    expect(checkAnswer(items[1], '=')).toBe(false);
    expect(checkAnswer(items[2], '=')).toBe(true);
    expect(checkAnswer(items[2], '<')).toBe(false);
  });

  test('generateComparisonItem devrait produire des égalités en mode integer', () => {
    // Générer beaucoup d'items pour vérifier la distribution
    const items = Array.from({ length: 200 }, () => generateComparisonItem('integer'));
    const equalItems = items.filter(item => item.correctAnswer === '=');

    // Vérifier que des égalités sont bien produites
    expect(equalItems.length).toBeGreaterThan(0);

    // Vérifier la distribution approximative (~30% ± 15%)
    const ratio = equalItems.length / items.length;
    expect(ratio).toBeGreaterThanOrEqual(0.15);
    expect(ratio).toBeLessThanOrEqual(0.45);
  });

  test('createComparisonTest en mode décimal devrait distribuer proportionnellement les types', () => {
      const test = createComparisonTest(ITEMS_COUNT_COMPARISON, 'decimal');

      // Vérifier le nombre total d'items
      expect(test.items).toHaveLength(ITEMS_COUNT_COMPARISON);

      // Compter les items par type
      const typeCounts = {};
      for (let i = 0; i < DECIMAL_COMPARISON_TYPES; i++) {
        typeCounts[i] = 0;
      }
      test.items.forEach(item => {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
      });

      // Vérifier la distribution proportionnelle : 49 items / 7 types = 7 par type
      for (let i = 0; i < DECIMAL_COMPARISON_TYPES; i++) {
        expect(typeCounts[i]).toBe(7);
      }
    });

    test('createComparisonTest en mode décimal avec 21 items devrait distribuer proportionnellement', () => {
      const test = createComparisonTest(21, 'decimal');

      expect(test.items).toHaveLength(21);

      const typeCounts = {};
      for (let i = 0; i < DECIMAL_COMPARISON_TYPES; i++) {
        typeCounts[i] = 0;
      }
      test.items.forEach(item => {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
      });

      // 21 / 7 = 3 par type
      for (let i = 0; i < DECIMAL_COMPARISON_TYPES; i++) {
        expect(typeCounts[i]).toBe(3);
      }
    });
  });