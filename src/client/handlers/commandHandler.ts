// External imports
import { readdir, stat } from 'node:fs/promises';
import * as path from 'path';
import { DiscordClient } from '../structures';

// Internal imports
import loadCommand from '../utils/loadCommand';

/**
 * Function to load commands into memory, as a collection, so they're accessible here
 * and everywhere else.
 * @param {*} dir
 * @param {*} client
 */
async function loadCommands(client: DiscordClient, dir: string): Promise<void> {
  try {
    const files = await readdir(dir);

    // For each file in the directory, check if it's a directory or a file.
    files.forEach(async (file: string) => {
      const filePath = path.join(dir, file);
      const stats = await stat(filePath);

      // If it's a directory, recurse into it.
      if (stats.isDirectory()) {
        loadCommands(client, filePath);
      }

      // If it's a file, load it.
      if (stats.isFile() && file.endsWith('.ts')) {
        loadCommand(client, filePath);
      }
    });
  } catch (e) {
    console.log(e);
  }
}
export default loadCommands;
