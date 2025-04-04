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

/**
 * Analyse la réponse pour identifier les erreurs spécifiques
 */
export function analyzeError(item: SubtractionItem, userAnswer: number): {
  errorType: string,
  feedback: string
} {
  // Si la réponse est correcte, pas d'erreur à analyser
  const correctAnswer = typeof item.correctAnswer === 'number' && item.correctAnswer % 1 !== 0
    ? parseFloat((item.correctAnswer).toFixed(1))
    : item.correctAnswer;

  const formattedUserAnswer = typeof item.firstNumber === 'number' && item.firstNumber % 1 !== 0
    ? parseFloat(userAnswer.toFixed(1))
    : userAnswer;

  if (formattedUserAnswer === correctAnswer) {
    return { errorType: 'none', feedback: 'Réponse correcte' };
  }

  // Analyser les erreurs possibles de soustraction

  // Vérifier si l'élève a inversé l'ordre des nombres
  const invertedResult = item.secondNumber - item.firstNumber;
  const hasInvertedOrder = Math.abs(formattedUserAnswer - invertedResult) < 0.1;

  if (hasInvertedOrder) {
    return {
      errorType: 'invertedOrder',
      feedback: "Attention à l'ordre : il faut soustraire le second nombre du premier, pas l'inverse"
    };
  }

  // Vérifier si l'erreur est liée à la gestion des emprunts
  const hasBorrowingError =
    Math.abs(formattedUserAnswer - correctAnswer) === 10 ||
    Math.abs(formattedUserAnswer - correctAnswer) === 1;

  if (hasBorrowingError) {
    return {
      errorType: 'borrowing',
      feedback: "N'oubliez pas de gérer les emprunts correctement dans la soustraction"
    };
  }

  // Vérifier si l'erreur est liée à l'alignement décimal (pour les nombres décimaux)
  if (typeof item.firstNumber === 'number' && (item.firstNumber % 1 !== 0 || item.secondNumber % 1 !== 0)) {
    const decimalAlignmentError =
      Math.abs(formattedUserAnswer - parseFloat((item.firstNumber - Math.floor(item.secondNumber)).toFixed(1))) < 0.1 ||
      Math.abs(formattedUserAnswer - parseFloat((Math.floor(item.firstNumber) - item.secondNumber).toFixed(1))) < 0.1;

    if (decimalAlignmentError) {
      return {
        errorType: 'decimalAlignment',
        feedback: "Assurez-vous d'aligner correctement les virgules avant de soustraire"
      };
    }
  }

  // Erreur par défaut si aucun pattern spécifique n'est détecté
  return {
    errorType: 'calculation',
    feedback: 'Ce n\'est pas la bonne réponse. Vérifiez votre calcul.'
  };
}