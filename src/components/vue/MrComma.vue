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
    <div v-if="level >= 10" class="accessory-glasses-container" title="Lunettes d'Érudit">
      <div class="glasses-frame">
        <div class="lens lens-left"><div class="shine"></div></div>
        <div class="bridge"></div>
        <div class="lens lens-right"><div class="shine"></div></div>
      </div>
    </div>
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

/* Kawaii & Star Celebrity Glasses */
.accessory-glasses-container {
  position: absolute;
  top: 26%; 
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  pointer-events: none;
}

.glasses-frame {
  display: flex;
  align-items: center;
  gap: 0px; /* Écart supprimé */
}

.lens {
  width: 11px; 
  height: 9px; 
  background: linear-gradient(180deg, #1f2937 0%, #000000 100%);
  border: 1px solid #fbbf24; 
  border-radius: 2px 2px 4px 4px; 
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.lens-left { 
  transform: rotate(-3deg); 
}
.lens-right { 
  transform: rotate(3deg); 
}

.bridge {
  width: 2px; /* Pont réduit */
  height: 1px;
  background: #fbbf24;
  margin-top: -2px;
}

/* Star-shaped shine for Kawaii effect */
.shine {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 50%;
  height: 50%;
  background: rgba(255, 255, 255, 0.9);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  transform: scale(0.6);
}

/* Version Dorée Star */
.has-aura .lens {
  border-color: #f59e0b;
  box-shadow: 0 0 5px #fcd34d;
}
.has-aura .bridge {
  background: #f59e0b;
}

/* Cape Styling - Slightly lower to attach to the body better */
.accessory-cape-container {
  position: absolute;
  top: 55%; 
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
  top: -38%; 
  left: 53%; /* Décalage léger à droite */
  transform: translateX(-50%) rotate(-5deg);
  font-size: 2rem;
  z-index: 20;
  filter: grayscale(1) brightness(1.5) drop-shadow(0 0 5px white);
}

.accessory-crown-gold {
  top: -43%; 
  left: 53%; /* Décalage léger à droite */
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
