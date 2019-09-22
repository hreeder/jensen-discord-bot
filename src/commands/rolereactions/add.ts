import {Message, Role, Emoji, Permissions} from 'discord.js';
import {CommandoMessage, CommandoClient} from 'discord.js-commando';
import {JensenCommand} from '../../command';

import {RoleDefinition} from '../../hooks/rolereactions';

export default class AddRoleReaction extends JensenCommand {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'add-role-reaction',
      group: 'rolereactions',
      memberName: 'add',
      description: 'Define a new assignable role',
      args: [{
        key: 'emoji',
        type: 'custom-emoji|string',
        prompt: 'Which emoji should this role use?'
      }, {
        key: 'role',
        type: 'role',
        prompt: 'What role should this emoji assign?'
      }]
    });
  }

  async exec(msg: CommandoMessage, args: {emoji: Emoji|string, role: Role}):
      Promise<Message|Message[]> {
    // Can the user who's messaged assign this role?
    if (args.role.comparePositionTo(msg.member.roles.highest) >= 0) {
      return msg.reply(`Sorry, you cannot assign ${args.role} therefore you cannot set it up as a reaction`)
    }

    if (!msg.member.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
      return msg.reply(`Sorry, you don't have the "Manage Roles" permission, therefore you cannot set up role reactions`)
    }

    // Ok, they can, let's proceed
    const emoteIndentifier: string = (args.emoji instanceof Emoji) ? args.emoji.id : args.emoji;

    const roles: RoleDefinition[] = this.getGuildSetting('rolereactions.roles') || [];
    roles.push({
      emojiCode: emoteIndentifier,
      roleID: args.role.id
    });
    await this.setGuildSetting('rolereactions.roles', roles);

    this.client.emit('rolereactionUpdate', msg.guild);

    return msg.reply(`Setting up ${args.emoji} to map to ${args.role}`);
  }
}
