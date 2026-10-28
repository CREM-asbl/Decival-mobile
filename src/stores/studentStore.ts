import { atom } from 'nanostores';
import { loadFromStorage, saveToStorage } from '../utils/persistence';

export const STUDENTS_KEY = 'decival_students';
export const MAX_NAME_LENGTH = 20;

export interface Student {
  id: string;
  name: string;
  createdAt: string;
}

export interface TrashedStudent extends Student {
  trashedAt: string;
}

export const TRASH_RETENTION_DAYS = 30;
const TRASH_RETENTION_MS = TRASH_RETENTION_DAYS * 86400000;

interface StudentState {
  students: Student[];
  activeStudentId: string | null;
  trash: TrashedStudent[];
}

export const studentState = atom<StudentState>({ students: [], activeStudentId: null, trash: [] });

function persist(state: StudentState): void {
  if (typeof window === 'undefined') return;
  saveToStorage(STUDENTS_KEY, state);
}

function loadPersisted(): StudentState | null {
  if (typeof window === 'undefined') return null;
  return loadFromStorage<StudentState>(STUDENTS_KEY);
}

const persisted = loadPersisted();
if (persisted) studentState.set({ students: persisted.students ?? [], activeStudentId: persisted.activeStudentId ?? null, trash: persisted.trash ?? [] });

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
  const { students, trash } = studentState.get();
  const student: Student = { id: makeId(), name: clean, createdAt: new Date().toISOString() };
  studentState.set({ students: [...students, student], activeStudentId: student.id, trash });
  return student;
}

export function setActiveStudent(id: string): void {
  const { students, trash } = studentState.get();
  if (!students.some((s) => s.id === id)) throw new Error('Élève inconnu');
  studentState.set({ students, activeStudentId: id, trash });
}

export function renameStudent(id: string, name: string): void {
  const { students, activeStudentId, trash } = studentState.get();
  const clean = normalizeName(name);
  if (!clean) throw new Error('Prénom vide');
  assertUnique(students, clean, id);
  studentState.set({
    students: students.map((s) => (s.id === id ? { ...s, name: clean } : s)),
    activeStudentId,
    trash,
  });
}

export function removeStudent(id: string): void {
  const { students, activeStudentId, trash } = studentState.get();
  const remaining = students.filter((s) => s.id !== id);
  studentState.set({
    students: remaining,
    activeStudentId: activeStudentId === id ? (remaining[0]?.id ?? null) : activeStudentId,
    trash,
  });
}

export function getTrashedStudents(): TrashedStudent[] {
  return studentState.get().trash;
}

export function trashStudent(id: string, trashedAt?: string): TrashedStudent {
  const { students, activeStudentId, trash } = studentState.get();
  const student = students.find((s) => s.id === id);
  if (!student) throw new Error('Élève inconnu');
  const trashed: TrashedStudent = { ...student, trashedAt: trashedAt ?? new Date().toISOString() };
  const remaining = students.filter((s) => s.id !== id);
  studentState.set({
    students: remaining,
    activeStudentId: activeStudentId === id ? (remaining[0]?.id ?? null) : activeStudentId,
    trash: [...trash.filter((t) => t.id !== id), trashed],
  });
  return trashed;
}

export function restoreStudent(id: string): Student {
  const { students, activeStudentId, trash } = studentState.get();
  const trashed = trash.find((t) => t.id === id);
  if (!trashed) throw new Error('Élève inconnu');
  assertUnique(students, trashed.name);
  const restored: Student = { id: trashed.id, name: trashed.name, createdAt: trashed.createdAt };
  studentState.set({
    students: [...students, restored],
    activeStudentId: activeStudentId ?? restored.id,
    trash: trash.filter((t) => t.id !== id),
  });
  return restored;
}

export function purgeExpiredTrash(now: number = Date.now()): string[] {
  const { students, activeStudentId, trash } = studentState.get();
  const expired = trash.filter((t) => now - new Date(t.trashedAt).getTime() > TRASH_RETENTION_MS);
  if (expired.length === 0) return [];
  studentState.set({
    students,
    activeStudentId,
    trash: trash.filter((t) => !expired.some((e) => e.id === t.id)),
  });
  return expired.map((e) => e.id);
}

export function resetStudentStore(): void {
  studentState.set({ students: [], activeStudentId: null, trash: [] });
}
