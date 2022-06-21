// External imports
import { CommandInteraction } from 'discord.js';

// Internal imports
import { DiscordClient, Logger } from './index';
import { ICommandInfo } from '../utils/interfaces';

export default abstract class SlashCommand {
  readonly client: DiscordClient;
  readonly logger: Logger;
  readonly info: ICommandInfo;

  constructor(client?: DiscordClient, info?: ICommandInfo) {
    this.client = client as DiscordClient;
    this.logger = new Logger();
    this.info = info as ICommandInfo;
  }

  /**
   * Handles catching errors when a user runs a command.
   * @param interaction
   * @param error
   */
  public async onError(
    interaction: CommandInteraction,
    error: any,
  ): Promise<void> {
    return await interaction.reply({
      content: `An error occurred while executing this command: \`${error.message}\``,
      ephemeral: true,
    });
  }

  /**
   * Runs the command.
   * @param interaction Interaction object
   * @param args Arguments
   */
  abstract execute(interaction: CommandInteraction, args?: string[]): Promise<any>;
}
