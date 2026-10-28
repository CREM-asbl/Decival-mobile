import { beforeEach, describe, expect, it } from 'vitest';
import {
  saveInProgressTest,
  loadInProgressTest,
  clearInProgressTest,
  hasInProgressTest,
} from '../../src/utils/inProgressTest';

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

describe('inProgressTest', () => {
  it('sauvegarde et recharge un test en cours', () => {
    const test = { id: 't1', items: [{ isCorrect: true }] };
    expect(saveInProgressTest('pierre', 'addition', 'integer', test, 2)).toBe(true);
    const loaded = loadInProgressTest('pierre', 'addition', 'integer');
    expect(loaded).not.toBeNull();
    expect(loaded.test).toEqual(test);
    expect(loaded.currentIndex).toBe(2);
    expect(hasInProgressTest('pierre', 'addition', 'integer')).toBe(true);
  });

  it('accepte un objet de configuration', () => {
    const test = { id: 't2', items: [] };
    saveInProgressTest({ studentId: 'paul', testType: 'comparison', mode: 'decimal', test, currentIndex: 1 });
    const loaded = loadInProgressTest({ studentId: 'paul', testType: 'comparison', mode: 'decimal' });
    expect(loaded.test.id).toBe('t2');
    expect(loaded.index).toBe(1);
  });

  it('ne recharge pas un mode différent', () => {
    saveInProgressTest('pierre', 'addition', 'integer', { id: 't3' }, 0);
    expect(loadInProgressTest('pierre', 'addition', 'decimal')).toBeNull();
  });

  it('efface un test en cours', () => {
    saveInProgressTest('pierre', 'addition', 'integer', { id: 't4' }, 0);
    expect(clearInProgressTest('pierre', 'addition', 'integer')).toBe(true);
    expect(loadInProgressTest('pierre', 'addition', 'integer')).toBeNull();
    expect(hasInProgressTest('pierre', 'addition', 'integer')).toBe(false);
  });
});
