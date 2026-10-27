import { beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEYS,
  clearStorage,
  scopedKey,
  saveToStorage,
} from '../../src/utils/persistence';

const STUDENT_LIST_KEY = 'decival_students';
const SCOPED_BASES = [
  STORAGE_KEYS.TEST_HISTORY,
  STORAGE_KEYS.TEST_STATS,
  STORAGE_KEYS.TYPE_MASTERY,
  STORAGE_KEYS.UNLOCKED_BADGES,
];

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
});

describe('clearStorage — purge tous les namespaces élèves', () => {
  it('efface les namespaces de 2 élèves + legacy', () => {
    saveToStorage(STUDENT_LIST_KEY, {
      students: [
        { id: 'a', name: 'Pierre' },
        { id: 'b', name: 'Paul' },
      ],
      activeStudentId: 'a',
    });
    for (const id of ['a', 'b']) {
      for (const base of SCOPED_BASES) localStorageMock.setItem(scopedKey(base, id), 'x');
    }
    localStorageMock.setItem(STORAGE_KEYS.TEST_HISTORY, 'legacy');

    clearStorage();

    for (const id of ['a', 'b']) {
      for (const base of SCOPED_BASES) {
        expect(localStorageMock.getItem(scopedKey(base, id))).toBeNull();
      }
    }
    expect(localStorageMock.getItem(STORAGE_KEYS.TEST_HISTORY)).toBeNull();
  });

  it('sans profils, efface legacy sans erreur', () => {
    localStorageMock.setItem(STORAGE_KEYS.TEST_STATS, 'legacy');
    expect(() => clearStorage()).not.toThrow();
    expect(localStorageMock.getItem(STORAGE_KEYS.TEST_STATS)).toBeNull();
  });
});
