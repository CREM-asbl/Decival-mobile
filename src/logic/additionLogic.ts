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
 * de cas d'utilisation, similaire à l'ancien Decival
 */
function generateDecimalAdditionItem(): AdditionItem {
  // Choisir un type d'item aléatoirement (0-6 comme dans l'ancien code)
  const type = Math.floor(Math.random() * 7);

  // Variables pour stocker les nombres générés
  let firstNumber: number;
  let secondNumber: number;
  let correctAnswer: number;
  let errorTypes: string[] = [];

  switch (type) {
    case 0: // 0,2 + 0,3 (Somme de dizaines sans retenue)
      const n1 = Math.floor(Math.random() * 8) + 1;
      const n2 = Math.floor(Math.random() * (9 - n1)) + 1; // Éviter les retenues

      firstNumber = n1 / 10;
      secondNumber = n2 / 10;
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(1));
      errorTypes = ['powerOfTen', 'decimalSum'];
      break;

    case 1: // 0,02 + 0,03 (Somme de centièmes sans retenue)
      const n1b = Math.floor(Math.random() * 8) + 1;
      const n2b = Math.floor(Math.random() * (9 - n1b)) + 1;

      firstNumber = n1b / 100;
      secondNumber = n2b / 100;
      correctAnswer = parseFloat((firstNumber + secondNumber).toFixed(2));
      errorTypes = ['powerOfTen', 'zeroPlacement', 'decimalSum'];
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
      break;

    default:
      // Cas par défaut (ne devrait jamais arriver)
      firstNumber = 0.5;
      secondNumber = 0.3;
      correctAnswer = 0.8;
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
  feedback: string
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
    return { errorType: 'unknown', feedback: 'Vérifiez votre calcul' };
  }

  if (item.errorTypes.includes('powerOfTen')) {
    // Vérifier si l'erreur vient d'une confusion dans les puissances de dix
    const powerOfTenError =
      formattedUserAnswer === correctAnswer * 10 ||
      formattedUserAnswer === correctAnswer / 10;

    if (powerOfTenError) {
      return {
        errorType: 'powerOfTen',
        feedback: 'Attention à la position de la virgule dans votre réponse'
      };
    }
  }

  if (item.errorTypes.includes('carry')) {
    // Vérifier si l'élève a oublié la retenue
    const carryError = Math.abs(formattedUserAnswer - correctAnswer) === 1;

    if (carryError) {
      return {
        errorType: 'carry',
        feedback: "N'oubliez pas la retenue lors de l'addition des décimales"
      };
    }
  }

  if (item.errorTypes.includes('decimalAlignment')) {
    // Vérifier si les nombres n'ont pas été alignés correctement
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
          feedback: 'Alignez les virgules des nombres avant d\'additionner'
        };
      }
    }
  }

  // Erreur par défaut si aucun pattern spécifique n'est détecté
  return {
    errorType: 'calculation',
    feedback: 'Ce n\'est pas la bonne réponse. Vérifiez votre calcul.'
  };
}

/**
 * Compte le nombre de décimales dans un nombre
 */
function countDecimals(num: number): number {
  if (Math.floor(num) === num) return 0;
  return num.toString().split('.')[1].length || 0;
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