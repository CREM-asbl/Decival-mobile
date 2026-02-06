
export interface DecimalItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface DecimalTest {
  id: string;
  type: 'decimal';
  items: DecimalItem[];
  currentItemIndex: number;
  startTime: Date;
  endTime?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}

