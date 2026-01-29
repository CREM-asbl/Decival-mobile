<template>
  <div class="mr-comma-container" :class="{ 'animate-bounce': animate, 'has-glow': level >= 35, 'has-aura': level >= 50 }">
    <!-- RPG Accessories - Cape (Must be first in DOM or use negative z-index relative to stacking context if supported, but safer here) -->
    <div v-if="level >= 20" class="accessory-cape-container" title="Cape de Héros">
      <div class="cape-fabric"></div>
    </div>

    <!-- Character Base -->
    <img
      :src="`/images/mrcomma_v2/${variant}.png`"
      :alt="altText"
      class="base-image w-full h-full object-contain"
    />
    
    <!-- Face Accessories -->
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
  /* Stacking context root */
  z-index: 1; 
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
  /* Position ajustée pour être pile sur les yeux */
  top: 15%; 
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.3rem; 
  z-index: 20;
  opacity: 0.95;
}

/* Cape Styling - Slightly lower to attach to the body better */
.accessory-cape-container {
  position: absolute;
  top: 52%; 
  left: 50%;
  transform: translateX(-50%);
  width: 50px; 
  height: 25px; 
  z-index: 5;
  pointer-events: none;
}

.cape-fabric {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #dc2626 0%, #991b1b 100%);
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
  border-radius: 4px;
  transform-origin: top center;
  animation: cape-flutter 3.5s infinite ease-in-out;
}

@keyframes cape-flutter {
  0%, 100% { transform: scaleX(1) skewX(0deg); }
  50% { transform: scaleX(1.1) skewX(2deg); }
}

.accessory-crown-silver {
  top: -35%; 
  left: 50%;
  transform: translateX(-50%) rotate(-5deg);
  font-size: 2rem;
  z-index: 20;
  filter: grayscale(1) brightness(1.5) drop-shadow(0 0 5px white);
}

.accessory-crown-gold {
  top: -40%; 
  left: 50%;
  transform: translateX(-50%) rotate(5deg);
  font-size: 2.5rem;
  z-index: 20;
  filter: drop-shadow(0 0 10px #fbbf24);
  animation: crown-shimmer 2s infinite alternate;
}

/* Visual Effects */
.has-glow .base-image {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
}

.has-aura .base-image {
  filter: drop-shadow(0 0 15px rgba(250, 204, 21, 0.9));
}

.aura-sparkles {
  position: absolute;
  inset: -15px;
  background-image: radial-gradient(circle, #fbbf24 1px, transparent 1px);
  background-size: 15px 15px;
  z-index: 2;
  opacity: 0.5;
  animation: aura-pulse 3s infinite linear;
  border-radius: 50%;
  pointer-events: none;
}

@keyframes crown-shimmer {
  from { transform: translateX(-50%) rotate(5deg) scale(1); filter: drop-shadow(0 0 10px #fbbf24); }
  to { transform: translateX(-50%) rotate(5deg) scale(1.1); filter: drop-shadow(0 0 20px #fcd34d); }
}

@keyframes aura-pulse {
  0% { transform: scale(0.95); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
  100% { transform: scale(0.95); opacity: 0.3; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-bounce {
  animation: bounce 1.5s ease infinite;
}
</style>
