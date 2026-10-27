import { TEST_TYPE_IDS, type TestTypeId } from '../types/test';

export type TestMode = 'integer' | 'decimal';

export function isValidTestMode(mode: unknown): mode is TestMode {
  return mode === 'integer' || mode === 'decimal';
}

export function parseTestMode(search: string): TestMode | null {
  const params = new URLSearchParams(search);
  const mode = params.get('mode');
  return isValidTestMode(mode) ? mode : null;
}

export function isValidTestTypeId(op: unknown): op is TestTypeId {
  return (TEST_TYPE_IDS as readonly string[]).includes(op as string);
}

export function buildModeUrl(op: string): string {
  return `/tests/mode?op=${op}`;
}

export function buildTestUrl(op: string, mode: TestMode): string {
  return `/tests/${op}?mode=${mode}`;
}
