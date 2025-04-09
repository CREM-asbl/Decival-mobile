export interface ComparisonItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  // Champs pour le système d'analyse d'erreurs
  type?: number;
  errorTypes?: string[];
  errorAnalysis?: {
    errorType: string;
    feedback: string;
    rule?: {
      id: string;
      name: string;
    }
  };
  // Règle associée à cet item pour l'analyse d'erreur
  rule?: {
    id: string;
    name: string;
  };
}

export interface ComparisonTest {
  id: string;
  type: 'comparison';
  mode: 'integer' | 'decimal';
  items: ComparisonItem[];
  currentItemIndex: number;
  startTime: Date;
  endTime?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}