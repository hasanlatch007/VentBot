import { Message, TextChannel } from "discord.js";
import prisma from "../../prisma";

const deleteEntry = async (message: Message) => {
  const messageId = message.content.split(" ")[1];

  if (!messageId) {
    await message.reply(
      "Missing messageId. Syntax: `!deleteRant {MESSAGE_ID}`"
    );
    return;
  }

  const entry = await prisma.ventMessage.findFirst({
    where: { messageId: messageId },
  });

  if (!entry) {
    await message.reply(
      "I could not find that entry in the DB seems like it was already deleted manually"
    );
    return;
  }

  const rantChannel = message.guild.channels.cache.find(
    (channel) => channel.name === "rant"
  ) as TextChannel;
  try {
    (await rantChannel.messages.fetch(messageId)).delete();
    await prisma.ventMessage.delete({ where: { id: entry.id } });
    await message.reply("Message deleted!");
  } catch (e) {
    await message.reply("Failed to delete rant! You know who to contact :')");
    console.log("Failed to delete rant entry", e);
  }
};

export default deleteEntry;
