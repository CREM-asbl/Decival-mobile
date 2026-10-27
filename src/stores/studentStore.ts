import { atom } from 'nanostores';
import { loadFromStorage, saveToStorage } from '../utils/persistence';

export const STUDENTS_KEY = 'decival_students';
export const MAX_NAME_LENGTH = 20;

export interface Student {
  id: string;
  name: string;
  createdAt: string;
}

interface StudentState {
  students: Student[];
  activeStudentId: string | null;
}

export const studentState = atom<StudentState>({ students: [], activeStudentId: null });

function persist(state: StudentState): void {
  if (typeof window === 'undefined') return;
  saveToStorage(STUDENTS_KEY, state);
}

function loadPersisted(): StudentState | null {
  if (typeof window === 'undefined') return null;
  return loadFromStorage<StudentState>(STUDENTS_KEY);
}

const persisted = loadPersisted();
if (persisted) studentState.set({ students: persisted.students ?? [], activeStudentId: persisted.activeStudentId ?? null });

studentState.subscribe((state) => persist(state));

function normalizeName(name: string): string {
  return name.trim().slice(0, MAX_NAME_LENGTH);
}

function assertUnique(students: Student[], name: string, excludeId?: string): void {
  const clash = students.some((s) => s.id !== excludeId && s.name.toLowerCase() === name.toLowerCase());
  if (clash) throw new Error('Prénom déjà utilisé');
}

function makeId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `s-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
  }
}

export function getStudents(): Student[] {
  return studentState.get().students;
}

export function getActiveStudent(): Student | null {
  const { students, activeStudentId } = studentState.get();
  return students.find((s) => s.id === activeStudentId) ?? null;
}

export function validateStudentName(name: string, students: Student[] = studentState.get().students): string {
  const clean = normalizeName(name);
  if (!clean) throw new Error('Prénom vide');
  assertUnique(students, clean);
  return clean;
}

export function addStudent(name: string): Student {
  const clean = validateStudentName(name);
  const { students } = studentState.get();
  const student: Student = { id: makeId(), name: clean, createdAt: new Date().toISOString() };
  studentState.set({ students: [...students, student], activeStudentId: student.id });
  return student;
}

export function setActiveStudent(id: string): void {
  const { students } = studentState.get();
  if (!students.some((s) => s.id === id)) throw new Error('Élève inconnu');
  studentState.set({ students, activeStudentId: id });
}

export function renameStudent(id: string, name: string): void {
  const { students, activeStudentId } = studentState.get();
  const clean = normalizeName(name);
  if (!clean) throw new Error('Prénom vide');
  assertUnique(students, clean, id);
  studentState.set({
    students: students.map((s) => (s.id === id ? { ...s, name: clean } : s)),
    activeStudentId,
  });
}

export function removeStudent(id: string): void {
  const { students, activeStudentId } = studentState.get();
  const remaining = students.filter((s) => s.id !== id);
  studentState.set({
    students: remaining,
    activeStudentId: activeStudentId === id ? (remaining[0]?.id ?? null) : activeStudentId,
  });
}

export function resetStudentStore(): void {
  studentState.set({ students: [], activeStudentId: null });
}
