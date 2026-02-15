const WEB_SEARCH_KEYWORDS = ["ウェブ検索", "Web search", "Search the web"];

/**
 * Simulate a real user click by dispatching pointer and mouse events.
 * Radix UI (used by ChatGPT) requires pointerdown/pointerup events
 * to trigger popover menus — element.click() alone is not sufficient.
 */
const simulateClick = (element: HTMLElement): void => {
  const rect = element.getBoundingClientRect();
  const clientX = rect.left + rect.width / 2;
  const clientY = rect.top + rect.height / 2;

  const pointerEventInit: PointerEventInit = {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    pointerId: 1,
    pointerType: "mouse",
    view: window,
  };

  element.dispatchEvent(new PointerEvent("pointerdown", pointerEventInit));
  element.dispatchEvent(new PointerEvent("pointerup", pointerEventInit));
  element.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      view: window,
    }),
  );
};

/**
 * Check if web search mode is already enabled without opening the menu.
 * Detects the search badge button in the composer toolbar.
 */
export const isSearchEnabled = (): boolean => {
  const buttons = document.querySelectorAll<HTMLButtonElement>("button");
  for (const btn of buttons) {
    const ariaLabel = btn.getAttribute("aria-label") ?? "";
    // Japanese: "検索：クリックして削除", English: "Search: Click to remove"
    if (
      (ariaLabel.includes("検索") || ariaLabel.toLowerCase().includes("search")) &&
      (ariaLabel.includes("削除") || ariaLabel.toLowerCase().includes("remove"))
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Find the "+" (composer plus) button.
 */
export const findPlusButton = (): HTMLButtonElement | null => {
  return document.querySelector<HTMLButtonElement>('[data-testid="composer-plus-btn"]');
};

/**
 * Find the "Web search" menu item radio within an open menu.
 */
export const findWebSearchMenuItem = (): HTMLElement | null => {
  const items = document.querySelectorAll<HTMLElement>('[role="menuitemradio"]');
  for (const item of items) {
    const text = item.textContent?.trim() ?? "";
    if (WEB_SEARCH_KEYWORDS.some((keyword) => text.includes(keyword))) {
      return item;
    }
  }
  return null;
};

/**
 * Check if a menu item radio is checked.
 */
export const isMenuItemChecked = (item: HTMLElement): boolean => {
  return item.getAttribute("aria-checked") === "true";
};

/**
 * Wait for an element matching the selector to appear in the DOM.
 */
const waitForElement = (selector: string, timeoutMs = 2000): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLElement>(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector<HTMLElement>(selector);
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
 * Enable web search by opening the "+" menu and clicking "Web search".
 * Returns true if search was enabled (or already was), false on failure.
 */
export const enableWebSearch = async (): Promise<boolean> => {
  if (isSearchEnabled()) {
    return true;
  }

  const plusButton = findPlusButton();
  if (!plusButton) {
    return false;
  }

  simulateClick(plusButton);

  const menu = await waitForElement('[role="menu"]');
  if (!menu) {
    return false;
  }

  const webSearchItem = findWebSearchMenuItem();
  if (!webSearchItem) {
    // Close menu by pressing Escape
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    return false;
  }

  if (isMenuItemChecked(webSearchItem)) {
    // Already checked, close menu
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    return true;
  }

  simulateClick(webSearchItem);
  return true;
};
