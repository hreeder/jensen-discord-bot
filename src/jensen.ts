import chalk from 'chalk';
import {Guild} from 'discord.js';
import {CommandoClient} from 'discord.js-commando';
import {join as pathJoin} from 'path';

export class Jensen {
  private client!: CommandoClient;

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

    this.client.registry.registerGroups(
        [['eve', 'Eve Online Related Commands']]);

    this.registerDefaults();
    this.bindCallbacks();

    this.client.registry.registerCommandsIn(pathJoin(__dirname, 'commands'));

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
}