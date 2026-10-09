import { XP_PER_LEVEL } from '../config/constants';

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice',
  5: 'Apprenti',
  10: 'Érudit des Chiffres',
  20: 'Chevalier Décimal',
  35: 'Grand Maître',
  50: 'Légende Vivante'
};

export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

export function getLevelTitle(level: number): string {
  if (!Number.isFinite(level) || level < 1) return LEVEL_TITLES[1];
  const thresholds = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (level >= threshold) return LEVEL_TITLES[threshold];
  }
  return LEVEL_TITLES[1];
}

export function getLevelProgress(totalXp: number): {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  remainingXp: number;
  nextLevel: number;
  percent: number;
} {
  if (!Number.isFinite(totalXp) || totalXp < 0) {
    return {
      level: 1,
      xpIntoLevel: 0,
      xpForNextLevel: XP_PER_LEVEL,
      remainingXp: XP_PER_LEVEL,
      nextLevel: 2,
      percent: 0
    };
  }

  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;
  const xpForNextLevel = XP_PER_LEVEL;
  const remainingXp = XP_PER_LEVEL - xpIntoLevel;
  const nextLevel = level + 1;
  const percent = clampPercent((xpIntoLevel / XP_PER_LEVEL) * 100);

  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    remainingXp,
    nextLevel,
    percent
  };
}

export function getScorePercent(score: number, maxScore: number): number {
  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0) return 0;
  if (score <= 0) return 0;
  if (score >= maxScore) return 100;
  return Math.round((score / maxScore) * 100);
}

export function getProgressEncouragement(stats: {
  totalTests?: number;
  averageScore?: number;
}): { title: string; variant: 'happy' | 'pointing' } {
  const totalTests = stats.totalTests ?? 0;
  const averageScore = clampPercent(stats.averageScore ?? 0);

  if (totalTests === 0) {
    return { title: "C'est parti !", variant: 'pointing' };
  }

  if (averageScore >= 90) return { title: 'Excellent travail !', variant: 'happy' };
  if (averageScore >= 70) return { title: 'Tu progresses bien !', variant: 'happy' };
  if (averageScore >= 50) return { title: 'Continue tes efforts !', variant: 'pointing' };
  return { title: "N'abandonne pas !", variant: 'pointing' };
}

export function getTestEncouragement(
  testType: string,
  itemCount: number
): { itemCount: number; message: string } {
  const count = Number.isFinite(itemCount) && itemCount > 0 ? itemCount : 0;
  const typeLabels: Record<string, string> = {
    addition: 'additions',
    subtraction: 'soustractions',
    multiplication: 'multiplications',
    comparison: 'comparaisons'
  };
  const label = typeLabels[testType] ?? 'exercices';
  return {
    itemCount: count,
    message: `Tu vas faire ${count} ${label}. Tu es prêt ?`
  };
}

export function summarizeMastery(mastery: Record<string, { mastered: boolean }> | undefined | null): {
  masteredCount: number;
  totalCount: number;
  percent: number;
} {
  if (!mastery || typeof mastery !== 'object') {
    return { masteredCount: 0, totalCount: 0, percent: 0 };
  }
  const entries = Object.values(mastery);
  const totalCount = entries.length;
  const masteredCount = entries.filter(e => e?.mastered === true).length;
  const percent = totalCount > 0 ? clampPercent(Math.round((masteredCount / totalCount) * 100)) : 0;
  return { masteredCount, totalCount, percent };
}