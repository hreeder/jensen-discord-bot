import {Message} from 'discord.js';
import {Command, CommandMessage} from 'discord.js-commando';

export class JensenCommand extends Command {
  async run(msg: CommandMessage, args: any):
      Promise<Message|Message[]> {
    return await this.exec(msg, args);
  }

  async exec(msg: CommandMessage, args: any):
      Promise<Message|Message[]> {
    throw new Error('No exec specified!');
  }
}
