import { Message } from "discord.js";
import prisma from "../../prisma";

const unbanUser = async (message: Message) => {
  const firstMentioned = message.mentions.members.first();

  if (!firstMentioned) {
    await message.reply("You must tag the member you want to ban!");
    return;
  }

  const exists = async (userId: string) => {
    return prisma.banList.findFirst({ where: { userId: userId } });
  };

  if (!exists(firstMentioned.id)) {
    await message.reply("User is not banned banned!");
    return;
  }
  const id = (await exists(message.member.id)).id;
  await prisma.banList.delete({ where: { id: id } });
  await message.reply("User has been banned!");
};

export default unbanUser;
