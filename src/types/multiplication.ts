export interface MultiplicationItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer?: number;
  userAnswer?: number;
  isCorrect?: boolean;
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