import Discord, {
  CollectorFilter,
  Message,
  MessageReaction,
  TextChannel,
  User,
} from "discord.js";
import bot from "../..";
import prisma from "../../prisma";
import scheduleTimer from "../events/timer/timer.service";

const GUILD_ID = process.env.GUILD_ID;

const handleDmRant = async (message: Message, force?: boolean) => {
  const words = message.content.split(/\s+/);
  const firstWord = words[0];
  if (firstWord != "!rant" && !force) return;
  const channel = message.channel;

  const menuMessage = await channel.send(
    "We're always here for you and will always support you no matter what you're going through! You can select 🔈 to sign your message or 🔇 to stay annonymous :)"
  );
  menuMessage.react("🔈");
  menuMessage.react("🔇");
  const filter: CollectorFilter<[MessageReaction, User]> = (reaction, user) =>
    (reaction.emoji.name === "🔈" || reaction.emoji.name === "🔇") && !user.bot;
  try {
    const reactions = await menuMessage.awaitReactions({
      filter,
      time: 60000,
      max: 1,
    });
    const reaction = reactions.first();
    if (!reaction) throw "No reactions";
    await channel.send(
      "Okay now you can send your message here and ill forward it to the rant channel :)"
    );
    await collectMessage(message, reaction.emoji.toString());
  } catch (e) {
    console.log(e);
    await channel.send(
      "Due to little limitations I cannot wait more than 1 minute :c! You can write it on the side and copy and paste it here :)"
    );
    return;
  }
};

const registerUserToDB = async (
  messageId: string,
  userId: string,
  username: string
) => {
  const executeTime = new Date();
  executeTime.setDate(executeTime.getDate() + 7);
  return await prisma.ventMessage.create({
    data: {
      messageId: messageId,
      userId: userId,
      userName: username,
      createdAt: executeTime,
    },
  });
};

const collectMessage = async (message: Message, reaction: string) => {
  const collectedMessage = await message.channel.awaitMessages({
    filter: (dmMessage) => !dmMessage.author.bot,
    time: 60000,
    max: 1,
  });
  const firstMessage = collectedMessage.first()?.content;

  if (!firstMessage) {
    message.channel.send(
      "Due to little limitations I cannot wait more than 1 minute :c! You can write it on the side and copy and paste it here :)"
    );
    return;
  }
  const memberId = collectedMessage.first().author.id;
  const guild = bot.guilds.resolve(GUILD_ID);
  const memberUsername = (await guild.members.fetch(memberId)).displayName;
  const dmChannel = collectedMessage.first().channel;
  const maybeSignature = reaction == "🔈" ? memberUsername : "Anonymous";

  const embed = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle(`Rant from ${maybeSignature}`)
    .setDescription(firstMessage);

  const channel = guild?.channels.cache.find(
    (channel) => channel.name === "rant"
  ) as TextChannel;
  const sendMessage = await channel.send({ embeds: [embed] });

  const newData = await registerUserToDB(
    sendMessage.id,
    memberId,
    memberUsername
  );
  await scheduleTimer(newData);
  await dmChannel.send(`Your message was send to ${channel.toString()}`);
};

export default handleDmRant;
