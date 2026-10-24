# Send-to-Phone

> Too lazy to open WhatsApp Web just to send a file to myself. Built a tool to do it instead.

Watches the local Downloads folder and sends new files directly to a phone via Telegram.

Contains two implementations:
1. **Desktop App (Node.js)** - Watches the filesystem directly.
2. **Chrome Extension** - Browser download listener.

---

## Desktop App

Node.js CLI that monitors the Downloads folder and sends completed files.

### Features
- Watches `Downloads` folder with `chokidar`
- Verifies download completion by polling file size before sending
- Terminal status with estimated upload time
- Filters out temporary files (`.crdownload`, `~$*`, hidden files)
- In-memory retry queue (`r` to retry failed transfers)

### Usage
1. Run `Start Send-to-Phone.bat` or `node node-app/index.js`
2. Download any file to `Downloads`
3. Controls:
   - `c` : Clear terminal output
   - `r` : Retry failed uploads
   - `ctrl+c` : Exit

---

## Chrome Extension

Alternative implementation using Chrome's download API.

### Limitations
- Cannot access local files due to browser security policies (fails on protected or blob URLs).
- Only detects downloads within Chrome, not desktop apps.

---

## Setup

1. Install Node.js.
2. Create `node-app/.env`:
   ```env
   BOT_TOKEN=your_bot_token_here
   CHAT_ID=your_chat_id_here
   ```
3. Telegram Bot API has a 50 MB file size limit.
