import { CommandoClient } from "discord.js-commando";
import { MessageReaction, User, Guild, RichEmbed, Message, TextChannel, Emoji } from "discord.js";
import chalk from "chalk";

export interface RoleDefinition {
  emojiCode: string;
  roleID: string;
}

export class RoleReactionsHooks {
  client: CommandoClient;
  constructor(client: CommandoClient) {
    this.client = client;

    this.client.on('rolereactionUpdate', this.onRoleReactionUpdate.bind(this));
  }

  async onRoleReactionUpdate(guild: Guild): Promise<void> {
    const roleReactionsChannelId = this.client.provider.get(guild, 'rolereactions.channel');
    const roleReactionMessageId = this.client.provider.get(guild, 'rolereactions.message');

    if (roleReactionsChannelId && roleReactionMessageId) {
      const roles: RoleDefinition[] = await this.client.provider.get(guild, 'rolereactions.roles') || [];

      const embed = new RichEmbed().setTitle('React with the following for roles');
      
      roles.forEach(roleDef => {
        const emoji: Emoji|undefined = guild.emojis.get(roleDef.emojiCode);
        const emojiString = (emoji) ? emoji.toString() : roleDef.emojiCode;

        const role = guild.roles.get(roleDef.roleID);
        if (role === undefined) {
          return;
        }
        embed.addField(emojiString, role.toString(), true);
      });

      const channel = this.client.channels.get(roleReactionsChannelId);      
      if (channel !== undefined && channel.type === 'text') {
        const textChannel = channel as TextChannel;
        const message = await textChannel.fetchMessage(roleReactionMessageId);
        message.edit({embed});

        message.reactions.forEach((reaction: MessageReaction, _key: string) => {
          // Supplying the message arg to reaction.remove will
          // resolve to the message author, ie this bot
          reaction.remove(message);
        });

        roles.forEach(roleDef => {
          const emoji: Emoji|string = guild.emojis.get(roleDef.emojiCode) || roleDef.emojiCode;
          message.react(emoji);
        });
      }
    }
  }

  async onMessageReactionAdd(reaction: MessageReaction, user: User): Promise<void> {
    // Don't act on self reactions
    if (user.id == this.client.user.id) {
      return;
    }

    const roleReactionMessageId = this.client.provider.get(reaction.message.guild, 'rolereactions.message');
    const messageId = reaction.message.id;

    if (roleReactionMessageId && roleReactionMessageId === messageId) {
      const emojiId: string = (reaction.emoji.id) ? reaction.emoji.identifier : reaction.emoji.toString();
      const roles: RoleDefinition[] = this.client.provider.get(reaction.message.guild, 'rolereactions.roles') || [];
      const targetRole = roles.filter((rd: RoleDefinition) => rd.emojiCode === emojiId);
      if (targetRole.length > 0) {
        console.log(chalk.blue('rolereactions:') + 'do the thing');
      }
    }
  }
}