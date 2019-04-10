import {Guild} from "discord.js";
import {SettingProvider, CommandoClient} from "discord.js-commando";

export class SettingsProvider extends SettingProvider {
  settings: Map<string, Map<string, string>>;

  constructor() {
    super()
    this.settings = new Map();
  }

  private getGSettings(guild: Guild | string): Map<string, string> {
    let gKey = SettingProvider.getGuildID(guild);

    let gSettings = this.settings.get(gKey)
    if (gSettings === undefined) {
      gSettings = new Map();
      this.settings.set(gKey, gSettings);
    }

    return gSettings
  }

  async init(client: CommandoClient): Promise<void> {}

  async destroy(): Promise<void> {}

  get(guild: Guild | string, key: string, defVal?: any): any {
    let val = this.getGSettings(guild).get(key);

    if (val !== undefined) {
      return val
    } else if (val === undefined && defVal !== undefined) {
      return defVal
    }

    return undefined;
  }

  async set(guild: Guild | string, key: string, val: any): Promise<any> {
    this.getGSettings(guild).set(key, val);
  }

  async remove(guild: Guild | string, key: string): Promise<any> {

  }

  async clear(guild: Guild | string): Promise<any> {

  }
}