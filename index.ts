import {
    Client,
    Message,
} from "discord.js";
import { messageManager } from "./src/events";
import timerEvent from "./src/events/timer/timer.event";

const bot = new Client({
    intents: [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_BANS",
      "GUILD_PRESENCES",
      "GUILD_VOICE_STATES",
      "GUILD_MESSAGES",
      "GUILD_MESSAGE_REACTIONS",
      "DIRECT_MESSAGES",
      "DIRECT_MESSAGE_REACTIONS",
    ],
    partials: ["REACTION", "MESSAGE", "CHANNEL"],
  });

bot.login(process.env.BOT_TOKEN)

bot.on("ready", async () => {
    console.log(`Bot is online - ${bot.user?.tag}`)
    await timerEvent()
})

bot.on("messageCreate", async (msg: Message) => {
    await messageManager(msg)
})

export default bot;
module.exports = bot;