import {Message, GuildChannel, Channel, TextChannel} from 'discord.js';
import {CommandMessage, CommandoClient} from 'discord.js-commando';
import {JensenCommand} from '../../command';

export default class Channels extends JensenCommand {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'channels',
      group: 'util',
      memberName: 'channels',
      description: 'List channels'
    });
  }

  async exec(msg: CommandMessage, _args: {}):
      Promise<Message|Message[]> {
    let channels = msg.guild.channels.map((channel: GuildChannel) => [channel.name, channel.id, channel.type]);

    let lines = ["I know of the following channels"]

    channels.forEach(([name, id, group]) => lines.push(`[${group}] ${name}: ${id}`));

    lines.push(`The current channel is: [${msg.channel.type}] ${msg.channel.id}`)

    let x: Channel|undefined = this.client.channels.get(msg.channel.id);

    if (x !== undefined && x.type === 'text') {
        let y: TextChannel = <TextChannel>x;
        y.send('test123');
    }
    

    return msg.reply(lines.join("\n"));
  }
}