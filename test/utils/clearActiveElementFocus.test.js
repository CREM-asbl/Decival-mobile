import { afterEach, describe, expect, test } from 'vitest';
import { clearActiveElementFocus } from '../../src/utils/clearActiveElementFocus';

describe('clearActiveElementFocus focus reset', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('retire le focus de l’élément actif avant d’afficher la question suivante', () => {
    document.body.innerHTML = '<button type="button">17</button>';
    const button = document.querySelector('button');

    button.focus();
    expect(document.activeElement).toBe(button);

    clearActiveElementFocus();

    expect(document.activeElement).not.toBe(button);
  });

  test('réinitialise la sélection sur changement de question', () => {
    document.body.innerHTML = '<div id="container"><button id="btn1">></button></div>';
    const container = document.getElementById('container');
    const btn = document.getElementById('btn1');
    btn.focus();
    expect(document.activeElement).toBe(btn);

    // Simulation de re-mount du container
    clearActiveElementFocus();
    container.innerHTML = '<button id="btn2">></button>';
    expect(document.activeElement).not.toBe(document.getElementById('btn2'));
  });
});
