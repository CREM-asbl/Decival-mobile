import { describe, it, expect } from 'vitest';
import {
  clampPercent,
  getLevelProgress,
  getLevelTitle,
  getProgressEncouragement,
  getScorePercent,
  getTestEncouragement,
  summarizeMastery
} from '../../src/logic/progressLogic';
import { XP_PER_LEVEL } from '../../src/config/constants';

describe('progressLogic — clampPercent', () => {
  it('borne les valeurs dans [0, 100]', () => {
    expect(clampPercent(-50)).toBe(0);
    expect(clampPercent(0)).toBe(0);
    expect(clampPercent(42.5)).toBe(42.5);
    expect(clampPercent(100)).toBe(100);
    expect(clampPercent(150)).toBe(100);
  });

  it('retombe sur 0 pour les valeurs non finies', () => {
    expect(clampPercent(Number.NaN)).toBe(0);
    expect(clampPercent(Number.POSITIVE_INFINITY)).toBe(0);
    expect(clampPercent(Number.NEGATIVE_INFINITY)).toBe(0);
  });
});

describe('progressLogic — getLevelTitle (paliers)', () => {
  it('associe chaque palier à son titre', () => {
    expect(getLevelTitle(0)).toBe('Novice');
    expect(getLevelTitle(1)).toBe('Novice');
    expect(getLevelTitle(4)).toBe('Novice');
    expect(getLevelTitle(5)).toBe('Apprenti');
    expect(getLevelTitle(10)).toBe('Érudit des Chiffres');
    expect(getLevelTitle(20)).toBe('Chevalier Décimal');
    expect(getLevelTitle(35)).toBe('Grand Maître');
    expect(getLevelTitle(50)).toBe('Légende Vivante');
    expect(getLevelTitle(999)).toBe('Légende Vivante');
  });

  it('reste robuste face aux entrées invalides', () => {
    expect(getLevelTitle(-3)).toBe('Novice');
    expect(getLevelTitle(Number.NaN)).toBe('Novice');
  });
});

describe('progressLogic — getLevelProgress (bornes XP)', () => {
  it('démarre au niveau 1 avec 0 XP', () => {
    expect(getLevelProgress(0)).toEqual({
      level: 1,
      xpIntoLevel: 0,
      xpForNextLevel: XP_PER_LEVEL,
      remainingXp: XP_PER_LEVEL,
      nextLevel: 2,
      percent: 0
    });
  });

  it('progresse dans le niveau courant', () => {
    const progress = getLevelProgress(50);
    expect(progress.level).toBe(1);
    expect(progress.xpIntoLevel).toBe(50);
    expect(progress.percent).toBe(50);
    expect(progress.remainingXp).toBe(50);
  });

  it('change de niveau exactement à XP_PER_LEVEL', () => {
    const progress = getLevelProgress(XP_PER_LEVEL);
    expect(progress.level).toBe(2);
    expect(progress.xpIntoLevel).toBe(0);
    expect(progress.percent).toBe(0);
    expect(progress.nextLevel).toBe(3);
  });

  it('ne descend jamais sous 0 % ni au-dessus de 100 %', () => {
    const negative = getLevelProgress(-120);
    expect(negative.level).toBe(1);
    expect(negative.percent).toBe(0);

    const almostMax = getLevelProgress(XP_PER_LEVEL * 3 + 99);
    expect(almostMax.percent).toBe(99);
    expect(almostMax.percent).toBeLessThanOrEqual(100);

    const invalid = getLevelProgress(Number.NaN);
    expect(invalid.level).toBe(1);
    expect(invalid.percent).toBe(0);
  });

  it('gère les très grandes valeurs', () => {
    const progress = getLevelProgress(XP_PER_LEVEL * 1000 + 50);
    expect(progress.level).toBe(1001);
    expect(progress.percent).toBe(50);
  });
});

describe('progressLogic — getScorePercent (score nul / score max)', () => {
  it('retourne 0 pour un score nul', () => {
    expect(getScorePercent(0, 28)).toBe(0);
  });

  it('retourne 100 pour un score parfait', () => {
    expect(getScorePercent(28, 28)).toBe(100);
  });

  it('arrondit les scores intermédiaires', () => {
    expect(getScorePercent(14, 28)).toBe(50);
    expect(getScorePercent(21, 28)).toBe(75);
    expect(getScorePercent(1, 3)).toBe(33);
  });

  it('borne les cas limites', () => {
    expect(getScorePercent(35, 28)).toBe(100);
    expect(getScorePercent(-3, 28)).toBe(0);
    expect(getScorePercent(5, 0)).toBe(0);
    expect(getScorePercent(0, 0)).toBe(0);
    expect(getScorePercent(Number.NaN, 28)).toBe(0);
    expect(getScorePercent(10, Number.NaN)).toBe(0);
  });
});

describe('progressLogic — getProgressEncouragement', () => {
  it("encourage l'élève qui n'a pas encore commencé", () => {
    const encouragement = getProgressEncouragement({ totalTests: 0, averageScore: 0 });
    expect(encouragement.title).toBe("C'est parti !");
    expect(encouragement.variant).toBe('pointing');
  });

  it('félicite un score maximal', () => {
    const encouragement = getProgressEncouragement({ totalTests: 4, averageScore: 100 });
    expect(encouragement.title).toBe('Excellent travail !');
    expect(encouragement.variant).toBe('happy');
  });

  it('reste encourageant sur un score nul', () => {
    const encouragement = getProgressEncouragement({ totalTests: 3, averageScore: 0 });
    expect(encouragement.title).toBe("N'abandonne pas !");
    expect(encouragement.variant).toBe('pointing');
  });

  it('suit les paliers de score', () => {
    expect(getProgressEncouragement({ totalTests: 1, averageScore: 90 }).title).toBe('Excellent travail !');
    expect(getProgressEncouragement({ totalTests: 1, averageScore: 89 }).title).toBe('Tu progresses bien !');
    expect(getProgressEncouragement({ totalTests: 1, averageScore: 70 }).title).toBe('Tu progresses bien !');
    expect(getProgressEncouragement({ totalTests: 1, averageScore: 69 }).title).toBe('Continue tes efforts !');
    expect(getProgressEncouragement({ totalTests: 1, averageScore: 50 }).title).toBe('Continue tes efforts !');
    expect(getProgressEncouragement({ totalTests: 1, averageScore: 49 }).title).toBe("N'abandonne pas !");
  });

  it('borne une progression négative ou aberrante', () => {
    const negative = getProgressEncouragement({ totalTests: 2, averageScore: -40 });
    expect(negative.title).toBe("N'abandonne pas !");
    expect(negative.variant).toBe('pointing');

    expect(getProgressEncouragement({ totalTests: 2, averageScore: 400 }).title).toBe('Excellent travail !');
    expect(getProgressEncouragement({}).title).toBe("C'est parti !");
  });
});

describe('progressLogic — getTestEncouragement', () => {
  it("annonce la longueur de la liste et tutoie l'élève", () => {
    const encouragement = getTestEncouragement('addition', 28);
    expect(encouragement.itemCount).toBe(28);
    expect(encouragement.message).toContain('28');
    expect(encouragement.message).toContain('additions');
    expect(encouragement.message.toLowerCase()).toContain('tu');
  });

  it('adapte le message à chaque opération', () => {
    expect(getTestEncouragement('comparison', 49).message).toContain('comparaisons');
    expect(getTestEncouragement('subtraction', 28).message).toContain('soustractions');
    expect(getTestEncouragement('multiplication', 20).message).toContain('multiplications');
  });

  it('reste robuste pour un type inconnu ou un compte invalide', () => {
    expect(getTestEncouragement('division', 10).message).toContain('10');
    expect(getTestEncouragement('addition', -5).itemCount).toBe(0);
    expect(getTestEncouragement('addition', Number.NaN).itemCount).toBe(0);
  });
});

describe('progressLogic — summarizeMastery', () => {
  it('compte les sous-compétences maîtrisées', () => {
    const summary = summarizeMastery({
      'addition-0': { mastered: true },
      'addition-1': { mastered: false },
      'addition-2': { mastered: true },
      'addition-3': { mastered: true }
    });
    expect(summary.masteredCount).toBe(3);
    expect(summary.totalCount).toBe(4);
    expect(summary.percent).toBe(75);
  });

  it('gère un état vide ou absent', () => {
    expect(summarizeMastery({})).toEqual({ masteredCount: 0, totalCount: 0, percent: 0 });
    expect(summarizeMastery(undefined)).toEqual({ masteredCount: 0, totalCount: 0, percent: 0 });
    expect(summarizeMastery(null)).toEqual({ masteredCount: 0, totalCount: 0, percent: 0 });
  });
});
