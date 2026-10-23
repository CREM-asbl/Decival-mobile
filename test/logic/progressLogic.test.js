import { describe, it, expect } from 'vitest';
import {
  clampPercent,
  getBadgeProgress,
  getEarnedBadges,
  getInTestEncouragement,
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

describe('progressLogic — getInTestEncouragement', () => {
  it('encourage au démarrage', () => {
    expect(getInTestEncouragement(0, 10)).toBe("C'est parti, tu peux le faire !");
    expect(getInTestEncouragement(1, 10)).toBe("C'est parti, tu peux le faire !");
  });

  it('encourage à mi-parcours', () => {
    expect(getInTestEncouragement(5, 10)).toBe('Bien, continue comme ça !');
  });

  it('encourage en fin de test', () => {
    expect(getInTestEncouragement(8, 10)).toBe('Plus que quelques questions, courage !');
    expect(getInTestEncouragement(10, 10)).toBe('Plus que quelques questions, courage !');
  });

  it('borne les cas limites', () => {
    expect(getInTestEncouragement(-3, 10)).toBe("C'est parti, tu peux le faire !");
    expect(getInTestEncouragement(99, 10)).toBe('Plus que quelques questions, courage !');
    expect(getInTestEncouragement(0, 0)).toBe("C'est parti, tu peux le faire !");
  });
});

describe('progressLogic — getBadgeProgress', () => {
  it('part de 0 % au niveau 1 (aucune progression vers le palier)', () => {
    expect(getBadgeProgress('LEVEL_5', { level: 1 })).toBe(0);
    expect(getBadgeProgress('LEVEL_10', { level: 1 })).toBe(0);
    expect(getBadgeProgress('LEVEL_50', { level: 1 })).toBe(0);
  });

  it('progresse vers le prochain palier de niveau', () => {
    expect(getBadgeProgress('LEVEL_5', { level: 3 })).toBe(40);
    expect(getBadgeProgress('LEVEL_10', { level: 10 })).toBe(100);
    expect(getBadgeProgress('LEVEL_20', { level: 10 })).toBe(45);
    expect(getBadgeProgress('LEVEL_35', { level: 20 })).toBe(54);
    expect(getBadgeProgress('LEVEL_50', { level: 35 })).toBe(68);
    expect(getBadgeProgress('LEVEL_50', { level: 50 })).toBe(100);
  });

  it('intègre la fraction XP dans le niveau courant', () => {
    expect(getBadgeProgress('LEVEL_5', { level: 1, xpIntoLevel: 0, xpForNextLevel: 100 })).toBe(0);
    expect(getBadgeProgress('LEVEL_5', { level: 3, xpIntoLevel: 50, xpForNextLevel: 100 })).toBe(50);
    expect(getBadgeProgress('LEVEL_5', { level: 4, xpIntoLevel: 100, xpForNextLevel: 100 })).toBe(80);
  });

  it('progresse sur la maîtrise des sous-compétences', () => {
    expect(getBadgeProgress('MASTERY_5', { masteredCount: 0 })).toBe(0);
    expect(getBadgeProgress('MASTERY_5', { masteredCount: 3 })).toBe(60);
    expect(getBadgeProgress('MASTERY_5', { masteredCount: 5 })).toBe(100);
    expect(getBadgeProgress('MASTERY_10', { masteredCount: 7 })).toBe(70);
  });

  it('progresse sur les badges de catégorie (addition/soustraction/…)', () => {
    expect(getBadgeProgress('MASTERY_ADDITION', { masteredInCategory: 0, categoryTotal: 7 })).toBe(0);
    expect(getBadgeProgress('MASTERY_ADDITION', { masteredInCategory: 3, categoryTotal: 7 })).toBe(43);
    expect(getBadgeProgress('MASTERY_ADDITION', { masteredInCategory: 7, categoryTotal: 7 })).toBe(100);
    expect(getBadgeProgress('MASTERY_COMPARISON', {})).toBe(0);
  });

  it('progresse sur la série de jours', () => {
    expect(getBadgeProgress('STREAK_3', { dailyStreak: 0 })).toBe(0);
    expect(getBadgeProgress('STREAK_3', { dailyStreak: 1 })).toBeGreaterThan(30);
    expect(getBadgeProgress('STREAK_3', { dailyStreak: 3 })).toBe(100);
  });

  it('retourne 0 ou 100 pour les badges binaires', () => {
    expect(getBadgeProgress('FIRST_TEST', { totalTests: 0 })).toBe(0);
    expect(getBadgeProgress('FIRST_TEST', { totalTests: 1 })).toBe(100);
    expect(getBadgeProgress('PERFECT_SCORE', { bestScore: 80 })).toBe(0);
    expect(getBadgeProgress('PERFECT_SCORE', { bestScore: 100 })).toBe(100);
  });

  it('borne les entrées invalides', () => {
    expect(getBadgeProgress('LEVEL_10', {})).toBe(0);
    expect(getBadgeProgress('UNKNOWN_BADGE', { level: 5 })).toBe(0);
    expect(getBadgeProgress('LEVEL_10', { level: Number.NaN })).toBe(0);
  });
});

describe('progressLogic — getEarnedBadges', () => {
  it('retourne les badges dont la progression atteint 100 %', () => {
    const earned = getEarnedBadges({
      level: 10,
      xpIntoLevel: 0,
      xpForNextLevel: 100,
      masteredCount: 5,
      dailyStreak: 3,
      totalTests: 1,
      bestScore: 100,
      categories: { addition: { mastered: 7, total: 7 } }
    });
    expect(earned).toContain('LEVEL_5');
    expect(earned).toContain('LEVEL_10');
    expect(earned).toContain('MASTERY_5');
    expect(earned).toContain('STREAK_3');
    expect(earned).toContain('FIRST_TEST');
    expect(earned).toContain('PERFECT_SCORE');
    expect(earned).toContain('MASTERY_ADDITION');
    expect(earned).not.toContain('LEVEL_20');
    expect(earned).not.toContain('MASTERY_10');
  });

  it('retourne un tableau vide sans progression', () => {
    expect(getEarnedBadges({})).toEqual([]);
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
