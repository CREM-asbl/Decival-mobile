/**
 * Génère un nombre aléatoire entre min (inclus) et max (inclus)
 * @param min Valeur minimale (incluse)
 * @param max Valeur maximale (incluse)
 * @returns Un nombre entier aléatoire entre min et max
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
