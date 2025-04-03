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

  // Génère aussi aléatoirement l'ordre des nombres (entier × décimal ou décimal × entier)
  const way = Math.random() < 0.5;

  // Variables pour stocker les nombres générés
  let firstNumber: number;
  let secondNumber: number;
  let correctAnswer: number;
  let errorTypes: string[] = [];

  switch (type) {
    case 0: // 3 * 0,3 (Produit sans changement de position de virgule)
      const n1 = Math.floor(Math.random() * 3) + 2; // 2-4
      let n2 = Math.floor(Math.random() * 3) + 2;   // 2-4

      // S'assurer que n1 * n2 < 10 (pas de retenue)
      while (n1 * n2 >= 10) {
        n2 = Math.floor(Math.random() * 3) + 2;
      }

      if (way) {
        firstNumber = n1;
        secondNumber = n2 / 10;
      } else {
        firstNumber = n1 / 10;
        secondNumber = n2;
      }

      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(1));
      errorTypes = ['powerOfTen', 'decimalProduct'];
      break;

    case 1: // 6 * 0,7 (Produit avec changement de position de virgule)
      const n1b = Math.floor(Math.random() * 8) + 2; // 2-9
      let n2b = Math.floor(Math.random() * 8) + 2;   // 2-9

      // S'assurer que n1 * n2 >= 10 (avec retenue)
      while (n1b * n2b < 10) {
        n2b = Math.floor(Math.random() * 8) + 2;
      }

      if (way) {
        firstNumber = n1b;
        secondNumber = n2b / 10;
      } else {
        firstNumber = n1b / 10;
        secondNumber = n2b;
      }

      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(1));
      errorTypes = ['decimalPlacement', 'carry'];
      break;

    case 2: // 0,2 * 0,3 (Multiplication de deux décimaux)
      const n1c = Math.floor(Math.random() * 3) + 2; // 2-4
      let n2c = Math.floor(Math.random() * 3) + 2;   // 2-4

      // S'assurer que n1 * n2 < 10 (pas de retenue)
      while (n1c * n2c >= 10) {
        n2c = Math.floor(Math.random() * 3) + 2;
      }

      firstNumber = n1c / 10;
      secondNumber = n2c / 10;

      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(2));
      errorTypes = ['multipleDecimals', 'powerOfTen'];
      break;

    case 3: // 0,5 * 0,8 (Multiplication de deux décimaux avec retenue)
      const n1d = Math.floor(Math.random() * 8) + 2; // 2-9
      let n2d = Math.floor(Math.random() * 8) + 2;   // 2-9

      // S'assurer que n1 * n2 >= 10 (avec retenue)
      while (n1d * n2d < 10) {
        n2d = Math.floor(Math.random() * 8) + 2;
      }

      firstNumber = n1d / 10;
      secondNumber = n2d / 10;

      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(2));
      errorTypes = ['multipleDecimals', 'decimalPlacement', 'carry'];
      break;

    case 4: // 0,5 * 0,03 (Multiplication avec différentes précisions)
      const n1e = Math.floor(Math.random() * 8) + 2; // 2-9
      let n2e = Math.floor(Math.random() * 8) + 2;   // 2-9

      // S'assurer que n1 * n2 >= 10 (avec retenue)
      while (n1e * n2e < 10) {
        n2e = Math.floor(Math.random() * 8) + 2;
      }

      if (way) {
        firstNumber = n1e / 10;
        secondNumber = n2e / 100;
      } else {
        firstNumber = n1e / 100;
        secondNumber = n2e / 10;
      }

      correctAnswer = parseFloat((firstNumber * secondNumber).toFixed(3));
      errorTypes = ['differentPrecisions', 'decimalAlignment'];
      break;

    default:
      // Cas par défaut (ne devrait jamais arriver)
      firstNumber = 0.5;
      secondNumber = 2;
      correctAnswer = 1.0;
      errorTypes = ['default'];
  }

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    correctAnswer,
    type: type,
    errorTypes // Stocke les types d'erreurs possibles pour ce problème
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
  feedback: string
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
    return { errorType: 'unknown', feedback: 'Vérifiez votre calcul' };
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
        feedback: 'Attention à la position de la virgule dans votre réponse. Comptez bien le nombre de décimales.'
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
        feedback: "Attention à la façon dont vous multipliez les décimales ensemble."
      };
    }
  }

  // Vérifier si l'erreur provient d'une confusion dans les tables de multiplication
  const product = Math.round(item.firstNumber * 10) * Math.round(item.secondNumber * 10);
  const tableError = Math.abs(formattedUserAnswer * 100 - product) <= 10;

  if (tableError) {
    return {
      errorType: 'multiplicationTable',
      feedback: 'Révisez votre table de multiplication pour ces nombres.'
    };
  }

  // Erreur par défaut si aucun pattern spécifique n'est détecté
  return {
    errorType: 'calculation',
    feedback: 'Ce n\'est pas la bonne réponse. Vérifiez votre calcul.'
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