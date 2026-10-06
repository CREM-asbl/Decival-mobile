// Tests pour vérifier la génération des nombres décimaux comme dans l'ancienne version
import { describe, expect, test } from 'vitest';
import { createAdditionTest } from '../../src/logic/additionLogic';
import { createComparisonTest } from '../../src/logic/comparisonLogic';
import { createMultiplicationTest } from '../../src/logic/multiplicationLogic';
import { createSubtractionTest } from '../../src/logic/subtractionLogic';

describe('Génération de nombres décimaux', () => {
  describe('Addition avec décimaux', () => {
    test('La création d\'un test d\'addition en mode décimal devrait générer des items uniques', () => {
      const test = createAdditionTest(7, 'decimal');

      // Vérifier que les items sont uniques (pas de doublons)
      const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}|${item.type}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(test.items.length); // Tous les items doivent être uniques

      expect(test.items.length).toBe(7);
      expect(test.mode).toBe('decimal');

      // Vérifier que chaque item possède les propriétés attendues pour les tests décimaux
      test.items.forEach(item => {
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('errorTypes');
        expect(item).toHaveProperty('firstNumber');
        expect(item).toHaveProperty('secondNumber');
        expect(item).toHaveProperty('correctAnswer');

        // Vérifier que le résultat est correctement calculé
        // Convertir en chaîne pour éviter les problèmes de précision flottante
        const calculatedAnswer = parseFloat((item.firstNumber + item.secondNumber).toFixed(2));
        const storedAnswer = parseFloat(item.correctAnswer.toFixed(2));
        expect(storedAnswer).toBeCloseTo(calculatedAnswer, 2);
      });
    });

    test('Les calculs des nombres décimaux doivent avoir la précision attendue', () => {
      const test = createAdditionTest(20, 'decimal');

      test.items.forEach(item => {
        let expectedPrecision;

        // Définir la précision attendue selon le type d'exercice
        if (item.type === 0 || item.type === 3 || item.type === 6) {
          expectedPrecision = 1; // 1 décimale
        } else {
          expectedPrecision = 2; // 2 décimales
        }

        // Vérifier que la réponse a la précision attendue
        const decimalPlaces = (item.correctAnswer.toString().split('.')[1] || '').length;
        expect(decimalPlaces).toBeLessThanOrEqual(expectedPrecision);
      });
    });
  });
  describe('Soustraction avec décimaux', () => {
    test('La création d\'un test de soustraction en mode décimal devrait générer des items uniques', () => {
      const test = createSubtractionTest(7, 'decimal');

      // Vérifier que les items sont uniques (pas de doublons)
      const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}|${item.type}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(test.items.length); // Tous les items doivent être uniques

      expect(test.items.length).toBe(7);
      expect(test.mode).toBe('decimal');

      // Vérifier que chaque item possède les propriétés attendues pour les tests décimaux
      test.items.forEach(item => {
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('errorTypes');
        expect(item).toHaveProperty('firstNumber');
        expect(item).toHaveProperty('secondNumber');
        expect(item).toHaveProperty('correctAnswer');

        // Vérifier que le premier nombre est toujours plus grand que le second (résultat positif)
        expect(item.firstNumber).toBeGreaterThanOrEqual(item.secondNumber);

        // Vérifier que le résultat est correctement calculé
        let precision = 1;
        if (item.type === 1 || item.type === 2 || item.type === 4 || item.type === 5) {
          precision = 2; // 2 décimales pour certains types
        }
        const expectedAnswer = parseFloat((item.firstNumber - item.secondNumber).toFixed(precision));
        expect(item.correctAnswer).toBeCloseTo(expectedAnswer, precision);
      });
    });

    test('Les calculs de soustraction décimale doivent avoir la précision correcte selon le type', () => {
      const test = createSubtractionTest(21, 'decimal');

      test.items.forEach(item => {
        let expectedPrecision;

        // Définir la précision attendue selon le type d'exercice
        if (item.type === 0 || item.type === 3 || item.type === 6) {
          expectedPrecision = 1; // 1 décimale
        } else {
          expectedPrecision = 2; // 2 décimales
        }

        // Vérifier que la réponse a la précision attendue
        const decimalStr = item.correctAnswer.toString().split('.')[1] || '';
        const decimalPlaces = decimalStr.length;
        expect(decimalPlaces).toBeLessThanOrEqual(expectedPrecision);
      });
    });
  });

  describe('Multiplication avec décimaux', () => {
    test('La création d\'un test de multiplication en mode décimal devrait générer des items uniques', () => {
      const test = createMultiplicationTest(7, 'decimal');

      // Vérifier que les items sont uniques (pas de doublons)
      const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}|${item.type}`);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(test.items.length); // Tous les items doivent être uniques

      expect(test.items.length).toBe(7);
      expect(test.mode).toBe('decimal');

      // Vérifier que chaque item possède les propriétés attendues pour les tests décimaux
      test.items.forEach(item => {
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('errorTypes');
        expect(item).toHaveProperty('firstNumber');
        expect(item).toHaveProperty('secondNumber');
        expect(item).toHaveProperty('correctAnswer');

        // Vérifier la précision du calcul selon le type
        // (même convention que la génération : 0 décimale pour le type 1, 3 pour les types en 0,01)
        let precision = 2;
        if (item.type === 1) {
          precision = 0;
        } else if (item.type === 3 || item.type === 5) {
          precision = 3;
        }

        // Vérifier que le résultat est correctement calculé avec la précision appropriée
        const expectedAnswer = parseFloat((item.firstNumber * item.secondNumber).toFixed(precision));
        expect(item.correctAnswer).toBeCloseTo(expectedAnswer, precision);
      });
    });

    test('Les calculs de multiplication décimale doivent avoir la précision correcte selon le type', () => {
      const test = createMultiplicationTest(20, 'decimal');

      test.items.forEach(item => {
        let expectedPrecision;

        // Définir la précision attendue selon le type d'exercice
        if (item.type === 1) {
          expectedPrecision = 0; // Multiplication par 10, 100
        } else if (item.type === 0 || item.type === 2 || item.type === 4 || item.type === 6) {
          expectedPrecision = 2; // La plupart des types ont au plus 2 décimales
        } else if (item.type === 3 || item.type === 5) {
          expectedPrecision = 3; // Types avec 0,01 ou 0,001
        } else {
          expectedPrecision = 2; // Fallback
        }

        // Vérifier que la réponse a la précision attendue
        const decimalStr = item.correctAnswer.toString().split('.')[1] || '';
        const significantDecimals = decimalStr.replace(/0+$/, '').length; // Ignorer les zéros finaux
        expect(significantDecimals).toBeLessThanOrEqual(expectedPrecision);
      });
    });
  });

  describe('Comparaison avec décimaux', () => {
      test('La création d\'un test de comparaison en mode décimal devrait générer des items uniques', () => {
        const test = createComparisonTest(7, 'decimal');

        // Vérifier que les items sont uniques (pas de doublons)
        const keys = test.items.map(item => `${item.firstNumber}_${item.secondNumber}|${item.type}`);
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(test.items.length); // Tous les items doivent être uniques

        expect(test.items.length).toBe(7);
        expect(test.mode).toBe('decimal');

        // Vérifier que chaque item possède les propriétés attendues pour les tests décimaux
        test.items.forEach(item => {
          expect(item).toHaveProperty('type');
          expect(item).toHaveProperty('errorTypes');
          expect(item).toHaveProperty('firstNumber');
          expect(item).toHaveProperty('secondNumber');
          expect(item).toHaveProperty('correctAnswer');

          // Vérifier que la réponse correcte est cohérente avec les nombres
          if (item.firstNumber > item.secondNumber) {
            expect(item.correctAnswer).toBe('>');
          } else if (item.firstNumber < item.secondNumber) {
            expect(item.correctAnswer).toBe('<');
          } else {
            expect(item.correctAnswer).toBe('=');
          }
        });
      });

    test('Les comparaisons de nombres décimaux doivent être correctes', () => {
      // Cas d'égalité avec zéros non significatifs : types 1 et 5
      for (let i = 0; i < 10; i++) {
        const test = createComparisonTest(7, 'decimal');
        const equalityItem = test.items.find(item => item.type === 1 || item.type === 5);

        // Avec 7 items répartis sur les 7 types, les types 1 et 5 sont toujours présents
        expect(equalityItem).toBeDefined();

        // Les nombres doivent être égaux malgré des affichages différents :
        // l'un porte un zéro après la virgule, l'autre non
        expect(equalityItem.correctAnswer).toBe('=');
        expect(equalityItem.firstNumber).toBeCloseTo(equalityItem.secondNumber, 5);
        expect(equalityItem.firstNumber).toBe(equalityItem.secondNumber);

        const firstDisplay = equalityItem.firstNumberDisplay;
        const secondDisplay = equalityItem.secondNumberDisplay;

        // Les deux affichages sont numériquement identiques...
        expect(parseFloat(firstDisplay.replace(',', '.'))).toBe(equalityItem.firstNumber);
        expect(parseFloat(secondDisplay.replace(',', '.'))).toBe(equalityItem.secondNumber);

        // ...mais textuellement différents : le zéro final est ajouté d'un seul côté
        expect(firstDisplay).not.toBe(secondDisplay);
        expect(firstDisplay === secondDisplay + '0' || secondDisplay === firstDisplay + '0').toBe(true);
        expect(firstDisplay.endsWith('0')).not.toBe(secondDisplay.endsWith('0'));

        // L'affichage respecte la convention française (virgule décimale)
        expect(firstDisplay).toContain(',');
        expect(secondDisplay).toContain(',');
      }
    });
  });
});
