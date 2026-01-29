<template>
  <div class="mr-comma-container" :class="{ 'animate-bounce': animate, 'has-glow': level >= 35, 'has-aura': level >= 50 }">
    <!-- Character Base -->
    <img
      :src="`/images/mrcomma_v2/${variant}.png`"
      :alt="altText"
      class="base-image w-full h-full object-contain"
    />

    <!-- RPG Accessories Overlays -->
    <div v-if="level >= 20" class="accessory accessory-cape" title="Cape de Héros">🧣</div>
    <div v-if="level >= 10" class="accessory accessory-glasses" title="Lunettes d'Érudit">👓</div>
    <div v-if="level >= 50" class="accessory accessory-crown-gold" title="Couronne d'Or">👑</div>
    <div v-else-if="level >= 35" class="accessory accessory-crown-silver" title="Couronne d'Argent">👑</div>
    
    <!-- Aura effect for legends -->
    <div v-if="level >= 50" class="aura-sparkles"></div>
  </div>
</template>

<script setup>

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // options: default, happy, confused, pointing
  },
  level: {
    type: Number,
    default: 1
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
</script>

<style scoped>
.mr-comma-container {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.base-image {
  position: relative;
  z-index: 10;
}

/* Accessory Positioning */
.accessory {
  position: absolute;
  z-index: 20;
  user-select: none;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.accessory-glasses {
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  opacity: 0.9;
}

.accessory-cape {
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%) rotate(-10deg);
  font-size: 2.8rem;
  z-index: 5; /* Behind the character */
  opacity: 1;
}

.accessory-crown-silver {
  top: -25%;
  left: 50%;
  transform: translateX(-50%) rotate(-5deg);
  font-size: 2.2rem;
  filter: grayscale(1) brightness(1.5) drop-shadow(0 0 5px white);
}

.accessory-crown-gold {
  top: -30%;
  left: 50%;
  transform: translateX(-50%) rotate(5deg);
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px #fbbf24);
  animation: crown-shimmer 2s infinite alternate;
}

/* Visual Effects */
.has-glow .base-image {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
}

.has-aura .base-image {
  filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.8));
}

.aura-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, #fbbf24 1px, transparent 1px);
  background-size: 15px 15px;
  z-index: 2;
  opacity: 0.4;
  animation: aura-pulse 3s infinite linear;
  border-radius: 50%;
}

@keyframes crown-shimmer {
  from { transform: translateX(-50%) rotate(5deg) scale(1); }
  to { transform: translateX(-50%) rotate(5deg) scale(1.1); filter: drop-shadow(0 0 15px #fcd34d); }
}

@keyframes aura-pulse {
  0% { transform: scale(0.9); opacity: 0.2; }
  50% { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(0.9); opacity: 0.2; }
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