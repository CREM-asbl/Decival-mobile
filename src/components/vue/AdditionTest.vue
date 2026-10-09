<template>
  <TestShell
    testType="addition"
    :createTest="createAdditionTest"
    :analyzeError="analyzeError"
    testTypeLabel="addition"
    operationSymbol="+"
    answerLabel="Réponse à l'addition"
  />
</template>

<script setup>
import { analyzeError, createAdditionTest } from '../../logic/additionLogic'
import TestShell from './TestShell.vue'
</script>