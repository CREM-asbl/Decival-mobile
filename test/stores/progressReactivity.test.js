import { beforeEach, describe, expect, it } from 'vitest';
import { addStudent, resetStudentStore, setActiveStudent } from '../../src/stores/studentStore';
import { stats, testHistory } from '../../src/stores/testStore';
import { unlockedBadges } from '../../src/stores/badgeStore';
import { typeMastery, updateTypeMastery } from '../../src/stores/typeMasteryStore';

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
});

describe('réactivité progression au changement d\'élève', () => {
  it('recharge stats, badges, maîtrise et historique pour le nouvel élève actif', () => {
    const pierre = addStudent('Pierre');
    stats.set({ totalTests: 2, averageScore: 70, bestScore: 90, xp: 20, level: 1, dailyStreak: 1 });
    unlockedBadges.set(['FIRST_TEST']);
    updateTypeMastery('addition', 1, true, 80);
    testHistory.set([{ id: 't1', items: [] }]);

    addStudent('Paul');
    expect(stats.get().totalTests).toBe(0);
    expect(unlockedBadges.get()).toHaveLength(0);
    expect(Object.keys(typeMastery.get().mastery)).toHaveLength(0);
    expect(testHistory.get()).toHaveLength(0);

    setActiveStudent(pierre.id);
    expect(stats.get().totalTests).toBe(2);
    expect(unlockedBadges.get()).toEqual(['FIRST_TEST']);
    expect(typeMastery.get().mastery['addition-decimal-1']).toBeDefined();
    expect(testHistory.get()).toHaveLength(1);
  });
});