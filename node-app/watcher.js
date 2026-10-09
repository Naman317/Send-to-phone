const fs = require("fs");

function waitUntilComplete(filePath) {
  return new Promise((resolve) => {
    let lastSize = -1;

    const interval = setInterval(() => {
      try {
        const { size } = fs.statSync(filePath);
        if (size === lastSize) {
          clearInterval(interval);
          resolve();
        }
        lastSize = size;
      } catch (e) {
        // Ignore if file disappears
      }
    }, 200);
  });
}

module.exports = waitUntilComplete;
