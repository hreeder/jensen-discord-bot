import * as Sentry from '@sentry/node';
import {Jensen} from './jensen';

Sentry.init({dsn: process.env.SENTRY_DSN});

try {
  const bot: Jensen = new Jensen();
  bot.run();
} catch (ex) {
  Sentry.captureException(ex);
}
