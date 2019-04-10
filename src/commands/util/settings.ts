import {Message} from 'discord.js';
import {CommandMessage, CommandoClient} from 'discord.js-commando';
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

  async exec(msg: CommandMessage, _args: {}):
      Promise<Message|Message[]> {
    let output: string[] = ['Settings'];
    if (this.client.provider) {
      let provider = <SettingsProvider>this.client.provider;
      provider.settings.forEach((guildSettings: Map<string, string>, guildId: string) => {
        guildSettings.forEach((val: string, key: string) => {
          output.push(`${guildId}:${key}:${val}`);
        });
      });
    }

    return msg.reply(`${output.join('\n')}`);
  }
}