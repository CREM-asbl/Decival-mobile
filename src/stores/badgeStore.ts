import { atom } from 'nanostores';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../utils/persistence';

export type BadgeId = 'FIRST_TEST' | 'PERFECT_SCORE' | 'STREAK_3' | 'MASTERY_REACHED' | 'LEVEL_5';

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
        description: 'Maîtrise ta première règle',
        icon: '👑'
    },
    LEVEL_5: {
        id: 'LEVEL_5',
        title: 'Expert',
        description: 'Atteins le niveau 5',
        icon: '🚀'
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
