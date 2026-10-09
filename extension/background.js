const handled = new Set();

chrome.downloads.onChanged.addListener(async (delta) => {
  if (delta.state?.current !== "complete") return;
  if (handled.has(delta.id)) return;
  handled.add(delta.id);
  setTimeout(() => handled.delete(delta.id), 10000);

  const { enabled, botToken, chatId } = await chrome.storage.sync.get(["enabled", "botToken", "chatId"]);
  if (!enabled || !botToken || !chatId) return;

  const [download] = await chrome.downloads.search({ id: delta.id });
  if (!download || download.state !== "complete") return;
  if (download.url.startsWith("chrome://") || download.url.startsWith("chrome-extension://")) return;

  const fileName = download.filename.split(/[\\/]/).pop();
  const MB = 1024 * 1024;

  if (download.fileSize > 50 * MB) {
    const sizeMB = (download.fileSize / MB).toFixed(1);
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "File Too Large",
      message: `"${fileName}" is ${sizeMB} MB. Telegram has a 50 MB limit.`,
    });
    return;
  }

  await chrome.storage.session.set({
    [`pending_${delta.id}`]: {
      id: download.id,
      url: download.finalUrl || download.url,
      filename: fileName,
    },
  });

  chrome.notifications.create(`dl_${delta.id}`, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Download Complete",
    message: `Send "${fileName}" to your phone?`,
    buttons: [{ title: "Send to Phone" }, { title: "Dismiss" }],
    requireInteraction: true,
    priority: 2,
  });
});

chrome.notifications.onButtonClicked.addListener(async (notifId, btnIdx) => {
  if (!notifId.startsWith("dl_")) return;
  chrome.notifications.clear(notifId);
  if (btnIdx !== 0) return;

  const downloadId = parseInt(notifId.replace("dl_", ""));
  const stored = await chrome.storage.session.get(`pending_${downloadId}`);
  const download = stored[`pending_${downloadId}`];
  if (!download) return;

  await chrome.storage.session.remove(`pending_${downloadId}`);

  const { botToken, chatId } = await chrome.storage.sync.get(["botToken", "chatId"]);

  chrome.action.setBadgeText({ text: "↑" });
  chrome.action.setBadgeBackgroundColor({ color: "#555" });

  try {
    const response = await fetch(download.url);
    if (!response.ok) throw new Error(`Could not fetch file (HTTP ${response.status})`);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", blob, download.filename);

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: "POST",
      body: formData,
    });

    if (!tgRes.ok) {
      const err = await tgRes.json();
      throw new Error(err.description || "Telegram API error");
    }

    const { sentCount = 0 } = await chrome.storage.sync.get("sentCount");
    await chrome.storage.sync.set({ sentCount: sentCount + 1 });

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Sent",
      message: `"${download.filename}" arrived on your phone.`,
    });

    chrome.action.setBadgeText({ text: "" });
  } catch (err) {
    let explanation = err.message;
    if (err.message === "Failed to fetch") {
      explanation = "Chrome security blocked access to this file type or link.";
    } else if (err.message.includes("413")) {
      explanation = "File exceeds Telegram's 50MB size limit.";
    }

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Send Failed",
      message: explanation,
    });
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 5000);
  }
});
