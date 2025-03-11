import { getRuleById } from '../stores/rulesStore';
import { RuleValidation } from '../types/rules';

interface ValidationContext {
  ruleId: string;
  answer: string | number;
  expectedAnswer: string | number;
  details?: {
    firstNumber?: number;
    secondNumber?: number;
    operation?: string;
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

  // Validation spécifique selon le type de règle
  switch (rule.type) {
    case 'addition':
      return validateAddition({ ruleId, answer, expectedAnswer, details });
    case 'subtraction':
      return validateSubtraction({ ruleId, answer, expectedAnswer, details });
    case 'multiplication':
      return validateMultiplication({ ruleId, answer, expectedAnswer, details });
    case 'comparison':
      return validateComparison({ ruleId, answer, expectedAnswer, details });
    default:
      return {
        ruleId,
        isValid: false,
        feedback: "Type de règle non supporté"
      };
  }
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