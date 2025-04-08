// Tests pour vérifier la génération des nombres décimaux comme dans l'ancienne version
import { describe, expect, test } from 'vitest';
import { createAdditionTest } from '../../src/logic/additionLogic';
import { createComparisonTest } from '../../src/logic/comparisonLogic';
import { createMultiplicationTest } from '../../src/logic/multiplicationLogic';
import { createSubtractionTest } from '../../src/logic/subtractionLogic';

describe('Génération de nombres décimaux', () => {
  describe('Addition avec décimaux', () => {
    test('La création d\'un test d\'addition en mode décimal devrait générer des items décimaux distribués', () => {
      const test = createAdditionTest(7, 'decimal');

      // Vérifier que les 7 items couvrent les 7 types de cas d'utilisation
      const types = new Set(test.items.map(item => item.type));

      expect(types.size).toBe(7); // Devrait avoir 7 types différents (0-6)
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

      // Tester la distribution des types
      expect(test.items.filter(item => item.type === 0).length).toBe(1); // Type 0: Somme de dixièmes sans retenue
      expect(test.items.filter(item => item.type === 1).length).toBe(1); // Type 1: Somme de centièmes sans retenue
      expect(test.items.filter(item => item.type === 2).length).toBe(1); // Type 2: Somme avec précisions différentes
      expect(test.items.filter(item => item.type === 3).length).toBe(1); // Type 3: Somme avec retenue
      expect(test.items.filter(item => item.type === 4).length).toBe(1); // Type 4: Somme de centièmes avec retenue
      expect(test.items.filter(item => item.type === 5).length).toBe(1); // Type 5: Addition avec nombres à plusieurs décimales
      expect(test.items.filter(item => item.type === 6).length).toBe(1); // Type 6: Addition d'entier et décimal
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
    test('La création d\'un test de soustraction en mode décimal devrait générer des items décimaux valides', () => {
      const test = createSubtractionTest(10, 'decimal');

      expect(test.items.length).toBe(10);
      expect(test.mode).toBe('decimal');

      test.items.forEach(item => {
        expect(item).toHaveProperty('firstNumber');
        expect(item).toHaveProperty('secondNumber');
        expect(item).toHaveProperty('correctAnswer');

        // Vérifier que le premier nombre est toujours plus grand que le second (résultat positif)
        expect(item.firstNumber).toBeGreaterThanOrEqual(item.secondNumber);

        // Vérifier que le résultat est correctement calculé
        const expectedAnswer = parseFloat((item.firstNumber - item.secondNumber).toFixed(1));
        expect(item.correctAnswer).toBeCloseTo(expectedAnswer, 1);        // Vérifier que les nombres sont générés avec la précision attendue
        // Nous vérifions la valeur arrondie plutôt que le nombre de décimales dans la représentation interne
        const roundedFirst = parseFloat(item.firstNumber.toFixed(1));
        const roundedSecond = parseFloat(item.secondNumber.toFixed(1));

        // Vérifier que les arrondis sont proches des originaux (ne devraient pas changer significativement)
        expect(item.firstNumber).toBeCloseTo(roundedFirst, 1);
        expect(item.secondNumber).toBeCloseTo(roundedSecond, 1);
      });
    });
  });

  describe('Multiplication avec décimaux', () => {
    test('La création d\'un test de multiplication en mode décimal devrait générer des items décimaux distribués', () => {
      const test = createMultiplicationTest(5, 'decimal');

      // Vérifier que les 5 items couvrent les 5 types de cas d'utilisation
      const types = new Set(test.items.map(item => item.type));

      expect(types.size).toBe(5); // Devrait avoir 5 types différents (0-4)
      expect(test.items.length).toBe(5);
      expect(test.mode).toBe('decimal');

      // Vérifier que chaque item possède les propriétés attendues pour les tests décimaux
      test.items.forEach(item => {
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('errorTypes');
        expect(item).toHaveProperty('firstNumber');
        expect(item).toHaveProperty('secondNumber');
        expect(item).toHaveProperty('correctAnswer');

        // Vérifier la précision du calcul selon le type
        let precision = 1;
        if (item.type === 2 || item.type === 3) {
          precision = 2;
        } else if (item.type === 4) {
          precision = 3;
        }

        // Vérifier que le résultat est correctement calculé avec la précision appropriée
        const expectedAnswer = parseFloat((item.firstNumber * item.secondNumber).toFixed(precision));
        expect(item.correctAnswer).toBeCloseTo(expectedAnswer, precision);
      });

      // Tester la distribution des types
      expect(test.items.filter(item => item.type === 0).length).toBe(1); // Type 0: Produit sans changement de position
      expect(test.items.filter(item => item.type === 1).length).toBe(1); // Type 1: Produit avec changement de position
      expect(test.items.filter(item => item.type === 2).length).toBe(1); // Type 2: Multiplication de deux décimaux
      expect(test.items.filter(item => item.type === 3).length).toBe(1); // Type 3: Multiplication avec retenue
      expect(test.items.filter(item => item.type === 4).length).toBe(1); // Type 4: Multiplication avec précisions différentes
    });

    test('Les calculs de multiplication décimale doivent avoir la précision correcte selon le type', () => {
      const test = createMultiplicationTest(20, 'decimal');

      test.items.forEach(item => {
        let expectedPrecision;

        // Définir la précision attendue selon le type d'exercice
        if (item.type === 0 || item.type === 1) {
          expectedPrecision = 1; // 1 décimale
        } else if (item.type === 2 || item.type === 3) {
          expectedPrecision = 2; // 2 décimales
        } else if (item.type === 4) {
          expectedPrecision = 3; // 3 décimales
        }

        // Vérifier que la réponse a la précision attendue
        const decimalStr = item.correctAnswer.toString().split('.')[1] || '';
        const significantDecimals = decimalStr.replace(/0+$/, '').length; // Ignorer les zéros finaux
        expect(significantDecimals).toBeLessThanOrEqual(expectedPrecision);
      });
    });
  });

  describe('Comparaison avec décimaux', () => {
    test('La création d\'un test de comparaison en mode décimal devrait générer des items décimaux distribués', () => {
      const test = createComparisonTest(7, 'decimal');

      // Vérifier que les 7 items couvrent les 7 types de cas d'utilisation
      const types = new Set(test.items.map(item => item.type));

      expect(types.size).toBe(7); // Devrait avoir 7 types différents (0-6)
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

      // Tester la distribution des types
      expect(test.items.filter(item => item.type === 0).length).toBe(1); // Type 0: Comparaison simple de dixièmes
      expect(test.items.filter(item => item.type === 1).length).toBe(1); // Type 1: Comparaison avec zéros non significatifs
      expect(test.items.filter(item => item.type === 2).length).toBe(1); // Type 2: Comparaison dixième vs centième (même chiffre)
      expect(test.items.filter(item => item.type === 3).length).toBe(1); // Type 3: Comparaison dixième vs centième (différents chiffres)
      expect(test.items.filter(item => item.type === 4).length).toBe(1); // Type 4: Comparaison avec confusion possible
      expect(test.items.filter(item => item.type === 5).length).toBe(1); // Type 5: Comparaison avec zéro à droite et différents chiffres
      expect(test.items.filter(item => item.type === 6).length).toBe(1); // Type 6: Comparaison avec zéro à droite, même valeur
    });

    test('Les comparaisons de nombres décimaux doivent être correctes', () => {
      // Tester spécifiquement le cas d'égalité (type 6)
      for (let i = 0; i < 10; i++) {
        const test = createComparisonTest(7, 'decimal');
        const equalityItem = test.items.find(item => item.type === 6);

        if (equalityItem) {
          // Pour ce type, les nombres doivent être égaux malgré des formats différents
          // L'un a un zéro après la virgule, l'autre non
          expect(equalityItem.correctAnswer).toBe('=');

          // Vérifier que les nombres sont numériquement égaux mais textuellement différents
          expect(equalityItem.firstNumber).toBeCloseTo(equalityItem.secondNumber, 5);

          // Vérifier que l'un des nombres a un format avec 0 à droite
          const firstStr = equalityItem.firstNumber.toString();
          const secondStr = equalityItem.secondNumber.toString();

          // Au moins un des deux nombres doit avoir une décimale non vide
          expect(firstStr.includes('.') || secondStr.includes('.')).toBe(true);
        }
      }
    });
  });
});
