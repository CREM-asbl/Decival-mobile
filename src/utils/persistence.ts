const STORAGE_KEYS = {
  RULE_PROGRESS: 'decival_rule_progress',
  TEST_HISTORY: 'decival_test_history'
};

interface StorageData {
  timestamp: number;
  data: any;
}

export function saveToStorage(key: string, data: any): void {
  try {
    const storageData: StorageData = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;

    const parsedData: StorageData = JSON.parse(storedData);
    return parsedData.data as T;
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return null;
  }
}

// Fonctions spécifiques pour la progression des règles
export function saveRuleProgress(data: any): void {
  saveToStorage(STORAGE_KEYS.RULE_PROGRESS, data);
}

export function loadRuleProgress<T>(): T | null {
  return loadFromStorage(STORAGE_KEYS.RULE_PROGRESS);
}

export { STORAGE_KEYS };
