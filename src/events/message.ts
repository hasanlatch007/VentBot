import { Message, TextChannel } from "discord.js"
import handleDmRant from "../programs/handleDm"


const handleMessage = async (message: Message) => {
    if (message.channel.type === "DM" && !message.author.bot) {
        await handleDmRant(message, false)
    } else {
       await handleServerMessages(message)
    }
}

const handleServerMessages = async (message: Message) => {
    const words = message.content.split(/\s+/)
    const firstWord = words[0]
    const channel = message.channel as TextChannel
    if (channel.name != "rant" || firstWord != "!rant") return
    const openDM = await message.author.createDM()
    const sendMessage = await openDM.send("Hello!")
    await handleDmRant(sendMessage, true)
}

export default handleMessage