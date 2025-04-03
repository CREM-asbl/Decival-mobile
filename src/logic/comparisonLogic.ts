import { nanoid } from 'nanoid';
import { type ComparisonItem, type ComparisonTest } from '../types/comparison';

export function generateComparisonItem(mode: 'integer' | 'decimal' = 'integer'): ComparisonItem {
  if (mode === 'integer') {
    // Générer deux nombres entiers différents pour la comparaison
    let firstNumber = Math.floor(Math.random() * 100);
    let secondNumber;

    do {
      secondNumber = Math.floor(Math.random() * 100);
    } while (secondNumber === firstNumber);

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: firstNumber > secondNumber ? '>' :
        firstNumber < secondNumber ? '<' : '='
    };
  } else {
    // Générer deux nombres décimaux différents pour la comparaison
    let firstNumber = Math.round(Math.random() * 100) / 10;
    let secondNumber;

    do {
      secondNumber = Math.round(Math.random() * 100) / 10;
    } while (Math.abs(secondNumber - firstNumber) < 0.1); // Éviter les valeurs trop proches

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: firstNumber > secondNumber ? '>' :
        firstNumber < secondNumber ? '<' : '='
    };
  }
}

export function createComparisonTest(numberOfItems: number = 10, mode: 'integer' | 'decimal' = 'integer'): ComparisonTest {
  return {
    id: nanoid(),
    type: 'comparison',
    mode,
    items: Array.from({ length: numberOfItems }, () => generateComparisonItem(mode)),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

export function checkAnswer(item: ComparisonItem, answer: string): boolean {
  // Vérifier que la réponse est l'un des symboles valides
  if (!['<', '=', '>'].includes(answer)) {
    return false;
  }
  return answer === item.correctAnswer;
}

export function evaluateTest(test: ComparisonTest): {
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