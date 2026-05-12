import { describe, it, expect } from 'vitest';
import { generateTeacherFeedback } from '../../src/logic/teacherFeedback';

describe('Teacher Feedback Logic', () => {
  
  describe('Addition Feedback', () => {
    it('should return perfect feedback for 100% correct', () => {
      const test = {
        type: 'addition',
        items: Array(28).fill(0).map((_, i) => ({
          type: i % 7,
          firstNumber: 1.2,
          secondNumber: 3.4,
          userAnswer: '4.6',
          isCorrect: true
        }))
      };
      const feedback = generateTeacherFeedback(test);
      expect(feedback.globalScore).toBe(100);
      expect(feedback.feedbackText).toContain('parfaitement');
    });

    it('should detect systematic tenPower errors', () => {
      const test = {
        type: 'addition',
        items: Array(28).fill(0).map((_, i) => ({
          type: i % 7,
          firstNumber: 1.2,
          secondNumber: 3.4,
          userAnswer: '46', // expected 4.6
          isCorrect: false
        }))
      };
      const feedback = generateTeacherFeedback(test);
      expect(feedback.feedbackText).toContain('puissances de 10');
    });

    it('should detect systematic passing (retenue) errors', () => {
      const test = {
        type: 'addition',
        items: Array(28).fill(0).map((_, i) => ({
          type: i % 7,
          firstNumber: 0.9,
          secondNumber: 0.2,
          userAnswer: '1.0', // expected 1.1, off by 0.1
          isCorrect: false
        }))
      };
      const feedback = generateTeacherFeedback(test);
      expect(feedback.feedbackText).toContain('retenues');
    });
  });

  describe('Subtraction Feedback', () => {
    it('should detect confusion with addition', () => {
      const test = {
        type: 'subtraction',
        items: Array(28).fill(0).map((_, i) => ({
          type: i % 7,
          firstNumber: 5.5,
          secondNumber: 1.2,
          userAnswer: '6.7', // 5.5 + 1.2 instead of 5.5 - 1.2
          isCorrect: false
        }))
      };
      const feedback = generateTeacherFeedback(test);
      expect(feedback.feedbackText).toContain('confusion');
    });

    it('should detect inversion errors', () => {
      const test = {
        type: 'subtraction',
        items: Array(28).fill(0).map((_, i) => ({
          type: i % 7,
          firstNumber: 5.2,
          secondNumber: 1.5,
          userAnswer: '-3.7', // 1.5 - 5.2 instead of 5.2 - 1.5
          isCorrect: false
        }))
      };
      // Note: the current logic detects inversion if Math.abs(given - (n2 - n1)) < EPSILON
      const feedback = generateTeacherFeedback(test);
      expect(feedback.feedbackText).toContain('inverse les termes');
    });
  });

  describe('Multiplication Feedback', () => {
    it('should detect systematic zero errors', () => {
      const test = {
        type: 'multiplication',
        items: Array(20).fill(0).map((_, i) => ({
          type: i % 7,
          firstNumber: 1.0,
          secondNumber: 0.1,
          userAnswer: '01', // expected 0.1, missing dot/comma and wrong zero placement
          isCorrect: false
        }))
      };
      
      const feedback = generateTeacherFeedback(test);
      expect(feedback.feedbackText).toContain('placement des zéros');
    });

    it('should detect systematic carry (retenue) errors', () => {
      const test = {
        type: 'multiplication',
        items: Array(20).fill(0).map((_, i) => ({
          type: i % 7,
          firstNumber: 0.6,
          secondNumber: 0.9,
          userAnswer: '0.53', // expected 0.54, off by 0.01 (carry error)
          isCorrect: false
        }))
      };
      
      const feedback = generateTeacherFeedback(test);
      expect(feedback.feedbackText).toContain('retenues');
    });
  });

  describe('Comparison Feedback', () => {
    it('should detect Natural Profile', () => {
      const test = {
        type: 'comparison',
        items: Array(49).fill(0).map((_, i) => {
          const type = i % 7;
          let userAnswer = '';
          let isCorrect = false;
          
          // Profil Naturel : traite décimaux comme entiers
          switch (type) {
            case 0: userAnswer = '<'; isCorrect = true; break;  // 0,1 < 0,3 (1 < 3) -> OK
            case 1: userAnswer = '<'; isCorrect = false; break; // 0,1 < 0,10 (1 < 10) -> Misconception
            case 2: userAnswer = '='; isCorrect = false; break; // 0,1 = 0,01 (1 = 1) -> Misconception
            case 3: userAnswer = '>'; isCorrect = true; break;  // 0,2 > 0,01 (2 > 1) -> OK
            case 4: userAnswer = '>'; isCorrect = false; break; // 0,13 > 0,3 (13 > 3) -> Misconception
            case 5: userAnswer = '>'; isCorrect = false; break; // 0,10 > 0,1 (10 > 1) -> Misconception
            case 6: userAnswer = '>'; isCorrect = false; break; // 0,80 > 0,9 (80 > 9) -> Misconception
          }
          
          return { type, userAnswer, isCorrect };
        })
      };
      
      const feedback = generateTeacherFeedback(test);
      expect(feedback.comparisonProfile?.profile).toBe('NATURAL');
    });

    it('should detect TOO_MANY_NO_ANSWERS', () => {
      const test = {
        type: 'comparison',
        items: Array(49).fill(0).map((_, i) => ({
          type: i % 7,
          userAnswer: i < 20 ? '' : '>',
          isCorrect: i >= 20
        }))
      };
      const feedback = generateTeacherFeedback(test);
      expect(feedback.comparisonProfile.profile).toBe('TOO_MANY_NO_ANSWERS');
    });
  });
});
