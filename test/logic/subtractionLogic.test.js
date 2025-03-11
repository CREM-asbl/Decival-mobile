import { describe, expect, test } from 'vitest';
import { checkAnswer, createSubtractionTest, evaluateTest, generateSubtractionItem } from '../../src/logic/subtractionLogic';

describe('Subtraction Logic', () => {
  test('generateSubtractionItem devrait créer une soustraction valide avec résultat positif', () => {
    const item = generateSubtractionItem();

    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('firstNumber');
    expect(item).toHaveProperty('secondNumber');
    expect(item).toHaveProperty('correctAnswer');
    expect(item.firstNumber).toBeGreaterThan(item.secondNumber);
    expect(item.correctAnswer).toBe(item.firstNumber - item.secondNumber);
    expect(item.correctAnswer).toBeGreaterThanOrEqual(0);
  });

  test('createSubtractionTest devrait créer un test avec le bon nombre d\'items', () => {
    const numberOfItems = 5;
    const test = createSubtractionTest(numberOfItems);

    expect(test).toHaveProperty('id');
    expect(test.items).toHaveLength(numberOfItems);
    expect(test.currentItemIndex).toBe(0);
    expect(test.status).toBe('not_started');
    expect(test.startTime).toBeInstanceOf(Date);

    // Vérifier que tous les items ont des soustractions valides
    test.items.forEach(item => {
      expect(item.firstNumber).toBeGreaterThan(item.secondNumber);
      expect(item.correctAnswer).toBeGreaterThanOrEqual(0);
    });
  });

  test('checkAnswer devrait correctement valider les réponses', () => {
    const item = {
      id: '1',
      firstNumber: 8,
      secondNumber: 3,
      correctAnswer: 5
    };

    expect(checkAnswer(item, 5)).toBe(true);
    expect(checkAnswer(item, 4)).toBe(false);
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