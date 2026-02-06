import { updateRuleProgress } from '../stores/ruleProgressStore';
import { getRuleById } from '../stores/rulesStore';
import type { RuleValidation } from '../types/rules';
import { EPSILON } from '../config/constants';

interface ValidationContext {
  ruleId: string;
  answer: string | number;
  expectedAnswer: string | number;
  details?: {
    firstNumber?: number;
    secondNumber?: number;
    operation?: string;
    rule?: {
      id: string;
      name: string;
    };
  };
}

export function validateRule({ ruleId, answer, expectedAnswer, details }: ValidationContext): RuleValidation {
  const rule = getRuleById(ruleId);
  if (!rule) {
    return {
      ruleId,
      isValid: false,
      feedback: "Règle non trouvée"
    };
  }
  // Vérifier si un identifiant de règle spécifique est fourni dans les détails
  const specificRuleId = details?.rule?.id || ruleId;

  // Validation spécifique selon le type de règle
  let result;
  switch (rule.type) {
    case 'addition':
      result = validateAddition({ ruleId, answer, expectedAnswer, details });
      break;
    case 'subtraction':
      result = validateSubtraction({ ruleId, answer, expectedAnswer, details });
      break;
    case 'multiplication':
      result = validateMultiplication({ ruleId, answer, expectedAnswer, details });
      break;
    case 'comparison':
      result = validateComparison({ ruleId, answer, expectedAnswer, details });
      break;
    case 'decimal':
      result = validateDecimal({ ruleId, answer, expectedAnswer, details });
      break;
    default:
      result = {
        ruleId,
        isValid: false,
        feedback: "Type de règle non supporté"
      };
  }

  // Mettre à jour la progression de la règle spécifique si disponible
  updateRuleProgress(specificRuleId, result.isValid);

  return result;
}

function validateAddition({ ruleId, answer, expectedAnswer, details }: ValidationContext): RuleValidation {
  const isCorrect = Number(answer) === Number(expectedAnswer);
  const { firstNumber = 0, secondNumber = 0 } = details || {};

  if (isCorrect) {
    return {
      ruleId,
      isValid: true,
      feedback: "Excellent ! L'addition est correcte."
    };
  }

  // Analyse des erreurs courantes
  const userAnswer = Number(answer);
  const sum = firstNumber + secondNumber;
  const hasForgottenCarry = Math.abs(userAnswer - sum) === 10;

  return {
    ruleId,
    isValid: false,
    feedback: hasForgottenCarry
      ? "N'oubliez pas la retenue lors de l'addition !"
      : "Ce n'est pas la bonne réponse. Vérifiez votre calcul.",
    suggestedStep: "Alignez les nombres et commencez par les unités"
  };
}

function validateSubtraction({ ruleId, answer, expectedAnswer, details }: ValidationContext): RuleValidation {
  const isCorrect = Number(answer) === Number(expectedAnswer);
  const { firstNumber = 0, secondNumber = 0 } = details || {};

  if (isCorrect) {
    return {
      ruleId,
      isValid: true,
      feedback: "Parfait ! La soustraction est correcte."
    };
  }

  // Analyse des erreurs courantes
  const userAnswer = Number(answer);
  const difference = firstNumber - secondNumber;
  const hasInvertedOrder = userAnswer === (secondNumber - firstNumber);

  return {
    ruleId,
    isValid: false,
    feedback: hasInvertedOrder
      ? "Attention à l'ordre : soustrayez le plus petit nombre du plus grand !"
      : "Ce n'est pas la bonne réponse. Vérifiez votre calcul.",
    suggestedStep: "Commencez par les unités et n'oubliez pas de gérer les emprunts"
  };
}

function validateMultiplication({ ruleId, answer, expectedAnswer, details }: ValidationContext): RuleValidation {
  const isCorrect = Number(answer) === Number(expectedAnswer);
  const { firstNumber = 0, secondNumber = 0 } = details || {};

  if (isCorrect) {
    return {
      ruleId,
      isValid: true,
      feedback: "Bravo ! La multiplication est correcte."
    };
  }

  // Vérifier si l'erreur vient d'une mauvaise mémorisation de la table
  const product = firstNumber * secondNumber;
  const isCloseToCorrect = Math.abs(Number(answer) - product) <= Math.min(firstNumber, secondNumber);

  return {
    ruleId,
    isValid: false,
    feedback: isCloseToCorrect
      ? "Presque ! Révisez votre table de multiplication."
      : "Ce n'est pas la bonne réponse. Vérifiez votre calcul.",
    suggestedStep: "Utilisez la table de multiplication correspondante"
  };
}

function validateComparison({ ruleId, answer, expectedAnswer }: ValidationContext): RuleValidation {
  const isCorrect = String(answer) === String(expectedAnswer);

  if (isCorrect) {
    return {
      ruleId,
      isValid: true,
      feedback: "Excellent ! La comparaison est correcte."
    };
  }

  return {
    ruleId,
    isValid: false,
    feedback: "La comparaison n'est pas correcte. Vérifiez le sens des symboles < et >.",
    suggestedStep: "Comparez les chiffres de gauche à droite"
  };
}

function validateDecimal({ ruleId, answer, expectedAnswer, details }: ValidationContext): RuleValidation {
  // Convertir les nombres pour la comparaison
  const userAnswer = Number(answer);
  const correctAnswer = Number(expectedAnswer);

  // Vérifier la validité de base
  if (isNaN(userAnswer)) {
    return {
      ruleId,
      isValid: false,
      feedback: "La réponse doit être un nombre valide",
      suggestedStep: "Utilisez la virgule (et non le point) comme séparateur décimal"
    };
  }

  const { firstNumber = 0, secondNumber = 0 } = details || {};

  // Vérifier si la réponse est correcte (avec tolérance pour les arrondis)
  const isCorrect = Math.abs(userAnswer - correctAnswer) < EPSILON;
  if (isCorrect) {
    return {
      ruleId,
      isValid: true,
      feedback: "Excellent ! L'opération avec les nombres décimaux est correcte."
    };
  }

  // Analyse des erreurs courantes avec les nombres décimaux
  const userDecimalPlaces = countDecimalPlaces(userAnswer);
  const expectedDecimalPlaces = countDecimalPlaces(correctAnswer);
  const firstDecimalPlaces = countDecimalPlaces(firstNumber);
  const secondDecimalPlaces = countDecimalPlaces(secondNumber);

  // Erreur d'alignement de la virgule
  const hasWrongAlignment = Math.abs(userDecimalPlaces - expectedDecimalPlaces) > 0;

  // Erreur de manipulation des zéros (ex: 0,40 considéré différent de 0,4)
  const isZeroError = Math.abs(userAnswer - correctAnswer) < 0.01 &&
    userDecimalPlaces !== expectedDecimalPlaces;

  if (hasWrongAlignment) {
    return {
      ruleId,
      isValid: false,
      feedback: "Attention à l'alignement de la virgule ! Vérifiez votre calcul.",
      suggestedStep: "Alignez les virgules avant de calculer"
    };
  } else if (isZeroError) {
    return {
      ruleId,
      isValid: false,
      feedback: "Les zéros à la fin d'un nombre décimal ne changent pas sa valeur",
      suggestedStep: "0,40 est égal à 0,4"
    };
  }

  // Erreur de calcul standard
  return {
    ruleId,
    isValid: false,
    feedback: "Ce n'est pas la bonne réponse. Vérifiez votre calcul.",
    suggestedStep: "Procédez étape par étape en respectant les règles des décimaux"
  };
}

// Fonction utilitaire pour compter le nombre de décimales
function countDecimalPlaces(num: number): number {
  const str = num.toString();
  const decimalPart = str.split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}