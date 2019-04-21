import {register as Register, collectDefaultMetrics, Counter} from 'prom-client';
import {CommandoClient} from 'discord.js-commando';
import {Application, Request, Response} from 'express';
import express = require('express');
import chalk from 'chalk';

export class JensenMetrics {
  client: CommandoClient;
  app: Application;

  static commandsProcessed: Counter = new Counter({
    name: 'jensen_number_of_commands_processed',
    help: 'Number of Commands Processed by the bot',
    labelNames: ['commandGroup', 'commandName', 'memberName', 'guildId']
  });

  constructor(client: CommandoClient) {
    this.client = client;
    this.app = express();

    this.app.get('/metrics', (req: Request, res: Response) => {
      res.set('Content-Type', Register.contentType);
      res.end(Register.metrics());
    });

    collectDefaultMetrics();
  }

  serve() {
    const metricsPort = process.env.METRICS_PORT || 9090;
    this.app.listen(metricsPort, () => console.log(chalk.cyanBright('metrics:') + `listening on port ${metricsPort}`));
  }
}

