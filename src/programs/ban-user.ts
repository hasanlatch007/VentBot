import { Message } from "discord.js";
import prisma from "../../prisma";

const banUser = async (message: Message) => {
  const firstMentioned = message.mentions.members.first();
  if (!firstMentioned) {
    await message.reply("You must tag the member you want to ban!");
    return;
  }

  const exists = async (userId: string) => {
    return prisma.banList.findFirst({ where: { userId: userId } });
  };

  if (exists(firstMentioned.id)) {
    await message.reply("User is already banned!");
    return;
  }

  await prisma.banList.create({
    data: { userId: firstMentioned.id, userName: firstMentioned.displayName },
  });
  await message.reply("User has been banned!");
};

export default banUser;
