import { nanoid } from 'nanoid';
import { type SubtractionItem, type SubtractionTest } from '../types/subtraction';

export function generateSubtractionItem(mode: 'integer' | 'decimal' = 'integer'): SubtractionItem {
  if (mode === 'integer') {
    // Générer des nombres entiers comme avant
    const secondNumber = Math.floor(Math.random() * 50); // Nombres jusqu'à 50 pour commencer
    const firstNumber = secondNumber + Math.floor(Math.random() * 50); // Premier nombre toujours plus grand

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: firstNumber - secondNumber
    };
  } else {
    // Générer des nombres décimaux avec un résultat positif
    const secondNumber = Math.round(Math.random() * 50) / 10;
    const firstNumber = secondNumber + Math.round(Math.random() * 50) / 10;

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: parseFloat((firstNumber - secondNumber).toFixed(1))
    };
  }
}

export function createSubtractionTest(numberOfItems: number = 10, mode: 'integer' | 'decimal' = 'integer'): SubtractionTest {
  return {
    id: nanoid(),
    type: 'subtraction',
    mode,
    items: Array.from({ length: numberOfItems }, () => generateSubtractionItem(mode)),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

export function checkAnswer(item: SubtractionItem, answer: number): boolean {
  // Pour les nombres décimaux, comparer avec une précision d'un chiffre après la virgule
  if (typeof item.firstNumber === 'number' && item.firstNumber % 1 !== 0) {
    const expectedAnswer = parseFloat((item.correctAnswer as number).toFixed(1));
    const userAnswer = parseFloat(answer.toFixed(1));
    return userAnswer === expectedAnswer;
  }

  // Pour les nombres entiers, comparaison simple
  return answer === item.correctAnswer;
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