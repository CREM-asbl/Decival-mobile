import { beforeEach, describe, expect, it } from 'vitest';
import { addStudent, resetStudentStore } from '../../src/stores/studentStore';
import { completeTest } from '../../src/stores/testStore';
import { STORAGE_KEYS, discardLegacyData } from '../../src/utils/persistence';

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
  resetStudentStore();
  discardLegacyData();
});

describe('migration legacy différée — après 1er test', () => {
  it('propose la reprise si des données legacy existent', () => {
    addStudent('Pierre');
    localStorageMock.setItem(STORAGE_KEYS.TEST_HISTORY, 'legacy-hist');
    const test = { id: 't1', type: 'addition', mode: 'integer', items: [{ isCorrect: true }], status: 'in_progress' };
    const result = completeTest(test);
    expect(result.legacyMigrationAvailable).toBe(true);
  });

  it('ne propose rien sans données legacy', () => {
    addStudent('Pierre');
    const test = { id: 't2', type: 'addition', mode: 'integer', items: [{ isCorrect: true }], status: 'in_progress' };
    const result = completeTest(test);
    expect(result.legacyMigrationAvailable).toBe(false);
  });
});
