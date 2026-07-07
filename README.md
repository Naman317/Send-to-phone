# Send to Phone

A Chrome extension that sends your downloads straight to your phone via Telegram — one click, no extra apps.

When a file finishes downloading, a notification pops up asking if you want to send it. Hit send and it shows up in Telegram.

![Extension popup](https://github.com/Naman317/send-to-phone/raw/main/preview.png)

## How to install

Since this isn't on the Chrome Web Store yet, you'll need to load it manually:

1. Download or clone this repo
2. Open Chrome and go to `chrome://extensions`
3. Turn on **Developer mode** in the top right
4. Click **Load unpacked** and select the `extension/` folder
5. Click the extension icon and follow the setup

Takes about 2 minutes.

## Setup

You'll need a Telegram bot and your Chat ID. The extension walks you through both steps with instructions — no technical knowledge needed.

**To get a bot token:**
- Open Telegram, search `@BotFather`
- Send `/newbot` and follow the steps
- Copy the token it gives you

**To get your Chat ID:**
- Search `@userinfobot` on Telegram
- Press Start — it replies with your ID
- Also make sure to send your bot at least one message first

## Limitations

- Files over **50 MB** can't be sent — this is a Telegram Bot API restriction
- The extension needs Chrome to be open to detect downloads

## Tech

Built with plain JavaScript as a Chrome Manifest V3 extension. No frameworks, no build step. Uses the Telegram Bot API to send files.

## Author

Made by [Naman Sharma](https://github.com/Naman317)
