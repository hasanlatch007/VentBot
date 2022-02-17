import { GuildMember } from "discord.js";

export const hasRole = (member: GuildMember, roleReq: string) => {
  return member.roles.cache.find((role) => role.name === roleReq);
};
