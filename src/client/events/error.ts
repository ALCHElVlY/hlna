// Internal imports
import { DiscordClient, Event } from '../structures';

export default class ErrorEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'error');
  }

  public async run(error: any): Promise<void> {
    console.log(error);
    if (error.message.includes('uncaughtException')) {
        const errorMsg = error.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
        console.error(`Uncaught Exception: ${errorMsg}`);
        process.exit(1);
    }
    if (error.message.includes('unhandledRejection')) {
        console.error(`Unhandled rejection: ${error}`);
    }
  }
}
