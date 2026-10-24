const chokidar = require("chokidar");
const path = require("path");
const os = require("os");
const fs = require("fs");
const readline = require("readline");

const waitUntilComplete = require("./watcher");
const sendFile = require("./sender");

const downloadsPath = path.join(os.homedir(), "Downloads");
let failedQueue = [];
let isRetrying = false;

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

function drawHeader() {
  console.log("==========================================");
  console.log("          SEND TO PHONE (ON)              ");
  console.log("==========================================");
  console.log(" Listening to: " + downloadsPath);
  console.log(" Commands: [c] Clear Screen | [r] Retry Failed | [ctrl+c] Quit");
  console.log("==========================================\n");
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function processFile(filePath) {
  const fileName = path.basename(filePath);
  
  if (fileName.startsWith("~$") || fileName.startsWith(".")) return;

  try {
    await waitUntilComplete(filePath);
    
    if (!fs.existsSync(filePath)) return;
    const stats = fs.statSync(filePath);
    const fileSizeStr = formatBytes(stats.size);
    
    const sizeInMB = stats.size / (1024 * 1024);
    const estimatedSeconds = Math.max(1, Math.ceil(sizeInMB / 1.0));

    console.log(`\n[Detect]  ${fileName} (${fileSizeStr})`);
    console.log(`[Sending] Uploading... (~${estimatedSeconds}s)`);
    
    await sendFile(filePath);
    console.log(`[Success] Sent ${fileName} to phone`);
    
    failedQueue = failedQueue.filter(f => f !== filePath);
  } catch (err) {
    let explanation = err.message;
    if (err.message.includes("413")) {
      explanation = "File exceeds Telegram 50MB limit";
    } else if (err.message.includes("ENOTFOUND") || err.message.includes("ECONNRESET")) {
      explanation = "No internet connection";
    }

    console.log(`[FAILED]  Could not send ${fileName}`);
    console.log(`          Why: ${explanation}`);
    console.log(`          Press 'r' to retry`);
    if (!failedQueue.includes(filePath)) {
      failedQueue.push(filePath);
    }
  }
}

process.stdin.on("keypress", async (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  }
  
  if (key.name === "c") {
    console.clear();
    drawHeader();
    console.log("Screen cleared.\n");
  }
  
  if (key.name === "r") {
    if (failedQueue.length === 0) {
      console.log("\n[Retry] No failed files to retry.");
      return;
    }
    if (isRetrying) {
      console.log("\n[Retry] Already retrying...");
      return;
    }
    
    console.log(`\n[Retry] Retrying ${failedQueue.length} failed file(s)...`);
    isRetrying = true;
    
    const toRetry = [...failedQueue];
    for (const filePath of toRetry) {
      if (fs.existsSync(filePath)) {
        await processFile(filePath);
      } else {
        console.log(`[Skip] File no longer exists: ${path.basename(filePath)}`);
        failedQueue = failedQueue.filter(f => f !== filePath);
      }
    }
    isRetrying = false;
  }
});

console.clear();
drawHeader();

chokidar.watch(downloadsPath, { ignoreInitial: true }).on(
  "add",
  (filePath) => {
    processFile(filePath);
  }
);
