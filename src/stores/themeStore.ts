import { atom } from 'nanostores';

export const isDarkMode = atom<boolean>(false);

let mediaQuery: MediaQueryList | null = null;
let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null = null;

function applyTheme(isDark: boolean) {
  if (typeof document === 'undefined') return;

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

function syncTheme(isDark: boolean, persist = false) {
  isDarkMode.set(isDark);
  applyTheme(isDark);

  if (persist && typeof localStorage !== 'undefined') {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }
}

export function initializeTheme() {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem('darkMode');
  const isDarkValue = stored !== null
    ? JSON.parse(stored)
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  syncTheme(isDarkValue);

  if (mediaQuery && mediaQueryHandler) {
    mediaQuery.removeEventListener('change', mediaQueryHandler);
  }

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQueryHandler = (event) => {
    if (localStorage.getItem('darkMode') === null) {
      syncTheme(event.matches);
    }
  };

  mediaQuery.addEventListener('change', mediaQueryHandler);
}

export function toggleDarkMode() {
  const newValue = !isDarkMode.get();
  syncTheme(newValue, true);
}