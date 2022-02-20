import { VentMessage } from "@prisma/client";
import { Message } from "discord.js";
import prisma from "../../prisma";

const isLocked = (data: VentMessage) => {
  return data.isLocked;
};

const replyToRant = async (message: Message) => {
  const words = message.content.split(" ");
  words.shift();
  const [rantId, ...rest] = words;
  const reply = rest.join(" ");

  if (!rantId || isNaN(Number(rantId)) || !reply) {
    await message.reply("Missing Syntax. Usage: !rantReply {ID} {Message}");
    return;
  }

  const rant = await prisma.ventMessage.findUnique({
    where: { id: Number(rantId) },
  });

  if (!rant) {
    await message.reply("I could not find that rant!");
    return;
  }

  if (isLocked(rant)) {
    await message.reply("Rant cannot be replied to!");
    return;
  }

  const rantOwnerDMs = await (
    await message.guild.members.fetch(rant.userId)
  ).createDM();

  const messageToSend = `Message from **${message.member.displayName}** replying to your rant **ID: ${rantId}** \n${reply}`;

  if (messageToSend.length > 2000) {
    await message.reply(
      "Message too long! I'm currently working to fix that so if you got this error damn you're unlucky :')"
    );
    return;
  }

  try {
    await rantOwnerDMs.send(messageToSend);
    await message.reply("Your message was sent!");
  } catch (e) {
    console.log(e);
    await message.reply(
      "It seems like I couldn't send this message to the owner, contact hasan he will manually do it :)"
    );
  }
};

export default replyToRant;
