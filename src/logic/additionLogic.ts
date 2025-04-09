import { nanoid } from 'nanoid';
import { type AdditionItem, type AdditionTest } from '../types/addition';

export function generateAdditionItem(mode: 'integer' | 'decimal' = 'integer'): AdditionItem {
  if (mode === 'integer') {
    // Générer des nombres entiers comme avant
    const firstNumber = Math.floor(Math.random() * 100);
    const secondNumber = Math.floor(Math.random() * 100);

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: firstNumber + secondNumber
    };
  } else {
    // Pour les nombres décimaux, on utilise des types spécifiques comme dans l'ancienne version
    return generateDecimalAdditionItem();
  }
}

/**
 * Génère un item d'addition avec nombres décimaux selon différents types
 * de cas d'utilisation, similaire à l'ancienne version
 */
function generateDecimalAdditionItem(): AdditionItem {
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
    case 0: // 0,2 + 0,3 (Somme de dizaines sans retenue)
      const n1 = Math.floor(Math.random() * 8) + 1;
      const n2 = Math.floor(Math.random() * (9 - n1)) + 1; // Éviter les retenues

      firstNumber = n1 / 10;
      secondNumber = n2 / 10;
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(1));
      errorTypes = ['powerOfTen', 'decimalSum'];
      rule = {
        id: 'add-dec-2',
        name: 'Addition de dixièmes sans retenue'
      };
      break;

    case 1: // 0,02 + 0,03 (Somme de centièmes sans retenue)
      const n1b = Math.floor(Math.random() * 8) + 1;
      const n2b = Math.floor(Math.random() * (9 - n1b)) + 1;

      firstNumber = n1b / 100;
      secondNumber = n2b / 100;
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(2));
      errorTypes = ['powerOfTen', 'zeroPlacement', 'decimalSum'];
      rule = {
        id: 'add-dec-3',
        name: 'Addition de centièmes sans retenue'
      };
      break;

    case 2: // 0,2 + 0,04 (Somme de nombres avec des précisions différentes)
      const n1c = Math.floor(Math.random() * 8) + 1;
      const n2c = Math.floor(Math.random() * (9 - n1c)) + 1;

      if (Math.random() < 0.5) {
        firstNumber = n1c / 10;
        secondNumber = n2c / 100;
      } else {
        firstNumber = n1c / 100;
        secondNumber = n2c / 10;
      }
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(2));
      errorTypes = ['decimalAlignment', 'powerOfTen'];
      rule = {
        id: 'add-dec-4',
        name: 'Addition avec précisions différentes'
      };
      break;

    case 3: // 0,5 + 0,8 (Somme avec retenue)
      const n1d = Math.floor(Math.random() * 8) + 2;
      let n2d;
      do {
        n2d = Math.floor(Math.random() * 9) + 1;
      } while (n1d + n2d < 10);

      firstNumber = n1d / 10;
      secondNumber = n2d / 10;
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(1));
      errorTypes = ['carry', 'decimalSum'];
      rule = {
        id: 'add-dec-5',
        name: 'Addition de dixièmes avec retenue'
      };
      break;

    case 4: // 0,05 + 0,08 (Somme de centièmes avec retenue)
      const n1e = Math.floor(Math.random() * 8) + 2;
      let n2e;
      do {
        n2e = Math.floor(Math.random() * 9) + 1;
      } while (n1e + n2e < 10);

      firstNumber = n1e / 100;
      secondNumber = n2e / 100;
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(2));
      errorTypes = ['carry', 'zeroPlacement', 'decimalSum'];
      rule = {
        id: 'add-dec-6',
        name: 'Addition de centièmes avec retenue'
      };
      break;

    case 5: // 0,1 + 0,77 (Addition avec nombre à plusieurs décimales)
      const n1f = Math.floor(Math.random() * 8) + 1;
      let n2f;
      if (n1f < 8) {
        const x = Math.floor(Math.random() * (9 - n1f)) + 1;
        const y = Math.floor(Math.random() * (9 - n1f)) + 1;
        n2f = x * 10 + y;
      } else {
        n2f = 11;
      }

      if (Math.random() < 0.5) {
        firstNumber = n1f / 10;
        secondNumber = n2f / 100;
      } else {
        firstNumber = n2f / 100;
        secondNumber = n1f / 10;
      }
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(2));
      errorTypes = ['decimalAlignment', 'multipleDecimals'];
      rule = {
        id: 'add-dec-4',
        name: 'Addition avec précisions différentes'
      };
      break;

    case 6: // 6 + 0,1 (Addition d'entier et décimal)
      const n1g = Math.floor(Math.random() * 9) + 1;
      const n2g = Math.floor(Math.random() * 9) + 1;

      if (Math.random() < 0.5) {
        firstNumber = n1g;
        secondNumber = n2g / 10;
      } else {
        firstNumber = n2g / 10;
        secondNumber = n1g;
      }
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(1));
      errorTypes = ['integerDecimalMix', 'decimalAlignment'];
      rule = {
        id: 'add-dec-1',
        name: 'Addition de nombres décimaux - Principes généraux'
      };
      break;

    default:
      // Cas par défaut (ne devrait jamais arriver)
      firstNumber = 0.5;
      secondNumber = 0.3;
      correctAnswer = 0.8;
      errorTypes = ['default'];
      rule = {
        id: 'add-dec-1',
        name: 'Addition de nombres décimaux - Principes généraux'
      };
  }

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    correctAnswer,
    type: type,
    errorTypes, // Stocke les types d'erreurs possibles pour ce problème
    rule // Associer directement la règle à l'item
  };
}

export function createAdditionTest(numberOfItems: number = 10, mode: 'integer' | 'decimal' = 'integer'): AdditionTest {
  // Distribution proportionnelle des items pour couvrir tous les types d'erreurs
  if (mode === 'decimal') {
    // Assurer une distribution des différents types de problèmes
    return {
      id: nanoid(),
      type: 'addition',
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
    type: 'addition',
    mode,
    items: Array.from({ length: numberOfItems }, () => generateAdditionItem(mode)),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

/**
 * Génère une répartition équilibrée des différents types d'items décimaux
 */
function generateDistributedItems(count: number): AdditionItem[] {
  const items: AdditionItem[] = [];

  // Distribuer les types équitablement
  for (let i = 0; i < count; i++) {
    // Assure une répartition proportionnelle des 7 types
    const type = i % 7;

    // Force la génération d'un item du type spécifique
    let item = generateDecimalAdditionItem();
    // On regénère jusqu'à obtenir le bon type
    while (item.type !== type) {
      item = generateDecimalAdditionItem();
    }

    items.push(item);
  }

  return items;
}

export function checkAnswer(item: AdditionItem, answer: number): boolean {
  // Pour les nombres décimaux, comparer avec une précision appropriée
  if (typeof item.firstNumber === 'number' && item.firstNumber % 1 !== 0) {
    // Déterminer la précision nécessaire (1 ou 2 décimales selon le type)
    const precision = item.type === 0 || item.type === 3 || item.type === 6 ? 1 : 2;
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
export function analyzeError(item: AdditionItem, userAnswer: number): {
  errorType: string,
  feedback: string,
  rule?: {
    id: string,
    name: string
  }
} {
  // Convertir les nombres pour comparaison
  const correctAnswer = parseFloat((item.correctAnswer as number).toFixed(2));
  const formattedUserAnswer = parseFloat(userAnswer.toFixed(2));

  // Si la réponse est correcte, pas d'erreur à analyser
  if (formattedUserAnswer === correctAnswer) {
    return { errorType: 'none', feedback: 'Réponse correcte' };
  }

  // Analyser les erreurs possibles selon le type d'exercice
  if (!item.errorTypes) {
    return {
      errorType: 'unknown',
      feedback: 'Vérifiez votre calcul',
      rule: item.rule || {
        id: 'add-1',
        name: 'Addition simple'
      }
    };
  }

  // Détecter les erreurs spécifiques pour fournir un feedback précis
  if (item.errorTypes.includes('powerOfTen')) {
    const powerOfTenError =
      formattedUserAnswer === correctAnswer * 10 ||
      formattedUserAnswer === correctAnswer / 10;

    if (powerOfTenError) {
      return {
        errorType: 'powerOfTen',
        feedback: 'Attention à la position de la virgule dans votre réponse',
        rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
      };
    }
  }

  if (item.errorTypes.includes('carry')) {
    const carryError = Math.abs(formattedUserAnswer - correctAnswer) === 1;

    if (carryError) {
      return {
        errorType: 'carry',
        feedback: "N'oubliez pas la retenue lors de l'addition des décimales",
        rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
      };
    }
  }

  if (item.errorTypes.includes('decimalAlignment')) {
    const decimal1 = countDecimals(item.firstNumber);
    const decimal2 = countDecimals(item.secondNumber);

    if (decimal1 !== decimal2) {
      const misalignment = Math.abs(
        formattedUserAnswer - (
          parseFloat((item.firstNumber + item.secondNumber).toFixed(Math.max(decimal1, decimal2)))
        )
      ) < 0.1;

      if (misalignment) {
        return {
          errorType: 'decimalAlignment',
          feedback: 'Alignez les virgules des nombres avant d\'additionner',
          rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
        };
      }
    }
  }

  // Pour toutes les autres erreurs, retourner la règle associée à l'item
  return {
    errorType: 'calculation',
    feedback: 'Ce n\'est pas la bonne réponse. Vérifiez votre calcul.',
    rule: item.rule || { // Fallback si la règle n'est pas définie pour une raison quelconque
      id: item.firstNumber % 1 !== 0 || item.secondNumber % 1 !== 0
        ? 'add-dec-1'
        : 'add-1',
      name: item.firstNumber % 1 !== 0 || item.secondNumber % 1 !== 0
        ? 'Addition de nombres décimaux - Principes généraux'
        : 'Addition simple'
    }
  };
}

/**
 * Compte le nombre de décimales dans un nombre
 */
function countDecimals(num: number): number {
  if (Math.floor(num) === num) return 0;
  return num.toString().split('.')[1].length || 0;
}

/**
 * Vérifie si une addition entre deux nombres nécessite une retenue
 * @param num1 Premier nombre de l'addition
 * @param num2 Deuxième nombre de l'addition
 * @returns true s'il y a au moins une retenue dans l'opération, false sinon
 */
function checkForCarry(num1: number, num2: number): boolean {
  // Pour les nombres décimaux, on vérifie la retenue en fonction du nombre de décimales
  const decimals1 = countDecimals(num1);
  const decimals2 = countDecimals(num2);

  // Obtenir les parties fractionnaires en tant que nombres entiers
  const maxDecimals = Math.max(decimals1, decimals2);
  const factor = Math.pow(10, maxDecimals);

  const fractionalPart1 = Math.round((num1 % 1) * factor);
  const fractionalPart2 = Math.round((num2 % 1) * factor);

  // Vérifier si l'addition des parties fractionnaires génère une retenue
  return (fractionalPart1 + fractionalPart2) >= factor;
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