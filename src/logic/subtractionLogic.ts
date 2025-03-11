import { nanoid } from 'nanoid';
import { SubtractionItem, SubtractionTest } from '../types/subtraction';

export function generateSubtractionItem(): SubtractionItem {
  // Générer des nombres de manière à avoir toujours une soustraction positive
  const secondNumber = Math.floor(Math.random() * 50); // Nombres jusqu'à 50 pour commencer
  const firstNumber = secondNumber + Math.floor(Math.random() * 50); // Premier nombre toujours plus grand

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    correctAnswer: firstNumber - secondNumber
  };
}

export function createSubtractionTest(numberOfItems: number = 10): SubtractionTest {
  return {
    id: nanoid(),
    items: Array.from({ length: numberOfItems }, () => generateSubtractionItem()),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

export function checkAnswer(item: SubtractionItem, answer: number): boolean {
  const isCorrect = answer === item.correctAnswer;
  return isCorrect;
}

export function evaluateTest(test: SubtractionTest): {
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