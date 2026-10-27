import { describe, it, expect } from 'vitest';
import { PROGRESS_TABS, resolveProgressTab, getProgressTabLabel } from '../../src/logic/progressLogic';

describe('progressTabs — onglets /progress', () => {
  it('expose 3 onglets Progrès/Badges/Stats', () => {
    expect(PROGRESS_TABS.map((t) => t.id)).toEqual(['progres', 'badges', 'stats']);
    expect(PROGRESS_TABS.map((t) => t.label)).toEqual(['Progrès', 'Badges', 'Stats']);
  });

  it('résout un onglet invalide vers Progrès', () => {
    expect(resolveProgressTab('badges')).toBe('badges');
    expect(resolveProgressTab('stats')).toBe('stats');
    expect(resolveProgressTab('nimporte-quoi')).toBe('progres');
    expect(resolveProgressTab(undefined)).toBe('progres');
    expect(resolveProgressTab(null)).toBe('progres');
  });

  it('retourne le libellé FR de chaque onglet', () => {
    expect(getProgressTabLabel('progres')).toBe('Progrès');
    expect(getProgressTabLabel('badges')).toBe('Badges');
    expect(getProgressTabLabel('stats')).toBe('Stats');
    expect(getProgressTabLabel('inconnu')).toBe('Progrès');
  });
});
