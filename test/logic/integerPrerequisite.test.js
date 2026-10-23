import { describe, it, expect, beforeEach } from 'vitest';
import { typeMastery, updateIntegerMastery, isIntegerMastered, migrateTypeMasteryKeys, resetTypeMastery } from '../../src/stores/typeMasteryStore';

beforeEach(() => {
  resetTypeMastery();
});

describe('Integer prerequisite (store)', () => {
  it('isIntegerMastered false initially, true after updateIntegerMastery', () => {
    expect(isIntegerMastered('addition')).toBe(false);
    updateIntegerMastery('addition', true, 85);
    expect(isIntegerMastered('addition')).toBe(true);
    expect(isIntegerMastered('subtraction')).toBe(false);
  });

  it('migrateTypeMasteryKeys converts legacy category-type keys to category-decimal-type', () => {
    const migrated = migrateTypeMasteryKeys({
      mastery: {
        'addition-3': { type: 3, category: 'addition', mastered: true, lastScore: 90, consecutiveSuccesses: 1 }
      }
    });
    typeMastery.set(migrated);
    const state = typeMastery.get();
    expect(state.mastery['addition-decimal-3']).toBeDefined();
    expect(state.mastery['addition-decimal-3'].mode).toBe('decimal');
    expect(state.mastery['addition-3']).toBeUndefined();
  });

  it('migrateTypeMasteryKeys leaves new-format keys untouched', () => {
    updateIntegerMastery('addition', true, 85);
    typeMastery.set(migrateTypeMasteryKeys(typeMastery.get()));
    expect(isIntegerMastered('addition')).toBe(true);
  });
});
