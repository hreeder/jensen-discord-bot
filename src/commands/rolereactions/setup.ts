import {Message, Channel, TextChannel, Permissions} from 'discord.js';
import {CommandoMessage, CommandoClient} from 'discord.js-commando';
import {JensenCommand} from '../../command';

export default class SetupRoleReactions extends JensenCommand {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'setup-role-reactions',
      group: 'rolereactions',
      memberName: 'setup',
      description: 'Set the target channel for the role reaction message',
      args: [{
        key: 'channel',
        type: 'channel',
        prompt: 'What channel should the message be sent to?'
      }],
      userPermissions: [
        'MANAGE_ROLES'
      ]
    });
  }

  async exec(msg: CommandoMessage, args: {channel: Channel}):
      Promise<Message|Message[]> {
    await this.setGuildSetting('rolereactions.channel', args.channel.id);

    if (!this.getGuildSetting('rolereactions.message') && args.channel.type == 'text') {
      const destinationChannel = args.channel as TextChannel;
      let sentMessage = await destinationChannel.send('test');
      if (Array.isArray(sentMessage)) {
        sentMessage = sentMessage[0];
      }
      sentMessage = sentMessage as Message;
      await this.setGuildSetting('rolereactions.message', sentMessage.id);
    }

    return msg.reply(`Setting up, using ${args.channel}`);
  }
}
