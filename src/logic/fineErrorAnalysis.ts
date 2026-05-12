/**
 * Analyse fine des erreurs pour les opérations (Addition, Soustraction, Multiplication).
 * Porté fidèlement depuis les classes Java AdditionTest, SubstractionTest et MultiplicationTest (CREM).
 */

import type { FineErrorAnalysisResult } from '../types/diagnostic';

const EPSILON = 0.000001;

/**
 * Analyse une réponse d'addition.
 */
export function analyzeAdditionError(n1: number, n2: number, given: number): FineErrorAnalysisResult {
  const expected = n1 + n2;
  const analysis: FineErrorAnalysisResult = {
    hasComma: given.toString().includes('.') || given.toString().includes(',') ? '1' : '0',
    tenPower: '0',
    zero: '1', // Par défaut OK si pas d'erreur spécifique détectée
    passing: '1',
    result: '0'
  };

  // 1. Puissance de 10
  if (Math.abs(given - expected * 10) < EPSILON || Math.abs(given - expected / 10) < EPSILON) {
    analysis.tenPower = '1';
  }

  // 2. Retenue (Passing)
  // On vérifie si la différence est exactement 1, 0.1, 0.01 etc.
  const diff = Math.abs(given - expected);
  if (Math.abs(diff - 1) < EPSILON || Math.abs(diff - 0.1) < EPSILON || Math.abs(diff - 0.01) < EPSILON) {
    analysis.passing = '0';
  }

  // 3. Résultat (Calcul pur)
  if (Math.abs(given - expected) < EPSILON) {
    analysis.result = '1';
  }

  return analysis;
}

/**
 * Analyse une réponse de soustraction.
 */
export function analyzeSubtractionError(n1: number, n2: number, given: number): FineErrorAnalysisResult {
  const expected = n1 - n2;
  const analysis: FineErrorAnalysisResult = {
    hasComma: given.toString().includes('.') || given.toString().includes(',') ? '1' : '0',
    tenPower: '0',
    zero: '1',
    passing: '1',
    result: '0',
    confusion: '0',
    inversion: '0'
  };

  // 1. Confusion (Addition au lieu de soustraction)
  if (Math.abs(given - (n1 + n2)) < EPSILON) {
    analysis.confusion = '1';
  }

  // 2. Inversion (L'élève fait n2 - n1 ou inverse les chiffres par colonne)
  // Note: Dans le Java original, l'inversion est souvent détectée par colonne. 
  // Ici on simplifie par la valeur globale si elle correspond à l'inverse.
  if (Math.abs(given - (n2 - n1)) < EPSILON) {
    analysis.inversion = '1';
  }

  // 3. Puissance de 10
  if (Math.abs(given - expected * 10) < EPSILON || Math.abs(given - expected / 10) < EPSILON) {
    analysis.tenPower = '1';
  }

  // 4. Emprunt (Passing)
  const diff = Math.abs(given - expected);
  if (Math.abs(diff - 1) < EPSILON || Math.abs(diff - 0.1) < EPSILON || Math.abs(diff - 0.01) < EPSILON) {
    analysis.passing = '0';
  }

  if (Math.abs(given - expected) < EPSILON) {
    analysis.result = '1';
  }

  return analysis;
}

/**
 * Analyse une réponse de multiplication.
 */
export function analyzeMultiplicationError(n1: number, n2: number, given: number): FineErrorAnalysisResult {
  const expected = n1 * n2;
  const analysis: FineErrorAnalysisResult = {
    hasComma: given.toString().includes('.') || given.toString().includes(',') ? '1' : '0',
    tenPower: '0',
    zero: '1',
    passing: '1',
    result: '0'
  };

  const givenStr = given.toString();
  const expectedStr = expected.toFixed(10).replace(/\.?0+$/, ''); // Normalise sans zéros traînants inutiles pour la comparaison
  
  // 1. Puissance de 10 (Très fréquent en multiplication de décimaux)
  if (Math.abs(given - expected * 10) < EPSILON || Math.abs(given - expected / 10) < EPSILON ||
      Math.abs(given - expected * 100) < EPSILON || Math.abs(given - expected / 100) < EPSILON) {
    analysis.tenPower = '1';
  }

  // 2. Zéro (Placement du zéro ou oubli)
  // Cas spécifique : multiplication par 0.1, 0.01 etc.
  const isSmallFactor = Math.abs(n1 - 0.1) < EPSILON || Math.abs(n1 - 0.01) < EPSILON || 
                        Math.abs(n2 - 0.1) < EPSILON || Math.abs(n2 - 0.01) < EPSILON;
  
  if (isSmallFactor && Math.abs(given - expected) > EPSILON) {
    // Si on multiplie par 0.1 et que c'est faux, c'est souvent un problème de placement/zéro
    analysis.zero = '0';
  }

  // Détection générique de zéro (ex: 0.5 * 0.2 = 0.1, élève met 1 ou 0.01)
  if (Math.abs(given - expected) > EPSILON) {
    const digitsExpected = expected.toString().replace(/[\.,]/g, '').replace(/^0+/, '');
    const digitsGiven = given.toString().replace(/[\.,]/g, '').replace(/^0+/, '');
    
    // Si les chiffres significatifs sont les mêmes mais que le résultat est faux, 
    // et que ce n'est pas juste une puissance de 10, c'est peut-être un problème de zéro de position
    if (digitsExpected === digitsGiven && analysis.tenPower === '0') {
      analysis.zero = '0';
    }
  }

  // 3. Retenue / Passage (Passing)
  const diff = Math.abs(given - expected);
  // On vérifie si l'erreur est de type "table" ou "retenue" (différence de 1 unité à un certain rang)
  if (Math.abs(diff - 1) < EPSILON || Math.abs(diff - 0.1) < EPSILON || Math.abs(diff - 0.01) < EPSILON || Math.abs(diff - 0.001) < EPSILON) {
    analysis.passing = '0';
  }

  if (Math.abs(given - expected) < EPSILON) {
    analysis.result = '1';
  }

  return analysis;
}
