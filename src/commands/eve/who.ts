import {Message} from 'discord.js';
import {Command, CommandMessage, CommandoClient} from 'discord.js-commando';

export class Who extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'who',
      group: 'eve',
      memberName: 'who',
      description: 'Lookup an Eve Online Character',
      args: [{
        key: 'characterName',
        type: 'string',
        prompt: 'Which character do you want to look up?'
      }]
    });
  }

  async run(msg: CommandMessage, args: {characterName: string}):
      Promise<Message|Message[]> {
    // const esiClient = esi({})
    return msg.reply(`You want ${args.characterName}, yeah?`);
  }
}