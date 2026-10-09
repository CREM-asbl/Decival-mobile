<template>
  <TestShell
    testType="subtraction"
    :createTest="createSubtractionTest"
    :analyzeError="analyzeError"
    testTypeLabel="soustraction"
    operationSymbol="−"
    answerLabel="Réponse à la soustraction"
  />
</template>

<script setup>
import { analyzeError, createSubtractionTest } from '../../logic/subtractionLogic'
import TestShell from './TestShell.vue'
</script>