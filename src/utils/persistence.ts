export const STORAGE_KEYS = {
  TYPE_MASTERY: 'decival_type_mastery',
  UNLOCKED_BADGES: 'decival_unlocked_badges',
  CURRENT_LEVEL: 'decival_level',
  TOTAL_XP: 'decival_xp',
  TEST_HISTORY: 'decival_test_history',
  TEST_STATS: 'testStats'
};

// Clés de données isolées par élève (tout sauf préférences globales).
const STUDENT_DATA_KEYS = [
  STORAGE_KEYS.TYPE_MASTERY,
  STORAGE_KEYS.UNLOCKED_BADGES,
  STORAGE_KEYS.TEST_HISTORY,
  STORAGE_KEYS.TEST_STATS
] as const;

function keySuffix(baseKey: string): string {
  return baseKey.startsWith('decival_') ? baseKey.slice('decival_'.length) : baseKey;
}

// Clé namespacée par élève, ou clé globale historique sans élève actif.
export function scopedKey(baseKey: string, studentId: string | null): string {
  if (!studentId) return baseKey;
  return `decival_student_${studentId}_${keySuffix(baseKey)}`;
}

// Déplace les données globales existantes vers le premier profil créé.
export function migrateLegacyToStudent(studentId: string): void {
  try {
    for (const base of STUDENT_DATA_KEYS) {
      const scoped = scopedKey(base, studentId);
      if (localStorage.getItem(scoped) !== null) continue;
      const legacy = localStorage.getItem(base);
      if (legacy !== null) {
        localStorage.setItem(scoped, legacy);
        localStorage.removeItem(base);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la migration des données élève:', error);
  }
}

// Efface les clés de données d'un élève (ou globales historiques sans id).
export function clearStudentData(studentId: string | null): void {
  try {
    for (const base of STUDENT_DATA_KEYS) {
      localStorage.removeItem(scopedKey(base, studentId));
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage du stockage:', error);
  }
}

interface StorageData {
  timestamp: number;
  data: any;
}

export function saveToStorage(key: string, data: any): void {
  try {
    // Conversion des dates en chaînes ISO pour une meilleure sérialisation
    const processedData = JSON.parse(JSON.stringify(data, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));

    const storageData: StorageData = {
      timestamp: Date.now(),
      data: processedData
    };

    localStorage.setItem(key, JSON.stringify(storageData));
    console.log(`Données sauvegardées pour ${key}:`, processedData);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;

    const parsedData: StorageData = JSON.parse(storedData);
    console.log(`Données chargées pour ${key}:`, parsedData.data);
    return parsedData.data as T;
  } catch (error) {
    console.error(`Erreur lors du chargement de ${key}:`, error);
    return null;
  }
}

// Fonction utilitaire pour nettoyer le stockage du profil courant
// (préférences globales thème/son/animations non touchées).
export function clearStorage(): void {
  clearStudentData(null);
}
