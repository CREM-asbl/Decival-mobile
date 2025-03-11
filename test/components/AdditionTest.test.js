import { describe, expect, test } from 'vitest';
import { loadCompiledComponent } from '../utils/testHelpers';

describe('AdditionTest Component', () => {
  test('devrait afficher correctement les nombres à additionner', async () => {
    const item = {
      id: '1',
      firstNumber: 25,
      secondNumber: 17,
      correctAnswer: 42
    };

    const componentPath = 'src/components/tests/AdditionTest.astro';
    const content = await loadCompiledComponent(componentPath);

    expect(content).toContain('item.firstNumber');
    expect(content).toContain('item.secondNumber');
    expect(content).toContain('text-accent" aria-hidden="true">+</span>');
  });

  test('devrait être accessible', async () => {
    const componentPath = 'src/components/tests/AdditionTest.astro';
    const content = await loadCompiledComponent(componentPath);

    // Vérification des attributs d'accessibilité
    expect(content).toContain('aria-');
    expect(content).toContain('role=');
    expect(content).toContain('label=');
  });

  test('devrait être adapté au mobile', async () => {
    const componentPath = 'src/components/tests/AdditionTest.astro';
    const content = await loadCompiledComponent(componentPath);

    // Vérification des classes Tailwind pour le responsive
    expect(content).toContain('sm:');
    expect(content).toContain('max-w-');
    expect(content).toContain('w-full');
  });

  test('devrait gérer la soumission du formulaire', async () => {
    const componentPath = 'src/components/tests/AdditionTest.astro';
    const content = await loadCompiledComponent(componentPath);

    expect(content).toContain('form.addEventListener("submit"');
    expect(content).toContain('preventDefault()');
    expect(content).toContain('answer-submitted');
  });
});