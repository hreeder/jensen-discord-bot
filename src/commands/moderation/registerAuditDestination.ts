import {Message} from 'discord.js';
import {CommandoMessage, CommandoClient} from 'discord.js-commando';
import {JensenCommand} from '../../command';

export default class RegisterAuditDestination extends JensenCommand {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'register-audit-channel',
      group: 'moderation',
      memberName: 'register-audit-channel',
      description: 'Register this channel as the audit channel'
    });
  }

  async exec(msg: CommandoMessage, _args: {}):
      Promise<Message|Message[]> {
    await this.setGuildSetting('moderation.auditChannel', msg.channel.id);

    return msg.reply(`Audit Channel set to ${msg.channel}`);
  }
}
