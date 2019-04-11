import {GuildMember, Guild, TextChannel, RichEmbed} from "discord.js";
import {CommandoClient} from "discord.js-commando";

export class AuditHook {
  client: CommandoClient;
  constructor(client: CommandoClient) {
    this.client = client;
  }

  async onGuildMemberAddAuditHook(member: GuildMember): Promise<void> {
    let guild: Guild = member.guild;
    let auditChannelId: string = this.client.provider.get(guild, 'moderation.auditChannel');

    if (auditChannelId) { // This will be undefined if the guild has not registered an audit channel
      let auditChannel = this.client.channels.get(auditChannelId);
      if (auditChannel && auditChannel.type === 'text') {
        let embed = new RichEmbed()
            .setThumbnail(member.user.avatarURL)
            .setTitle(`${member.user.tag} joined the server`)
            .addField('Username', member.user.username, true)
            .addField('Discriminator', member.user.discriminator, true)
            .addField('ID', member.user.id, true)
            .addField('Joined At', member.joinedAt, true)
            .setFooter('Audit Log: User Joined Guild');
        (<TextChannel>auditChannel).send({embed: embed});
      }
    }
  }

  async onGuildMemberRemoveAuditHook(member: GuildMember): Promise<void> {
    let guild: Guild = member.guild;
    let auditChannelId: string = this.client.provider.get(guild, 'moderation.auditChannel');

    if (auditChannelId) { // This will be undefined if the guild has not registered an audit channel
      let auditChannel = this.client.channels.get(auditChannelId);
      if (auditChannel && auditChannel.type === 'text') {
        let embed = new RichEmbed()
            .setThumbnail(member.user.avatarURL)
            .setTitle(`${member.user.tag} left the server`)
            .setFooter('Audit Log: User Left Guild');
        (<TextChannel>auditChannel).send({embed: embed});
      }
    }
  }
}