import { describe, it, expect } from 'vitest';
import { TEST_TYPE_IDS, TEST_TYPE_LABELS, getTestTypeLabel } from '../../src/types/test';

describe('test types — source unique', () => {
  it('expose les 4 ids EN', () => {
    expect([...TEST_TYPE_IDS]).toEqual(['addition', 'subtraction', 'multiplication', 'comparison']);
  });

  it('mappe chaque id vers son label FR', () => {
    expect(TEST_TYPE_LABELS).toEqual({
      addition: 'addition',
      subtraction: 'soustraction',
      multiplication: 'multiplication',
      comparison: 'comparaison'
    });
  });

  it('getTestTypeLabel retourne le label FR', () => {
    expect(getTestTypeLabel('subtraction')).toBe('soustraction');
    expect(getTestTypeLabel('comparison')).toBe('comparaison');
  });

  it('getTestTypeLabel fallback sur l’id inconnu', () => {
    expect(getTestTypeLabel('unknown')).toBe('unknown');
  });
});
