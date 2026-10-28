import { beforeEach, describe, expect, it } from 'vitest';
import {
  TRASH_RETENTION_DAYS,
  addStudent,
  getActiveStudent,
  getStudents,
  getTrashedStudents,
  purgeExpiredTrash,
  resetStudentStore,
  restoreStudent,
  trashStudent,
} from '../../src/stores/studentStore';

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

describe('studentTrash — corbeille 30j', () => {
  it('rétention de 30 jours', () => {
    expect(TRASH_RETENTION_DAYS).toBe(30);
  });

  it('trashStudent déplace vers corbeille et réactive un autre', () => {
    const pierre = addStudent('Pierre');
    const paul = addStudent('Paul');
    expect(getActiveStudent()?.id).toBe(paul.id);
    const trashed = trashStudent(paul.id);
    expect(trashed.id).toBe(paul.id);
    expect(getStudents()).toHaveLength(1);
    expect(getTrashedStudents()).toHaveLength(1);
    expect(getActiveStudent()?.id).toBe(pierre.id);
  });

  it('restoreStudent restaure le profil dans le délai', () => {
    const s = addStudent('Pierre');
    trashStudent(s.id);
    expect(getStudents()).toHaveLength(0);
    const restored = restoreStudent(s.id);
    expect(restored.name).toBe('Pierre');
    expect(getStudents()).toHaveLength(1);
    expect(getTrashedStudents()).toHaveLength(0);
  });

  it('restore rejette un doublon de prénom', () => {
    const s = addStudent('Pierre');
    trashStudent(s.id);
    addStudent('pierre');
    expect(() => restoreStudent(s.id)).toThrow('Prénom déjà utilisé');
  });

  it('purgeExpiredTrash purge après 30j et garde les récents', () => {
    const vieux = addStudent('Vieux');
    trashStudent(vieux.id, new Date(Date.now() - 31 * 86400000).toISOString());
    const recent = addStudent('Recent');
    trashStudent(recent.id);
    const purged = purgeExpiredTrash();
    expect(purged).toContain(vieux.id);
    expect(purged).not.toContain(recent.id);
    expect(getTrashedStudents().map((t) => t.id)).toEqual([recent.id]);
  });
});
