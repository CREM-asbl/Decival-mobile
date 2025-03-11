import { nanoid } from 'nanoid';
import { AdditionItem, AdditionTest } from '../types/addition';

export function generateAdditionItem(): AdditionItem {
  const firstNumber = Math.floor(Math.random() * 100);
  const secondNumber = Math.floor(Math.random() * 100);

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    correctAnswer: firstNumber + secondNumber
  };
}

export function createAdditionTest(numberOfItems: number = 10): AdditionTest {
  return {
    id: nanoid(),
    items: Array.from({ length: numberOfItems }, () => generateAdditionItem()),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

export function checkAnswer(item: AdditionItem, answer: number): boolean {
  const isCorrect = answer === item.correctAnswer;
  return isCorrect;
}

export function evaluateTest(test: AdditionTest): {
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