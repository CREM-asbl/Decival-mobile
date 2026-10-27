import { beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEYS,
  hasLegacyData,
  migrateLegacyToStudent,
  discardLegacyData,
  scopedKey,
} from '../../src/utils/persistence';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

describe('migration choice — détection legacy', () => {
  it('absent si aucune des 4 clés présente', () => {
    expect(hasLegacyData()).toBe(false);
  });

  it('présent si au moins une clé legacy existe', () => {
    localStorageMock.setItem(STORAGE_KEYS.TEST_STATS, 'x');
    expect(hasLegacyData()).toBe(true);
  });
});

describe('migration choice — récupérer', () => {
  it('copie vers namespace élève et purge legacy', () => {
    localStorageMock.setItem(STORAGE_KEYS.TEST_HISTORY, 'legacy-hist');
    localStorageMock.setItem(STORAGE_KEYS.TEST_STATS, 'legacy-stats');
    migrateLegacyToStudent('abc');
    expect(localStorageMock.getItem(scopedKey(STORAGE_KEYS.TEST_HISTORY, 'abc'))).toBe('legacy-hist');
    expect(localStorageMock.getItem(scopedKey(STORAGE_KEYS.TEST_STATS, 'abc'))).toBe('legacy-stats');
    expect(localStorageMock.getItem(STORAGE_KEYS.TEST_HISTORY)).toBeNull();
    expect(localStorageMock.getItem(STORAGE_KEYS.TEST_STATS)).toBeNull();
  });
});

describe('migration choice — recommencer à zéro', () => {
  it('purge legacy sans copier', () => {
    localStorageMock.setItem(STORAGE_KEYS.TEST_HISTORY, 'legacy-hist');
    localStorageMock.setItem(STORAGE_KEYS.TEST_STATS, 'legacy-stats');
    discardLegacyData();
    expect(localStorageMock.getItem(STORAGE_KEYS.TEST_HISTORY)).toBeNull();
    expect(localStorageMock.getItem(STORAGE_KEYS.TEST_STATS)).toBeNull();
    expect(localStorageMock.getItem(scopedKey(STORAGE_KEYS.TEST_HISTORY, 'abc'))).toBeNull();
  });
});