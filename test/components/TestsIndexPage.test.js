import { describe, expect, test } from 'vitest';
import { loadCompiledComponent } from '../utils/testHelpers';

describe('Tests index page', () => {
  test('place le test de comparaison en premier dans la liste', async () => {
    const content = await loadCompiledComponent('src/pages/tests/index.astro');

    const comparisonIndex = content.indexOf('id: "comparison"');
    const additionIndex = content.indexOf('id: "addition"');
    const subtractionIndex = content.indexOf('id: "subtraction"');
    const multiplicationIndex = content.indexOf('id: "multiplication"');

    expect(comparisonIndex).toBeGreaterThanOrEqual(0);
    expect(comparisonIndex).toBeLessThan(additionIndex);
    expect(comparisonIndex).toBeLessThan(subtractionIndex);
    expect(comparisonIndex).toBeLessThan(multiplicationIndex);
  });
});
