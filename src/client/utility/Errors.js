// const logger = require('../structures/Logger');

// ** Reference only **
// QuestHandler Errors
/* module.exports.QuestHandlerError = {
	// Dynamic
	MISSING_SERVER_MISSION: (param) => `${param} is required to start a mission`,
	TYPE_ERROR_STRING: (param) => `${param} must be a string`,
	// Static
	MISSING_MISSION: 'Must pass a guild mission to get',
	MISSING_MESSAGE: 'Must pass a message to unpin',
	DOES_NOT_EXIST: 'Mission does not exist',
	MISSING_GUILD_CACHERELOAD: 'You must pass a guild in order to refresh its cache',
	MISSING_GUILD_RESOLVEROLE: 'Must pass a guild to resolve a role',
	MISSING_GUILD_RESOLVECHANNEL: 'Must pass a guild to resolve a channel',
};*/


module.exports.CommandHandlerError = {
	_FAILEDTOLOAD: (param1 = []) => console.log(
		`❌ There was an error loading ${param1.length} files from the commands directory`,
		'error',
	),
};