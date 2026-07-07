# Send to Phone

Too lazy to open WhatsApp Web just to send a file to myself. Built a tool to do it instead. 

This project gives you two ways to automatically send finished downloads straight to your phone via Telegram — one click, no extra apps on your phone.

## 1. The Chrome Extension (Recommended)
The extension lives in your browser. When a file finishes downloading in Chrome, a notification pops up asking if you want to send it. Hit send and it's pushed straight to your phone.

* **Best for:** People who mostly download files from the internet.
* **Limitations:** Files over 50 MB can't be sent (Telegram Bot API limit). Doesn't catch files saved from other desktop apps (like Slack or MS Word).

### How to install the extension
1. Download or clone this repo
2. Open Chrome and go to `chrome://extensions`
3. Turn on **Developer mode** in the top right
4. Click **Load unpacked** and select the `extension/` folder
5. Click the extension icon and follow the quick setup

---

## 2. The Desktop App (Node.js)
The desktop app watches your actual physical `Downloads` folder on Windows. It catches **everything** — whether you downloaded it in Chrome, saved a document from Microsoft Word, or downloaded an image from Slack. It pops up a native Windows dialog asking if you want to send the file.

* **Best for:** Power users who want to catch files saved from *any* app on their computer.
* **Limitations:** Requires Node.js installed. Must be kept running in the background.

### How to run the desktop app
1. Open a terminal and navigate to the `node-app/` folder
2. Run `npm install` to get the dependencies
3. Create a `.env` file inside `node-app/` with your Telegram credentials (see Setup below)
4. Run `node index.js`

*(Note: If you run this AND the Chrome extension at the same time, you'll get two prompts when you download something in Chrome! Pick the one that fits your workflow best.)*

---

## Telegram Setup (Required for both)
Whether you use the extension or the desktop app, you need a Telegram bot and your Chat ID to tell it where to send the files.

**To get a bot token:**
- Open Telegram, search `@BotFather`
- Send `/newbot` and follow the steps
- Copy the token it gives you

**To get your Chat ID:**
- Search `@userinfobot` on Telegram
- Press Start — it replies with your ID
- **Crucial:** Send at least one message to your new bot first, so it has permission to message you!

*(If you're using the Desktop app, put these in a `.env` file inside the `node-app/` folder. The extension has a built-in setup wizard for this).*

## Author
Made by [Naman Sharma](https://github.com/Naman317)
