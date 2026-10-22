import { describe, it, expect } from 'vitest';
import { generateTeacherFeedback } from '../../src/logic/teacherFeedback';

function makeIntegerTest(type, correct, total) {
  return {
    type,
    mode: 'integer',
    items: Array(total).fill(0).map((_, i) => ({
      firstNumber: 10 + i,
      secondNumber: 5,
      userAnswer: i < correct ? 'ok' : 'ko',
      isCorrect: i < correct
    }))
  };
}

describe('Integer mastery verdict (binary, 80% threshold)', () => {
  it('addition 23/28 integer => mastered, no per-type results', () => {
    const feedback = generateTeacherFeedback(makeIntegerTest('addition', 23, 28));
    expect(feedback.integerMastery.mastered).toBe(true);
    expect(feedback.integerMastery.correct).toBe(23);
    expect(feedback.integerMastery.total).toBe(28);
    expect(feedback.resultsByType).toEqual([]);
    expect(feedback.comparisonProfile).toBeUndefined();
  });

  it('subtraction 18/28 integer => not mastered', () => {
    const feedback = generateTeacherFeedback(makeIntegerTest('subtraction', 18, 28));
    expect(feedback.integerMastery.mastered).toBe(false);
    expect(feedback.resultsByType).toEqual([]);
  });

  it('comparison 40/49 integer => mastered, no false OTHER profile', () => {
    const test = {
      type: 'comparison',
      mode: 'integer',
      items: Array(49).fill(0).map((_, i) => ({
        firstNumberDisplay: `${10 + i}`,
        secondNumberDisplay: `${5}`,
        userAnswer: i < 40 ? '>' : '<',
        isCorrect: i < 40
      }))
    };
    const feedback = generateTeacherFeedback(test);
    expect(feedback.integerMastery.mastered).toBe(true);
    expect(feedback.comparisonProfile).toBeUndefined();
    expect(feedback.resultsByType).toEqual([]);
  });

  it('comparison 20/49 integer => not mastered, no INSTRUCTIONS_NOT_UNDERSTOOD', () => {
    const test = {
      type: 'comparison',
      mode: 'integer',
      items: Array(49).fill(0).map((_, i) => ({
        firstNumberDisplay: `${10 + i}`,
        secondNumberDisplay: `${5}`,
        userAnswer: i < 20 ? '>' : '<',
        isCorrect: i < 20
      }))
    };
    const feedback = generateTeacherFeedback(test);
    expect(feedback.integerMastery.mastered).toBe(false);
    expect(feedback.comparisonProfile).toBeUndefined();
  });

  it('decimal mode unchanged: per-type results still produced', () => {
    const test = {
      type: 'addition',
      mode: 'decimal',
      items: Array(28).fill(0).map((_, i) => ({
        type: i % 7,
        firstNumber: 1.2,
        secondNumber: 3.4,
        userAnswer: '4.6',
        isCorrect: true
      }))
    };
    const feedback = generateTeacherFeedback(test);
    expect(feedback.integerMastery).toBeUndefined();
    expect(feedback.resultsByType.length).toBeGreaterThan(0);
  });
});
