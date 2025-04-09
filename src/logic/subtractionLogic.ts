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
    // Pour les nombres décimaux, on utilise des types spécifiques comme dans l'ancienne version
    return generateDecimalSubtractionItem();
  }
}

/**
 * Génère un item de soustraction avec nombres décimaux selon différents types
 * de cas d'utilisation, similaire à l'ancien Decival
 */
function generateDecimalSubtractionItem(): SubtractionItem {
  // Choisir un type d'item aléatoirement (0-6 comme dans l'ancien code)
  const type = Math.floor(Math.random() * 7);

  // Variables pour stocker les nombres générés
  let firstNumber: number;
  let secondNumber: number;
  let correctAnswer: number;
  let errorTypes: string[] = [];
  // Variable pour stocker la règle associée à l'item
  let rule: { id: string; name: string };

  switch (type) {
    case 0: // Soustraction de dixièmes sans emprunt
      secondNumber = (Math.floor(Math.random() * 8) + 1) / 10; // 0,1 à 0,8
      firstNumber = ((Math.floor(Math.random() * (9 - Math.floor(secondNumber * 10))) + Math.floor(secondNumber * 10) + 1) / 10) + Math.floor(secondNumber);
      correctAnswer = parseFloat((firstNumber - secondNumber).toFixed(1));
      errorTypes = ['decimalAlignment', 'simpleSubtraction'];
      rule = {
        id: 'sub-dec-2',
        name: 'Soustraction de dixièmes sans emprunt'
      };
      break;

    case 1: // Soustraction de centièmes sans emprunt
      secondNumber = (Math.floor(Math.random() * 8) + 1) / 100; // 0,01 à 0,08
      firstNumber = ((Math.floor(Math.random() * (9 - Math.floor(secondNumber * 100))) + Math.floor(secondNumber * 100) + 1) / 100) + Math.floor(secondNumber);
      correctAnswer = parseFloat((firstNumber - secondNumber).toFixed(2));
      errorTypes = ['decimalAlignment', 'zeroPlacement'];
      rule = {
        id: 'sub-dec-3',
        name: 'Soustraction de centièmes sans emprunt'
      };
      break;

    case 2: // Soustraction avec précisions différentes
      secondNumber = (Math.floor(Math.random() * 9) + 1) / 100; // 0,01 à 0,09
      firstNumber = (Math.floor(Math.random() * 9) + 1) / 10; // 0,1 à 0,9
      correctAnswer = parseFloat((firstNumber - secondNumber).toFixed(2));
      errorTypes = ['decimalAlignment', 'differentPrecisions'];
      rule = {
        id: 'sub-dec-4',
        name: 'Soustraction avec précisions différentes'
      };
      break;

    case 3: // Soustraction de dixièmes avec emprunt
      secondNumber = (Math.floor(Math.random() * 9) + 1) / 10; // 0,1 à 0,9
      firstNumber = ((Math.floor(Math.random() * Math.floor(secondNumber * 10))) / 10) + Math.ceil(secondNumber);
      correctAnswer = parseFloat((firstNumber - secondNumber).toFixed(1));
      errorTypes = ['borrowing', 'decimalSubtraction'];
      rule = {
        id: 'sub-dec-5',
        name: 'Soustraction de dixièmes avec emprunt'
      };
      break;

    case 4: // Soustraction de centièmes avec emprunt
      secondNumber = (Math.floor(Math.random() * 9) + 1) / 100; // 0,01 à 0,09
      firstNumber = ((Math.floor(Math.random() * Math.floor(secondNumber * 100)) / 100) + Math.ceil(secondNumber * 10) / 10);
      correctAnswer = parseFloat((firstNumber - secondNumber).toFixed(2));
      errorTypes = ['borrowing', 'zeroPlacement'];
      rule = {
        id: 'sub-dec-6',
        name: 'Soustraction de centièmes avec emprunt'
      };
      break;

    case 5: // Soustraction de nombres mixtes (0,27 - 0,09)
      firstNumber = (Math.floor(Math.random() * 9) + 1) / 10 + (Math.floor(Math.random() * 9) + 1) / 100; // 0,11 à 0,99
      secondNumber = (Math.floor(Math.random() * Math.floor(firstNumber * 100)) / 100);
      correctAnswer = parseFloat((firstNumber - secondNumber).toFixed(2));
      errorTypes = ['borrowing', 'zeroPlacement', 'differentPrecisions'];
      rule = {
        id: 'sub-dec-7',
        name: 'Soustraction de nombres mixtes'
      };
      break;

    case 6: // Soustraction d'entier et décimal (5 - 0,7)
      firstNumber = Math.floor(Math.random() * 9) + 1; // 1 à 9
      secondNumber = (Math.floor(Math.random() * 9) + 1) / 10; // 0,1 à 0,9
      correctAnswer = parseFloat((firstNumber - secondNumber).toFixed(1));
      errorTypes = ['integerDecimalMix', 'borrowing'];
      rule = {
        id: 'sub-dec-1',
        name: 'Soustraction de nombres décimaux - Principes généraux'
      };
      break;

    default:
      firstNumber = 0.8;
      secondNumber = 0.3;
      correctAnswer = 0.5;
      errorTypes = ['default'];
      rule = {
        id: 'sub-dec-1',
        name: 'Soustraction de nombres décimaux - Principes généraux'
      };
  }

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    correctAnswer,
    type: type,
    errorTypes,
    rule // Associer directement la règle à l'item
  };
}

export function createSubtractionTest(numberOfItems: number = 10, mode: 'integer' | 'decimal' = 'integer'): SubtractionTest {
  // Distribution proportionnelle des items pour couvrir tous les types d'erreurs
  if (mode === 'decimal') {
    // Assurer une distribution des différents types de problèmes
    return {
      id: nanoid(),
      type: 'subtraction',
      mode,
      items: generateDistributedItems(numberOfItems),
      currentItemIndex: 0,
      startTime: new Date(),
      status: 'not_started'
    };
  }

  // Pour les entiers, comportement inchangé
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

/**
 * Génère une répartition équilibrée des différents types d'items décimaux
 */
function generateDistributedItems(count: number): SubtractionItem[] {
  const items: SubtractionItem[] = [];

  // Distribuer les types équitablement
  for (let i = 0; i < count; i++) {
    // Assure une répartition proportionnelle des 7 types
    const type = i % 7;

    // Force la génération d'un item du type spécifique
    let item = generateDecimalSubtractionItem();
    // On regénère jusqu'à obtenir le bon type
    while (item.type !== type) {
      item = generateDecimalSubtractionItem();
    }

    items.push(item);
  }

  return items;
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
  feedback: string,
  rule?: {
    id: string,
    name: string
  }
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

  // Analyser les erreurs spécifiques pour fournir un feedback précis

  // Vérifier si l'élève a inversé l'ordre des nombres
  const invertedResult = item.secondNumber - item.firstNumber;
  const hasInvertedOrder = Math.abs(formattedUserAnswer - invertedResult) < 0.1;
  if (hasInvertedOrder) {
    return {
      errorType: 'invertedOrder',
      feedback: "Attention à l'ordre : il faut soustraire le second nombre du premier, pas l'inverse",
      rule: item.rule || {
        id: 'sub-1',
        name: 'Soustraction simple'
      }
    };
  }

  // Vérifier si l'erreur est liée à la gestion des emprunts
  const hasBorrowingError =
    Math.abs(formattedUserAnswer - correctAnswer) === 10 ||
    Math.abs(formattedUserAnswer - correctAnswer) === 1;
  if (hasBorrowingError) {
    return {
      errorType: 'borrowing',
      feedback: "N'oubliez pas de gérer les emprunts correctement dans la soustraction",
      rule: item.rule || {
        id: 'sub-2',
        name: 'Soustraction avec emprunt'
      }
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
        feedback: "Assurez-vous d'aligner correctement les virgules avant de soustraire",
        rule: item.rule || {
          id: 'sub-dec-4',
          name: 'Soustraction avec précisions différentes'
        }
      };
    }
  }

  // Pour toutes les autres erreurs, retourner la règle associée à l'item
  return {
    errorType: 'calculation',
    feedback: 'Ce n\'est pas la bonne réponse. Vérifiez votre calcul.',
    rule: item.rule || { // Fallback si la règle n'est pas définie
      id: item.firstNumber % 1 !== 0 || item.secondNumber % 1 !== 0
        ? 'sub-dec-1'
        : 'sub-1',
      name: item.firstNumber % 1 !== 0 || item.secondNumber % 1 !== 0
        ? 'Soustraction de nombres décimaux - Principes généraux'
        : 'Soustraction simple'
    }
  };
}