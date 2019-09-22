import {Message} from 'discord.js';
import {CommandoMessage, CommandoClient} from 'discord.js-commando';
import {JensenCommand} from '../../command';
import { SettingsProvider } from '../../settingsProvider';

export default class Settings extends JensenCommand {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'settings',
      group: 'util',
      memberName: 'settings',
      description: 'List settings',
      guildOnly: true
    });
  }

  async exec(msg: CommandoMessage, _args: {}):
      Promise<Message|Message[]> {
    const output: string[] = ['Settings'];
    if (this.client.provider) {
      const provider = this.client.provider as SettingsProvider;
      provider.settings.forEach((guildSettings: Map<string, string>, guildId: string) => {
        guildSettings.forEach((val: string, key: string) => {
          output.push(`${guildId}:${key}:${val}`);
        });
      });
    }

    return msg.reply(`${output.join('\n')}`);
  }
}
