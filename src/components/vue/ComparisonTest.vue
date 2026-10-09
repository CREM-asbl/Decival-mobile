<template>
  <TestShell
    testType="comparison"
    :createTest="createComparisonTest"
    :analyzeError="analyzeError"
    testTypeLabel="comparaison"
    operationSymbol=""
    isComparison
  />
</template>

<script setup>
import { analyzeError, createComparisonTest } from '../../logic/comparisonLogic'
import TestShell from './TestShell.vue'
</script>