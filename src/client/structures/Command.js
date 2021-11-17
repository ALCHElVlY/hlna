/* eslint-disable no-empty-function */
/* eslint-disable no-mixed-spaces-and-tabs */
const permissions = require('./permissions');

// General structure of a command, using builder pattern.
module.exports = class Command {
	constructor() {
		this.name = '';
		this.enabled = false;
		this.guildOnly = false;
		this.aliases = [];
		this.permLevel = '';
		this.category = '';
		this.description = '';
		this.usage = '';
		this.args = {};
	}


	/**
     * Allow external definition of sub-actions of this command.
     * Function f is being called with a context, see `run` method.
     * @param {*} key
     * @param {*} desc
     * @param {*} f
     * @param {*} perm
     */
	on(key, desc = '', f, perm = undefined) {
		this.args[key] = { desc: desc, perm: perm, f: f };
	}


	/**
     * Initialising function which is called on each run of the command
     * @param {*} context
     */
	// eslint-disable-next-line no-unused-vars
	init(context) {}

	/**
     * Fallback case for action resolving
     * @param {*} context
     */
	default(context) {
		let [settings] = [];
		settings = context.self.settings.get(context.message.guild.id);
		context.message.reply({ content: `Unknown usage. Type \`${settings['prefix']} help ${this.name}\` for details.` });
	}

	// Builder
	setName(n) { this.name = n; return this;}
	setEnabled(n) { this.enabled = n; return this;}
	setGuildOnly(n) { this.guildOnly = n; return this;}
	setAliases(n) { this.aliases = n; return this;}
	setPermLevel(n) { this.permLevel = n; return this;}
	setDescription(n) { this.description = n; return this;}
	setCategory(n) { this.category = n; return this;}
	setUsage(n) { this.usage = n; return this;}

	/**
     * Gets called from the messageCreate.js module, when the message resolved to a call to this command
     * @param {*} context
     * @returns
     */
	run(context) {
		this.init(context);
		const action = context.args[0];
		if (action === undefined || !(action in this.args)) {
			this.default(context);
		}
		else {
			const arg = this.args[action];
			if (arg.perm) {
				const requiredLevel = permissions.fromName(arg.perm);
				if (context.level < requiredLevel) {
					return context.message.channel.send({ content: [
						'You do not have permission to use this command.\n' +
            			`Your permission level is ${context.level} (${permissions.list[context.level].name})\n` +
            			`This command requires level ${requiredLevel} (${arg.perm})`],
					});
				}
			}
			context.action = action;
			context.args.shift();
			arg.f(context);
		}
	}
};