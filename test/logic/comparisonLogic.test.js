import { describe, expect, test } from 'vitest';
import { checkAnswer, createComparisonTest, evaluateTest, generateComparisonItem } from '../../src/logic/comparisonLogic';

describe('Comparison Logic', () => {
  test('generateComparisonItem devrait créer un item de comparaison valide', () => {
    const item = generateComparisonItem();

    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('firstNumber');
    expect(item).toHaveProperty('secondNumber');
    expect(item).toHaveProperty('correctAnswer');
    expect(['<', '=', '>']).toContain(item.correctAnswer);

    // Vérifier que la réponse est correcte
    if (item.firstNumber < item.secondNumber) {
      expect(item.correctAnswer).toBe('<');
    } else if (item.firstNumber > item.secondNumber) {
      expect(item.correctAnswer).toBe('>');
    } else {
      expect(item.correctAnswer).toBe('=');
    }
  });

  test('createComparisonTest devrait créer un test avec le bon nombre d\'items', () => {
    const numberOfItems = 5;
    const test = createComparisonTest(numberOfItems);

    expect(test).toHaveProperty('id');
    expect(test.items).toHaveLength(numberOfItems);
    expect(test.currentItemIndex).toBe(0);
    expect(test.status).toBe('not_started');
    expect(test.startTime).toBeInstanceOf(Date);

    // Vérifier que tous les items ont des comparaisons valides
    test.items.forEach(item => {
      expect(['<', '=', '>']).toContain(item.correctAnswer);
    });
  });

  test('checkAnswer devrait correctement valider les réponses', () => {
    const items = [
      {
        id: '1',
        firstNumber: 5,
        secondNumber: 8,
        correctAnswer: '<'
      },
      {
        id: '2',
        firstNumber: 8,
        secondNumber: 5,
        correctAnswer: '>'
      },
      {
        id: '3',
        firstNumber: 5,
        secondNumber: 5,
        correctAnswer: '='
      }
    ];

    expect(checkAnswer(items[0], '<')).toBe(true);
    expect(checkAnswer(items[0], '>')).toBe(false);
    expect(checkAnswer(items[1], '>')).toBe(true);
    expect(checkAnswer(items[1], '=')).toBe(false);
    expect(checkAnswer(items[2], '=')).toBe(true);
    expect(checkAnswer(items[2], '<')).toBe(false);
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