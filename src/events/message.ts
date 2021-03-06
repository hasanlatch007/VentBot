import { Message, TextChannel } from "discord.js";
import { hasRole } from "../common/Tools";
import banUser from "../programs/ban-user";
import deleteEntry from "../programs/delete-entry";
import handleDmRant from "../programs/handleDm";
import replyToRant from "../programs/reply-rant";

const handleMessage = async (message: Message) => {
  if (message.channel.type === "DM" && !message.author.bot) {
    await handleDmRant(message, false);
  } else {
    await handleServerMessages(message);
  }
};

const handleServerMessages = async (message: Message) => {
  const words = message.content.split(/\s+/);
  const firstWord = words[0];
  const channel = message.channel as TextChannel;
  if (firstWord === "!deleteRant")
    hasRole(message.member, "BIG MAN") ? await deleteEntry(message) : null;
  if (channel.name === "reply-rant" && firstWord === "!replyRant")
    await replyToRant(message);
  if (firstWord === "!banFromBot")
    hasRole(message.member, "BIG MAN") ? await banUser(message) : null;
};

export default handleMessage;
