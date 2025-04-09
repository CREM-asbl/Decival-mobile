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
    // Pour les nombres décimaux, on utilise des types spécifiques comme dans l'ancienne version
    return generateDecimalMultiplicationItem();
  }
}

/**
 * Génère un item de multiplication avec nombres décimaux selon différents types
 * de cas d'utilisation, similaire à l'ancien Decival
 */
function generateDecimalMultiplicationItem(): MultiplicationItem {
  // Choisir un type d'item aléatoirement (0-4 comme dans l'ancien code)
  const type = Math.floor(Math.random() * 5);

  // Variables pour stocker les nombres générés
  let firstNumber: number;
  let secondNumber: number;
  let correctAnswer: number;
  let errorTypes: string[] = [];
  // Variable pour stocker la règle associée à l'item
  let rule: { id: string; name: string };

  switch (type) {
    case 0: // Multiplication simple de décimaux (0,5 × 0,2)
      firstNumber = (Math.floor(Math.random() * 9) + 1) / 10;
      secondNumber = (Math.floor(Math.random() * 9) + 1) / 10;
      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(2));
      errorTypes = ['powerOfTen', 'decimalProduct'];
      rule = {
        id: 'mult-dec-2',
        name: 'Multiplication de deux nombres décimaux'
      };
      break;

    case 1: // Multiplication par 10, 100 (3,7 × 10)
      firstNumber = Math.floor(Math.random() * 90 + 10) / 10;

      const factorChoice = Math.random() < 0.5 ? 10 : 100;
      secondNumber = factorChoice;

      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(factorChoice === 10 ? 0 : 0));
      errorTypes = ['powerOfTen'];
      rule = {
        id: 'mult-dec-7',
        name: 'Multiplication par 10, 100, 1000'
      };
      break;

    case 2: // Multiplication d'entier par décimal (3 × 0,7)
      if (Math.random() < 0.5) {
        firstNumber = Math.floor(Math.random() * 9) + 1;
        secondNumber = (Math.floor(Math.random() * 9) + 1) / 10;
      } else {
        secondNumber = Math.floor(Math.random() * 9) + 1;
        firstNumber = (Math.floor(Math.random() * 9) + 1) / 10;
      }
      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(1));
      errorTypes = ['powerOfTen', 'tableMultiplication'];
      rule = {
        id: 'mult-dec-3',
        name: 'Multiplication d\'un nombre entier par un nombre décimal'
      };
      break;

    case 3: // Multiplication de décimaux avec des précisions différentes (0,2 × 0,03)
      if (Math.random() < 0.5) {
        firstNumber = (Math.floor(Math.random() * 9) + 1) / 10;
        secondNumber = (Math.floor(Math.random() * 9) + 1) / 100;
      } else {
        secondNumber = (Math.floor(Math.random() * 9) + 1) / 10;
        firstNumber = (Math.floor(Math.random() * 9) + 1) / 100;
      }
      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(3));
      errorTypes = ['powerOfTen', 'decimalProduct', 'placeValue'];
      rule = {
        id: 'mult-dec-4',
        name: 'Multiplication avec précisions différentes'
      };
      break;

    case 4: // Multiplication de décimaux nécessitant une retenue (0,6 × 0,9)
      firstNumber = (Math.floor(Math.random() * 3) + 6) / 10; // 0,6 à 0,9
      secondNumber = (Math.floor(Math.random() * 3) + 7) / 10; // 0,7 à 0,9
      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(2));
      errorTypes = ['powerOfTen', 'carry', 'decimalProduct'];
      rule = {
        id: 'mult-dec-5',
        name: 'Multiplication de décimaux avec retenue'
      };
      break;

    default:
      // Cas par défaut (ne devrait jamais arriver)
      firstNumber = 0.5;
      secondNumber = 0.2;
      correctAnswer = 0.1;
      errorTypes = ['default'];
      rule = {
        id: 'mult-dec-1',
        name: 'Multiplication de nombres décimaux - Principes généraux'
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

export function createMultiplicationTest(numberOfItems: number = 10, mode: 'integer' | 'decimal' = 'integer'): MultiplicationTest {
  // Distribution proportionnelle des items pour couvrir tous les types d'erreurs
  if (mode === 'decimal') {
    // Assurer une distribution des différents types de problèmes
    return {
      id: nanoid(),
      type: 'multiplication',
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
    type: 'multiplication',
    mode,
    items: Array.from({ length: numberOfItems }, () => generateMultiplicationItem(mode)),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

/**
 * Génère une répartition équilibrée des différents types d'items décimaux
 */
function generateDistributedItems(count: number): MultiplicationItem[] {
  const items: MultiplicationItem[] = [];

  // Distribuer les types équitablement
  for (let i = 0; i < count; i++) {
    // Assure une répartition proportionnelle des 5 types
    const type = i % 5;

    // Force la génération d'un item du type spécifique
    let item = generateDecimalMultiplicationItem();
    // On regénère jusqu'à obtenir le bon type
    while (item.type !== type) {
      item = generateDecimalMultiplicationItem();
    }

    items.push(item);
  }

  return items;
}

export function checkAnswer(item: MultiplicationItem, answer: number): boolean {
  // Pour les nombres décimaux, comparer avec une précision appropriée
  if (typeof item.firstNumber === 'number' && (item.firstNumber % 1 !== 0 || item.secondNumber % 1 !== 0)) {
    // Déterminer la précision nécessaire selon le type
    let precision = 1;
    if (item.type === 2 || item.type === 3) {
      precision = 2;
    } else if (item.type === 4) {
      precision = 3;
    }

    const expectedAnswer = parseFloat((item.correctAnswer as number).toFixed(precision));
    const userAnswer = parseFloat(answer.toFixed(precision));
    return userAnswer === expectedAnswer;
  }

  // Pour les nombres entiers, comparaison simple
  return answer === item.correctAnswer;
}

/**
 * Analyse la réponse pour identifier les erreurs spécifiques
 */
export function analyzeError(item: MultiplicationItem, userAnswer: number): {
  errorType: string,
  feedback: string,
  rule?: {
    id: string,
    name: string
  }
} {
  // Si la réponse est correcte, pas d'erreur à analyser
  const precisionDecimal = item.type === 4 ? 3 : item.type === 2 || item.type === 3 ? 2 : 1;
  const correctAnswer = parseFloat((item.correctAnswer as number).toFixed(precisionDecimal));
  const formattedUserAnswer = parseFloat(userAnswer.toFixed(precisionDecimal));

  if (formattedUserAnswer === correctAnswer) {
    return { errorType: 'none', feedback: 'Réponse correcte' };
  }

  // Analyser les erreurs possibles selon le type d'exercice
  if (!item.errorTypes) {
    return {
      errorType: 'unknown',
      feedback: 'Vérifiez votre calcul',
      rule: item.rule || {
        id: 'mult-1',
        name: 'Tables de multiplication'
      }
    };
  }

  if (item.errorTypes.includes('powerOfTen')) {
    // Vérifier si l'erreur vient d'une confusion dans les puissances de dix
    const powerOfTenError =
      formattedUserAnswer === correctAnswer * 10 ||
      formattedUserAnswer === correctAnswer / 10 ||
      formattedUserAnswer === correctAnswer * 100 ||
      formattedUserAnswer === correctAnswer / 100;

    if (powerOfTenError) {
      return {
        errorType: 'powerOfTen',
        feedback: 'Attention à la position de la virgule dans votre réponse. Comptez bien le nombre de décimales.',
        rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
      };
    }
  }

  if (item.errorTypes.includes('decimalProduct')) {
    // Vérifier si l'erreur est due à une mauvaise multiplication des nombres
    const productError = Math.abs(
      formattedUserAnswer -
      (Math.floor(item.firstNumber) * Math.floor(item.secondNumber) +
        (item.firstNumber % 1) * (item.secondNumber % 1))
    ) < 0.1;

    if (productError) {
      return {
        errorType: 'decimalProduct',
        feedback: "Attention à la façon dont vous multipliez les décimales ensemble.",
        rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
      };
    }
  }

  // Vérifier si l'erreur provient d'une confusion dans les tables de multiplication
  const product = Math.round(item.firstNumber * 10) * Math.round(item.secondNumber * 10);
  const tableError = Math.abs(formattedUserAnswer * 100 - product) <= 10;

  if (tableError) {
    return {
      errorType: 'multiplicationTable',
      feedback: 'Révisez votre table de multiplication pour ces nombres.',
      rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
    };
  }

  // Pour toutes les autres erreurs, retourner la règle associée à l'item
  return {
    errorType: 'calculation',
    feedback: 'Ce n\'est pas la bonne réponse. Vérifiez votre calcul.',
    rule: item.rule || { // Fallback si la règle n'est pas définie
      id: item.firstNumber % 1 !== 0 || item.secondNumber % 1 !== 0
        ? 'mult-dec-1'
        : 'mult-1',
      name: item.firstNumber % 1 !== 0 || item.secondNumber % 1 !== 0
        ? 'Multiplication de nombres décimaux - Principes généraux'
        : 'Tables de multiplication'
    }
  };
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