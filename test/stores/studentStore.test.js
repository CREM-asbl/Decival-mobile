import { beforeEach, describe, expect, it } from 'vitest';
import {
  addStudent,
  getActiveStudent,
  getStudents,
  removeStudent,
  renameStudent,
  resetStudentStore,
  setActiveStudent,
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

describe('studentStore — ajout', () => {
  it('crée un élève avec prénom nettoyé et l’active', () => {
    const student = addStudent('  Pierre ');
    expect(student.name).toBe('Pierre');
    expect(student.id).toBeTruthy();
    expect(getActiveStudent()?.id).toBe(student.id);
    expect(getStudents()).toHaveLength(1);
  });

  it('rejette prénom vide', () => {
    expect(() => addStudent('   ')).toThrow();
    expect(getStudents()).toHaveLength(0);
  });

  it('rejette doublon insensible à la casse', () => {
    addStudent('Pierre');
    expect(() => addStudent('pierre')).toThrow();
  });

  it('tronque prénom trop long', () => {
    const student = addStudent('A'.repeat(50));
    expect(student.name.length).toBeLessThanOrEqual(20);
  });
});

describe('studentStore — sélection', () => {
  it('change élève actif', () => {
    const pierre = addStudent('Pierre');
    const paul = addStudent('Paul');
    setActiveStudent(pierre.id);
    expect(getActiveStudent()?.id).toBe(pierre.id);
    setActiveStudent(paul.id);
    expect(getActiveStudent()?.id).toBe(paul.id);
  });

  it('rejette id inconnu', () => {
    addStudent('Pierre');
    expect(() => setActiveStudent('nope')).toThrow();
  });
});

describe('studentStore — gestion', () => {
  it('renomme élève', () => {
    const s = addStudent('Pierre');
    renameStudent(s.id, 'Pierrot');
    expect(getActiveStudent()?.name).toBe('Pierrot');
  });

  it('rejette renommage vers doublon', () => {
    const s = addStudent('Pierre');
    addStudent('Paul');
    expect(() => renameStudent(s.id, 'paul')).toThrow();
  });

  it('supprime élève et réactive un autre', () => {
    const pierre = addStudent('Pierre');
    const paul = addStudent('Paul');
    setActiveStudent(pierre.id);
    removeStudent(pierre.id);
    expect(getStudents()).toHaveLength(1);
    expect(getActiveStudent()?.id).toBe(paul.id);
  });

  it('supprime dernier élève → aucun actif', () => {
    const s = addStudent('Pierre');
    removeStudent(s.id);
    expect(getStudents()).toHaveLength(0);
    expect(getActiveStudent()).toBeNull();
  });
});

describe('studentStore — persistance', () => {
  it('persiste liste et actif en localStorage', () => {
    const s = addStudent('Pierre');
    addStudent('Paul');
    setActiveStudent(s.id);
    const raw = JSON.parse(localStorageMock.getItem('decival_students'));
    expect(raw.data.students).toHaveLength(2);
    expect(raw.data.activeStudentId).toBe(s.id);
  });
});
