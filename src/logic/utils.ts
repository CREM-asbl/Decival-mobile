import { nanoid } from 'nanoid';

/**
 * Génère des items uniques via un callback, avec un contrôle d'unicité basé sur une fonction clé.
 */
export function generateUniqueItems<T>(
  count: number,
  generator: () => T,
  keyFn: (item: T) => string,
  maxAttempts: number = 1000
): T[] {
  const result: T[] = [];
  const seen = new Set<string>();
  let attempts = 0;

  while (result.length < count) {
    attempts += 1;

    if (attempts > maxAttempts) {
      throw new Error(`Impossible de générer ${count} exercices uniques`);
    }

    const item = generator();
    const key = keyFn(item);

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}