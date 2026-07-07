const chokidar = require("chokidar");
const path = require("path");
const os = require("os");

const waitUntilComplete = require("./watcher");
const askUser = require("./notifier");
const sendFile = require("./sender");

const downloadsPath = path.join(os.homedir(), "Downloads");

console.log("📥 Watching Downloads folder...");

chokidar.watch(downloadsPath, { ignoreInitial: true }).on(
  "add",
  async (filePath) => {
    try {
      await waitUntilComplete(filePath);

      const fileName = path.basename(filePath);
      const shouldSend = await askUser(fileName);

      if (shouldSend) {
        await sendFile(filePath);
        console.log(`📤 Sent: ${fileName}`);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  }
);
