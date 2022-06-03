// External imports
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const stat = promisify(require('fs').stat);
const path = require('path');

// Internal imports
const loadCommand = require('../utility/loadCommand');
const Error = require('../utility/Errors');
const CommandHandlerError = Error.CommandHandlerError;

/**
 * Function to load commands into memory, as a collection, so they're accessible here
 * and everywhere else.
 * @param {*} dir
 * @param {*} callback
 */
async function loadCommands(dir, callback) {
  readdir(dir, function (err, files) {
    if (err) console.log(CommandHandlerError._FAILEDTOLOAD(files, dir));

    // Loop through the files/folders
    files.forEach(async function (file) {
      const filepath = path.join(dir, file);

      // If the file path contains folders, loop through those as well
      await stat(filepath, async function (err, stats) {
        if (stats.isDirectory()) {
          await loadCommands(filepath, callback);
        }
        // load the command files
        else if (stats.isFile() && file.endsWith('.js')) {
          const response = loadCommand(filepath);
          if (response) console.log(response);
        }
      });
    });
  });
}
module.exports = loadCommands;
