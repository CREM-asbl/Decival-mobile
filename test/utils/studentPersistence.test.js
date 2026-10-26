import { beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEYS,
  clearStudentData,
  migrateLegacyToStudent,
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

describe('persistence — scopedKey', () => {
  it('préfixe les clés par élève', () => {
    expect(scopedKey(STORAGE_KEYS.TEST_HISTORY, 'abc')).toBe('decival_student_abc_test_history');
    expect(scopedKey(STORAGE_KEYS.TEST_STATS, 'abc')).toBe('decival_student_abc_testStats');
    expect(scopedKey(STORAGE_KEYS.TYPE_MASTERY, 'abc')).toBe('decival_student_abc_type_mastery');
    expect(scopedKey(STORAGE_KEYS.UNLOCKED_BADGES, 'abc')).toBe('decival_student_abc_unlocked_badges');
  });

  it('garde clé globale sans élève', () => {
    expect(scopedKey(STORAGE_KEYS.TEST_HISTORY, null)).toBe(STORAGE_KEYS.TEST_HISTORY);
  });
});

describe('persistence — migrateLegacyToStudent', () => {
  it('déplace données globales vers namespace élève', () => {
    localStorageMock.setItem(STORAGE_KEYS.TEST_HISTORY, '{"timestamp":1,"data":[]}');
    migrateLegacyToStudent('abc');
    expect(localStorageMock.getItem('decival_student_abc_test_history')).toBe('{"timestamp":1,"data":[]}');
    expect(localStorageMock.getItem(STORAGE_KEYS.TEST_HISTORY)).toBeNull();
  });

  it('n’écrase pas données élève existantes', () => {
    localStorageMock.setItem(STORAGE_KEYS.TEST_HISTORY, 'legacy');
    localStorageMock.setItem('decival_student_abc_test_history', 'mine');
    migrateLegacyToStudent('abc');
    expect(localStorageMock.getItem('decival_student_abc_test_history')).toBe('mine');
  });
});

describe('persistence — clearStudentData', () => {
  it('efface seulement namespace élève', () => {
    localStorageMock.setItem('decival_student_abc_test_history', 'x');
    localStorageMock.setItem('decival_student_def_test_history', 'y');
    clearStudentData('abc');
    expect(localStorageMock.getItem('decival_student_abc_test_history')).toBeNull();
    expect(localStorageMock.getItem('decival_student_def_test_history')).toBe('y');
  });
});
