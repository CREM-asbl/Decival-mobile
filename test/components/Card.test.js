import { describe, expect, test } from 'vitest';
import { loadCompiledComponent } from '../utils/testHelpers';

describe('Card Component', () => {
  test('devrait rendre correctement avec les props données', async () => {
    const componentPath = 'src/components/Card.astro';
    const componentContent = await loadCompiledComponent(componentPath);

    expect(componentContent).not.toBeNull();
    expect(componentContent).toContain('export interface Props');
    expect(componentContent).toContain('title: string');
    expect(componentContent).toContain('body: string');
    expect(componentContent).toContain('href: string');
    expect(componentContent).toContain('class="group flex');
    expect(componentContent).toContain('href={href}');
    expect(componentContent).toContain('{title}');
    expect(componentContent).toContain('{body}');
  });

  test('devrait être adapté pour mobile', async () => {
    const componentPath = 'src/components/Card.astro';
    const componentContent = await loadCompiledComponent(componentPath);

    expect(componentContent).toContain('@media (max-width: 640px)');
  });
});