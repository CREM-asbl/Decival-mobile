import { nanoid } from 'nanoid';
import { type ComparisonItem, type ComparisonTest } from '../types/comparison';

export function generateComparisonItem(mode: 'integer' | 'decimal' = 'integer'): ComparisonItem {
  if (mode === 'integer') {
    // Générer deux nombres entiers différents pour la comparaison
    let firstNumber = Math.floor(Math.random() * 100);
    let secondNumber;

    do {
      secondNumber = Math.floor(Math.random() * 100);
    } while (secondNumber === firstNumber);

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: firstNumber > secondNumber ? '>' :
        firstNumber < secondNumber ? '<' : '='
    };
  } else {
    // Pour les nombres décimaux, on utilise des types spécifiques comme dans l'ancienne version
    return generateDecimalComparisonItem();
  }
}

/**
 * Génère un item de comparaison avec nombres décimaux selon différents types
 * de cas d'utilisation, similaire à l'ancien Decival
 */
function generateDecimalComparisonItem(): ComparisonItem {
  // Choisir un type d'item aléatoirement (0-6 comme dans l'ancien code)
  const type = Math.floor(Math.random() * 7);

  // Variables pour stocker les nombres générés
  let firstNumber: number;
  let secondNumber: number;
  let correctAnswer: string;
  let errorTypes: string[] = [];

  switch (type) {
    case 0: // 0,1 vs 0,3 (Comparaison simple de dixièmes)
      const n1 = Math.floor(Math.random() * 9) + 1;
      let n2 = Math.floor(Math.random() * 9) + 1;

      // Éviter les nombres identiques
      while (n2 === n1) {
        n2 = Math.floor(Math.random() * 9) + 1;
      }

      firstNumber = n1 / 10;
      secondNumber = n2 / 10;
      correctAnswer = firstNumber > secondNumber ? '>' :
        firstNumber < secondNumber ? '<' : '=';

      errorTypes = ['simpleComparison', 'decimal'];
      break;

    case 1: // 0,1 vs 0,20 (Comparaison avec zéros non significatifs)
      let n1b = Math.floor(Math.random() * 9) + 1;
      let n2b = Math.floor(Math.random() * 9) + 1;

      // Éviter les nombres identiques
      while (n2b === n1b) {
        n2b = Math.floor(Math.random() * 9) + 1;
      }

      // S'assurer que n2b > n1b
      if (n2b < n1b) {
        const tmp = n1b;
        n1b = n2b;
        n2b = tmp;
      }

      if (Math.random() < 0.5) {
        // 0,n2b0 vs 0,n1b (où n2b0 > n1b)
        firstNumber = n2b / 10 + 0 / 100; // 0,n2b0
        secondNumber = n1b / 10; // 0,n1b
        correctAnswer = '>';
      } else {
        // 0,n1b vs 0,n2b0 (où n2b0 > n1b)
        firstNumber = n1b / 10; // 0,n1b
        secondNumber = n2b / 10 + 0 / 100; // 0,n2b0
        correctAnswer = '<';
      }

      errorTypes = ['zeroComparison', 'decimalLength'];
      break;

    case 2: // 0,1 vs 0,01 (Comparaison entre dixième et centième, même chiffre)
      const n = Math.floor(Math.random() * 9) + 1;

      if (Math.random() < 0.5) {
        firstNumber = n / 10; // 0,n
        secondNumber = n / 100; // 0,0n
        correctAnswer = '>';
      } else {
        firstNumber = n / 100; // 0,0n
        secondNumber = n / 10; // 0,n
        correctAnswer = '<';
      }

      errorTypes = ['placeValue', 'decimalPlacement'];
      break;

    case 3: // 0,2 vs 0,01 (Comparaison entre dixième et centième, différents chiffres)
      let n1d = Math.floor(Math.random() * 9) + 1;
      let n2d = Math.floor(Math.random() * 9) + 1;

      // Éviter les nombres identiques
      while (n2d === n1d) {
        n2d = Math.floor(Math.random() * 9) + 1;
      }

      // S'assurer que n2d < n1d
      if (n2d > n1d) {
        const tmp = n1d;
        n1d = n2d;
        n2d = tmp;
      }

      if (Math.random() < 0.5) {
        firstNumber = n2d / 100; // 0,0n2d
        secondNumber = n1d / 10; // 0,n1d
        correctAnswer = '<';
      } else {
        firstNumber = n1d / 10; // 0,n1d
        secondNumber = n2d / 100; // 0,0n2d
        correctAnswer = '>';
      }

      errorTypes = ['placeValue', 'decimalPlacement', 'differentDigits'];
      break;

    case 4: // 0,1 vs 0,02 (Comparaison entre dixième et centième, confusion possible)
      let n1e = Math.floor(Math.random() * 9) + 1;
      let n2e = Math.floor(Math.random() * 9) + 1;

      // Éviter les nombres identiques
      while (n2e === n1e) {
        n2e = Math.floor(Math.random() * 9) + 1;
      }

      // S'assurer que n2e < n1e
      if (n2e > n1e) {
        const tmp = n1e;
        n1e = n2e;
        n2e = tmp;
      }

      if (Math.random() < 0.5) {
        firstNumber = n1e / 10; // 0,n1e
        secondNumber = n2e / 100; // 0,0n2e
        correctAnswer = '>';
      } else {
        firstNumber = n2e / 100; // 0,0n2e
        secondNumber = n1e / 10; // 0,n1e
        correctAnswer = '<';
      }

      errorTypes = ['placeValue', 'decimalPlacement', 'confusionPossible'];
      break;

    case 5: // 0,2 vs 0,10 (Comparaison avec zéro à droite et différents chiffres)
      let n1f = Math.floor(Math.random() * 9) + 1;
      let n2f = Math.floor(Math.random() * 9) + 1;

      // Éviter les nombres identiques
      while (n2f === n1f) {
        n2f = Math.floor(Math.random() * 9) + 1;
      }

      // S'assurer que n2f < n1f
      if (n2f > n1f) {
        const tmp = n1f;
        n1f = n2f;
        n2f = tmp;
      }

      if (Math.random() < 0.5) {
        firstNumber = n1f / 10; // 0,n1f
        secondNumber = n2f / 10 + 0 / 100; // 0,n2f0
        correctAnswer = '>';
      } else {
        firstNumber = n2f / 10 + 0 / 100; // 0,n2f0
        secondNumber = n1f / 10; // 0,n1f
        correctAnswer = '<';
      }

      errorTypes = ['zeroAtRight', 'decimalLength', 'differentDigits'];
      break;

    case 6: // 0,1 vs 0,10 (Comparaison avec zéro à droite, même valeur)
      const nf = Math.floor(Math.random() * 9) + 1;

      if (Math.random() < 0.5) {
        firstNumber = nf / 10; // 0,nf
        secondNumber = nf / 10 + 0 / 100; // 0,nf0
      } else {
        firstNumber = nf / 10 + 0 / 100; // 0,nf0
        secondNumber = nf / 10; // 0,nf
      }
      correctAnswer = '=';

      errorTypes = ['equality', 'zeroAtRight', 'sameValue'];
      break;

    default:
      // Cas par défaut (ne devrait jamais arriver)
      firstNumber = 0.5;
      secondNumber = 0.3;
      correctAnswer = '>';
      errorTypes = ['default'];
  }

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    correctAnswer,
    type: type,
    errorTypes
  };
}

export function createComparisonTest(numberOfItems: number = 10, mode: 'integer' | 'decimal' = 'integer'): ComparisonTest {
  // Distribution proportionnelle des items pour couvrir tous les types d'erreurs
  if (mode === 'decimal') {
    // Assurer une distribution des différents types de problèmes
    return {
      id: nanoid(),
      type: 'comparison',
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
    type: 'comparison',
    mode,
    items: Array.from({ length: numberOfItems }, () => generateComparisonItem(mode)),
    currentItemIndex: 0,
    startTime: new Date(),
    status: 'not_started'
  };
}

/**
 * Génère une répartition équilibrée des différents types d'items décimaux
 */
function generateDistributedItems(count: number): ComparisonItem[] {
  const items: ComparisonItem[] = [];

  // Distribuer les types équitablement
  for (let i = 0; i < count; i++) {
    // Assure une répartition proportionnelle des 7 types
    const type = i % 7;

    // Force la génération d'un item du type spécifique
    let item = generateDecimalComparisonItem();
    // On regénère jusqu'à obtenir le bon type
    while (item.type !== type) {
      item = generateDecimalComparisonItem();
    }

    items.push(item);
  }

  return items;
}

export function checkAnswer(item: ComparisonItem, answer: string): boolean {
  // Vérifier que la réponse est l'un des symboles valides
  if (!['<', '=', '>'].includes(answer)) {
    return false;
  }
  return answer === item.correctAnswer;
}

/**
 * Analyse la réponse pour identifier les erreurs spécifiques
 */
export function analyzeError(item: ComparisonItem, userAnswer: string): {
  errorType: string,
  feedback: string
} {
  // Si la réponse est correcte, pas d'erreur à analyser
  if (userAnswer === item.correctAnswer) {
    return { errorType: 'none', feedback: 'Réponse correcte' };
  }

  // Analyser les erreurs possibles selon le type d'exercice
  if (!item.errorTypes) {
    return { errorType: 'unknown', feedback: 'Vérifiez votre comparaison' };
  }

  // Cas spécial : confusion entre < et >
  if ((userAnswer === '<' && item.correctAnswer === '>') ||
    (userAnswer === '>' && item.correctAnswer === '<')) {
    return {
      errorType: 'inversedSymbols',
      feedback: "Attention au sens du symbole : < signifie 'plus petit que' et > signifie 'plus grand que'"
    };
  }

  // Erreur liée à l'égalité (particulièrement pour le type 6)
  if (item.type === 6) {
    if (userAnswer !== '=') {
      return {
        errorType: 'ignoreZeroAtRight',
        feedback: "Attention : un zéro à droite après la virgule ne change pas la valeur du nombre"
      };
    }
  }

  // Erreur liée à la position de la virgule (types 2, 3 ou 4)
  if (item.errorTypes.includes('placeValue') || item.errorTypes.includes('decimalPlacement')) {
    return {
      errorType: 'decimalPosition',
      feedback: "Attention à la position des chiffres après la virgule : 0,1 est plus grand que 0,01"
    };
  }

  // Erreur liée aux zéros à droite (type 1 ou 5)
  if (item.errorTypes.includes('zeroComparison') || item.errorTypes.includes('zeroAtRight')) {
    if (userAnswer === '=') {
      return {
        errorType: 'misunderstoodZero',
        feedback: "Les zéros à la fin d'un nombre décimal ne changent pas sa valeur, mais ceux entre la virgule et les autres chiffres sont importants"
      };
    }
  }

  // Erreur par défaut si aucun pattern spécifique n'est détecté
  return {
    errorType: 'comparison',
    feedback: 'Ce n\'est pas la bonne réponse. Comparez attentivement les nombres décimaux.'
  };
}

export function evaluateTest(test: ComparisonTest): {
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