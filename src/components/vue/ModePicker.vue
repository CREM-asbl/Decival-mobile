<template>
  <TestModeSelector
    v-if="testType"
    :testType="testType"
    @modeSelected="goToTest"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TestModeSelector from '../tests/TestModeSelector.vue';
import { getActiveStudent } from '../../stores/studentStore';
import { buildTestUrl, isValidTestTypeId } from '../../utils/testModeRoute';

const testType = ref('');

function goToTest(mode) {
  window.location.assign(buildTestUrl(testType.value, mode));
}

onMounted(() => {
  if (!getActiveStudent()) {
    window.location.replace('/tests/qui');
    return;
  }
  const op = new URLSearchParams(window.location.search).get('op');
  if (!isValidTestTypeId(op)) {
    window.location.replace('/tests');
    return;
  }
  testType.value = op;
});
</script>
