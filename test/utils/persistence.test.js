import { beforeEach, describe, expect, test } from 'vitest';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../src/utils/persistence';

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

describe('Persistence Utils', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('devrait sauvegarder les données avec un timestamp', () => {
    const testData = { test: 'data' };
    saveToStorage(STORAGE_KEYS.RULE_PROGRESS, testData);

    const stored = localStorage.getItem(STORAGE_KEYS.RULE_PROGRESS);
    const parsed = JSON.parse(stored);

    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('data');
    expect(parsed.data).toEqual(testData);
  });

  test('devrait charger les données sauvegardées', () => {
    const testData = { test: 'data' };
    saveToStorage(STORAGE_KEYS.RULE_PROGRESS, testData);

    const loaded = loadFromStorage(STORAGE_KEYS.RULE_PROGRESS);
    expect(loaded).toEqual(testData);
  });

  test('devrait retourner null pour une clé inexistante', () => {
    const loaded = loadFromStorage('inexistant');
    expect(loaded).toBeNull();
  });

  test('devrait gérer les erreurs de parsing', () => {
    localStorage.setItem(STORAGE_KEYS.RULE_PROGRESS, 'invalid json');
    const loaded = loadFromStorage(STORAGE_KEYS.RULE_PROGRESS);
    expect(loaded).toBeNull();
  });

  test('devrait sauvegarder et charger différents types de données', () => {
    const testCases = [
      { key: 'test-number', value: 42 },
      { key: 'test-string', value: 'hello' },
      { key: 'test-array', value: [1, 2, 3] },
      { key: 'test-object', value: { a: 1, b: '2' } },
      { key: 'test-null', value: null }
    ];

    testCases.forEach(({ key, value }) => {
      saveToStorage(key, value);
      const loaded = loadFromStorage(key);
      expect(loaded).toEqual(value);
    });
  });
});