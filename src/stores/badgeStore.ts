import { atom } from 'nanostores';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/persistence';
import { ICON_PATHS, type IconName } from '../config/icons';

export type BadgeId = 'FIRST_TEST' | 'PERFECT_SCORE' | 'STREAK_3' | 'MASTERY_REACHED' | 'MASTERY_5' | 'MASTERY_10' | 'MASTERY_ADDITION' | 'MASTERY_SUBTRACTION' | 'MASTERY_MULTIPLICATION' | 'MASTERY_COMPARISON' | 'LEVEL_5' | 'LEVEL_50';

export interface Badge {
    id: BadgeId;
    title: string;
    description: string;
    icon: IconName;
    unlockedAt?: Date;
}

export const BADGES: Record<BadgeId, Badge> = {
    FIRST_TEST: {
        id: 'FIRST_TEST',
        title: 'Premier Pas',
        description: 'Termine ton tout premier test',
        icon: 'target'
    },
    PERFECT_SCORE: {
        id: 'PERFECT_SCORE',
        title: 'Sans Faute',
        description: 'Obtiens un score de 100%',
        icon: 'star'
    },
    STREAK_3: {
        id: 'STREAK_3',
        title: 'Assidu',
        description: 'Pratique pendant 3 jours consécutifs',
        icon: 'flame'
    },
    MASTERY_REACHED: {
        id: 'MASTERY_REACHED',
        title: 'Maître',
        description: 'Maîtrise ta première sous-compétence',
        icon: 'crown'
    },
    MASTERY_5: {
        id: 'MASTERY_5',
        title: 'Petit Génie',
        description: 'Maîtrise 5 sous-compétences différentes',
        icon: 'graduation'
    },
    MASTERY_10: {
        id: 'MASTERY_10',
        title: 'Savant',
        description: 'Maîtrise 10 sous-compétences différentes',
        icon: 'lightbulb'
    },
    MASTERY_ADDITION: {
        id: 'MASTERY_ADDITION',
        title: 'As de l\'Addition',
        description: 'Maîtrise toutes les sous-compétences d\'addition de base',
        icon: 'plus'
    },
    MASTERY_SUBTRACTION: {
        id: 'MASTERY_SUBTRACTION',
        title: 'Pro de la Soustraction',
        description: 'Maîtrise toutes les sous-compétences de soustraction de base',
        icon: 'minus'
    },
    MASTERY_MULTIPLICATION: {
        id: 'MASTERY_MULTIPLICATION',
        title: 'Crack de la Multiplication',
        description: 'Maîtrise toutes les sous-compétences de multiplication de base',
        icon: 'times'
    },
    MASTERY_COMPARISON: {
        id: 'MASTERY_COMPARISON',
        title: 'Expert des Comparaisons',
        description: 'Maîtrise toutes les sous-compétences de comparaison',
        icon: 'scale'
    },
    LEVEL_5: {
        id: 'LEVEL_5',
        title: 'Expert',
        description: 'Atteins le niveau 5',
        icon: 'rocket'
    },
    LEVEL_50: {
        id: 'LEVEL_50',
        title: 'Légende de Decival',
        description: 'Atteins le niveau ultra-secret 50',
        icon: 'crown'
    }
};

// Source unique des icônes d'opération : les mêmes SVG que les badges de maîtrise
export const OPERATION_ICONS = {
    addition: BADGES.MASTERY_ADDITION.icon,
    subtraction: BADGES.MASTERY_SUBTRACTION.icon,
    multiplication: BADGES.MASTERY_MULTIPLICATION.icon,
    comparison: BADGES.MASTERY_COMPARISON.icon
} as const;

export const unlockedBadges = atom<BadgeId[]>([]);

// Initialisation
if (typeof window !== 'undefined') {
    const saved = loadFromStorage<BadgeId[]>(STORAGE_KEYS.UNLOCKED_BADGES);
    if (saved) unlockedBadges.set(saved);
}

// Persistance
unlockedBadges.subscribe(badges => {
    if (typeof window !== 'undefined') {
        saveToStorage(STORAGE_KEYS.UNLOCKED_BADGES, badges);
    }
});

export function unlockBadge(badgeId: BadgeId) {
    const current = unlockedBadges.get();
    if (!current.includes(badgeId)) {
        unlockedBadges.set([...current, badgeId]);
        return true; // Nouveau badge débloqué
    }
    return false;
}
