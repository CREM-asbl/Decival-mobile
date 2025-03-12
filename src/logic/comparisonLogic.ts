import { nanoid } from 'nanoid';
import { type ComparisonItem, type ComparisonTest } from '../types/comparison';

export function generateComparisonItem(): ComparisonItem {
  // Générer deux nombres différents pour la comparaison
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
}

export function createComparisonTest(numberOfItems: number = 10): ComparisonTest {
  return {
    id: nanoid(),
    type: 'comparison',
    items: Array.from({ length: numberOfItems }, () => generateComparisonItem()),
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