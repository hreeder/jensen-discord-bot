import {Message, RichEmbed} from 'discord.js';
import {CommandMessage, CommandoClient} from 'discord.js-commando';
import {JensenCommand} from '../../command';

import {ESIClient} from '../../esi';

export default class Who extends JensenCommand {
  esi: ESIClient;

  constructor(client: CommandoClient) {
    super(client, {
      name: 'evewho',
      group: 'eve',
      memberName: 'who',
      description: 'Lookup an Eve Online Entity',
      args: [{
        key: 'name',
        type: 'string',
        prompt: 'What do you want to look up?'
      }]
    });

    this.esi = new ESIClient();
  }

  async exec(msg: CommandMessage, args: {name: string}):
      Promise<Message|Message[]> {
    const ids = await this.esi.universe.IDs([args.name]);

    let embed = null;

    if (ids.characters !== undefined) {
      embed = await this.buildCharacterEmbed(ids.characters[0].id);
    } else if (ids.corporations !== undefined) {
      embed = await this.buildCorporationEmbed(ids.corporations[0].id);
    }

    if (embed !== null) {
      embed.setFooter(`Retrieved from ESI`).setTimestamp();
      return msg.reply({embed});
    }

    return msg.reply(`Nothing found by the name of ${args.name}`);
  }

  private async buildCharacterEmbed(characterID: number): Promise<RichEmbed> {
    const character = await this.esi.character.get(characterID);
    const corporation =
        await this.esi.corporation.get(character.corporation_id);

    const embed =
        new RichEmbed()
            .setAuthor(
                'EvE Online Character',
                'https://pbs.twimg.com/profile_images/1055096512898830338/cP_VSPQO_400x400.jpg')
            .setTitle(character.name)
            .setThumbnail(
                `https://image.eveonline.com/Character/${characterID}_128.jpg`)
            .addField(
                'Corporation', `${corporation.name} [${corporation.ticker}]`,
                true);

    if (corporation.alliance_id !== undefined) {
      const alliance = await this.esi.alliance.get(corporation.alliance_id);
      embed.addField('Alliance', `${alliance.name} <${alliance.ticker}>`, true);
    } else {
      embed.addBlankField(true);
    }

    embed
        .addField(
            'Security Status',
            Math.round(character.security_status * 100) / 100, true)
        .addField(
            'Links',
            `[EvEWho](https://evewho.com/pilot/${
                character.name.replace(
                    ' ',
                    '_')}) ~ [zKillboard](https://zkillboard.com/character/${
                characterID})`);

    return embed;
  }

  private async buildCorporationEmbed(corpID: number): Promise<RichEmbed> {
    const corp = await this.esi.corporation.get(corpID);
    const embed =
        new RichEmbed()
            .setAuthor(
                'EvE Online Corporation',
                'https://pbs.twimg.com/profile_images/1055096512898830338/cP_VSPQO_400x400.jpg')
            .setTitle(`${corp.name} [${corp.ticker}]`)
            .setThumbnail(
                `https://image.eveonline.com/Corporation/${corpID}_128.png`);

    if (corp.alliance_id !== undefined) {
      const alliance = await this.esi.alliance.get(corp.alliance_id);
      embed.addField('Alliance', `${alliance.name} <${alliance.ticker}>`, true);
    }

    embed.addField('Members', corp.member_count)
        .addField(
            'Links',
            `[zKillboard](https://zkillboard.com/corporation/${corpID})`);

    return embed;
  }
}