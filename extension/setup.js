const tokenInput   = document.getElementById("tokenInput");
const chatIdInput  = document.getElementById("chatIdInput");
const tokenError   = document.getElementById("tokenError");
const chatIdError  = document.getElementById("chatIdError");
const step1El      = document.getElementById("step1");
const step2El      = document.getElementById("step2");
const step3El      = document.getElementById("step3");
const testingMsg   = document.getElementById("testingMsg");
const dot1         = document.getElementById("dot1");
const dot2         = document.getElementById("dot2");
const dot3         = document.getElementById("dot3");
const line1        = document.getElementById("line1");
const line2        = document.getElementById("line2");

(async () => {
  const { botToken, chatId } = await chrome.storage.sync.get(["botToken", "chatId"]);
  if (botToken) tokenInput.value = botToken;
  if (chatId)   chatIdInput.value = chatId;
})();

const tokenVisBtn = document.getElementById("tokenVisBtn");
const eyeOpen     = document.getElementById("eyeOpen");
const eyeClosed   = document.getElementById("eyeClosed");

tokenVisBtn.addEventListener("click", () => {
  const isPassword = tokenInput.type === "password";
  tokenInput.type  = isPassword ? "text" : "password";
  eyeOpen.style.display   = isPassword ? "none"  : "block";
  eyeClosed.style.display = isPassword ? "block" : "none";
});

document.getElementById("step1Next").addEventListener("click", () => {
  const token = tokenInput.value.trim();
  tokenError.textContent = "";

  if (!token) {
    tokenError.textContent = "Please enter your bot token.";
    return;
  }
  if (!/^\d+:[A-Za-z0-9_-]{35,}$/.test(token)) {
    tokenError.textContent = "That doesn't look like a valid token. Check and try again.";
    return;
  }

  goToStep(2);
});

document.getElementById("step2Back").addEventListener("click", () => goToStep(1));

document.getElementById("step2Next").addEventListener("click", async () => {
  const token  = tokenInput.value.trim();
  const chatId = chatIdInput.value.trim();
  chatIdError.textContent = "";

  if (!chatId) {
    chatIdError.textContent = "Please enter your Chat ID.";
    return;
  }
  if (!/^-?\d+$/.test(chatId)) {
    chatIdError.textContent = "Chat ID should be a number (e.g. 1040834388).";
    return;
  }

  const nextBtn = document.getElementById("step2Next");
  nextBtn.disabled = true;
  testingMsg.style.display = "flex";

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Send to Phone is connected. You'll get a notification whenever a download finishes.",
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      throw new Error(data.description || "Telegram API error: check token and Chat ID.");
    }

    await chrome.storage.sync.set({ botToken: token, chatId, enabled: true });

    testingMsg.style.display = "none";
    goToStep(3);
  } catch (err) {
    testingMsg.style.display = "none";
    nextBtn.disabled = false;
    chatIdError.textContent = err.message;
  }
});

document.getElementById("doneBtn").addEventListener("click", () => {
  window.close();
});

function goToStep(n) {
  step1El.style.display = n === 1 ? "block" : "none";
  step2El.style.display = n === 2 ? "block" : "none";
  step3El.style.display = n === 3 ? "block" : "none";

  dot1.className = "step" + (n >= 1 ? (n > 1 ? " done" : " active") : "");
  dot2.className = "step" + (n >= 2 ? (n > 2 ? " done" : " active") : "");
  dot3.className = "step" + (n >= 3 ? " done" : "");

  line1.className = "step-line" + (n > 1 ? " done" : "");
  line2.className = "step-line" + (n > 2 ? " done" : "");
}
