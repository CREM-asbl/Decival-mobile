/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Minimal stand-ins for astro:actions / astro:schema so action handlers can be
// unit-tested without the Astro runtime. The real zod schema lives in the
// astro:actions module at runtime; here we only need parse() semantics.
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    alias: {
      'astro:actions': join(__dirname, 'vitest-mock-astro-actions.js'),
      'astro:schema': join(__dirname, 'vitest-mock-astro-schema.js'),
    },
  },
});