export interface AdditionItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer: number;
  userAnswer?: number;
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

export interface AdditionTest {
  id: string;
  type: 'addition';
  mode: 'integer' | 'decimal';
  items: AdditionItem[];
  currentItemIndex: number;
  startTime: Date;
  endTime?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}