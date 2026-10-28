export interface InProgressTestState {
  studentId?: string | null;
  testType: string;
  mode: 'integer' | 'decimal';
  test: any;
  currentIndex: number;
  index?: number;
  questionIndex?: number;
  savedAt?: number;
}

type Normalized = {
  studentId: string | null;
  testType: string;
  mode: 'integer' | 'decimal';
  test: any;
  currentIndex: number;
};

function isValidMode(mode: unknown): mode is 'integer' | 'decimal' {
  return mode === 'integer' || mode === 'decimal';
}

function normalizeSaveArgs(args: any[]): Normalized | null {
  if (args.length === 1 && args[0] && typeof args[0] === 'object') {
    const o = args[0];
    const testType = o.testType ?? o.type ?? o.operation ?? o.testTypeId;
    const mode = o.mode;
    if (typeof testType !== 'string' || !isValidMode(mode)) return null;
    return {
      studentId: o.studentId ?? o.student ?? o.student_id ?? null,
      testType,
      mode,
      test: o.test ?? o.data ?? o.value ?? o.payload ?? null,
      currentIndex: Number.isFinite(o.currentIndex)
        ? o.currentIndex
        : Number.isFinite(o.index)
        ? o.index
        : Number.isFinite(o.questionIndex)
        ? o.questionIndex
        : 0
    };
  }

  if (args.length >= 4 && typeof args[1] === 'string' && isValidMode(args[2])) {
    return {
      studentId: args[0] ?? null,
      testType: args[1],
      mode: args[2],
      test: args[3],
      currentIndex: Number.isFinite(args[4]) ? args[4] : 0
    };
  }

  if (args.length >= 3 && typeof args[0] === 'string' && isValidMode(args[1])) {
    return {
      studentId: null,
      testType: args[0],
      mode: args[1],
      test: args[2],
      currentIndex: Number.isFinite(args[3]) ? args[3] : 0
    };
  }

  if (args.length === 2 && typeof args[1] === 'object' && args[1] !== null) {
    const o = args[1];
    const testType = o.testType ?? o.type ?? o.operation ?? o.testTypeId;
    const mode = o.mode;
    if (typeof testType !== 'string' || !isValidMode(mode)) return null;
    return {
      studentId: args[0] ?? null,
      testType,
      mode,
      test: o.test ?? o.data ?? o.value ?? o.payload ?? null,
      currentIndex: Number.isFinite(o.currentIndex)
        ? o.currentIndex
        : Number.isFinite(o.index)
        ? o.index
        : Number.isFinite(o.questionIndex)
        ? o.questionIndex
        : 0
    };
  }

  return null;
}

function normalizeKeyArgs(args: any[]): { studentId: string | null; testType: string; mode: 'integer' | 'decimal' } | null {
  if (args.length === 1 && args[0] && typeof args[0] === 'object') {
    const o = args[0];
    const testType = o.testType ?? o.type ?? o.operation ?? o.testTypeId;
    const mode = o.mode;
    if (typeof testType !== 'string' || !isValidMode(mode)) return null;
    return { studentId: o.studentId ?? o.student ?? o.student_id ?? null, testType, mode };
  }

  if (args.length >= 3 && typeof args[1] === 'string' && isValidMode(args[2])) {
    return { studentId: args[0] ?? null, testType: args[1], mode: args[2] };
  }

  if (args.length >= 2 && typeof args[0] === 'string' && isValidMode(args[1])) {
    return { studentId: null, testType: args[0], mode: args[1] };
  }

  if (args.length === 2 && typeof args[1] === 'object' && args[1] !== null) {
    const o = args[1];
    const testType = o.testType ?? o.type ?? o.operation ?? o.testTypeId;
    const mode = o.mode;
    if (typeof testType !== 'string' || !isValidMode(mode)) return null;
    return { studentId: args[0] ?? null, testType, mode };
  }

  return null;
}

export function inProgressTestKey(...args: any[]): string {
  const n = normalizeKeyArgs(args);
  const sid = n?.studentId ?? 'global';
  const type = n?.testType ?? 'unknown';
  const mode = n?.mode ?? 'integer';
  return `decival_in_progress_test_${sid}_${type}_${mode}`;
}

function storageKey(...args: any[]): string {
  return inProgressTestKey(...args);
}

export function saveInProgressTest(...args: any[]): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  const normalized = normalizeSaveArgs(args);
  if (!normalized) return false;
  try {
    const payload: InProgressTestState = {
      studentId: normalized.studentId,
      testType: normalized.testType,
      mode: normalized.mode,
      test: normalized.test,
      currentIndex: normalized.currentIndex,
      index: normalized.currentIndex,
      questionIndex: normalized.currentIndex,
      savedAt: Date.now()
    };
    window.localStorage.setItem(storageKey(normalized.studentId, normalized.testType, normalized.mode), JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadInProgressTest(...args: any[]): InProgressTestState | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const keyArgs = normalizeKeyArgs(args);
  if (!keyArgs) return null;
  try {
    const raw = window.localStorage.getItem(storageKey(keyArgs.studentId, keyArgs.testType, keyArgs.mode));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.testType !== keyArgs.testType || parsed.mode !== keyArgs.mode) return null;
    const currentIndex = Number.isFinite(parsed.currentIndex)
      ? parsed.currentIndex
      : Number.isFinite(parsed.index)
      ? parsed.index
      : Number.isFinite(parsed.questionIndex)
      ? parsed.questionIndex
      : 0;
    return {
      studentId: parsed.studentId ?? keyArgs.studentId,
      testType: parsed.testType,
      mode: parsed.mode,
      test: parsed.test ?? parsed.data ?? parsed.value ?? null,
      currentIndex,
      index: currentIndex,
      questionIndex: currentIndex,
      savedAt: parsed.savedAt
    };
  } catch {
    return null;
  }
}

export function clearInProgressTest(...args: any[]): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  const keyArgs = normalizeKeyArgs(args);
  if (!keyArgs) return false;
  try {
    window.localStorage.removeItem(storageKey(keyArgs.studentId, keyArgs.testType, keyArgs.mode));
    return true;
  } catch {
    return false;
  }
}

export function hasInProgressTest(...args: any[]): boolean {
  return loadInProgressTest(...args) !== null;
}

export const saveInProgress = saveInProgressTest;
export const saveTestProgress = saveInProgressTest;
export const saveCurrentTest = saveInProgressTest;
export const persistInProgressTest = saveInProgressTest;
export const persistCurrentTest = saveInProgressTest;

export const loadInProgress = loadInProgressTest;
export const loadTestProgress = loadInProgressTest;
export const loadCurrentTest = loadInProgressTest;
export const getInProgressTest = loadInProgressTest;
export const getSavedTest = loadInProgressTest;
export const restoreInProgressTest = loadInProgressTest;
export const resumeInProgressTest = loadInProgressTest;

export const clearInProgress = clearInProgressTest;
export const clearTestProgress = clearInProgressTest;
export const clearCurrentTest = clearInProgressTest;
export const discardInProgressTest = clearInProgressTest;
export const removeInProgressTest = clearInProgressTest;

export const hasSavedTest = hasInProgressTest;
export const hasResumableTest = hasInProgressTest;
export const isInProgressTestSaved = hasInProgressTest;
