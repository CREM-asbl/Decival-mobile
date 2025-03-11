import { describe, expect, test } from 'vitest';
import { validateRule } from '../../src/logic/ruleValidation';

describe('Rule Validation', () => {
  describe('Addition Rules', () => {
    test('devrait valider une addition correcte', () => {
      const result = validateRule({
        ruleId: 'add-1',
        answer: 37,
        expectedAnswer: 37,
        details: {
          firstNumber: 24,
          secondNumber: 13
        }
      });

      expect(result.isValid).toBe(true);
      expect(result.feedback).toContain('correcte');
    });

    test('devrait détecter une retenue oubliée', () => {
      const result = validateRule({
        ruleId: 'add-1',
        answer: 52,
        expectedAnswer: 62,
        details: {
          firstNumber: 28,
          secondNumber: 34
        }
      });

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('retenue');
    });
  });

  describe('Subtraction Rules', () => {
    test('devrait valider une soustraction correcte', () => {
      const result = validateRule({
        ruleId: 'sub-1',
        answer: 21,
        expectedAnswer: 21,
        details: {
          firstNumber: 52,
          secondNumber: 31
        }
      });

      expect(result.isValid).toBe(true);
      expect(result.feedback).toContain('correcte');
    });

    test('devrait détecter une inversion d\'ordre', () => {
      const result = validateRule({
        ruleId: 'sub-1',
        answer: -21,
        expectedAnswer: 21,
        details: {
          firstNumber: 52,
          secondNumber: 31
        }
      });

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('ordre');
    });
  });

  describe('Multiplication Rules', () => {
    test('devrait valider une multiplication correcte', () => {
      const result = validateRule({
        ruleId: 'mult-1',
        answer: 42,
        expectedAnswer: 42,
        details: {
          firstNumber: 6,
          secondNumber: 7
        }
      });

      expect(result.isValid).toBe(true);
      expect(result.feedback).toContain('correcte');
    });

    test('devrait suggérer de réviser la table', () => {
      const result = validateRule({
        ruleId: 'mult-1',
        answer: 48,
        expectedAnswer: 42,
        details: {
          firstNumber: 6,
          secondNumber: 7
        }
      });

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('table');
    });
  });

  describe('Comparison Rules', () => {
    test('devrait valider une comparaison correcte', () => {
      const result = validateRule({
        ruleId: 'comp-1',
        answer: '>',
        expectedAnswer: '>',
        details: {
          firstNumber: 45,
          secondNumber: 32
        }
      });

      expect(result.isValid).toBe(true);
      expect(result.feedback).toContain('correcte');
    });

    test('devrait détecter une erreur de symbole', () => {
      const result = validateRule({
        ruleId: 'comp-1',
        answer: '<',
        expectedAnswer: '>',
        details: {
          firstNumber: 45,
          secondNumber: 32
        }
      });

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('symboles');
    });
  });
});