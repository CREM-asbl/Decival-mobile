import { describe, expect, test } from 'vitest';
import { analyzeError as analyzeSubtractionError } from '../../src/logic/subtractionLogic';
import { analyzeError as analyzeAdditionError } from '../../src/logic/additionLogic';
import { analyzeError as analyzeMultiplicationError } from '../../src/logic/multiplicationLogic';
import { analyzeError as analyzeComparisonError } from '../../src/logic/comparisonLogic';

// ============================================================================
// Tests pour subtractionLogic.analyzeError()
// ============================================================================
describe('subtractionLogic.analyzeError', () => {
    test('devrait retourner "none" pour une réponse correcte', () => {
        const item = {
            id: '1',
            firstNumber: 0.8,
            secondNumber: 0.3,
            correctAnswer: 0.5,
            rule: { id: 'sub-dec-2', name: 'Soustraction de dixièmes sans emprunt' }
        };

        const result = analyzeSubtractionError(item, 0.5);
        expect(result.errorType).toBe('none');
        expect(result.feedback).toBe('Réponse correcte');
    });

    test('devrait détecter une inversion de l\'ordre des nombres', () => {
        const item = {
            id: '1',
            firstNumber: 8,
            secondNumber: 3,
            correctAnswer: 5,
            rule: { id: 'sub-1', name: 'Soustraction simple' }
        };

        // L'utilisateur a fait 3 - 8 = -5
        const result = analyzeSubtractionError(item, -5);
        expect(result.errorType).toBe('invertedOrder');
        expect(result.feedback).toContain('ordre');
    });

    test('devrait détecter une erreur d\'emprunt', () => {
        const item = {
            id: '1',
            firstNumber: 25,
            secondNumber: 8,
            correctAnswer: 17,
            rule: { id: 'sub-2', name: 'Soustraction avec emprunt' }
        };

        // Différence de 1 (erreur d'emprunt typique)
        const result = analyzeSubtractionError(item, 18);
        expect(result.errorType).toBe('borrowing');
        expect(result.feedback).toContain('emprunt');
    });

    test('devrait détecter une erreur d\'alignement décimal', () => {
        const item = {
            id: '1',
            firstNumber: 0.5,
            secondNumber: 0.3,
            correctAnswer: 0.2,
            rule: { id: 'sub-dec-2', name: 'Soustraction de dixièmes' }
        };

        // Réponse différente de la correcte
        const result = analyzeSubtractionError(item, 0.8);
        expect(['decimalAlignment', 'calculation']).toContain(result.errorType);
    });

    test('devrait retourner une erreur de calcul pour les autres cas', () => {
        const item = {
            id: '1',
            firstNumber: 10,
            secondNumber: 4,
            correctAnswer: 6,
            rule: { id: 'sub-1', name: 'Soustraction simple' }
        };

        const result = analyzeSubtractionError(item, 3);
        expect(result.errorType).toBe('calculation');
        expect(result.rule).toBeDefined();
    });
});

// ============================================================================
// Tests pour additionLogic.analyzeError()
// ============================================================================
describe('additionLogic.analyzeError', () => {
    test('devrait retourner "none" pour une réponse correcte', () => {
        const item = {
            id: '1',
            firstNumber: 0.3,
            secondNumber: 0.5,
            correctAnswer: 0.8,
            errorTypes: ['powerOfTen', 'decimalSum'],
            rule: { id: 'add-dec-2', name: 'Addition de dixièmes sans retenue' }
        };

        const result = analyzeAdditionError(item, 0.8);
        expect(result.errorType).toBe('none');
        expect(result.feedback).toBe('Réponse correcte');
    });

    test('devrait détecter une erreur de puissance de 10 (x10)', () => {
        const item = {
            id: '1',
            firstNumber: 0.3,
            secondNumber: 0.5,
            correctAnswer: 0.8,
            errorTypes: ['powerOfTen', 'decimalSum'],
            rule: { id: 'add-dec-2', name: 'Addition de dixièmes sans retenue' }
        };

        // L'utilisateur a répondu 8 au lieu de 0.8 (erreur x10)
        const result = analyzeAdditionError(item, 8);
        expect(result.errorType).toBe('powerOfTen');
        expect(result.feedback).toContain('virgule');
    });

    test('devrait détecter une erreur de puissance de 10 (/10)', () => {
        const item = {
            id: '1',
            firstNumber: 0.3,
            secondNumber: 0.5,
            correctAnswer: 0.8,
            errorTypes: ['powerOfTen', 'decimalSum'],
            rule: { id: 'add-dec-2', name: 'Addition de dixièmes sans retenue' }
        };

        // L'utilisateur a répondu 0.08 au lieu de 0.8 (erreur /10)
        const result = analyzeAdditionError(item, 0.08);
        expect(result.errorType).toBe('powerOfTen');
    });

    test('devrait détecter une erreur de retenue', () => {
        const item = {
            id: '1',
            firstNumber: 0.7,
            secondNumber: 0.8,
            correctAnswer: 1.5,
            errorTypes: ['carry', 'decimalSum'],
            rule: { id: 'add-dec-5', name: 'Addition de dixièmes avec retenue' }
        };

        // Différence de 1 (oubli de retenue)
        const result = analyzeAdditionError(item, 0.5);
        expect(result.errorType).toBe('carry');
        expect(result.feedback).toContain('retenue');
    });

    test('devrait retourner une erreur de calcul générique', () => {
        const item = {
            id: '1',
            firstNumber: 5,
            secondNumber: 3,
            correctAnswer: 8,
            errorTypes: ['simpleAddition'],  // Must have errorTypes for 'calculation' type
            rule: { id: 'add-1', name: 'Addition simple' }
        };

        const result = analyzeAdditionError(item, 6);
        expect(result.errorType).toBe('calculation');
        expect(result.rule).toBeDefined();
    });

    test('devrait gérer les items sans errorTypes', () => {
        const item = {
            id: '1',
            firstNumber: 5,
            secondNumber: 3,
            correctAnswer: 8
        };

        const result = analyzeAdditionError(item, 6);
        expect(result.errorType).toBe('unknown');
        expect(result.rule).toBeDefined();
    });
});

// ============================================================================
// Tests pour multiplicationLogic.analyzeError()
// ============================================================================
describe('multiplicationLogic.analyzeError', () => {
    test('devrait retourner "none" pour une réponse correcte', () => {
        const item = {
            id: '1',
            firstNumber: 0.5,
            secondNumber: 0.2,
            correctAnswer: 0.1,
            errorTypes: ['powerOfTen', 'decimalProduct'],
            rule: { id: 'mult-dec-4', name: 'Multiplication de deux nombres décimaux' }
        };

        const result = analyzeMultiplicationError(item, 0.1);
        expect(result.errorType).toBe('none');
        expect(result.feedback).toBe('Réponse correcte');
    });

    test('devrait détecter une erreur de puissance de 10 (x10)', () => {
        const item = {
            id: '1',
            firstNumber: 0.5,
            secondNumber: 0.2,
            correctAnswer: 0.1,
            errorTypes: ['powerOfTen', 'decimalProduct'],
            rule: { id: 'mult-dec-4', name: 'Multiplication de deux nombres décimaux' }
        };

        // L'utilisateur a répondu 1 au lieu de 0.1 (erreur x10)
        const result = analyzeMultiplicationError(item, 1);
        expect(result.errorType).toBe('powerOfTen');
        expect(result.feedback).toContain('virgule');
    });

    test('devrait détecter une erreur de puissance de 10 (x100)', () => {
        const item = {
            id: '1',
            firstNumber: 0.5,
            secondNumber: 0.2,
            correctAnswer: 0.1,
            errorTypes: ['powerOfTen', 'decimalProduct'],
            rule: { id: 'mult-dec-4', name: 'Multiplication de deux nombres décimaux' }
        };

        // L'utilisateur a répondu 10 au lieu de 0.1 (erreur x100)
        const result = analyzeMultiplicationError(item, 10);
        expect(result.errorType).toBe('powerOfTen');
    });

    test('devrait retourner une erreur de calcul générique', () => {
        const item = {
            id: '1',
            firstNumber: 3,
            secondNumber: 4,
            correctAnswer: 12,
            errorTypes: ['tableMultiplication'],  // Must have errorTypes for detection
            rule: { id: 'mult-1', name: 'Multiplication simple' }
        };

        const result = analyzeMultiplicationError(item, 15);
        expect(['calculation', 'multiplicationTable']).toContain(result.errorType);
        expect(result.rule).toBeDefined();
    });

    test('devrait gérer les items sans errorTypes', () => {
        const item = {
            id: '1',
            firstNumber: 3,
            secondNumber: 4,
            correctAnswer: 12
        };

        const result = analyzeMultiplicationError(item, 15);
        expect(result.errorType).toBe('unknown');
        expect(result.rule).toBeDefined();
    });
});

// ============================================================================
// Tests pour comparisonLogic.analyzeError()
// ============================================================================
describe('comparisonLogic.analyzeError', () => {
    test('devrait retourner "none" pour une réponse correcte', () => {
        const item = {
            id: '1',
            firstNumber: 0.5,
            secondNumber: 0.3,
            correctAnswer: '>',
            errorTypes: ['simpleComparison', 'decimal'],
            rule: { id: 'comp-dec-8', name: 'Comparaison simple de dixièmes' }
        };

        const result = analyzeComparisonError(item, '>');
        expect(result.errorType).toBe('none');
        expect(result.feedback).toBe('Réponse correcte');
    });

    test('devrait détecter une inversion de symboles (< au lieu de >)', () => {
        const item = {
            id: '1',
            firstNumber: 0.5,
            secondNumber: 0.3,
            correctAnswer: '>',
            errorTypes: ['simpleComparison', 'decimal'],
            rule: { id: 'comp-dec-8', name: 'Comparaison simple de dixièmes' }
        };

        const result = analyzeComparisonError(item, '<');
        expect(result.errorType).toBe('inversedSymbols');
        expect(result.feedback).toContain('sens du symbole');
    });

    test('devrait détecter une inversion de symboles (> au lieu de <)', () => {
        const item = {
            id: '1',
            firstNumber: 0.3,
            secondNumber: 0.5,
            correctAnswer: '<',
            errorTypes: ['simpleComparison', 'decimal'],
            rule: { id: 'comp-dec-8', name: 'Comparaison simple de dixièmes' }
        };

        const result = analyzeComparisonError(item, '>');
        expect(result.errorType).toBe('inversedSymbols');
    });

    test('devrait détecter une erreur de position décimale', () => {
        const item = {
            id: '1',
            firstNumber: 0.1,
            secondNumber: 0.01,
            correctAnswer: '>',
            type: 2,
            errorTypes: ['placeValue', 'decimalPlacement'],
            rule: { id: 'comp-dec-10', name: 'Comparaison dixième vs centième' }
        };

        const result = analyzeComparisonError(item, '<');
        expect(['decimalPosition', 'inversedSymbols']).toContain(result.errorType);
    });

    test('devrait détecter une erreur avec les zéros à droite', () => {
        const item = {
            id: '1',
            firstNumber: 0.1,
            secondNumber: 0.1,
            correctAnswer: '=',
            type: 5,
            errorTypes: ['zeroAtRight'],
            rule: { id: 'comp-dec-9', name: 'Comparaison avec zéros non significatifs' }
        };

        // L'utilisateur pense que 0,10 != 0,1
        const result = analyzeComparisonError(item, '>');
        expect(['misunderstoodZero', 'comparison']).toContain(result.errorType);
    });

    test('devrait retourner une erreur de comparaison générique', () => {
        const item = {
            id: '1',
            firstNumber: 5,
            secondNumber: 3,
            correctAnswer: '>',
            errorTypes: ['simpleComparison'],
            rule: { id: 'comp-1', name: 'Comparaison de nombres' }
        };

        const result = analyzeComparisonError(item, '=');
        expect(result.errorType).toBe('comparison');
        expect(result.rule).toBeDefined();
    });

    test('devrait gérer les items sans errorTypes', () => {
        const item = {
            id: '1',
            firstNumber: 5,
            secondNumber: 3,
            correctAnswer: '>'
        };

        const result = analyzeComparisonError(item, '<');
        expect(['unknown', 'inversedSymbols']).toContain(result.errorType);
        expect(result.rule).toBeDefined();
    });
});
