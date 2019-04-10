import {GuildMember, Guild, TextChannel} from "discord.js";
import {CommandoClient} from "discord.js-commando";

export class AuditHook {
  client: CommandoClient;
  constructor(client: CommandoClient) {
    this.client = client;
  }

  async onGuildMemberAddAuditHook(member: GuildMember): Promise<void> {
    let guild: Guild = member.guild;
    let auditChannelId: string = this.client.provider.get(guild, 'moderation.auditChannel');

    if (auditChannelId) {
      let rawAuditChannel = this.client.channels.get(auditChannelId);
      if (rawAuditChannel && rawAuditChannel.type === 'text') {
        let auditChannel = <TextChannel>rawAuditChannel;
        auditChannel.send(`${member} just joined the server`);
      }
    }
  }
}