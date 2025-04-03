import { nanoid } from 'nanoid';
import type { DecimalItem, DecimalTest } from '../types/decimal';

/**
 * Génère un élément d'opération avec des nombres décimaux.
 * Le résultat attendu sera toujours à un chiffre après la virgule.
 */
export function generateDecimalItem(): DecimalItem {
  // Générer des nombres avec 1 chiffre après la virgule
  const firstNumber = Math.round(Math.random() * 100) / 10;
  const secondNumber = Math.round(Math.random() * 100) / 10;

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    correctAnswer: +(firstNumber + secondNumber).toFixed(1) // Addition arrondie à 1 décimale
  };
}

/**
 * Crée un test d'opérations avec des nombres décimaux
 */
export function createDecimalTest(numberOfItems: number = 10): DecimalTest {
  return {
    id: nanoid(),
    type: 'decimal',
    items: Array.from({ length: numberOfItems }, () => generateDecimalItem()),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

/**
 * Vérifie si une réponse est correcte pour un élément donné
 */
export function checkAnswer(item: DecimalItem, answer: number): boolean {
  // Arrondir les deux nombres à 1 décimale pour éviter les erreurs de précision
  const expectedAnswer = parseFloat(item.correctAnswer.toFixed(1));
  const userAnswer = parseFloat(answer.toFixed(1));
  return userAnswer === expectedAnswer;
}

/**
 * Évalue les résultats d'un test
 */
export function evaluateTest(test: DecimalTest): {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
} {
  const totalQuestions = test.items.length;
  const correctAnswers = test.items.filter(item => item.isCorrect).length;
  const score = (correctAnswers / totalQuestions) * 100;

  return {
    totalQuestions,
    correctAnswers,
    score
  };
}