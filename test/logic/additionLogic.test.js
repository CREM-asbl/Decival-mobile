import { describe, expect, test } from 'vitest';
import { checkAnswer, createAdditionTest, evaluateTest, generateAdditionItem } from '../../src/logic/additionLogic';

describe('Addition Logic', () => {
  test('generateAdditionItem devrait créer un item valide', () => {
    const item = generateAdditionItem();

    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('firstNumber');
    expect(item).toHaveProperty('secondNumber');
    expect(item).toHaveProperty('correctAnswer');
    expect(item.correctAnswer).toBe(item.firstNumber + item.secondNumber);
  });

  test('createAdditionTest devrait créer un test avec le bon nombre d\'items', () => {
    const numberOfItems = 5;
    const test = createAdditionTest(numberOfItems);

    expect(test).toHaveProperty('id');
    expect(test.items).toHaveLength(numberOfItems);
    expect(test.currentItemIndex).toBe(0);
    expect(test.status).toBe('not_started');
    expect(test.startTime).toBeInstanceOf(Date);
  });

  test('checkAnswer devrait correctement valider les réponses', () => {
    const item = {
      id: '1',
      firstNumber: 5,
      secondNumber: 3,
      correctAnswer: 8
    };

    expect(checkAnswer(item, 8)).toBe(true);
    expect(checkAnswer(item, 7)).toBe(false);
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