/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  showToast_feedback?: (message: string, duration?: number) => void;
}
