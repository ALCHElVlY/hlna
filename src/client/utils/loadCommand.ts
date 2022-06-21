// Internal imports
import DiscordClient from '../structures/DiscordClient';
import { CommandHandlerError } from '../../errors';

/**
 * Loads a command from a file.
 * @param {String} file The file to load
 */
const loadCommand = async (client: DiscordClient, file: string): Promise<void> => {
  const commandName = file.replace(/^.*\\/gim, '').split('.')[0];
  
  try {
    console.log(`Loading Command: ${commandName}`);
    const commandFile = (await import(file)).default;
    const command = new commandFile(client);
    client.commands.set(commandName, command);
  } catch (e: any) {
    throw new CommandHandlerError(`Unable to load command ${commandName}: ${e}`);
  }
}
export default loadCommand;