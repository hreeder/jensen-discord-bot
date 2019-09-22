import {Message} from 'discord.js';
import {Command, CommandoMessage} from 'discord.js-commando';

import {JensenMetrics} from './metrics';

export class JensenCommand extends Command {
  msg?: CommandoMessage;

  async run(msg: CommandoMessage, args: {}|string|string[]):
      Promise<Message|Message[]> {
    this.msg = msg;

    JensenMetrics.commandsProcessed.inc({ 'commandGroup': this.group.id, 'commandName': this.name, 'memberName': this.memberName, 'guildId': msg.guild.id });

    return await this.exec(msg, args);
  }

  async exec(msg: CommandoMessage, args: {}|string|string[]):
      Promise<Message|Message[]> {
    throw new Error('No exec specified!');
  }

  getGuildSetting(key: string, defVal?: any): any {
    if (!this.client.provider || !this.msg) {
      throw new Error('No access to guild settings');
    }

    return this.client.provider.get(this.msg.guild, key, defVal);
  }

  async setGuildSetting(key: string, val: any): Promise<any> {
    if (!this.client.provider || !this.msg) {
      throw new Error('No access to guild settings');
    }

    return await this.client.provider.set(this.msg.guild, key, val);
  }

  async clearGuildSettings(): Promise<void> {
    if (!this.client.provider || !this.msg) {
      throw new Error('No access to guild settings');
    }

    return await this.client.provider.clear(this.msg.guild);
  }
}
