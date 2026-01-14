<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Bouton flottant -->
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 flex items-center gap-2"
      title="Donner un retour"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      Retour
    </button>

    <!-- Modal Feedback -->
    <Teleport to="body" v-if="isOpen">
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Nous aider à améliorer</h2>
            <button
              @click="isOpen = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitFeedback" class="p-6 space-y-4">
            <!-- Catégorie -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie
              </label>
              <div class="space-y-2">
                <label v-for="cat in categories" :key="cat" class="flex items-center">
                  <input
                    type="radio"
                    :value="cat"
                    v-model="form.category"
                    class="w-4 h-4 text-blue-600 dark:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ cat }}</span>
                </label>
              </div>
            </div>

            <!-- Note (1-5 étoiles) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Évaluation : {{ form.rating }}/5
              </label>
              <div class="flex gap-2">
                <button
                  v-for="i in 5"
                  :key="i"
                  type="button"
                  @click="form.rating = i"
                  :class="[
                    'text-2xl transition-colors',
                    i <= form.rating ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                >
                  ★
                </button>
              </div>
            </div>

            <!-- Commentaire -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Commentaire
              </label>
              <textarea
                v-model="form.comment"
                placeholder="Décris ton retour (min. 10 caractères)..."
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                minlength="10"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ form.comment.length }}/10+</p>
            </div>

            <!-- Email optionnel -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (optionnel)
              </label>
              <input
                v-model="form.email"
                type="email"
                placeholder="pour qu'on puisse te répondre..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
              />
            </div>

            <!-- Contexte (automatique) -->
            <div class="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
              📍 Page actuelle: {{ currentPage }} | 📱 {{ isOnline ? 'En ligne' : 'Hors ligne' }}
            </div>

            <!-- Erreur/Success -->
            <div v-if="message" :class="[
              'p-3 rounded text-sm',
              message.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            ]">
              {{ message.text }}
            </div>

            <!-- Boutons -->
            <div class="flex gap-2">
              <button
                type="button"
                @click="isOpen = false"
                class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !isFormValid"
                :class="[
                  'flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors',
                  isSubmitting || !isFormValid
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                ]"
              >
                {{ isSubmitting ? 'Envoi...' : 'Envoyer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { actions } from 'astro:actions';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const isOpen = ref(false);
const isSubmitting = ref(false);
const message = ref(null);
const isOnline = ref(navigator.onLine);
const currentPage = ref('');

const categories = ['Bug 🐛', 'Idée 💡', 'Ergonomie 🎯'];

const form = ref({
  category: 'Idée 💡',
  rating: 4,
  comment: '',
  email: ''
});

const isFormValid = computed(() => {
  const hasCategory = form.value.category && form.value.category.trim().length > 0;
  const hasRating = form.value.rating > 0 && form.value.rating <= 5;
  const hasComment = form.value.comment && form.value.comment.trim().length >= 10;

  return hasCategory && hasRating && hasComment;
});

onMounted(() => {
  // Détecter la page actuelle
  currentPage.value = window.location.pathname || '/';

  // Écouter les changements de connectivité
  window.addEventListener('online', () => isOnline.value = true);
  window.addEventListener('offline', () => isOnline.value = false);
});

onUnmounted(() => {
  window.removeEventListener('online', () => isOnline.value = true);
  window.removeEventListener('offline', () => isOnline.value = false);
});

const submitFeedback = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  message.value = null;

  try {
    const result = await actions.sendFeedback({
      category: form.value.category,
      rating: form.value.rating,
      comment: form.value.comment,
      email: form.value.email,
      page: currentPage.value,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    message.value = { type: 'success', text: '✅ Merci pour ton retour !' };
    form.value = { category: 'Idée 💡', rating: 4, comment: '', email: '' };
    setTimeout(() => isOpen.value = false, 1500);
  } catch (error) {
    console.error('Feedback error:', error);
    message.value = {
      type: 'error',
      text: '❌ Erreur : ' + (error instanceof Error ? error.message : 'Impossible d\'envoyer le feedback')
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>
