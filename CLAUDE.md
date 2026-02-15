# CLAUDE.md

## Project Overview

ChatGPT Search Always On — A Chrome extension that automatically enables ChatGPT's web search toggle for every conversation.

**Tech Stack**: TypeScript, [WXT](https://wxt.dev/) (Manifest V3), Vitest, [Biome](https://biomejs.dev/) (linter/formatter)

## Architecture

```
entrypoints/
└── content.ts              # Content script (composer detection, auto-enable logic)
utils/
├── searchToggle.ts         # Search toggle detection and enabling (pure functions + async enabler)
├── searchToggle.test.ts    # Unit tests for searchToggle
├── domObserver.ts          # MutationObserver setup for composer detection
└── domObserver.test.ts     # Unit tests for domObserver
```

- Path alias: `@/` → project root
- WXT global functions (`defineContentScript`, etc.) do not need to be imported

## How It Works

1. Content script runs on `chatgpt.com` and `chat.openai.com`
2. Waits for the composer "+" button (`data-testid="composer-plus-btn"`) to appear
3. Clicks "+" to open the dropdown menu, then clicks "ウェブ検索" / "Web search"
4. MutationObserver watches for SPA navigation to re-enable on new conversations

## Development Commands

```bash
mise exec -- pnpm dev        # Start dev server (hot reload)
mise exec -- pnpm build      # Production build
mise exec -- pnpm compile    # Type check (tsc --noEmit)
mise exec -- pnpm lint       # Lint and format check (Biome)
mise exec -- pnpm lint:fix   # Lint and format with auto-fix
mise exec -- pnpm test       # Run tests (Vitest)
mise exec -- pnpm zip        # Create ZIP for Chrome Web Store
```

## Testing Conventions

- **Framework**: Vitest with happy-dom environment
- **Location**: Place `*.test.ts` in the same directory as the test target
- **Structure**: Group with `describe`, cover normal cases, error cases, and edge cases
- **Scope**: Only test public functions (private methods are out of scope)

## Code Conventions

- TypeScript strict mode
- Prefer arrow functions
- Naming: camelCase (variables/functions), PascalCase (types), kebab-case (CSS classes)

## Selector Maintenance

ChatGPT's UI changes frequently. If the extension stops working:

1. Open ChatGPT and inspect the "+" button and its dropdown menu
2. Update selectors in `utils/searchToggle.ts` and `utils/domObserver.ts`
3. Key selectors: `[data-testid="composer-plus-btn"]`, `[role="menuitemradio"]`
4. Test with `mise exec -- pnpm test`
