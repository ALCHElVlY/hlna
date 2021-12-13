// Import the utility classes to interact with the Discord API
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Import Discord for JSDoc reference
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

// Import the logger class
const logger = require('./Logger');

class SlashCommands {
	constructor(client) {
		this.client = client;
		this.commands = client.commands;
		this.commandsToRegister = [];
		this.application = process.env.APPLICATION_ID;
		this.rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
	}


	/**
	 * Http `POST` method to deploy slash commands
	 * for this client to the API.
	 * @returns
	 */
	async deployAll() {
		await this.client.wait(3000);

		// Loop through the commands and push them to the slashCommand array
		for (const value of this.commands.values()) {
			this.commandsToRegister.push(value.data.toJSON());
		}

		// Register the commands to the API
		await this.rest.put(Routes.applicationCommands(this.application), {
			body: this.commandsToRegister,
		});

		return await logger.log('Successfully registered application commands');
	}


	/**
	 * Http `PUT` method to deploy slash commands
	 * for this guild to the API.
	 * @param {Discord.Guild} guildID The guild ID
	 * @returns
	 */
	async deployGuildOnly(guildID) {
		await this.client.wait(3000);

		// Loop through the commands and push them to the slashCommand array
		for (const value of this.commands.values()) {
			this.commandsToRegister.push(value.data.toJSON());
		}

		// Register the commands to the API
		await this.rest.put(Routes.applicationGuildCommands(
			this.application,
			guildID,
		),
		{
			body: this.commandsToRegister,
		});

		return await logger.log(`Successfully registered application commands to guild ${guildID.toString()}`);
	}


	/**
	 * Http `PUT` method to delete all client slash commands
	 * from the API.
	 * @returns
	 */
	async deleteAll() {
		await this.client.wait(3000);
		await this.rest.put(Routes.applicationCommands(this.application), {
			body: [],
		});

		return await logger.log('Successfully deleted all slash commands');
	}


	/**
	 * Http `PUT` method to delete all of the client slash
	 * commands for this guild from the API.
	 * @param {Discord.Guild} guildID The guild ID
	 * @returns
	 */
	async deleteGuildOnly(guildID) {
		await this.client.wait(3000);
		await this.rest.put(Routes.applicationGuildCommands(
			this.application,
			guildID,
		),
		{
			body: [],
		});

		return await logger.log('Successfully deleted all slash commands from this guild');
	}


	/**
	 * Http `GET` method to return all of the slash
	 * commands for this client from the API.
	 * @returns
	 */
	async getAll() {
		return await this.rest.get(Routes.applicationCommands(
			this.application,
		));
	}


	/**
	 * Http `GET` method to return all of the client slash
	 * commands for this guild from the API.
	 * @param {Discord.Guild} guildID The guild ID
	 * @returns
	 */
	getGuildOnly(guildID) {
		return this.rest.get(Routes.applicationGuildCommands(
			this.application,
			guildID,
		));
	}

}
module.exports = SlashCommands;