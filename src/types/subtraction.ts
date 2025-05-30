export interface SubtractionItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer?: number;
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

export interface SubtractionTest {
  id: string;
  type: 'subtraction';
  mode: 'integer' | 'decimal';
  items: SubtractionItem[];
  currentItemIndex: number;
  startTime: Date;
  endTime?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}