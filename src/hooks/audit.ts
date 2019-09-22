import {GuildMember, Guild, TextChannel, MessageEmbed} from "discord.js";
import {CommandoClient} from "discord.js-commando";

export class AuditHook {
  client: CommandoClient;
  constructor(client: CommandoClient) {
    this.client = client;
  }

  async onGuildMemberAddAuditHook(member: GuildMember): Promise<void> {
    const guild: Guild = member.guild;
    const auditChannelId: string = this.client.provider.get(guild, 'moderation.auditChannel');

    if (auditChannelId) { // This will be undefined if the guild has not registered an audit channel
      const auditChannel = this.client.channels.get(auditChannelId);
      if (auditChannel && auditChannel.type === 'text') {
        const embed = new MessageEmbed()
            .setTitle(`${member.user.tag} joined the server`)
            .addField('Username', member.user.username, true)
            .addField('Discriminator', member.user.discriminator, true)
            .addField('ID', member.user.id, true)
            .addField('Joined At', member.joinedAt, true)
            .setFooter('Audit Log: User Joined Guild');
        const avatarURL = member.user.avatarURL();
        if (avatarURL !== null) {
          embed.setThumbnail(avatarURL);
        }
        (auditChannel as TextChannel).send({embed});
      }
    }
  }

  async onGuildMemberRemoveAuditHook(member: GuildMember): Promise<void> {
    const guild: Guild = member.guild;
    const auditChannelId: string = this.client.provider.get(guild, 'moderation.auditChannel');

    if (auditChannelId) { // This will be undefined if the guild has not registered an audit channel
      const auditChannel = this.client.channels.get(auditChannelId);
      if (auditChannel && auditChannel.type === 'text') {
        const embed = new MessageEmbed()
            .setTitle(`${member.user.tag} left the server`)
            .setFooter('Audit Log: User Left Guild');
        const avatarURL = member.user.avatarURL();
        if (avatarURL !== null) {
          embed.setThumbnail(avatarURL);
        }
        (auditChannel as TextChannel).send({embed});
      }
    }
  }
}
