import { createComposerObserver, waitForComposer } from "@/utils/domObserver";
import { enableWebSearch } from "@/utils/searchToggle";

export default defineContentScript({
  matches: ["https://chatgpt.com/*", "https://chat.openai.com/*"],
  runAt: "document_idle",
  async main(ctx) {
    const tryEnableSearch = async (): Promise<void> => {
      // Small delay to let the UI stabilize after navigation
      await new Promise((resolve) => setTimeout(resolve, 300));
      await enableWebSearch();
    };

    // Wait for the composer to appear on initial page load
    const composer = await waitForComposer();
    if (composer) {
      await tryEnableSearch();
    }

    // Watch for composer re-appearance on SPA navigation
    const observer = createComposerObserver(() => {
      tryEnableSearch();
    });
    ctx.onInvalidated(() => observer.disconnect());

    // Handle SPA location changes (ChatGPT doesn't reload on navigation)
    ctx.addEventListener(window, "wxt:locationchange", () => {
      tryEnableSearch();
    });
  },
});
