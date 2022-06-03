const eventHandler = require('./eventHandler');
const commandHandler = require('./commandHandler');
const loadMaps = require('./loadMaps');

module.exports = {
  loadEvents: eventHandler,
  loadCommands: commandHandler,
  loadMaps: loadMaps,
};
