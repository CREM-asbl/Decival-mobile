import { nanoid } from 'nanoid';
import { type ComparisonItem, type ComparisonTest } from '../types/comparison';
import {
  DEFAULT_TEST_ITEMS,
  DECIMAL_COMPARISON_TYPES,
  INTEGER_RANGE
} from '../config/constants';

export function generateComparisonItem(mode: 'integer' | 'decimal' = 'integer'): ComparisonItem {
  if (mode === 'integer') {
    // Générer deux nombres entiers différents pour la comparaison
    let firstNumber = Math.floor(Math.random() * INTEGER_RANGE.comparison.max);
    let secondNumber;

    do {
      secondNumber = Math.floor(Math.random() * INTEGER_RANGE.comparison.max);
    } while (secondNumber === firstNumber);

    return {
      id: nanoid(),
      firstNumber,
      secondNumber,
      correctAnswer: firstNumber > secondNumber ? '>' :
        firstNumber < secondNumber ? '<' : '=',
      rule: {
        id: 'comp-1',
        name: 'Comparaison de nombres'
      }
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
function generateDecimalComparisonItem(forcedType?: number): ComparisonItem {
  // Choisir un type d'item aléatoirement si non forcé
  const type = forcedType !== undefined ? forcedType : Math.floor(Math.random() * DECIMAL_COMPARISON_TYPES);

  // Variables pour stocker les nombres générés
  let firstNumber: number;
  let secondNumber: number;
  let correctAnswer: string;
  let errorTypes: string[] = [];
  // Variable pour stocker la règle associée à l'item
  let rule: { id: string; name: string };

  // Nouveaux champs pour les chaînes d'affichage
  let firstNumberDisplay: string | undefined;
  let secondNumberDisplay: string | undefined;

  switch (type) {
    case 0: // 0,1 vs 0,3 (Comparaison simple de dixièmes)
      const n1 = Math.floor(Math.random() * 9) + 1;
      let n2 = Math.floor(Math.random() * 9) + 1;

      // Éviter les nombres identiques
      while (n2 === n1) {
        n2 = Math.floor(Math.random() * 9) + 1;
      }

      firstNumber = parseFloat((n1 / 10).toFixed(1));
      secondNumber = parseFloat((n2 / 10).toFixed(1));
      firstNumberDisplay = firstNumber.toLocaleString('fr-FR');
      secondNumberDisplay = secondNumber.toLocaleString('fr-FR');

      correctAnswer = firstNumber > secondNumber ? '>' :
        firstNumber < secondNumber ? '<' : '=';

      errorTypes = ['simpleComparison', 'decimal'];
      rule = {
        id: 'comp-dec-8',
        name: 'Comparaison simple de dixièmes'
      };
      break;

    case 1: // 0,1 vs 0,20 (Comparaison avec zéros non significatifs)
      let n1b = Math.floor(Math.random() * 9) + 1;
      let n2b = n1b; // Même chiffre pour vérifier l'égalité malgré les zéros à droite

      firstNumber = parseFloat((n1b / 10).toFixed(1));
      secondNumber = parseFloat((n2b / 10).toFixed(1)); // Pour forcer l'affichage comme 0,10

      firstNumberDisplay = (n1b / 10).toLocaleString('fr-FR');
      secondNumberDisplay = (n2b / 10).toLocaleString('fr-FR') + '0'; // Force le zéro à la fin

      correctAnswer = '='; // Toujours égaux

      errorTypes = ['zeroComparison', 'zeroAtRight'];
      rule = {
        id: 'comp-dec-9',
        name: 'Comparaison avec zéros non significatifs'
      };
      break;

    case 2: // 0,1 vs 0,01 (Comparaison dixième vs centième - même chiffre)
      const n1c = Math.floor(Math.random() * 9) + 1;
      const n2c = n1c; // Même chiffre

      firstNumber = parseFloat((n1c / 10).toFixed(1));
      secondNumber = parseFloat((n2c / 100).toFixed(2));
      firstNumberDisplay = firstNumber.toLocaleString('fr-FR');
      secondNumberDisplay = secondNumber.toLocaleString('fr-FR');

      correctAnswer = '>'; // Le dixième est toujours plus grand que le centième (pour un même chiffre)

      errorTypes = ['placeValue', 'decimalPlacement'];
      rule = {
        id: 'comp-dec-10',
        name: 'Comparaison dixième vs centième (même chiffre)'
      };
      break;

    case 3: // 0,2 vs 0,03 (Comparaison dixième vs centième - différents chiffres)
      const n1d = Math.floor(Math.random() * 8) + 2; // 2-9
      const n2d = Math.floor(Math.random() * (n1d - 1)) + 1; // 1 à (n1d-1)

      firstNumber = parseFloat((n1d / 10).toFixed(1));
      secondNumber = parseFloat((n2d / 100).toFixed(2));

      firstNumberDisplay = firstNumber.toLocaleString('fr-FR');
      secondNumberDisplay = secondNumber.toLocaleString('fr-FR');

      correctAnswer = '>'; // Le dixième est toujours plus grand

      errorTypes = ['placeValue', 'decimalPlacement', 'differentDigits'];
      rule = {
        id: 'comp-dec-11',
        name: 'Comparaison dixième vs centième (différents chiffres)'
      };
      break;

    case 4: // 0,13 vs 0,3 (Confusion possible)
      const n1e = Math.floor(Math.random() * 9) + 1; // 1-9
      const n2e = Math.floor(Math.random() * 9) + 1; // 1-9
      const n3e = Math.floor(Math.random() * 9) + 1; // 1-9

      firstNumber = parseFloat(((n1e / 10) + (n2e / 100)).toFixed(2));
      secondNumber = parseFloat((n3e / 10).toFixed(1));

      // Assurer un affichage propre (max 2 décimales)
      firstNumber = parseFloat(firstNumber.toFixed(2));
      firstNumberDisplay = firstNumber.toLocaleString('fr-FR');
      secondNumberDisplay = secondNumber.toLocaleString('fr-FR');

      // Déterminer la réponse correcte
      if (firstNumber > secondNumber) {
        correctAnswer = '>';
      } else if (firstNumber < secondNumber) {
        correctAnswer = '<';
      } else {
        correctAnswer = '=';
      }

      errorTypes = ['confusion', 'decimalLength'];
      rule = {
        id: 'comp-dec-12',
        name: 'Comparaison avec confusion possible'
      };
      break;

    case 5: // 0,10 vs 0,1 (Zéro à droite, même valeur)
      const n1f = Math.floor(Math.random() * 9) + 1;

      firstNumber = parseFloat((n1f / 10).toFixed(1));
      secondNumber = parseFloat((n1f / 10).toFixed(1)); // Même valeur

      firstNumberDisplay = (n1f / 10).toLocaleString('fr-FR') + '0';
      secondNumberDisplay = (n1f / 10).toLocaleString('fr-FR');

      correctAnswer = '=';

      errorTypes = ['zeroAtRight'];
      rule = {
        id: 'comp-dec-9',
        name: 'Comparaison avec zéros non significatifs'
      };
      break;

    case 6: // 0,10 vs 0,2 (Zéro à droite, valeurs différentes)
      const n1g = Math.floor(Math.random() * 9) + 1;
      let n2g = Math.floor(Math.random() * 9) + 1;

      // Éviter les nombres identiques
      while (n2g === n1g) {
        n2g = Math.floor(Math.random() * 9) + 1;
      }

      // Correction de la logique inverse et ajout de l'affichage
      if (Math.random() < 0.5) {
        // Premier nombre avec 0 à la fin, plus petit
        // Ex: 0.80 < 0.9
        firstNumber = parseFloat((n1g / 10).toFixed(1));
        secondNumber = parseFloat((n2g / 10).toFixed(1));

        firstNumberDisplay = firstNumber.toLocaleString('fr-FR') + '0';
        secondNumberDisplay = secondNumber.toLocaleString('fr-FR');

        correctAnswer = firstNumber < secondNumber ? '<' : '>';
      } else {
        // Premier nombre normal, Deuxième avec 0 à la fin
        // Ex: 0.9 > 0.80
        firstNumber = parseFloat((n1g / 10).toFixed(1));
        secondNumber = parseFloat((n2g / 10).toFixed(1));

        firstNumberDisplay = firstNumber.toLocaleString('fr-FR');
        secondNumberDisplay = secondNumber.toLocaleString('fr-FR') + '0';

        correctAnswer = firstNumber < secondNumber ? '<' : '>';
      }

      errorTypes = ['zeroAtRight', 'differentDigits'];
      rule = {
        id: 'comp-dec-13',
        name: 'Comparaison avec zéros à droite et valeurs différentes'
      };
      break;

    default:
      // Cas par défaut
      firstNumber = 0.1;
      secondNumber = 0.2;
      firstNumberDisplay = '0,1';
      secondNumberDisplay = '0,2';
      correctAnswer = '<';
      errorTypes = ['default'];
      rule = {
        id: 'comp-dec-1',
        name: 'Comparaison de nombres décimaux'
      };
  }

  return {
    id: nanoid(),
    firstNumber,
    secondNumber,
    firstNumberDisplay,
    secondNumberDisplay,
    correctAnswer,
    type: type,
    errorTypes,
    rule // Associer directement la règle à l'item
  };
}

export function createComparisonTest(numberOfItems: number = DEFAULT_TEST_ITEMS, mode: 'integer' | 'decimal' = 'integer'): ComparisonTest {
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
  const types = [0, 1, 2, 3, 4, 5, 6];

  // Mélanger les types
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }

  // Distribuer les items selon l'ordre aléatoire des types
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    items.push(generateDecimalComparisonItem(type));
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
  feedback: string,
  rule?: {
    id: string,
    name: string
  }
} {
  // Si la réponse est correcte, pas d'erreur à analyser
  if (userAnswer === item.correctAnswer) {
    return { errorType: 'none', feedback: 'Réponse correcte' };
  }

  // Analyser les erreurs possibles selon le type d'exercice
  if (!item.errorTypes) {
    return {
      errorType: 'unknown',
      feedback: 'Vérifiez votre comparaison',
      rule: item.rule || {
        id: 'comp-1',
        name: 'Comparaison de nombres'
      }
    };
  }

  // Cas spécial : confusion entre < et >
  if ((userAnswer === '<' && item.correctAnswer === '>') ||
    (userAnswer === '>' && item.correctAnswer === '<')) {
    return {
      errorType: 'inversedSymbols',
      feedback: "Attention au sens du symbole : < signifie 'plus petit que' et > signifie 'plus grand que'",
      rule: item.rule || {
        id: 'comp-1',
        name: 'Comparaison de nombres'
      }
    };
  }

  // Erreur liée à l'égalité (particulièrement pour le type 6)
  if (item.type === 6) {
    if (userAnswer !== '=') {
      return {
        errorType: 'ignoreZeroAtRight',
        feedback: "Attention : un zéro à droite après la virgule ne change pas la valeur du nombre",
        rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
      };
    }
  }

  // Erreur liée à la position de la virgule (types 2, 3 ou 4)
  if (item.errorTypes.includes('placeValue') || item.errorTypes.includes('decimalPlacement')) {
    return {
      errorType: 'decimalPosition',
      feedback: "Attention à la position des chiffres après la virgule : 0,1 est plus grand que 0,01",
      rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
    };
  }

  // Erreur liée aux zéros à droite (type 1 ou 5)
  if (item.errorTypes.includes('zeroComparison') || item.errorTypes.includes('zeroAtRight')) {
    if (userAnswer === '=') {
      return {
        errorType: 'misunderstoodZero',
        feedback: "Les zéros à la fin d'un nombre décimal ne changent pas sa valeur, mais ceux entre la virgule et les autres chiffres sont importants",
        rule: item.rule // Utiliser la règle associée à l'item lors de sa génération
      };
    }
  }

  // Pour toutes les autres erreurs, retourner un message générique avec la règle associée à l'item
  return {
    errorType: 'comparison',
    feedback: 'Ce n\'est pas la bonne réponse. Comparez attentivement les nombres.',
    rule: item.rule || { // Fallback si la règle n'est pas définie
      id: (typeof item.firstNumber === 'number' && item.firstNumber % 1 !== 0) ||
        (typeof item.secondNumber === 'number' && item.secondNumber % 1 !== 0)
        ? 'comp-dec-1'
        : 'comp-1',
      name: (typeof item.firstNumber === 'number' && item.firstNumber % 1 !== 0) ||
        (typeof item.secondNumber === 'number' && item.secondNumber % 1 !== 0)
        ? 'Comparaison de nombres décimaux'
        : 'Comparaison de nombres'
    }
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