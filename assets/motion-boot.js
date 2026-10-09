/* Set up text entrances before first paint; fail open if the main script fails. */
(() => {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.documentElement.classList.add('motion-pending');
  window.setTimeout(() => document.documentElement.classList.remove('motion-pending'), 4000);
})();
