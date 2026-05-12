/**
 * Types pour le système de diagnostic pédagogique Decival.
 * Porté fidèlement depuis ComparisonTest.getProfileDesc() (Java).
 */

/** Profils diagnostiques pour la comparaison de décimaux */
export type ComparisonProfile =
  | 'TOO_MANY_NO_ANSWERS'
  | 'INSTRUCTIONS_NOT_UNDERSTOOD'
  | 'NATURAL'
  | 'LENGTH'
  | 'EXPERT'
  | 'EXPERT_WITH_ERRORS'
  | 'NEAR_EXPERT'
  | 'OTHER';

export interface ComparisonProfileResult {
  profile: ComparisonProfile;
  label: string;
  description: string;
  /** Couleur CSS pour l'affichage */
  color: string;
  /** Icône emoji */
  icon: string;
  /** Score par type (0-6) : nombre de réponses correctes ou conformes au profil */
  scoresByType: number[];
  /** Nombre total de réponses correctes */
  totalCorrect: number;
  /** Nombre total de non-réponses */
  totalUnanswered: number;
}

/** Résultat d'analyse fine pour un item d'opération */
export interface FineErrorAnalysisResult {
  /** La réponse contient une virgule (0, = non, 1 = oui) */
  hasComma: '0' | '1' | '-';
  /** La puissance de 10 est correcte */
  tenPower: '0' | '1' | '-';
  /** Le zéro est correctement placé */
  zero: '0' | '1' | '-';
  /** La retenue/passage est correcte */
  passing: '0' | '1' | '-';
  /** Le calcul (somme/diff/produit) est correct */
  result: '0' | '1' | '-';
  /** Confusion d'opération (soustraction uniquement) */
  confusion?: '0' | '1' | '-';
  /** Inversion des termes (soustraction uniquement) */
  inversion?: '0' | '1' | '-';
}

/** Tableau de codage complet pour un test d'opérations */
export interface CodingArrayRow {
  type: number;
  item: string;
  expectedAnswer: string;
  givenAnswer: string;
  analysis: FineErrorAnalysisResult;
}

/** Type de test pour les badges basés sur les types */
export type TestCategory = 'comparison' | 'addition' | 'subtraction' | 'multiplication';

/** Résultat de maîtrise d'un type d'item */
export interface TypeMasteryResult {
  type: number;
  label?: string;
  correct: number;
  total: number;
  mastered: boolean;
}

/** Résumé de feedback pour l'enseignant */
export interface TeacherFeedbackSummary {
  /** Profil diagnostique (comparaison uniquement) */
  comparisonProfile?: ComparisonProfileResult;
  /** Résultats par type */
  resultsByType: TypeMasteryResult[];
  /** Texte de feedback détaillé */
  feedbackText: string;
  /** Score global */
  globalScore: number;
  /** Nombre total d'items */
  totalItems: number;
  /** Nombre de réponses correctes */
  correctAnswers: number;
}
