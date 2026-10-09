<template>
  <TestShell
    testType="multiplication"
    :createTest="createMultiplicationTest"
    :analyzeError="analyzeError"
    testTypeLabel="multiplication"
    operationSymbol="×"
    answerLabel="Réponse à la multiplication"
  />
</template>

<script setup>
import { analyzeError, createMultiplicationTest } from '../../logic/multiplicationLogic'
import TestShell from './TestShell.vue'
</script>