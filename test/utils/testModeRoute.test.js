import { describe, expect, it } from 'vitest';
import {
  buildModeUrl,
  buildTestUrl,
  isValidTestMode,
  parseTestMode,
} from '../../src/utils/testModeRoute';

describe('testModeRoute', () => {
  it('valide integer/decimal uniquement', () => {
    expect(isValidTestMode('integer')).toBe(true);
    expect(isValidTestMode('decimal')).toBe(true);
    expect(isValidTestMode('')).toBe(false);
    expect(isValidTestMode('foo')).toBe(false);
    expect(isValidTestMode(null)).toBe(false);
  });

  it('parse le mode depuis query string', () => {
    expect(parseTestMode('?mode=integer')).toBe('integer');
    expect(parseTestMode('?mode=decimal')).toBe('decimal');
    expect(parseTestMode('?mode=foo')).toBeNull();
    expect(parseTestMode('')).toBeNull();
  });

  it('construit les URLs du parcours', () => {
    expect(buildModeUrl('addition')).toBe('/tests/mode?op=addition');
    expect(buildTestUrl('addition', 'integer')).toBe('/tests/addition?mode=integer');
    expect(buildTestUrl('addition', 'decimal')).toBe('/tests/addition?mode=decimal');
  });
});
