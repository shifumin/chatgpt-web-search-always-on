const COMPOSER_SELECTOR = '[data-testid="composer-plus-btn"]';
const DEBOUNCE_DELAY_MS = 500;

/**
 * Simple debounce implementation.
 */
const debounce = (fn: () => void, delay: number): (() => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(fn, delay);
  };
};

/**
 * Wait for an element matching the selector to appear in the DOM.
 * Resolves immediately if already present.
 */
export const waitForComposer = (timeoutMs = 10000): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLElement>(COMPOSER_SELECTOR);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector<HTMLElement>(COMPOSER_SELECTOR);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeoutMs);
  });
};

/**
 * Create a MutationObserver that watches for the composer "+" button
 * to appear in the DOM (e.g., on SPA navigation to a new conversation).
 * Fires the callback with debouncing to avoid excessive invocations.
 */
export const createComposerObserver = (callback: () => void): MutationObserver => {
  const debouncedCallback = debounce(callback, DEBOUNCE_DELAY_MS);

  const observer = new MutationObserver(() => {
    const composer = document.querySelector(COMPOSER_SELECTOR);
    if (composer) {
      debouncedCallback();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  return observer;
};
