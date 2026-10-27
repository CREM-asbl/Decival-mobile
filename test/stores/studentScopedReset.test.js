import { beforeEach, describe, expect, it } from 'vitest';
import {
  addStudent,
  resetStudentStore,
  setActiveStudent,
} from '../../src/stores/studentStore';
import { stats, testHistory, resetTestData } from '../../src/stores/testStore';
import { typeMastery, updateTypeMastery, resetTypeMastery } from '../../src/stores/typeMasteryStore';
import { STORAGE_KEYS, scopedKey } from '../../src/utils/persistence';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value);
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
});

describe('reset scopé par élève', () => {
  it('resetTestData/resetTypeMastery exigent un studentId explicite', () => {
    expect(resetTestData.length).toBe(1);
    expect(resetTypeMastery.length).toBe(1);
  });

  it('reset avec id actif vide le scope actif, autre namespace intact', () => {
    const pierre = addStudent('Pierre');
    stats.set({ totalTests: 3, averageScore: 80, bestScore: 100, xp: 50, level: 2, dailyStreak: 1 });
    updateTypeMastery('addition', 1, true, 90);
    testHistory.set([{ id: 't1', items: [] }]);

    const paul = addStudent('Paul');
    stats.set({ totalTests: 1, averageScore: 60, bestScore: 60, xp: 10, level: 1, dailyStreak: 1 });

    setActiveStudent(pierre.id);
    expect(stats.get().totalTests).toBe(3);

    resetTestData(pierre.id);
    resetTypeMastery(pierre.id);

    expect(stats.get().totalTests).toBe(0);
    expect(testHistory.get()).toHaveLength(0);
    expect(Object.keys(typeMastery.get().mastery)).toHaveLength(0);

    const paulStats = JSON.parse(localStorageMock.getItem(scopedKey(STORAGE_KEYS.TEST_STATS, paul.id)));
    expect(paulStats.data.totalTests).toBe(1);
  });
});
