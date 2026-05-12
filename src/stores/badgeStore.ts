import { atom } from 'nanostores';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/persistence';

export type BadgeId = 'FIRST_TEST' | 'PERFECT_SCORE' | 'STREAK_3' | 'MASTERY_REACHED' | 'MASTERY_5' | 'MASTERY_10' | 'MASTERY_ADDITION' | 'MASTERY_SUBTRACTION' | 'MASTERY_MULTIPLICATION' | 'MASTERY_COMPARISON' | 'LEVEL_5' | 'LEVEL_50';

export interface Badge {
    id: BadgeId;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: Date;
}

export const BADGES: Record<BadgeId, Badge> = {
    FIRST_TEST: {
        id: 'FIRST_TEST',
        title: 'Premier Pas',
        description: 'Termine ton tout premier test',
        icon: '🎯'
    },
    PERFECT_SCORE: {
        id: 'PERFECT_SCORE',
        title: 'Sans Faute',
        description: 'Obtiens un score de 100%',
        icon: '🌟'
    },
    STREAK_3: {
        id: 'STREAK_3',
        title: 'Assidu',
        description: 'Pratique pendant 3 jours consécutifs',
        icon: '🔥'
    },
    MASTERY_REACHED: {
        id: 'MASTERY_REACHED',
        title: 'Maître',
        description: 'Maîtrise ton premier type d\'opération',
        icon: '👑'
    },
    MASTERY_5: {
        id: 'MASTERY_5',
        title: 'Petit Génie',
        description: 'Maîtrise 5 types d\'opérations différents',
        icon: '🎓'
    },
    MASTERY_10: {
        id: 'MASTERY_10',
        title: 'Savant',
        description: 'Maîtrise 10 types d\'opérations différents',
        icon: '💡'
    },
    MASTERY_ADDITION: {
        id: 'MASTERY_ADDITION',
        title: 'As de l\'Addition',
        description: 'Maîtrise tous les types d\'addition de base',
        icon: '➕'
    },
    MASTERY_SUBTRACTION: {
        id: 'MASTERY_SUBTRACTION',
        title: 'Pro de la Soustraction',
        description: 'Maîtrise tous les types de soustraction de base',
        icon: '➖'
    },
    MASTERY_MULTIPLICATION: {
        id: 'MASTERY_MULTIPLICATION',
        title: 'Crack de la Multiplication',
        description: 'Maîtrise tous les types de multiplication de base',
        icon: '✖️'
    },
    MASTERY_COMPARISON: {
        id: 'MASTERY_COMPARISON',
        title: 'Expert des Comparaisons',
        description: 'Maîtrise tous les types de comparaison',
        icon: '⚖️'
    },
    LEVEL_5: {
        id: 'LEVEL_5',
        title: 'Expert',
        description: 'Atteins le niveau 5',
        icon: '🚀'
    },
    LEVEL_50: {
        id: 'LEVEL_50',
        title: 'Légende de Decival',
        description: 'Atteins le niveau ultra-secret 50',
        icon: '👑'
    }
};

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
