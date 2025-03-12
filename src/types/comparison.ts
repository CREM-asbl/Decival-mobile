export interface ComparisonItem {
  id: string;
  firstNumber: number;
  secondNumber: number;
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}