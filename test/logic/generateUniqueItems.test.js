import { describe, expect, test } from 'vitest';
import { generateUniqueItems } from '../../src/logic/utils';
import { createComparisonTest } from '../../src/logic/comparisonLogic';
import { createAdditionTest } from '../../src/logic/additionLogic';
import { createSubtractionTest } from '../../src/logic/subtractionLogic';
import { createMultiplicationTest } from '../../src/logic/multiplicationLogic';

describe('generateUniqueItems', () => {
  test('should create unique items', () => {
    const generator = () => Math.floor(Math.random() * 100);
    const keyFn = (item) => item.toString();
    const uniqueItems = generateUniqueItems(10, generator, keyFn);

    const uniqueSet = new Set(uniqueItems);
    expect(uniqueSet.size).toBe(uniqueItems.length);
  });

  test('should regenerate on collision', () => {
    let callCount = 0;
      const generator = () => { callCount++; return callCount <= 5 ? 1 : callCount; };
    const keyFn = (item) => item.toString();
    const uniqueItems = generateUniqueItems(5, generator, keyFn);
    expect(uniqueItems.length).toBe(5);
    expect(callCount).toBeGreaterThan(5);
  });
});

describe('Unicité globale des items de test (reproduction du bug)', () => {
  // Bug : la même paire (ex: 36 = 36) pouvait apparaître dans deux types différents
  // car l'unicité était vérifiée par type séparément.
  test('createComparisonTest en mode decimal doit avoir des items uniques globalement', () => {
    for (let seed = 0; seed < 20; seed++) {
      const test = createComparisonTest(49, 'decimal');
      const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}|${item.type}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(test.items.length);
    }
  });

  test('createComparisonTest en mode integer doit avoir des items uniques globalement', () => {
    for (let seed = 0; seed < 20; seed++) {
      const test = createComparisonTest(49, 'integer');
      const keys = test.items.map(item => `${item.firstNumber}|${item.secondNumber}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(test.items.length);
    }
  });

  test('createAdditionTest en mode decimal doit avoir des items uniques globalement', () => {
    for (let seed = 0; seed < 20; seed++) {
      const test = createAdditionTest(28, 'decimal');
      const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}|${item.type}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(test.items.length);
    }
  });

  test('createSubtractionTest en mode decimal doit avoir des items uniques globalement', () => {
    for (let seed = 0; seed < 20; seed++) {
      const test = createSubtractionTest(28, 'decimal');
      const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}|${item.type}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(test.items.length);
    }
  });

  test('createMultiplicationTest en mode decimal doit avoir des items uniques globalement', () => {
    for (let seed = 0; seed < 20; seed++) {
      const test = createMultiplicationTest(20, 'decimal');
      const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}|${item.type}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(test.items.length);
    }
  });

    test('createAdditionTest en mode integer doit avoir des items uniques globalement', () => {
      for (let seed = 0; seed < 20; seed++) {
        const test = createAdditionTest(28, 'integer');
        const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}`);
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(test.items.length);
      }
    });

    test('createSubtractionTest en mode integer doit avoir des items uniques globalement', () => {
      for (let seed = 0; seed < 20; seed++) {
        const test = createSubtractionTest(28, 'integer');
        const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}`);
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(test.items.length);
      }
    });

    test('createMultiplicationTest en mode integer doit avoir des items uniques globalement', () => {
      for (let seed = 0; seed < 20; seed++) {
        const test = createMultiplicationTest(20, 'integer');
        const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}`);
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(test.items.length);
      }
    });
  });