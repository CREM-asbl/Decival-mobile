import { computed, nextTick, ref, type Ref } from 'vue'
import { EPSILON, MAX_ANSWER_VALUE, MIN_ANSWER_VALUE } from '../config/constants'
import { playSound } from '../stores/soundStore'
import { completeTest, currentTest } from '../stores/testStore'

/**
 * Configuration pour un composant de test mathématique
 */
export interface MathTestConfig {
    /** Fonction pour créer un nouveau test */
    createTest: (numberOfItems: number, mode: 'integer' | 'decimal') => any
    /** Fonction pour analyser les erreurs */
    analyzeError: (item: any, userAnswer: any) => any
    /** Type de test pour l'affichage */
    testType: string
    /** L'opérateur est une comparaison (utilise string au lieu de number) */
    isComparison?: boolean
}

/**
 * Composable réutilisable pour les composants de test mathématique
 * Gère l'état, la logique de soumission, et le formatage des nombres
 */
export function useMathTest(config: MathTestConfig) {
    // État local
    const testStarted = ref(false)
    const currentQuestionIndex = ref(0)
    const answer: Ref<string> = ref('')
    const showResultModal = ref(false)
    const showCompleteModal = ref(false)
    const isCorrect = ref(false)
    const score = ref(0)
    const gamificationResults: Ref<any> = ref(null)
    const testMode: Ref<'integer' | 'decimal'> = ref('integer')
    const errorAnalysis: Ref<any> = ref(null)
    const continueBtn: Ref<HTMLButtonElement | null> = ref(null)
    const answerInput: Ref<HTMLInputElement | null> = ref(null)

    // Test en cours
    const test: Ref<any> = ref(null)

    // Helper pour donner le focus au champ de saisie
    function focusInput() {
        nextTick(() => {
            answerInput.value?.focus()
        })
    }

    // Démarrer un test avec le mode sélectionné
    function startTestWithMode(mode: 'integer' | 'decimal') {
        testMode.value = mode
        test.value = config.createTest(5, mode)
        currentTest.set(test.value)
        testStarted.value = true
        focusInput()
    }

    // Calculer la progression
    const progress = computed(() => {
        if (!test.value?.items) return 0
        return ((currentQuestionIndex.value + 1) / test.value.items.length) * 100
    })

    // Calculer le pas d'incrément pour l'input
    const inputStep = computed(() => {
        if (test.value?.mode === 'decimal') {
            return 0.01
        }
        return 1
    })

    // Obtenir l'item courant
    const currentItem = computed(() => {
        if (!test.value?.items) return null
        return test.value.items[currentQuestionIndex.value]
    })

    // Gérer la soumission du formulaire
    function handleSubmit() {
        // Si le résultat est déjà affiché, le Enter doit continuer
        if (showResultModal.value) {
            handleContinue()
            return
        }

        // Vérifier que la réponse n'est pas vide
        if (answer.value === null || answer.value === undefined || answer.value === '') {
            return
        }

        // Pour les comparaisons, traitement spécial
        if (config.isComparison) {
            handleComparisonSubmit()
            return
        }

        // Convertir et valider la réponse numérique
        let userAnswer: number

        if (test.value.mode === 'decimal') {
            const answerStr = String(answer.value).replace(',', '.')

            if (!/^-?\d+(\.\d+)?$/.test(answerStr)) {
                return
            }
            userAnswer = parseFloat(answerStr)

            if (isNaN(userAnswer) || userAnswer < MIN_ANSWER_VALUE || userAnswer > MAX_ANSWER_VALUE) {
                return
            }

            const expectedAnswer = currentItem.value?.correctAnswer
            if (expectedAnswer === undefined) return

            isCorrect.value = Math.abs(userAnswer - expectedAnswer) < EPSILON
        } else {
            const answerStr = String(answer.value)

            if (!/^-?\d+$/.test(answerStr)) {
                return
            }
            userAnswer = parseInt(answerStr)

            if (isNaN(userAnswer) || userAnswer < MIN_ANSWER_VALUE || userAnswer > MAX_ANSWER_VALUE) {
                return
            }

            const expectedAnswer = currentItem.value?.correctAnswer
            if (expectedAnswer === undefined) return

            isCorrect.value = userAnswer === expectedAnswer
        }

        // Mettre à jour l'item avec la réponse
        test.value.items[currentQuestionIndex.value].userAnswer = userAnswer
        test.value.items[currentQuestionIndex.value].isCorrect = isCorrect.value

        // Analyser l'erreur si la réponse est incorrecte
        if (!isCorrect.value) {
            const analysis = config.analyzeError(currentItem.value, userAnswer)
            test.value.items[currentQuestionIndex.value].errorAnalysis = analysis
        } else {
            errorAnalysis.value = null
        }

        // Jouer le son approprié
        playSound(isCorrect.value ? 'correct' : 'incorrect')

        // Afficher le résultat
        showResultModal.value = true

        // Donner le focus au bouton continuer
        nextTick(() => {
            continueBtn.value?.focus()
        })
    }

    // Gérer la soumission pour les comparaisons
    function handleComparisonSubmit() {
        const userAnswer = answer.value

        if (!['<', '=', '>'].includes(userAnswer)) {
            return
        }

        const expectedAnswer = currentItem.value?.correctAnswer
        if (expectedAnswer === undefined) return

        isCorrect.value = userAnswer === expectedAnswer

        test.value.items[currentQuestionIndex.value].userAnswer = userAnswer
        test.value.items[currentQuestionIndex.value].isCorrect = isCorrect.value

        if (!isCorrect.value) {
            const analysis = config.analyzeError(currentItem.value, userAnswer)
            test.value.items[currentQuestionIndex.value].errorAnalysis = analysis
        }

        playSound(isCorrect.value ? 'correct' : 'incorrect')
        showResultModal.value = true

        nextTick(() => {
            continueBtn.value?.focus()
        })
    }

    // Formater un nombre pour l'affichage
    function formatNumber(number: any): string | number {
        if (test.value?.mode === 'decimal') {
            if (typeof number !== 'number') return number

            // Nettoyer les imprécisions de calcul
            const cleanNumber = Number(number.toPrecision(12))
            const numberStr = cleanNumber.toString()
            const decimalPart = numberStr.includes('.') ? numberStr.split('.')[1] : ''

            // Au moins une décimale pour les nombres décimaux
            const precision = Math.max(1, decimalPart.length)

            return cleanNumber.toFixed(precision).replace('.', ',')
        }
        return number
    }

    // Gérer le clic sur Continuer
    function handleContinue() {
        showResultModal.value = false
        answer.value = ''

        if (!test.value?.items || currentQuestionIndex.value + 1 >= test.value.items.length) {
            // Calculer le score final
            const correctAnswers = test.value.items.filter((item: any) => item.isCorrect).length
            score.value = Math.round((correctAnswers / test.value.items.length) * 100)

            // Terminer le test
            const results = completeTest(test.value)
            gamificationResults.value = results

            // Afficher la modal de fin
            showCompleteModal.value = true
        } else {
            // Passer à la question suivante
            currentQuestionIndex.value++
            focusInput()
        }
    }

    // Gérer le redémarrage
    function handleRestart() {
        const newTest = config.createTest(5, testMode.value)
        test.value = newTest
        currentTest.set(newTest)

        currentQuestionIndex.value = 0
        answer.value = ''
        showCompleteModal.value = false
        score.value = 0
        focusInput()
    }

    return {
        // État
        testStarted,
        currentQuestionIndex,
        answer,
        showResultModal,
        showCompleteModal,
        isCorrect,
        score,
        gamificationResults,
        testMode,
        errorAnalysis,
        continueBtn,
        answerInput,
        test,

        // Computed
        progress,
        inputStep,
        currentItem,

        // Méthodes
        focusInput,
        startTestWithMode,
        handleSubmit,
        formatNumber,
        handleContinue,
        handleRestart
    }
}
