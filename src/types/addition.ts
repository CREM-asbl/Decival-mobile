export interface AdditionItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer?: number;
  userAnswer?: number;
  isCorrect?: boolean;
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