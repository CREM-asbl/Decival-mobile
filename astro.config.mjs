import apphosting from '@apphosting/astro-adapter';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';
import serviceWorker from 'astrojs-service-worker';

import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Les server actions nécessitent un rendu serveur (server/hybrid)
  output: 'server',

  adapter: node({
    mode: 'standalone'
  }),

  integrations: [
    vue(),
    serviceWorker({
      workbox: {
        // Mise en cache des ressources statiques
        runtimeCaching: [
          {
            urlPattern: /\.(js|css|png|jpg|jpeg|svg|mp3)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources'
            }
          },
          {
            // Cache pour les données d'application (tests, progress, etc)
            urlPattern: /\/(tests|progress)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-data',
              networkTimeoutSeconds: 3
            }
          },
          {
            // Stratégie par défaut pour le reste
            urlPattern: /.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'others'
            }
          }
        ]
      }
    })
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});