import { nanoid } from 'nanoid';
import { type MultiplicationItem, type MultiplicationTest } from '../types/multiplication';

export function generateMultiplicationItem(mode: 'integer' | 'decimal' = 'integer'): MultiplicationItem {
  if (mode === 'integer') {
    // Nombres entiers simples (1-12) pour l'apprentissage
    const firstNumber = Math.floor(Math.random() * 12) + 1;
    const secondNumber = Math.floor(Math.random() * 12) + 1;

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: firstNumber * secondNumber
    };
  } else {
    // Multiplication avec nombres décimaux (1 chiffre après la virgule)
    // On utilise des nombres plus petits pour les décimaux
    const firstNumber = Math.round((Math.random() * 10) * 10) / 10;
    const secondNumber = Math.round((Math.random() * 10) * 10) / 10;

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: parseFloat((firstNumber * secondNumber).toFixed(1))
    };
  }
}

export function createMultiplicationTest(numberOfItems: number = 10, mode: 'integer' | 'decimal' = 'integer'): MultiplicationTest {
  return {
    id: nanoid(),
    type: 'multiplication',
    mode,
    items: Array.from({ length: numberOfItems }, () => generateMultiplicationItem(mode)),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

export function checkAnswer(item: MultiplicationItem, answer: number): boolean {
  // Pour les nombres décimaux, comparer avec une précision d'un chiffre après la virgule
  if (typeof item.firstNumber === 'number' && item.firstNumber % 1 !== 0) {
    const expectedAnswer = parseFloat((item.correctAnswer as number).toFixed(1));
    const userAnswer = parseFloat(answer.toFixed(1));
    return userAnswer === expectedAnswer;
  }

  // Pour les nombres entiers, comparaison simple
  return answer === item.correctAnswer;
}

export function evaluateTest(test: MultiplicationTest): {
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