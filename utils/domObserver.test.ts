// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createComposerObserver, waitForComposer } from "./domObserver";

describe("waitForComposer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("normal cases", () => {
    it("resolves immediately when composer already exists", async () => {
      document.body.innerHTML = '<button data-testid="composer-plus-btn">+</button>';
      const result = await waitForComposer();
      expect(result).not.toBeNull();
      expect(result?.getAttribute("data-testid")).toBe("composer-plus-btn");
    });

    it("resolves when composer appears after a delay", async () => {
      const promise = waitForComposer(5000);

      // Simulate composer appearing after a short delay
      setTimeout(() => {
        const btn = document.createElement("button");
        btn.setAttribute("data-testid", "composer-plus-btn");
        document.body.appendChild(btn);
      }, 50);

      const result = await promise;
      expect(result).not.toBeNull();
    });
  });

  describe("edge cases", () => {
    it("resolves with null on timeout", async () => {
      const result = await waitForComposer(50);
      expect(result).toBeNull();
    });
  });
});

describe("createComposerObserver", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("normal cases", () => {
    it("creates a MutationObserver", () => {
      const callback = vi.fn();
      const observer = createComposerObserver(callback);
      expect(observer).toBeInstanceOf(MutationObserver);
      observer.disconnect();
    });

    it("fires callback when composer appears (debounced)", async () => {
      const callback = vi.fn();
      const observer = createComposerObserver(callback);

      const btn = document.createElement("button");
      btn.setAttribute("data-testid", "composer-plus-btn");
      document.body.appendChild(btn);

      // Callback should not fire immediately
      expect(callback).not.toHaveBeenCalled();

      // Allow MutationObserver microtask to run, then advance debounce timer
      await vi.advanceTimersByTimeAsync(500);
      expect(callback).toHaveBeenCalledTimes(1);

      observer.disconnect();
    });
  });

  describe("edge cases", () => {
    it("does not fire callback when non-composer elements appear", async () => {
      const callback = vi.fn();
      const observer = createComposerObserver(callback);

      const div = document.createElement("div");
      document.body.appendChild(div);

      vi.advanceTimersByTime(500);
      expect(callback).not.toHaveBeenCalled();

      observer.disconnect();
    });
  });
});
