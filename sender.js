require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  throw new Error("Missing BOT_TOKEN or CHAT_ID in .env file");
}

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

function sendFile(filePath) {
  return bot.sendDocument(CHAT_ID, filePath);
}

module.exports = sendFile;
