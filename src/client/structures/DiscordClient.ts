// External imports
import {
  Client,
  IntentsString,
  MessageMentionOptions,
  PartialTypes,
  Collection,
} from 'discord.js';
import { readdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import * as path from 'path';

// Internal imports
import loadCommand from '../utils/loadCommand';
import { SlashCommand as Command } from '../structures';

export default class DiscordClient extends Client {
  readonly client;
  public commands;
  public settings;

  constructor(
    intents: IntentsString[],
    allowedMentions?: MessageMentionOptions,
    partials?: PartialTypes[],
  ) {
    super({ intents, allowedMentions, partials });

    this.client = this;
    this.commands = new Collection<string, Command>();
    this.settings = new Collection<any, any>();
  }

  /**
   * Loads the client commands into memory, as a collection.
   */
  private async LoadCommands(dir?: string): Promise<void> {
    const commandPath = dir || path.join(__dirname, '..', 'commands');
    const commandFolder: string[] = readdirSync(commandPath);

    try {
      commandFolder.forEach(async (file: string) => {
        const filePath = path.join(commandPath, file);
        const stats = await stat(filePath);

        // If it's a directory, recurse into it.
        if (stats.isDirectory()) {
          this.LoadCommands(filePath);
        }

        // If it's a file, load it.
        if (stats.isFile() &&
          (file.endsWith('.ts') || file.endsWith('.js'))) {
          await loadCommand(this, filePath);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Loads the event files required for the client.
   */
  private async LoadEvents(): Promise<void> {
    const eventPath: string = path.join(__dirname, '..', 'events');
    const eventFolder: string[] = readdirSync(eventPath);
    console.log(`Loading a total of ${eventFolder.length} events.`);

    eventFolder.forEach(async (file) => {
      const DiscordClientEvent = (await import(`${eventPath}/${file}`)).default;
      const event = new DiscordClientEvent(this.client);
      console.log(`Loading Event: ${event.name}`);
      this.client.on(event.name, event.run.bind(event));
    });
  }

  /**
   * Handles loading all the collections, events, and commands before logging
   * the client in.
   * @param token The token to use to log the client in.
   */
  public async Login(token: string): Promise<void> {
    await this.LoadEvents();
    await this.LoadCommands();
    await this.login(token);
  }
}
