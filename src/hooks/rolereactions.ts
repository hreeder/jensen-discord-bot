import { CommandoClient } from "discord.js-commando";
import { MessageReaction, User, Guild, MessageEmbed, TextChannel, Emoji, Collection, GuildEmoji, GuildMember, Role, RoleResolvable } from "discord.js";

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

      const embed = new MessageEmbed().setTitle('React with the following for roles');
      
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
        const message = await textChannel.messages.fetch(roleReactionMessageId);
        message.edit({embed});

        const existing_reactions = message.reactions.filter(reaction => reaction.me).map(reaction => reaction.emoji);

        // message.reactions.forEach((reaction: MessageReaction, key: string) => {
        //   // Supplying the message arg to reaction.remove will
        //   // resolve to the message author, ie this bot
        //   reaction.remove(message);
        //   message.reactions.remove(key);
        // });

        roles.forEach(roleDef => {
          const emoji: GuildEmoji|string = guild.emojis.get(roleDef.emojiCode) || roleDef.emojiCode;
          message.react(emoji);
        });
      }
    }
  }

  messageReactionHandler(reaction: MessageReaction, user: User, action: string): void {
    // Don't act on self reactions
    if (this.client.user !== null && user.id == this.client.user.id) {
      return;
    }

    // Abort if this isn't a guild message
    if (reaction.message.guild === null) {
      return;
    }

    const roleReactionMessageId = this.client.provider.get(reaction.message.guild.id, 'rolereactions.message');
    const messageId = reaction.message.id;

    if (roleReactionMessageId && roleReactionMessageId === messageId) {
      const emojiId: string = (reaction.emoji.id) ? reaction.emoji.identifier : reaction.emoji.toString();
      
      const roles: RoleDefinition[] = this.client.provider.get(reaction.message.guild.id, 'rolereactions.roles') || [];
      const targetRole = roles.filter((rd: RoleDefinition) => rd.emojiCode === emojiId);

      if (targetRole.length > 0) {
        let gm = reaction.message.guild.member(user)!
        if (action === "add") {
          gm.roles.add(targetRole[0].roleID)
        } else if (action === "remove") {
          gm.roles.remove(targetRole[0].roleID)
        }
      }
    }
  }

  async onMessageReactionAdd(reaction: MessageReaction, user: User): Promise<void> {
    // Abort if this isn't a guild message
    if (reaction.message.guild === null) {
      return;
    }
    this.messageReactionHandler(reaction, user, "add");
  }

  async onMessageReactionRemove(reaction: MessageReaction, user: User): Promise<void> {
    // Abort if this isn't a guild message
    if (reaction.message.guild === null) {
      return;
    }
    this.messageReactionHandler(reaction, user, "remove");
  }
}
