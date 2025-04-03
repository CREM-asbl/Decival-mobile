export interface MultiplicationItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer?: number;
  userAnswer?: number;
  isCorrect?: boolean;
  // Nouveaux champs pour le système d'erreurs proportionnelles
  type?: number;
  errorTypes?: string[];
}

export interface MultiplicationTest {
  id: string;
  type: 'multiplication';
  mode: 'integer' | 'decimal';
  items: MultiplicationItem[];
  currentItemIndex: number;
  startTime: Date;
  endTime?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}