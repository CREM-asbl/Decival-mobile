import { atom } from 'nanostores';

export const isDarkMode = atom<boolean>(false);

export function initializeTheme() {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem('darkMode');
  let isDarkValue = false;
  if (stored !== null) {
    isDarkValue = JSON.parse(stored);
  } else {
    isDarkValue = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  isDarkMode.set(isDarkValue);
  document.documentElement.classList.toggle('dark', isDarkValue);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) { // Only update if user hasn't set a preference
      isDarkMode.set(e.matches);
    }
  });
}

export function toggleDarkMode() {
  const newValue = !isDarkMode.get();
  isDarkMode.set(newValue);
  localStorage.setItem('darkMode', JSON.stringify(newValue));
}