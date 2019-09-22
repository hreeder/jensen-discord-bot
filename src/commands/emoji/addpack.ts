import { Message, Emoji } from "discord.js";
import { CommandoClient, CommandoMessage } from "discord.js-commando";
import { JensenCommand } from "../../command";

interface IPacks {
  [key: string]: Array<[string, string]>;
}

const PACKS: IPacks = {
  mySuperAwesomePack:[
    ['https://github.com/Berach/BERACHS_COMPLETE_PIDGIN/raw/master/10bux.gif', 'tenbux'],
    ['https://github.com/Berach/BERACHS_COMPLETE_PIDGIN/raw/master/allears.gif', 'allears']
  ]
};

export default class AddPack extends JensenCommand {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'add-emote-pack',
      group: 'emoji',
      memberName: 'addpack',
      description: 'Add an emote pack',
      args: [{
        key: 'code',
        type: 'string',
        prompt: 'What is the code of the emote pack to add?'
      }]
    });
  }

  async exec(msg: CommandoMessage, args: {code: string}):
      Promise<Message|Message[]> {

    // Get pack, if it exists
    if (!(args.code in PACKS)) {
      return msg.reply(`Pack \`${args.code}\` not found.`);
    }

    const emotes = PACKS[args.code];
    
    const currentEmoji = msg.guild.emojis.map((emoji: Emoji, id: string) => emoji.name);
    console.log(currentEmoji);

    const fails: string[] = [];

    emotes.forEach(([link, code]) => {
      console.log(`${link}, :${code}:`);
      if (currentEmoji.includes(code)) {
        fails.push(code);
      } else {
        msg.guild.emojis.create(link, code)
            .then((emoji: Emoji) => console.log(`Added ${emoji.name} - ${emoji.id}!`))
            .catch(console.error);
      }
    });

    let output = "Done";

    if (fails.length > 0) {
      const failedEmoji = fails.join(", ");
      output += `, however the following emoji were already present on this server and couldn't be added again: ${failedEmoji}.`;
    } else {
      output += "! All emoji added successfully!";
    }
    return msg.reply(output);
  }
}
