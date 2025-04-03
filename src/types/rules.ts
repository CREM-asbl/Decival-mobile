export interface Rule {
  id: string;
  type: 'addition' | 'subtraction' | 'multiplication' | 'comparison' | 'decimal';
  title: string;
  description: string;
  examples: Example[];
  steps: string[];
  tips: string[];
}

export interface Example {
  problem: string;
  solution: string;
  explanation: string;
}

export interface RuleValidation {
  ruleId: string;
  isValid: boolean;
  feedback: string;
  suggestedStep?: string;
}

export type RuleType = 'addition' | 'subtraction' | 'multiplication' | 'comparison' | 'decimal';