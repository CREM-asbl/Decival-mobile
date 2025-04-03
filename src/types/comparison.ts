export interface ComparisonItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
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