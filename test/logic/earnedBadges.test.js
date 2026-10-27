import { describe, expect, it } from 'vitest';
import { getEarnedBadges } from '../../src/logic/progressLogic';
import { unlockedBadges } from '../../src/stores/badgeStore';

describe('getEarnedBadges — pureté (aucune écriture store)', () => {
  it('déterministe et sans effet sur unlockedBadges', () => {
    unlockedBadges.set(['FIRST_TEST']);
    const ctx = {
      level: 6,
      xpIntoLevel: 0,
      xpForNextLevel: 100,
      masteredCount: 0,
      dailyStreak: 0,
      totalTests: 1,
      bestScore: 100,
      categories: {},
    };
    const first = getEarnedBadges(ctx);
    const second = getEarnedBadges(ctx);
    expect(second).toEqual(first);
    expect(unlockedBadges.get()).toEqual(['FIRST_TEST']);
    expect(first).toContain('LEVEL_5');
    expect(first).toContain('FIRST_TEST');
    expect(first).toContain('PERFECT_SCORE');
  });
});
