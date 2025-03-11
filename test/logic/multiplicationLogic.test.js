import { describe, expect, test } from 'vitest';
import { checkAnswer, createMultiplicationTest, evaluateTest, generateMultiplicationItem } from '../../src/logic/multiplicationLogic';

describe('Multiplication Logic', () => {
  test('generateMultiplicationItem devrait créer une multiplication valide avec des nombres entre 1 et 12', () => {
    const item = generateMultiplicationItem();

    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('firstNumber');
    expect(item).toHaveProperty('secondNumber');
    expect(item).toHaveProperty('correctAnswer');
    expect(item.firstNumber).toBeGreaterThanOrEqual(1);
    expect(item.firstNumber).toBeLessThanOrEqual(12);
    expect(item.secondNumber).toBeGreaterThanOrEqual(1);
    expect(item.secondNumber).toBeLessThanOrEqual(12);
    expect(item.correctAnswer).toBe(item.firstNumber * item.secondNumber);
  });

  test('createMultiplicationTest devrait créer un test avec le bon nombre d\'items', () => {
    const numberOfItems = 5;
    const test = createMultiplicationTest(numberOfItems);

    expect(test).toHaveProperty('id');
    expect(test.items).toHaveLength(numberOfItems);
    expect(test.currentItemIndex).toBe(0);
    expect(test.status).toBe('not_started');
    expect(test.startTime).toBeInstanceOf(Date);

    // Vérifier que tous les items ont des multiplications valides
    test.items.forEach(item => {
      expect(item.firstNumber).toBeGreaterThanOrEqual(1);
      expect(item.firstNumber).toBeLessThanOrEqual(12);
      expect(item.secondNumber).toBeGreaterThanOrEqual(1);
      expect(item.secondNumber).toBeLessThanOrEqual(12);
      expect(item.correctAnswer).toBe(item.firstNumber * item.secondNumber);
    });
  });

  test('checkAnswer devrait correctement valider les réponses', () => {
    const item = {
      id: '1',
      firstNumber: 4,
      secondNumber: 3,
      correctAnswer: 12
    };

    expect(checkAnswer(item, 12)).toBe(true);
    expect(checkAnswer(item, 13)).toBe(false);
  });

  test('evaluateTest devrait calculer le score correctement', () => {
    const test = {
      id: '1',
      items: [
        { id: '1', isCorrect: true },
        { id: '2', isCorrect: false },
        { id: '3', isCorrect: true },
        { id: '4', isCorrect: true }
      ]
    };

    const result = evaluateTest(test);
    expect(result.totalQuestions).toBe(4);
    expect(result.correctAnswers).toBe(3);
    expect(result.score).toBe(75);
  });
});