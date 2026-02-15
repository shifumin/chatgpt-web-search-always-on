# ChatGPT Web Search Always On

A Chrome extension that automatically enables ChatGPT's web search toggle whenever you start a new conversation.

## Installation

1. Clone the repository:
   ```bash
   ghq get github.com/shifumin/chatgpt-web-search-always-on
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the extension:
   ```bash
   pnpm build
   ```
4. Open `chrome://extensions/` in Chrome
5. Enable **Developer mode** (toggle in the top right)
6. Click **Load unpacked** and select the `.output/chrome-mv3` directory

## Features

- Automatically enables web search toggle when ChatGPT loads
- Works on new conversations and SPA page navigation
- Lightweight and non-intrusive
- Supports both `chatgpt.com` and `chat.openai.com`

## How it works

1. Detects the composer "+" button on the ChatGPT page
2. Opens the dropdown menu and selects "Web search"
3. Monitors for SPA navigation to re-enable on new conversations
4. Skips if web search is already enabled

## Tech Stack

- [WXT](https://wxt.dev/) (Manifest V3 framework)
- TypeScript
- [Vitest](https://vitest.dev/)
- [Biome](https://biomejs.dev/)
