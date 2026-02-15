// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  findPlusButton,
  findWebSearchMenuItem,
  isMenuItemChecked,
  isSearchEnabled,
} from "./searchToggle";

describe("isSearchEnabled", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("normal cases", () => {
    it("returns true when Japanese search badge button exists", () => {
      document.body.innerHTML = '<button aria-label="検索：クリックして削除">検索</button>';
      expect(isSearchEnabled()).toBe(true);
    });

    it("returns true when English search badge button exists", () => {
      document.body.innerHTML = '<button aria-label="Search: Click to remove">Search</button>';
      expect(isSearchEnabled()).toBe(true);
    });

    it("returns false when no search badge exists", () => {
      document.body.innerHTML = '<button aria-label="Send">Send</button>';
      expect(isSearchEnabled()).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("returns false when page has no buttons", () => {
      document.body.innerHTML = "<div>Hello</div>";
      expect(isSearchEnabled()).toBe(false);
    });

    it("does not match partial keywords alone", () => {
      document.body.innerHTML = '<button aria-label="検索">検索</button>';
      expect(isSearchEnabled()).toBe(false);
    });

    it("handles multiple buttons and finds the correct one", () => {
      document.body.innerHTML = `
        <button aria-label="Send">Send</button>
        <button aria-label="検索：クリックして削除">検索</button>
        <button aria-label="Cancel">Cancel</button>
      `;
      expect(isSearchEnabled()).toBe(true);
    });
  });
});

describe("findPlusButton", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("finds button with data-testid composer-plus-btn", () => {
    document.body.innerHTML = '<button data-testid="composer-plus-btn">+</button>';
    expect(findPlusButton()).not.toBeNull();
    expect(findPlusButton()?.getAttribute("data-testid")).toBe("composer-plus-btn");
  });

  it("returns null when plus button does not exist", () => {
    document.body.innerHTML = '<button data-testid="other-btn">Other</button>';
    expect(findPlusButton()).toBeNull();
  });
});

describe("findWebSearchMenuItem", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("normal cases", () => {
    it("finds Japanese web search menu item", () => {
      document.body.innerHTML = `
        <div role="menu">
          <div role="menuitemradio">社内知識</div>
          <div role="menuitemradio">ウェブ検索</div>
          <div role="menuitemradio">エージェントモード</div>
        </div>
      `;
      const item = findWebSearchMenuItem();
      expect(item).not.toBeNull();
      expect(item?.textContent?.trim()).toBe("ウェブ検索");
    });

    it("finds English web search menu item", () => {
      document.body.innerHTML = `
        <div role="menu">
          <div role="menuitemradio">Create image</div>
          <div role="menuitemradio">Web search</div>
        </div>
      `;
      const item = findWebSearchMenuItem();
      expect(item).not.toBeNull();
    });
  });

  describe("edge cases", () => {
    it("returns null when no menu items exist", () => {
      expect(findWebSearchMenuItem()).toBeNull();
    });

    it("returns null when menu has no web search item", () => {
      document.body.innerHTML = `
        <div role="menu">
          <div role="menuitemradio">社内知識</div>
          <div role="menuitemradio">画像を作成する</div>
        </div>
      `;
      expect(findWebSearchMenuItem()).toBeNull();
    });
  });
});

describe("isMenuItemChecked", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns true when aria-checked is true", () => {
    document.body.innerHTML = '<div role="menuitemradio" aria-checked="true">ウェブ検索</div>';
    const item = document.querySelector<HTMLElement>('[role="menuitemradio"]');
    expect(item).not.toBeNull();
    expect(isMenuItemChecked(item as HTMLElement)).toBe(true);
  });

  it("returns false when aria-checked is false", () => {
    document.body.innerHTML = '<div role="menuitemradio" aria-checked="false">ウェブ検索</div>';
    const item = document.querySelector<HTMLElement>('[role="menuitemradio"]');
    expect(item).not.toBeNull();
    expect(isMenuItemChecked(item as HTMLElement)).toBe(false);
  });

  it("returns false when aria-checked is absent", () => {
    document.body.innerHTML = '<div role="menuitemradio">ウェブ検索</div>';
    const item = document.querySelector<HTMLElement>('[role="menuitemradio"]');
    expect(item).not.toBeNull();
    expect(isMenuItemChecked(item as HTMLElement)).toBe(false);
  });
});
