export interface AdditionItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer?: number;
  userAnswer?: number;
  isCorrect?: boolean;
  // Nouveaux champs pour le système d'erreurs proportionnelles
  type?: number;
  errorTypes?: string[];
  // Champ pour stocker l'analyse d'erreur
  errorAnalysis?: {
    errorType: string;
    feedback: string;
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