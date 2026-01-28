/**
 * Configuration constants for the Decival application
 * Centralized location for all magic numbers and hardcoded values
 */

// ============================================================================
// Gamification Constants
// ============================================================================

/** XP awarded for each correct answer */
export const XP_PER_CORRECT_ANSWER = 10

/** Bonus XP for a perfect score (100%) */
export const XP_BONUS_PERFECT_SCORE = 20

/** Additional XP per correct answer in streak mode */
export const XP_PER_STREAK_ANSWER = 5

/** XP required to gain one level */
export const XP_PER_LEVEL = 100

/** Number of consecutive successes required to master a rule */
export const MASTERY_THRESHOLD = 3

// ============================================================================
// Test Generation Constants
// ============================================================================

/** Default number of items per test */
export const DEFAULT_TEST_ITEMS = 5

/** Number of different decimal item types in subtraction/addition */
export const DECIMAL_SUBTRACTION_TYPES = 7
export const DECIMAL_ADDITION_TYPES = 7
export const DECIMAL_MULTIPLICATION_TYPES = 7
export const DECIMAL_COMPARISON_TYPES = 7

// ============================================================================
// Numerical Precision Constants
// ============================================================================

/** Epsilon for floating-point comparison (handles IEEE 754 precision issues) */
export const EPSILON = 0.0001

/** Maximum allowed answer value */
export const MAX_ANSWER_VALUE = 1000

/** Minimum allowed answer value */
export const MIN_ANSWER_VALUE = 0

// ============================================================================
// UI Constants
// ============================================================================

/** Animation duration in milliseconds */
export const ANIMATION_DURATION_MS = 300

/** Sound feedback delay in milliseconds */
export const SOUND_DELAY_MS = 100

// ============================================================================
// Range Constants for Item Generation
// ============================================================================

export const INTEGER_RANGE = {
    addition: { min: 1, max: 100 },
    subtraction: { min: 1, max: 100 },
    multiplication: { min: 1, max: 10 },
    comparison: { min: 1, max: 100 }
}

export const DECIMAL_RANGE = {
    tenths: { min: 0.1, max: 0.9 },
    hundredths: { min: 0.01, max: 0.99 }
}
