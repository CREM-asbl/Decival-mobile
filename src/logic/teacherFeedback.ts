import type { TeacherFeedbackSummary, TypeMasteryResult, ComparisonProfileResult, TestCategory } from '../types/diagnostic';
import type { ComparisonTest } from '../types/comparison';
import type { AdditionTest } from '../types/addition';
import type { SubtractionTest } from '../types/subtraction';
import type { MultiplicationTest } from '../types/multiplication';
import { detectComparisonProfile, getComparisonResultsByType } from './diagnosticProfiles';
import { analyzeAdditionError, analyzeSubtractionError, analyzeMultiplicationError } from './fineErrorAnalysis';

type AnyTest = ComparisonTest | AdditionTest | SubtractionTest | MultiplicationTest;

/**
 * Génère un résumé de feedback pour l'enseignant à partir d'un test complété.
 */
export function generateTeacherFeedback(test: AnyTest): TeacherFeedbackSummary {
  const correctAnswers = test.items.filter(item => item.isCorrect).length;
  const totalItems = test.items.length;
  const globalScore = totalItems > 0 ? (correctAnswers / totalItems) * 100 : 0;

  let resultsByType: TypeMasteryResult[] = [];
  let comparisonProfile: ComparisonProfileResult | undefined;
  let feedbackText = '';

  if (test.type === 'comparison') {
    comparisonProfile = detectComparisonProfile(test.items);
    resultsByType = getComparisonResultsByType(test.items);
    feedbackText = comparisonProfile.description;
  } else {
    // Opérations
    resultsByType = getOperationResultsByType(test);
    feedbackText = generateOperationFeedbackText(test);
  }

  return {
    comparisonProfile,
    resultsByType,
    feedbackText,
    globalScore,
    totalItems,
    correctAnswers
  };
}

/**
 * Calcule la maîtrise par type pour les opérations.
 */
function getOperationResultsByType(test: AdditionTest | SubtractionTest | MultiplicationTest): TypeMasteryResult[] {
  const results: TypeMasteryResult[] = [];
  const typesCount = 7;
  
  // Labels pédagogiques (basés sur les fichiers logic)
  const additionLabels = [
    'Dixièmes sans retenue',
    'Centièmes sans retenue',
    'Précisions différentes',
    'Dixièmes avec retenue',
    'Centièmes avec retenue',
    'Plusieurs décimales',
    'Entier et décimal'
  ];

  const subtractionLabels = [
    'Dixièmes sans emprunt',
    'Centièmes sans emprunt',
    'Précisions différentes',
    'Dixièmes avec emprunt',
    'Centièmes avec emprunt',
    'Nombres mixtes',
    'Entier et décimal'
  ];

  const multiplicationLabels = [
    'X simple (0,x * 0,y)',
    'X par 10, 100, ...',
    'X entier * décimal',
    'X précisions diff.',
    'X avec retenue',
    'X par 0,1, 0,01, ...',
    'X nombre à 2 chiffres'
  ];

  const labels = test.type === 'addition' ? additionLabels : 
                 test.type === 'subtraction' ? subtractionLabels : 
                 multiplicationLabels;
  
  // Seuil de maîtrise : 75% de réussite sur les items du type présent
  const MASTERY_THRESHOLD = 0.75;

  for (let type = 0; type < typesCount; type++) {
    const typeItems = test.items.filter(i => i.type === type);
    const total = typeItems.length;
    
    if (total === 0) continue; // On ne renvoie que les types testés

    const correct = typeItems.filter(i => i.isCorrect).length;
    results.push({
      type,
      label: labels[type] || `Type ${type}`,
      correct,
      total,
      mastered: (correct / total) >= MASTERY_THRESHOLD
    });
  }

  return results;
}

/**
 * Génère le texte de feedback pour les opérations en analysant les erreurs.
 */
function generateOperationFeedbackText(test: AdditionTest | SubtractionTest | MultiplicationTest): string {
  if (test.items.every(i => i.isCorrect)) {
    return "L'élève maîtrise parfaitement cette opération. Aucune erreur n'a été détectée.";
  }

  const errors = test.items.filter(i => !i.isCorrect && i.userAnswer !== undefined);
  if (errors.length === 0) {
    return "Le test n'a pas été complété ou contient trop de non-réponses pour une analyse fiable.";
  }

  const issues = {
    tenPower: 0,
    comma: 0,
    passing: 0,
    zero: 0,
    confusion: 0,
    inversion: 0
  };

  errors.forEach(item => {
    let analysis;
    const n1 = item.firstNumber;
    const n2 = item.secondNumber;
    const given = Number(item.userAnswer);

    if (isNaN(given)) return;

    if (test.type === 'addition') {
      analysis = analyzeAdditionError(n1, n2, given);
    } else if (test.type === 'subtraction') {
      analysis = analyzeSubtractionError(n1, n2, given);
    } else {
      analysis = analyzeMultiplicationError(n1, n2, given);
    }

    if (analysis.tenPower === '1') issues.tenPower++;
    if (analysis.hasComma === '0') issues.comma++;
    if (analysis.passing === '0') issues.passing++;
    if (analysis.zero === '0') issues.zero++;
    if (analysis.confusion === '1') issues.confusion++;
    if (analysis.inversion === '1') issues.inversion++;
  });

  const feedbackMessages: string[] = [];

  // 1. Erreurs de structure / conceptuelles (Priorité maximale)
  if (issues.confusion > 1) {
    feedbackMessages.push("Il y a une confusion manifeste entre l'addition et la soustraction.");
  }
  if (issues.inversion > 1) {
    feedbackMessages.push("L'élève inverse les termes de la soustraction (fait le plus petit moins le plus grand par colonne).");
  }

  // 2. Erreurs de procédure technique
  if (issues.zero > 1) {
    feedbackMessages.push("Le placement des zéros (notamment les zéros non significatifs ou de position) pose problème.");
  }
  if (issues.passing > 1) {
    feedbackMessages.push(test.type === 'subtraction' ? "Les emprunts (passages par la dizaine) ne sont pas maîtrisés." : "Les retenues ne sont pas correctement gérées.");
  }

  // 3. Erreurs de notation décimale
  if (issues.tenPower > 1) {
    // Si on a déjà un problème de zéro, le décalage de virgule est peut-être lié
    const prefix = issues.zero > 1 ? "De plus, l'élève" : "L'élève";
    feedbackMessages.push(`${prefix} semble avoir des difficultés avec les puissances de 10 (décalage de virgule).`);
  }
  if (issues.comma > 1) {
    feedbackMessages.push("L'élève oublie souvent de placer la virgule dans son résultat.");
  }

  if (feedbackMessages.length === 0) {
    return "L'élève commet des erreurs de calcul ponctuelles, mais sans schéma d'erreur systématique détecté.";
  }

  return feedbackMessages.join(' ');
}
