# Send-to-Phone Automation

> Too lazy to open WhatsApp Web just to send a file to myself. Built a tool to do it instead.

A Node.js tool that watches the local Downloads folder and automatically sends new files directly to a phone via Telegram. 

This repository contains two approaches:
1. **Desktop Dashboard (Node.js)** - The primary tool. Watches the filesystem directly.
2. **Chrome Extension** - A browser-based alternative.

---

## Desktop Dashboard (Recommended)

A Node.js CLI application that monitors the filesystem to bypass browser security restrictions. 

### Features
- **Real-Time Folder Monitoring:** Uses `chokidar` to monitor the `Downloads` folder.
- **File Verification:** Polls file sizes to ensure the download is 100% complete before transfer.
- **CLI Dashboard:** Displays real-time logs, file sizes, and estimated upload times.
- **File Filtering:** Ignores hidden system files, `.crdownload` temporary files, and `~$` Word lock files.
- **Manual Retry System:** Caches failed uploads in RAM. Press `r` to bulk-retry failed files after network drops.

### Usage
1. Run `Start Send-to-Phone.bat` to launch the CLI.
2. Download any file to the `Downloads` folder.
3. Keyboard Controls:
   - `c` : Clear terminal output.
   - `r` : Retry failed uploads.
4. Close the terminal window to stop the script.

---

## Chrome Extension

A Chrome extension that uses the `chrome.downloads` API to intercept browser downloads.

### Limitations
This extension is deprecated in favor of the Desktop Dashboard due to browser limitations:
- **CORS Restrictions:** Chrome prevents extensions from reading local files. The extension attempts to re-fetch the file from the origin URL, which fails on secure portals, auth-gated links, or `blob:` URLs ("Failed to Fetch" error).
- **Scope:** Cannot detect files saved from desktop applications (Slack, Word, etc.).

---

## Setup & Configuration

Both tools use the Telegram Bot API for file transfer.

1. Install [Node.js](https://nodejs.org/).
2. Create a `.env` file in the `node-app` directory:
   ```env
   BOT_TOKEN=your_bot_token_here
   CHAT_ID=your_chat_id_here
   ```
3. **Limit:** Telegram's Bot API enforces a hard 50 MB maximum file size limit.
