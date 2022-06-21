// External imports
import { Message, EmojiResolvable, CommandInteraction, Snowflake, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { bold } from '@discordjs/builders';
import crypto from 'crypto';
import fetch, { Response } from 'node-fetch';
import { readdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'path';

// Internal imports
import { DiscordClient, Logger } from '../structures/index';
import { IMessageMentions } from './interfaces';
import { clientConfig } from '../../interfaces/env_config';
import { EmbedEnum } from '../../enums';
import defaultEmojis from './unicodeEmojis.json';
import { client } from '../bot';

export default class ClientFunctions {
  /**
   * Fetches the ARK server status from the ini file provided
   * by the API.
   * @param client The Discord client
   */
  private static async GetArkStatus(client: DiscordClient): Promise<any> {
    const response: Response = await fetch(
      'http://arkdedicated.com/officialserverstatus.ini',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const results: string = await response.text();
    const status = this.FormatGameStatus(results);

    client.user?.setActivity(`ARK: ${status}`, {
      type: 'WATCHING',
    });
  }

  /**
   * Fetches the current rates for ARK official servers.
   */
  public static async GetOfficialRates(): Promise<Map<any, any>> {
    const keyRegex = new RegExp(/[\d=.]/gm);
    const valueRegex = new RegExp(/[a-zA-Z|=]/gm);
    const OfficialRates = new Map<any, any>();

    // Make a fetch request
    const response = await fetch('http://arkdedicated.com/dynamicconfig.ini', {
      method: 'GET',
    });
    if (this.CheckStatus(response)) {
      const data = await response.text();
      const propterties = data.split('\r\n');
      for (let i = 0; i < propterties.length; i++) {
        const key = propterties[i].replace(keyRegex, '');
        const value = propterties[i].replace(valueRegex, '');

        OfficialRates.set(key, value);
      }
    }

    // Return the results
    return OfficialRates;
  }

  /**
   * Formats the game status returned from the ini file.
   * @param status The unformatted ARK server status
   */
  private static FormatGameStatus(status: string): string {
    const regex: RegExp = /ark\sofficial.*?>(.*?)<\/>/gim;
    const match: RegExpExecArray | null = regex.exec(status);
    if (match) {
      return match[1];
    }
    return 'Unknown';
  }

  /**
   * Refreshes the server status every 30 seconds.
   * @param client The Discord client
   */
  public static RefreshGameStatus(client: DiscordClient): void {
    setInterval(async () => {
      await this.GetArkStatus(client);
    }, 30000);
  }

  /**
   * @example ClientFunctions.Sleep(1000); // Sleep for 1 second
   */
  public static async Sleep(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  /**
   * Returns a string formatted with Discord markdown.
   * @param text The text to format
   */
  public static HighLight(text: string): string {
    return `\`${text}\``;
  }

  /**
   * Prompts the user to reply to a question, usually used with
   * the {@link AwaitConfirmation} method.
   * @param interaction Interaction callback
   * @param question The question to ask the user
   * @param limit The maximum amount of time to wait for a response
   */
  public static async AwaitReply(
    interaction: CommandInteraction,
    question: string,
    limit: number = 60000,
  ): Promise<any> {
    // Filter the message collector to only allow the interaction author
    const filter = (m: Message): boolean => {
      if (m.author.id === interaction.user.id) return true;
      return false;
    };
    await interaction.channel?.send({ content: question });

    try {
      const collected = await interaction.channel?.awaitMessages({
        filter,
        max: 1,
        maxProcessed: 1,
        time: limit,
        errors: ['time'],
      });
      return collected?.first();
    } catch (e) {
      return false;
    }
  }

  /**
   * Sends the prompt message and awaits a confirmation from the user.
   * @param interaction Interaction callback
   * @param question The question to ask the user
   */
  public static async AwaitConfirmation(
    interaction: CommandInteraction,
    question: string,
  ): Promise<boolean> {
    const response: Message = await this.AwaitReply(
      interaction,
      `${interaction?.user} ${question}` + ' **(yes/no)**',
    );
    if (['y', 'yes'].includes(response.content)) {
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  }

  /**
   * Searches for mentions within a given interaction message.
   * @param message The interaction message
   */
  public static GetMentions(message: Message): IMessageMentions | string {
    let hasMention: boolean = false;
    const mentions: Array<any> = [];

    // Check if there are any user mentions in this message
    if (message.mentions.users.size <= 0) {
      hasMention = false;
    } else {
      hasMention = true;
      const userMention = message.mentions.users?.first();
      mentions.push(userMention?.id);
    }

    // Check if there are any role mentions in this message
    if (message.mentions.roles.size <= 0) {
      hasMention = false;
    } else {
      hasMention = true;
      const roleMention = message.mentions.roles?.first();
      mentions.push(roleMention?.id);
    }

    // Check if there are any channel mentions in this message
    if (message.mentions.channels.size === 0) {
      hasMention = false;
    } else {
      hasMention = true;
      const channelMention = message.mentions.channels?.first();
      mentions.push(channelMention?.id);
    }

    // Check if the message contained any mentions
    switch (hasMention) {
      case true:
        return mentions[0];
      case false:
        return message.content;
    }
  }

  /**
   * Queries the Battlemetrics API for a given server's stats.
   * @param interaction Interaction callback
   * @param server The server to fetch stats for
   */
  public static async FetchServerData(
    client: DiscordClient,
    interaction: CommandInteraction,
    server: string,
  ): Promise<any> {
    const match = server.match(/\d+/gm);
    const standardFilter: string = `${clientConfig.BM_API_STANDARD}${server}`;
    const freeBuildFilter: string = `${clientConfig.BM_API_GENESIS}${match}`;
    const GenServers: string[] = ['genone708', 'genone706', 'genone705'];
    const IsFreeBuildMap: boolean = GenServers.includes(server);
    try {
      // Check if the server is a standard server or freebuild(genesis) server
      switch (IsFreeBuildMap) {
        case true:
          const freeBuildResponse = await fetch(freeBuildFilter);
          const freeBuildData = await freeBuildResponse.json();
          interaction.reply({
            embeds: [
              EmbedEnum.SERVER_EMBED(client, freeBuildData.data[0].attributes),
            ],
            ephemeral: true,
          });
          break;
        default:
          const standardResponse = await fetch(standardFilter);
          const standardData = await standardResponse.json();
          interaction.reply({
            embeds: [
              EmbedEnum.SERVER_EMBED(client, standardData.data[0].attributes),
            ],
            ephemeral: true,
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Sets the multiplier for the tekgen command.
   * @param radius The generator radius
   */
  public static SetMultiplier(radius: number): number {
    const multiplier_setting: string[] = [];
    switch (radius) {
      case 1:
        multiplier_setting.push('1');
        break;
      case 2:
        multiplier_setting.push('1.33');
        break;
      case 5:
        multiplier_setting.push('2.32');
        break;
      case 10:
        multiplier_setting.push('3.97');
        break;
      default:
        throw new Error('Invalid radius');
    }

    // Return the multiplier
    return Number(multiplier_setting[0]);
  }

  /**
   * Formats a given mute time into a human readable format as
   * milliseconds.
   * @param time The time to format
   */
  public static FormatMuteTime(time: string): number {
    const duration: any = time.match(/(\d)/gm);
    const timeUnit: any = time.match(/(\D)/gim);

    // Determine the time unit
    switch (timeUnit[0]) {
      case 's':
        return duration[0] * 1000;
      case 'm':
        return duration[0] * (1000 * 60);
      case 'h':
        return duration[0] * (1000 * 3600);
      case 'd':
        return duration[0] * (1000 * 86400);
      case 'w':
        return duration[0] * (1000 * 604800);
      default:
        throw new Error(
          'Duration out of range. Accepted units are [s, m, h, d, w]',
        );
    }
  }

  /**
   * This method is used to format the time it takes the cloning chamber
   * to finish cloning a dino in ARK.
   * @param num The number to format
   * @returns The formatted num as a string
   */
  public static Calculate(num: number): string | string[] {
    const days: number = Math.floor(num / 86400);
    const hours: number = Math.floor(num / 3600) % 24;
    const minutes: number = Math.floor(num / 60) % 60;
    const seconds: number = Math.round(num % 60);
    return [
      `${bold(days.toString())}d ${bold(hours.toString())}h`,
      `${bold(minutes.toString())}m ${bold(seconds.toString())}s`,
    ].join(' ');
  }

  /**
   * Formats a Discord timestamp into a string.
   * @param createdDate Timestamp to format
   */
  public static CalculateAccountAge(createdDate: number): string {
    const years: number = Math.floor(createdDate / (1000 * 60 * 60 * 24 * 365));
    const months: number = Math.floor(
      (createdDate / (1000 * 60 * 60 * 24 * 30)) % 12,
    );
    const days: number = Math.floor((createdDate / (1000 * 60 * 60 * 24)) % 30);
    const hours: number = Math.floor((createdDate / (1000 * 60 * 60)) % 24);

    return `${years}Y ${months}M ${days}D ${hours}H`;
  }

  /**
   * Returns the custom emoji given the client has access to it, otherwise
   * it returns the unicode emoji.
   * @param client The Discord client
   * @param emoji The emoji to search for
   */
  public static FindEmoji(
    client: DiscordClient,
    emoji: string,
  ): EmojiResolvable {
    let emojiToReturn;

    try {
      console.log(defaultEmojis);
      const customEmoji = client.emojis.cache.find((e) => e.name === emoji);
      if (customEmoji) {
        emojiToReturn = customEmoji;
      }
      // let unicodeEmoji;
      /* if (!customEmoji) {
        // unicodeEmoji = defaultEmoji.find((e) => e === `${ctx}`);
        return client.emojis.cache.get(ctx);
      }*/
    } catch (e) {
      console.log(e);
    }

    return emojiToReturn as EmojiResolvable;
  }

  /**
   * Checks the http status code of a given url before proceeding.
   * @param res The Axios response
   */
  public static CheckStatus(res: Response): boolean {
    let status: boolean = false;

    // res.status >= 200 && res.status < 300
    if (res.ok) {
      status = true;
    } else {
      status = false;
      throw Error(res.statusText);
    }
    return status;
  }

  /**
   * Formats a given string using proper case.
   * @param text The text to format
   * @example "hello world" => "Hello World"
   */
  public static ToProperCase(text: string): string {
    return (text ? text.toLowerCase() : text).replace(
      /(^|[\s\xA0])[^\s\xA0]/g,
      (s) => {
        return s.toUpperCase();
      },
    );
  }

  /**
   * Returns a random token generated using crypto.
   * @param length The length of the token; `defaults to 24`
   */
  public static GenerateAuthToken(length: number = 24): void {
    const token = crypto.randomBytes(length).toString('hex');
    try {
      console.log(token);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Deploy all client slash commands to the API. (**affects all guilds**)
   */
  public static async DeployAllCommands(): Promise<void> {
    const commands: Collection<any, any> = new Collection();
    const commandsToRegister: Array<any> = [];
    const rest = new REST({ version: '9' }).setToken(clientConfig.DEV_BOT_TOKEN);
    const applicationID = clientConfig.DEV_APPLICATION_ID;
    const logger = new Logger();
    // Loop through the commands directory and load the commands
    const load = async (directory?: string): Promise<void> => {
      const commandDir = directory || path.join(__dirname, '..', 'commands');
      const commandFolder: string[] = readdirSync(commandDir);
      try {
        commandFolder.forEach(async (file: string) => {
          const commandName = file.replace(/^.*\\/gim, '').split('.')[0];
          const filePath = path.join(commandDir, file);
          const stats = await stat(filePath);

          // If it's a directory, recurse into it.
          if (stats.isDirectory()) {
            load(filePath);
          }

          // If it's a file, load it.
          if (stats.isFile() &&
            (file.endsWith('.ts') || file.endsWith('.js'))) {
              const SlashCommand = (await import(filePath)).default;
              const command = new SlashCommand();
              commands.set(commandName, command.info);
          }
        });
      } catch (e: any) {
        console.log(e);
      }
    };

    await load();
    await this.Sleep(1000);
    
    // Loop through the commands and push them to the slashCommand array
    for (const value of commands.values()) {
      commandsToRegister.push(value.data.toJSON());
    }

    // Register the commands to the API
    await rest.put(
      Routes.applicationCommands(applicationID),
      {
        body: commandsToRegister,
      },
    );

    await logger.Log('Successfully registered application commands');
  }

  /**
   * Deploys all client slash commands to the API. (**affects only the given guild**)
   * @param guildID The guild ID
   */
  public static async DeployGuildOnlyCommands(guildID: Snowflake): Promise<void> {
    const commands: Collection<any, any> = new Collection();
    const commandsToRegister: Array<any> = [];
    const rest = new REST({ version: '9' }).setToken(clientConfig.DEV_BOT_TOKEN);
    const applicationID = clientConfig.DEV_APPLICATION_ID;
    const logger = new Logger();
    // Loop through the commands directory and load the commands
    const load = async (directory?: string): Promise<void> => {
      const commandDir = directory || path.join(__dirname, '..', 'commands');
      const commandFolder: string[] = readdirSync(commandDir);
      try {
        commandFolder.forEach(async (file: string) => {
          const commandName = file.replace(/^.*\\/gim, '').split('.')[0];
          const filePath = path.join(commandDir, file);
          const stats = await stat(filePath);

          // If it's a directory, recurse into it.
          if (stats.isDirectory()) {
            load(filePath);
          }

          // If it's a file, load it.
          if (stats.isFile() &&
            (file.endsWith('.ts') || file.endsWith('.js'))) {
              const SlashCommand = (await import(filePath)).default;
              const command = new SlashCommand();
              commands.set(commandName, command.info);
          }
        });
      } catch (e: any) {
        console.log(e);
      }
    };

    await load();
    await this.Sleep(1000);
    
    // Loop through the commands and push them to the slashCommand array
    for (const value of commands.values()) {
      commandsToRegister.push(value.data.toJSON());
    }

    // Register the commands to the API
    await rest.put(
      Routes.applicationGuildCommands(applicationID, guildID),
      {
        body: commandsToRegister,
      },
    );

    await logger.Log(
      `Successfully registered application commands to guild ${guildID.toString()}`,
    );
  }

  /**
   * Delete all client slash commands from the API. (**affects all guilds**)
   */
  public static async DeleteAllCommands(): Promise<void> {
    const rest = new REST({ version: '9' }).setToken(clientConfig.DEV_BOT_TOKEN);
    const applicationID = clientConfig.DEV_APPLICATION_ID;
    const logger = new Logger();
    await this.Sleep(1000);

    // Delete the commands from the API
    await rest.put(Routes.applicationCommands(applicationID), {
      body: [],
    });

    await logger.Log('Successfully deleted all slash commands');
  }

  /**
   * Delete all client slash commands from the API. (**affects only the given guild**)
   * @param guildID The guild ID
   */
  public static async DeleteGuildOnlyCommands(guildID: Snowflake): Promise<void> {
    const rest = new REST({ version: '9' }).setToken(clientConfig.DEV_BOT_TOKEN);
    const applicationID = clientConfig.DEV_APPLICATION_ID;
    const logger = new Logger();
    await this.Sleep(1000);

    await rest.put(
      Routes.applicationGuildCommands(applicationID, guildID),
      {
        body: [],
      },
    );

    await logger.Log(
      'Successfully deleted all slash commands from this guild',
    );
  }
}
