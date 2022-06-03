/**
 * The loadCommand function takes in a JavaScript
 * file and loads it as a client command.
 * @param {String} file The file to load
 * @returns
 */
function loadCommand(file) {
  const client = require('../index');
  const commandName = file.replace(/\w+\\/gm, '').split('.')[0];
  try {
    console.log(`Loading Command: ${commandName}`);
    const props = require(`../../../${file}`);
    client.commands.set(commandName, props);
    // props.aliases.forEach(alias => client.aliases.set(alias, commandName));
    return false;
  } catch (e) {
    console.error(`Unable to load command ${commandName}: ${e}`);
  }
}
module.exports = loadCommand;
