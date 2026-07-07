const fs = require("fs");

function waitUntilComplete(filePath) {
  return new Promise((resolve) => {
    let lastSize = -1;

    const interval = setInterval(() => {
      const { size } = fs.statSync(filePath);
      if (size === lastSize) {
        clearInterval(interval);
        resolve();
      }
      lastSize = size;
    }, 1000);
  });
}

module.exports = waitUntilComplete;
