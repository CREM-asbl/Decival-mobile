export interface SubtractionItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer?: number;
  userAnswer?: number;
  isCorrect?: boolean;
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