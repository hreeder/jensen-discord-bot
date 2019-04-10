import chalk from 'chalk';
import {Guild, GuildMember} from 'discord.js';
import {CommandoClient} from 'discord.js-commando';
import {join as pathJoin} from 'path';

import {SettingsProvider} from './settingsProvider';

import {AuditHook} from './hooks/audit';

export class Jensen {
  private client!: CommandoClient;
  private audit!: AuditHook;

  run(): void {
    if (process.env.DISCORD_TOKEN === undefined) {
      console.error(
          chalk.red('error') +
          ' DISCORD_TOKEN is not set, but is required to continue.');
      return;
    }

    console.log(chalk.green('Welcome ') + 'to ' + chalk.blue('Jensen'));
    console.log('I hope you asked for this.\n');

    let commandPrefix = process.env.COMMAND_PREFIX || "$";

    this.client = new CommandoClient({
      owner: '49558744991793152',
      commandPrefix: commandPrefix,
      messageCacheLifetime: 30,
      messageSweepInterval: 60
    });
    console.log(chalk.green('setup:') + 'Client Created')
    
    this.client.registry.registerGroups([
      ['eve', 'Eve Online Related Commands'],
      ['moderation', 'Guild Moderation Commands']
    ]);
    console.log(chalk.green('setup:') + 'Groups Registered')

    this.registerDefaults();
    this.bindCallbacks();
    console.log(chalk.green('setup:') + 'Internals Wired');

    let settingsProvider = new SettingsProvider();
    this.client.setProvider(settingsProvider);
    console.log(chalk.green('setup:') + 'SettingsProvider set');

    this.client.registry.registerCommandsIn(pathJoin(__dirname, 'commands'));
    console.log(chalk.green('setup:') + 'Commands Registered');

    this.audit = new AuditHook(this.client);
    console.log(chalk.green('setup:') + 'Hooks Set Up')

    this.client.login(process.env.DISCORD_TOKEN);
  }

  private registerDefaults(): void {
    this.client.registry.registerDefaultTypes()
        .registerDefaultGroups()
        .registerDefaultCommands({eval_: false});
  }

  private updateActivity(): void {
    this.client.user.setActivity(
        `${this.client.guilds.size} Servers`, {type: 'LISTENING'});
  }

  private bindCallbacks(): void {
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('guildCreate', this.onGuildCreate.bind(this));
    this.client.on('guildDelete', this.onGuildDelete.bind(this));
    if (process.env.NODE_DEBUG === 'commando') {
      this.client.on('debug', message => console.log(message));
    }
  }

  private onReady(): void {
    console.log(
        chalk.green('Logged In ') + 'as ' + chalk.blue(this.client.user.tag));
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

  private onGuildMemberAdd(member: GuildMember): void {
    if (this.audit) {
      this.audit.onGuildMemberAddAuditHook(member);
    }
  }
}