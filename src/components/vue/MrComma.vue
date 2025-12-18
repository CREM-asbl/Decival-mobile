<template>
  <div class="mr-comma-container" :class="{ 'animate-bounce': animate }">
    <img
      :src="`/images/mrcomma_v2/${variant}.png`"
      :alt="altText"
      class="w-full h-full object-contain"
    />
  </div>
</template>

<script setup>

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // options: default, happy, confused, pointing
  },
  animate: {
    type: Boolean,
    default: false
  },
  altText: {
    type: String,
    default: 'Monsieur Virgule',
    required: false
  }
})

// Logique d'animation ou d'interaction supplémentaire si nécessaire
</script>

<style scoped>
.mr-comma-container {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}
</style>