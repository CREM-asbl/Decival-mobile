
import { createAdditionTest } from '../src/logic/additionLogic';
import { createSubtractionTest } from '../src/logic/subtractionLogic';
import { createMultiplicationTest } from '../src/logic/multiplicationLogic';
import { createComparisonTest } from '../src/logic/comparisonLogic';
import * as fs from 'fs';

const FORBIDDEN_RULES = [
    'add-dec-1',
    'sub-dec-1',
    'mult-dec-1',
    'comp-dec-1'
];

let logOutput = '';
function log(msg: string) {
    console.log(msg);
    logOutput += msg + '\n';
}

function verifyGenerator(name: string, creator: (size: number, mode: 'decimal') => any, iterations = 200) {
    log(`\n--- Verifying ${name} (Small Tests Simulation) ---`);
    const ruleCounts: Record<string, number> = {};
    let forbiddenCount = 0;
    const TEST_SIZE = 5;

    for (let i = 0; i < iterations; i++) {
        // Create a small test of 5 items
        const test = creator(TEST_SIZE, 'decimal');

        test.items.forEach((item: any) => {
            // Check if rule exists
            if (!item.rule || !item.rule.id) {
                log(`❌ Item missing rule ID: ${JSON.stringify(item)}`);
                return;
            }
            const ruleId = item.rule.id;

            ruleCounts[ruleId] = (ruleCounts[ruleId] || 0) + 1;

            if (FORBIDDEN_RULES.includes(ruleId)) {
                forbiddenCount++;
            }
        });
    }

    const totalItems = iterations * TEST_SIZE;
    log(`Total items generated: ${totalItems} (${iterations} tests of size ${TEST_SIZE})`);
    log("Rule distribution:");
    Object.entries(ruleCounts).sort().forEach(([id, count]) => {
        log(`  ${id}: ${count} (${(count / totalItems * 100).toFixed(1)}%)`);
    });

    if (forbiddenCount > 0) {
        log(`❌ FAILED: Found ${forbiddenCount} items using forbidden rules!`);
    } else {
        log("✅ PASSED: No forbidden rules found.");
    }
}

function verifyComparisonLogic(iterations = 1000) {
    log(`\n--- Verifying Comparison Logic Correctness ---`);
    let errors = 0;

    const creator = createComparisonTest;

    for (let i = 0; i < iterations; i++) {
        const test = creator(1, 'decimal');
        const item = test.items[0];

        // Manual check calculation
        let correctSym = '=';
        if (item.firstNumber < item.secondNumber) correctSym = '<';
        if (item.firstNumber > item.secondNumber) correctSym = '>';

        // Check if the item's correctAnswer property matches our manual calculation
        if (item.correctAnswer !== correctSym) {
            log(`❌ LOGIC ERROR: ${item.firstNumber} vs ${item.secondNumber}. \n   - Generated Answer: ${item.correctAnswer} \n   - Actual: ${correctSym} \n   - Type: ${item.type} \n   - Rule: ${item.rule?.id}`);
            errors++;
        }
    }

    if (errors === 0) {
        log(`✅ PASSED: Verified ${iterations} comparison items. All logic correct.`);
    } else {
        log(`❌ FAILED: Found ${errors} logic errors.`);
    }
}

async function runVerification() {
    log("Starting verification with randomized distribution...");

    // Addition
    verifyGenerator('Addition', createAdditionTest);

    // Subtraction
    verifyGenerator('Subtraction', createSubtractionTest);

    // Multiplication
    verifyGenerator('Multiplication', createMultiplicationTest);

    // Comparison
    verifyGenerator('Comparison', createComparisonTest);

    // Logic Verification
    verifyComparisonLogic();

    log("Verification complete.");
    fs.writeFileSync('verification_output.txt', logOutput);
}

runVerification();
