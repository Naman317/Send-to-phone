const mainToggle = document.getElementById("mainToggle");
const statusLabel = document.getElementById("statusLabel");
const statusSub   = document.getElementById("statusSub");
const statusRing  = document.getElementById("statusRing");
const sentCountEl = document.getElementById("sentCount");
const mainState   = document.getElementById("mainState");
const setupState  = document.getElementById("setupState");

async function init() {
  const { botToken, chatId, enabled = false, sentCount = 0 } =
    await chrome.storage.sync.get(["botToken", "chatId", "enabled", "sentCount"]);

  if (!botToken || !chatId) {
    setupState.style.display = "block";
    return;
  }

  mainState.style.display = "block";
  sentCountEl.textContent = sentCount;
  setToggle(enabled);
}

function setToggle(on) {
  mainToggle.checked = on;
  statusLabel.textContent = on ? "Active" : "Paused";
  statusSub.textContent   = on ? "Watching your downloads" : "Notifications are off";
  statusRing.classList.toggle("active", on);
}

mainToggle?.addEventListener("change", async () => {
  const on = mainToggle.checked;
  await chrome.storage.sync.set({ enabled: on });
  setToggle(on);
});

document.getElementById("settingsBtn")?.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("setup.html?edit=true") });
});

document.getElementById("goSetupBtn")?.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("setup.html") });
});

init();
