/**
 * Système de diagnostic par profils pour la comparaison de décimaux.
 * Porté fidèlement depuis ComparisonTest.getProfileDesc() (Java, CREM).
 *
 * Profils détectés (dans cet ordre de priorité) :
 * 1. TOO_MANY_NO_ANSWERS : ≥15 non-réponses sur 49
 * 2. INSTRUCTIONS_NOT_UNDERSTOOD : ≥50% erreurs sur le type 0 (comparaison simple)
 * 3. NATURAL : traite la partie décimale comme un nombre naturel
 * 4. LENGTH : choisit systématiquement le nombre le plus long
 * 5. EXPERT : ≥5/7 correct par type ET ≥45/49 total
 * 6. EXPERT_WITH_ERRORS : ≥5/7 correct par type MAIS <45/49 total
 * 7. NEAR_EXPERT : tout correct SAUF types 5 et 6 (zéros à droite)
 * 8. OTHER : aucun profil ne correspond
 */

import type { ComparisonItem } from '../types/comparison';
import type { ComparisonProfile, ComparisonProfileResult } from '../types/diagnostic';

const ITEMS_PER_TYPE = 7;
const TOTAL_ITEMS = 49;
const NO_ANSWER_THRESHOLD = 15;
const TYPE_MASTERY_THRESHOLD = 5;
const EXPERT_TOTAL_THRESHOLD = 45;

/** Descriptions des profils en français (terminologie FWB) */
const PROFILE_DESCRIPTIONS: Record<ComparisonProfile, { label: string; description: string; color: string; icon: string }> = {
  TOO_MANY_NO_ANSWERS: {
    label: 'Trop de non-réponses',
    description: "L'élève n'a pas répondu à un nombre significatif de questions. Le test ne peut pas être interprété de manière fiable. Il est recommandé de refaire le test en s'assurant que l'élève comprend bien la consigne.",
    color: '#9e9e9e',
    icon: '⚠️'
  },
  INSTRUCTIONS_NOT_UNDERSTOOD: {
    label: 'Consigne incomprise',
    description: "L'élève semble ne pas avoir compris la consigne du test. Un nombre important d'erreurs est observé même sur les comparaisons les plus simples (type 0). Il est recommandé de vérifier la compréhension de la consigne avant de refaire le test.",
    color: '#ff9800',
    icon: '⚠️'
  },
  NATURAL: {
    label: 'Profil Naturel',
    description: "L'élève traite la partie décimale comme un nombre naturel. Par exemple, il considère que 0,12 > 0,9 car 12 > 9. Cette conception est très répandue et nécessite un travail spécifique sur le sens de la virgule et la valeur positionnelle des chiffres après la virgule.",
    color: '#f44336',
    icon: '🔴'
  },
  LENGTH: {
    label: 'Profil Longueur',
    description: "L'élève choisit systématiquement le nombre décimal qui a le plus de chiffres après la virgule. Par exemple, il considère que 0,123 > 0,9 car 0,123 a plus de chiffres. Ce profil indique une confusion entre la longueur de l'écriture et la grandeur du nombre.",
    color: '#ff5722',
    icon: '🟠'
  },
  EXPERT: {
    label: 'Profil Expert',
    description: "L'élève maîtrise très bien la comparaison de nombres décimaux. Il réussit de manière cohérente tous les types de comparaison, y compris les cas impliquant des zéros non significatifs et l'égalité. Félicitations !",
    color: '#4caf50',
    icon: '🟢'
  },
  EXPERT_WITH_ERRORS: {
    label: 'Profil Expert avec erreurs',
    description: "L'élève comprend globalement bien la comparaison de décimaux et réussit la majorité des types, mais commet encore quelques erreurs ponctuelles. Un travail ciblé sur les types d'items échoués permettrait d'atteindre le niveau expert.",
    color: '#8bc34a',
    icon: '🟡'
  },
  NEAR_EXPERT: {
    label: 'Profil Presque Expert',
    description: "L'élève maîtrise bien la plupart des comparaisons, mais éprouve des difficultés spécifiques avec les zéros non significatifs à droite (types 5 et 6). Par exemple, il peut hésiter entre 0,2 et 0,20 ou entre 0,1 et 0,10. Un travail ciblé sur l'équivalence des écritures décimales est recommandé.",
    color: '#03a9f4',
    icon: '🔵'
  },
  OTHER: {
    label: 'Profil Autre',
    description: "Le profil de l'élève ne correspond à aucun des profils typiques identifiés par la recherche. Les résultats sont hétérogènes et nécessitent une analyse plus approfondie par l'enseignant pour comprendre les conceptions sous-jacentes.",
    color: '#607d8b',
    icon: '⚪'
  }
};

/**
 * Détecte le profil diagnostique d'un élève à partir de ses réponses au test de comparaison.
 * Algorithme fidèle au code Java ComparisonTest.getProfileDesc().
 */
export function detectComparisonProfile(items: ComparisonItem[]): ComparisonProfileResult {
  const scoresByType = new Array(7).fill(0);
  const totalByType = new Array(7).fill(0);

  // Compteurs de base
  let totalUnanswered = 0;
  let totalCorrect = 0;

  items.forEach(item => {
    const type = item.type ?? 0;
    if (type >= 0 && type < 7) {
      totalByType[type]++;
    }
    if (!item.userAnswer || item.userAnswer === '') {
      totalUnanswered++;
    } else if (item.isCorrect) {
      totalCorrect++;
      if (type >= 0 && type < 7) {
        scoresByType[type]++;
      }
    }
  });

  const buildResult = (profile: ComparisonProfile): ComparisonProfileResult => ({
    profile,
    ...PROFILE_DESCRIPTIONS[profile],
    scoresByType,
    totalCorrect,
    totalUnanswered
  });

  // 1. Trop de non-réponses
  if (totalUnanswered >= NO_ANSWER_THRESHOLD) {
    return buildResult('TOO_MANY_NO_ANSWERS');
  }

  // 2. Consigne incomprise (≥50% erreurs sur type 0)
  const type0Items = items.filter(i => (i.type ?? 0) === 0);
  const type0Answered = type0Items.filter(i => i.userAnswer && i.userAnswer !== '');
  const type0Wrong = type0Answered.filter(i => !i.isCorrect);
  if (type0Answered.length > 0 && type0Wrong.length >= type0Answered.length / 2) {
    return buildResult('INSTRUCTIONS_NOT_UNDERSTOOD');
  }

  // 3. Profil Naturel
  // L'élève traite la partie décimale comme un nombre naturel (ex: 0,12 > 0,9 car 12 > 9)
  const naturalScores = new Array(7).fill(0);
  items.forEach(item => {
    const type = item.type ?? 0;
    if (!item.userAnswer || item.userAnswer === '') return;

    // Pour chaque type, on vérifie si la réponse est COHÉRENTE avec le profil naturel
    switch (type) {
      case 0: // 0,1 vs 0,3 -> pense 1 < 3. Correct.
        if (item.isCorrect) naturalScores[0]++;
        break;
      case 1: // 0,1 vs 0,10 -> pense 1 < 10. Erreur (<).
        if (item.userAnswer === '<') naturalScores[1]++;
        break;
      case 2: // 0,1 vs 0,01 -> pense 1 = 1. Erreur (=).
        if (item.userAnswer === '=') naturalScores[2]++;
        break;
      case 3: // 0,2 vs 0,01 -> pense 2 > 1. Correct.
        if (item.isCorrect) naturalScores[3]++;
        break;
      case 4: // 0,13 vs 0,3 -> pense 13 > 3. Erreur (>).
        if (item.userAnswer === '>') naturalScores[4]++;
        break;
      case 5: // 0,10 vs 0,1 -> pense 10 > 1. Erreur (>).
        if (item.userAnswer === '>') naturalScores[5]++;
        break;
      case 6: // 0,80 vs 0,9 -> pense 80 > 9. Erreur (>).
        if (item.userAnswer === '>') naturalScores[6]++;
        break;
    }
  });

  if (naturalScores.every(s => s >= TYPE_MASTERY_THRESHOLD)) {
    return buildResult('NATURAL');
  }

  // 4. Profil Longueur
  // L'élève choisit systématiquement le nombre avec le plus grand nombre de chiffres après la virgule
  const lengthScores = new Array(7).fill(0);
  items.forEach(item => {
    const type = item.type ?? 0;
    if (!item.userAnswer || item.userAnswer === '') return;

    const len1 = item.firstNumberDisplay?.split(',')[1]?.length || 0;
    const len2 = item.secondNumberDisplay?.split(',')[1]?.length || 0;

    switch (type) {
      case 0: // Même longueur -> correct
        if (item.isCorrect) lengthScores[0]++;
        break;
      default:
        // Si longueurs différentes, choisit le plus long
        if (len1 > len2) {
          if (item.userAnswer === '>') lengthScores[type]++;
        } else if (len2 > len1) {
          if (item.userAnswer === '<') lengthScores[type]++;
        } else {
          // Si même longueur (devrait pas arriver sauf type 0), correct
          if (item.isCorrect) lengthScores[type]++;
        }
        break;
    }
  });

  if (lengthScores.every(s => s >= TYPE_MASTERY_THRESHOLD)) {
    return buildResult('LENGTH');
  }

  // 5 & 6. Profil Expert / Expert avec erreurs
  if (scoresByType.every(s => s >= TYPE_MASTERY_THRESHOLD)) {
    if (totalCorrect >= EXPERT_TOTAL_THRESHOLD) {
      return buildResult('EXPERT');
    } else {
      return buildResult('EXPERT_WITH_ERRORS');
    }
  }

  // 7. Profil Presque Expert
  // Correct sur types 0-4, mais erreurs sur types 5 et 6 (zéros à droite)
  const nearExpertScores = new Array(7).fill(0);
  items.forEach(item => {
    const type = item.type ?? 0;
    if (!item.userAnswer || item.userAnswer === '') return;

    if (type <= 4) {
      if (item.isCorrect) nearExpertScores[type]++;
    } else {
      // Types 5 et 6 : erreur typique = ne pas reconnaître l'équivalence
      // Java : getGivenAns().length() > 3 → a donné une réponse erronée longue
      if (!item.isCorrect) nearExpertScores[type]++;
    }
  });

  if (nearExpertScores.every(s => s >= TYPE_MASTERY_THRESHOLD)) {
    return buildResult('NEAR_EXPERT');
  }

  // 8. Profil Autre
  return buildResult('OTHER');
}

/**
 * Calcule les résultats par type pour un test de comparaison.
 */
export function getComparisonResultsByType(items: ComparisonItem[]): { type: number; correct: number; total: number; mastered: boolean }[] {
  const results: { type: number; correct: number; total: number; mastered: boolean }[] = [];

  for (let type = 0; type < 7; type++) {
    const typeItems = items.filter(i => (i.type ?? 0) === type);
    const correct = typeItems.filter(i => i.isCorrect).length;
    const total = typeItems.length;
    results.push({
      type,
      correct,
      total,
      mastered: correct >= TYPE_MASTERY_THRESHOLD
    });
  }

  return results;
}
