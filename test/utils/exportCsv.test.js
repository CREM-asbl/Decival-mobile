import { describe, expect, it } from 'vitest';
import { buildResultsCsv } from '../../src/utils/exportCsv';

describe('exportCsv — buildResultsCsv', () => {
  it('traduit type et mode en labels FR', () => {
    const csv = buildResultsCsv(
      { totalTests: 1, averageScore: 75, bestScore: 100 },
      [
        {
          startTime: new Date('2026-10-01T10:00:00').getTime(),
          type: 'addition',
          mode: 'integer',
          items: [{ isCorrect: true }, { isCorrect: false }]
        }
      ]
    );
    expect(csv).toContain('addition');
    expect(csv).toContain('Nombres entiers');
    expect(csv).not.toContain(',integer,');
  });

  it('traduit le mode décimal', () => {
    const csv = buildResultsCsv(
      { totalTests: 1, averageScore: 50, bestScore: 50 },
      [
        {
          startTime: Date.now(),
          type: 'comparison',
          mode: 'decimal',
          items: [{ isCorrect: true }, { isCorrect: true }]
        }
      ]
    );
    expect(csv).toContain('comparaison');
    expect(csv).toContain('Nombres décimaux');
  });

  it('gère un historique vide', () => {
    const csv = buildResultsCsv({ totalTests: 0, averageScore: 0, bestScore: 0 }, []);
    expect(csv).toContain('Statistiques globales');
    expect(csv).toContain('Historique des tests');
  });
});
