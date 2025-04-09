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
  // Variable pour stocker la règle associée à l'item
  let rule: { id: string; name: string };

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
      rule = {
        id: 'comp-dec-1',
        name: 'Comparaison de nombres décimaux'
      };
      break;

    case 1: // 0,1 vs 0,20 (Comparaison avec zéros non significatifs)
      let n1b = Math.floor(Math.random() * 9) + 1;
      let n2b = n1b; // Même chiffre pour vérifier l'égalité malgré les zéros à droite

      firstNumber = n1b / 10;
      secondNumber = n2b / 10 + 0; // Pour forcer l'affichage comme 0,10
      correctAnswer = '='; // Toujours égaux

      errorTypes = ['zeroComparison', 'zeroAtRight'];
      rule = {
        id: 'comp-dec-2',
        name: 'Comparaison avec zéros non significatifs'
      };
      break;

    case 2: // 0,1 vs 0,01 (Comparaison dixième vs centième - même chiffre)
      const n1c = Math.floor(Math.random() * 9) + 1;
      const n2c = n1c; // Même chiffre

      firstNumber = n1c / 10;
      secondNumber = n2c / 100;
      correctAnswer = '>'; // Le dixième est toujours plus grand que le centième (pour un même chiffre)

      errorTypes = ['placeValue', 'decimalPlacement'];
      rule = {
        id: 'dec-1',
        name: 'Structure des nombres décimaux'
      };
      break;

    case 3: // 0,2 vs 0,03 (Comparaison dixième vs centième - différents chiffres)
      const n1d = Math.floor(Math.random() * 8) + 2; // 2-9
      const n2d = Math.floor(Math.random() * (n1d - 1)) + 1; // 1 à (n1d-1)

      firstNumber = n1d / 10;
      secondNumber = n2d / 100;
      correctAnswer = '>'; // Le dixième est toujours plus grand

      errorTypes = ['placeValue', 'decimalPlacement', 'differentDigits'];
      rule = {
        id: 'dec-1',
        name: 'Structure des nombres décimaux'
      };
      break;

    case 4: // 0,13 vs 0,3 (Confusion possible)
      const n1e = Math.floor(Math.random() * 9) + 1; // 1-9
      const n2e = Math.floor(Math.random() * 9) + 1; // 1-9
      const n3e = Math.floor(Math.random() * 9) + 1; // 1-9

      firstNumber = (n1e / 10) + (n2e / 100);
      secondNumber = n3e / 10;

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
        id: 'comp-dec-3',
        name: 'Comparaison avec confusion possible'
      };
      break;

    case 5: // 0,10 vs 0,1 (Zéro à droite, même valeur)
      const n1f = Math.floor(Math.random() * 9) + 1;

      firstNumber = n1f / 10;
      secondNumber = n1f / 10; // Même valeur
      correctAnswer = '=';

      errorTypes = ['zeroAtRight'];
      rule = {
        id: 'comp-dec-2',
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

      if (n1g < n2g) {
        firstNumber = n1g / 10;
        secondNumber = n2g / 10;
        correctAnswer = '<';
      } else {
        firstNumber = n2g / 10;
        secondNumber = n1g / 10;
        correctAnswer = '>';
      }

      errorTypes = ['zeroAtRight', 'differentDigits'];
      rule = {
        id: 'comp-dec-1',
        name: 'Comparaison de nombres décimaux'
      };
      break;

    default:
      // Cas par défaut
      firstNumber = 0.1;
      secondNumber = 0.2;
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
    correctAnswer,
    type: type,
    errorTypes,
    rule // Associer directement la règle à l'item
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