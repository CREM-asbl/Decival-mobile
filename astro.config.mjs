import node from '@apphosting/astro-adapter';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';
import serviceWorker from 'astrojs-service-worker';

export default defineConfig({
  output: 'static',
  adapter: node({
    mode: "standalone"
  }),
  integrations: [
    tailwind(),
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
  ]
});