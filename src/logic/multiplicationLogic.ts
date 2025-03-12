import { nanoid } from 'nanoid';
import { type MultiplicationItem, type MultiplicationTest } from '../types/multiplication';

export function generateMultiplicationItem(): MultiplicationItem {
  // On commence avec des nombres simples pour l'apprentissage (1-12)
  const firstNumber = Math.floor(Math.random() * 12) + 1;
  const secondNumber = Math.floor(Math.random() * 12) + 1;

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    correctAnswer: firstNumber * secondNumber
  };
}

export function createMultiplicationTest(numberOfItems: number = 10): MultiplicationTest {
  return {
    id: nanoid(),
    items: Array.from({ length: numberOfItems }, () => generateMultiplicationItem()),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

export function checkAnswer(item: MultiplicationItem, answer: number): boolean {
  const isCorrect = answer === item.correctAnswer;
  return isCorrect;
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