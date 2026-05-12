export const STORAGE_KEYS = {
  TYPE_MASTERY: 'decival_type_mastery',
  UNLOCKED_BADGES: 'decival_unlocked_badges',
  CURRENT_LEVEL: 'decival_level',
  TOTAL_XP: 'decival_xp',
  TEST_HISTORY: 'decival_test_history',
  TEST_STATS: 'testStats'
};

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

// Fonction utilitaire pour nettoyer le stockage
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TEST_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.TEST_STATS);
    localStorage.removeItem(STORAGE_KEYS.TYPE_MASTERY);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_BADGES);
    console.log("Stockage effacé avec succès");
  } catch (error) {
    console.error('Erreur lors du nettoyage du stockage:', error);
  }
}
