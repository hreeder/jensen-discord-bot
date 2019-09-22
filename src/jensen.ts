import chalk from 'chalk';
import {Guild, GuildMember, MessageReaction, User} from 'discord.js';
import {CommandoClient} from 'discord.js-commando';
import {join as pathJoin} from 'path';
import {JensenMetrics} from './metrics';

import {SettingsProvider} from './settingsProvider';
import {CustomEmojiArgumentType} from './types/custom-emoji';

import {AuditHook} from './hooks/audit';
import {RoleReactionsHooks} from './hooks/rolereactions';

export class Jensen {
  private client!: CommandoClient;
  private audit!: AuditHook;
  private rrhooks!: RoleReactionsHooks;
  private metrics?: JensenMetrics;

  run(): void {
    if (process.env.DISCORD_TOKEN === undefined) {
      console.error(
          chalk.red('error') +
          ' DISCORD_TOKEN is not set, but is required to continue.');
      return;
    }

    console.log(chalk.green('Welcome ') + 'to ' + chalk.blue('Jensen'));
    console.log('I hope you asked for this.\n');

    const commandPrefix = process.env.COMMAND_PREFIX || "$";
    console.log(chalk.green('setup:') + `commandPrefix set to ${commandPrefix}`);

    this.client = new CommandoClient({
      owner: '49558744991793152',
      commandPrefix,
      messageCacheLifetime: 30,
      messageSweepInterval: 60
    });
    console.log(chalk.green('setup:') + 'Client Created');
    
    this.client.registry.registerGroups([
      ['emoji', 'Emote management'],
      ['eve', 'Eve Online Related Commands'],
      ['moderation', 'Guild Moderation Commands'],
      ['rolereactions', 'Role Reaction Commands']
    ]);
    console.log(chalk.green('setup:') + 'Groups Registered');

    this.registerDefaults();
    // this.client.registry.registerType(CustomEmojiArgumentType);
    this.bindCallbacks();
    console.log(chalk.green('setup:') + 'Internals Wired');

    const settingsProvider = new SettingsProvider();
    this.client.setProvider(settingsProvider);
    console.log(chalk.green('setup:') + 'SettingsProvider set');

    this.client.registry.registerCommandsIn(pathJoin(__dirname, 'commands'));
    console.log(chalk.green('setup:') + 'Commands Registered');

    this.audit = new AuditHook(this.client);
    this.rrhooks = new RoleReactionsHooks(this.client);
    console.log(chalk.green('setup:') + 'Hooks Set Up');

    const collectMetrics = Boolean(process.env.METRICS_ENABLED) || false;
    if (collectMetrics) {
      console.log(chalk.cyanBright('metrics:') + 'enabled');
      this.metrics = new JensenMetrics(this.client);

      this.metrics.serve();
    }

    this.client.login(process.env.DISCORD_TOKEN);
  }

  private registerDefaults(): void {
    this.client.registry.registerDefaultTypes()
        .registerDefaultGroups()
        .registerDefaultCommands({eval: false});
  }

  private updateActivity(): void {
    this.client.user!.setActivity(
        `${this.client.guilds.size} Servers`, {type: 'LISTENING'});
  }

  private bindCallbacks(): void {
    if (process.env.NODE_DEBUG === 'commando') {
      this.client.on('debug', message => console.log(message));
    }

    this.client.on('ready', this.onReady.bind(this));
    this.client.on('guildCreate', this.onGuildCreate.bind(this));
    this.client.on('guildDelete', this.onGuildDelete.bind(this));

    this.client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this));
    this.client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this));

    this.client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
    this.client.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));
  }

  private onReady(): void {
    console.log(
        chalk.green('Logged In ') + 'as ' + chalk.blue(this.client.user!.tag));
    this.updateActivity();
  }

  private onGuildCreate(guild: Guild): void {
    console.log(chalk.green('Added ') + 'to ' + chalk.blue(guild.name));
    this.updateActivity();
  }

  private onGuildDelete(guild: Guild): void {
    console.log(chalk.green('Removed ') + 'from ' + chalk.blue(guild.name));
    this.updateActivity();
  }

  private onMessageReactionAdd(reaction: MessageReaction, user: User) {
    if (this.rrhooks) {
      this.rrhooks.onMessageReactionAdd(reaction, user);
    }
  }

  private onMessageReactionRemove(reaction: MessageReaction, user: User) {
    if (this.rrhooks) {
      this.rrhooks.onMessageReactionRemove(reaction, user);
    }
  }

  private onGuildMemberAdd(member: GuildMember): void {
    if (this.audit) {
      this.audit.onGuildMemberAddAuditHook(member);
    }
  }

  private onGuildMemberRemove(member: GuildMember): void {
    if (this.audit) {
      this.audit.onGuildMemberRemoveAuditHook(member);
    }
  }
}
