const client = require('../../client/index');
const format = require('../../client/utility/format.js');
// const moment = format.moment;

// Import the format options
const {
	highlighted,
	channelMention,
} = format.formatOptions;

const MEMBER_JOIN_EMBED = (member) => {
	const createdDate = Date.now() - member.user.createdTimestamp;
	const embed = format.embed()
		.setColor('#63CBEB')
		.setAuthor({
			name: member.user.tag,
			iconURL: member.user.displayAvatarURL({
				dynamic: true,
				size: 512,
			}),
		})
		.setDescription(`
   		**Scanning Specimen**: ${member}
		**Survivor ID**: ${member.user.id}
		**Implant Created**: ${calculateAccAge(createdDate)}
		
		\`\`Ready when you are survivor.\`\`
   		`)
		.setThumbnail(process.env.WELCOME_IMAGE);

	// Return the embed
	return embed;
};

const MEMBER_LEAVE_EMBED = (member) => {
	const embed = format.embed()
		.setColor('#2F3136')
		.setAuthor({
			name: member.user.tag,
			iconURL: member.user.displayAvatarURL({
				dynamic: true,
				size: 512,
			}),
		})
		.setDescription(`
			**Scanned Specimen**: ${member}
			**Survivor ID**: ${member.user.id}
			**Implant Created**: [Out of range]

			\`\`Cheers mate, catch you later.\`\`
			`)
		.setThumbnail('https://imgur.com/6axfSUV.gif');

	// Return the embed
	return embed;
};

const MEMBER_ROLE_ADD = (member, role) => {
	const embed = format.embed()
		.setColor('#63CBEB')
		.setTitle('Role Added')
		.setDescription(`${member} gained the role ${role}`)
		.setTimestamp();

	// Return the embed
	return embed;
};

const MEMBER_ROLE_REMOVE = (member, role) => {
	const embed = format.embed()
		.setColor('#63CBEB')
		.setTitle('Role Removed')
		.setDescription(`${member} lost the role ${role}`)
		.setTimestamp();

	// Return the embed
	return embed;
};

const MESSAGE_BULK_DELETE_EMBED = (content) => {
	const embed = format.embed()
		.setColor('#63CBEB')
		.setTitle('Message Bulk Delete')
		.setDescription([
			`**Amount**: ${content[2]}`,
			`**Deleted by**: ${content[0].tag}`,
			`**Deleted from**: ${channelMention(content[1])}`,
		].join('\n'))
		.setTimestamp();

	// Return the embed
	return embed;
};

const ERROR_EMBED = (error) => {
	const errorEmoji = client.findEmoji('redX');
	const embed = format.embed()
		.setColor('#ff8b8b')
		.setTitle(errorEmoji + ' Error')
		.setDescription(error)
		.setTimestamp();

	// return the embed
	return embed;
};

const SUCCESS_EMBED = (message) => {
	const successEmoji = client.findEmoji('greenCheck');
	const embed = format.embed()
		.setColor('#8aff8b')
		.setTitle(successEmoji + ' Success')
		.setDescription(message)
		.setTimestamp();

	// Return the embed
	return embed;
};

const HELP_EMBED = (helpData) => {
	// Loop through the help data and extract the command
	// categories. Only the first occurance of the category will be used
	const categories = [];
	for (const data of helpData) {
		if (!categories.includes(data.Category)) {
			categories.push(data.Category);
		}
	}

	// Build the embed
	const embed = format.embed()
		.setTitle('Command List')
		.setDescription([
			'For example usage, visit the documentation!',
		].join('\n'));

	// Extract the commands for each category
	const commands = {};
	for (const category of categories.sort()) {
		commands[category] = [];
		for (const data of helpData) {
			if (data.Category === category) {
				commands[category].push(data.Command);
			}
		}
	}

	// Add the commands and categories to the embed
	Object.entries(commands).forEach(([c, cmds]) => {
		embed.addFields({
			name: c,
			value: cmds.join('\n').replace(/(^\w+)/gm, (s) => {
				return highlighted(s);
			}),
			inline: false,
		});
	});


	// Return the embed
	return embed;
};

const KICK_DM_EMBED = (guild, reason) => {
	const embed = format.embed()
		.setColor('#FF8080')
		.setTitle('Hello, you have been kicked from')
		.setDescription([
			`Guild: **${guild.name}**`,
			`Reason: \`${reason}\``,
		].join('\n'))
		.setTimestamp()
		.setFooter('goodbye!');

	// Return the embed
	return embed;
};

const BAN_DM_EMBED = (guild, reason) => {
	const embed = format.embed()
		.setColor('#FF8080')
		.setTitle('Hello, you have been banned from')
		.setDescription([
			`Guild: **${guild.name}**`,
			`Reason: \`${reason}\``,
		].join('\n'))
		.setTimestamp()
		.setFooter('goodbye!');

	// Return the embed
	return embed;
};

const CRAFT_EMBED = (itemData, amount) => {
	// Get the experience from the itemData
	const experience = (itemData.experienced_gained === null)
		? 0
		: itemData.experienced_gained;
	// Get the level from the itemData
	const level = (itemData.req_level)
		? itemData.req_level
		: 'None';
	// Get the ingredients from the itemData
	const ingredients = (itemData.ingredient_list)
		? itemData.ingredient_list
		: 'None';
	// Get the total ingredients from the itemData
	const total_ingredients = ingredients.replace(/(\d+)/gm, (m) => {
		const parsedIngredientQty = new Number(parseInt(m)) + '';
		return (parsedIngredientQty * amount).toLocaleString();
	});
	// Get the total experience from the itemData
	const total_exp = (experience && experience > 0)
		? (experience * amount).toLocaleString()
		: 'None';

	// Build the embed
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor({
			name: `${client.user.username} | Craft Calculator`,
			iconURL: client.user.displayAvatarURL({
				dynamic: true,
				size: 512,
			}),
		})
		.setDescription([
			`**Crafting**: ${highlighted(itemData.name)}\n` +
			`**Amount**: ${highlighted(amount)}`,
		].join('\n'))
		.setThumbnail(itemData.image_url)

		.addFields({
			name: 'Crafting Ingredients',
			value: `${total_ingredients}`
				.replace(/(x\d+,\d+|x\d+)/gm, function(d) {
					return highlighted(d);
				})
				.replace(/(,\B)/gm, '\n'),
			inline: true,
		}, {
			name: 'Additional Info',
			value: `Required level: ${level}\nExperience points gained: ${total_exp}`,
			inline: false,
		});

	// Return the embed
	return embed;
};

const CLONE_EMBED = (creatureName, level, clone_cost, clone_time, mature_rate) => {
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor({
			name: `${client.user.username} | Clone Calculator`,
			iconURL: client.user.displayAvatarURL({
				dynamic: true,
				size: 512,
			}),
		})
		.setDescription(
			'**Creature**: ' + `${highlighted(creatureName.toProperCase())}` + '\n' +
                    '**Level**: ' + `${highlighted(level)}`,
		)
		.setThumbnail(process.env.CLONING_CHAMBER)
		.setFooter(`Baby Mature Speed Multiplier: ${mature_rate}`)

		.addFields({
			name: 'Total Shard Cost',
			value: `${client.findEmoji('element_shard')} ${clone_cost.toLocaleString()}`,
			inline: false,
		}, {
			name: 'Total Time',
			value: `${client.findEmoji('stopwatch1')} ${client.calculate(clone_time)}`,
			inline: false,
		});

	// Return the embed
	return embed;
};

const GENERATOR_EMBED = (fuel_amount, consumption_rate) => {
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor({
			name: `${client.user.username} | Generator Calculator`,
			iconURL: client.user.displayAvatarURL({
				dynamic: true,
				size: 512,
			}),
		})
		.setThumbnail(process.env.GASOLINE)
		.setDescription([
			`**Fuel Qty**: ${highlighted(fuel_amount)}`,
			'Depleted in: ' + client.calculate(consumption_rate),
		].join('\n'));

	// Return the embed
	return embed;
};

const TEKGEN_EMBED = (element, radius, consumption_rate) => {
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor({
			name: `${client.user.username} | Tek Generator Calculator`,
			iconURL: client.user.displayAvatarURL({
				dynamic: true,
				size: 512,
			}),
		})
		.setThumbnail(process.env.ELEMENT)
		.setDescription([
			`**Fuel Amount**: ${highlighted(element)}`,
			`**Radius**: ${highlighted(radius)}`,
			'Depleted in: ' + client.calculate(consumption_rate),
		].join('\n'));

	// Return the embed
	return embed;
};

const MILK_EMBED = (food_level, consumption_rate) => {
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor({
			name: `${client.user.username} | Wyvern Milk Calculator`,
			iconURL: client.user.displayAvatarURL({
				dynamic: true,
				size: 512,
			}),
		})
		.setThumbnail(process.env.WYVERN_MILK)
		.setDescription([
			`**Food Level**: ${highlighted(food_level)}`,
			'Feed again in: ' + client.calculate(consumption_rate),
		].join('\n'));

	// Return the embed
	return embed;
};

const SERVER_EMBED = (data) => {
	const status = data.status.includes('offline') ? `${client.findEmoji('redCheckBox')} ${data.status}` :
		data.status.includes('online') ? `${client.findEmoji('greenCheckBox')} ${data.status}` : '';
	const country = data.country;
	const embed = format.embed()
		.setColor('#ffffb3')
		.setDescription(`
				**› Name:** ${data.name}
				**› ID:** ${data.id}
				**› Status:** ${status}
				**› Player Count:** ${data.players} / ${data.maxPlayers}
				**› In-game Days:** ${data.details.time}
				`)
		.setFooter('Powered by the battlemetrics API', process.env.BATTLEMETRICS)

		.addFields({
			name: 'Additional Details',
			value: `
					Map: ${data.details.map}
					Official: ${data.details.official}
					PVE: ${data.details.pve}
					Crossplay: ${data.details.crossplay}`,
			inline: true,
		},
		{
			name: '\u200B',
			value: `
					Country: :flag_${country.toLowerCase()}:
					Game Port: \`${data.ip}:${data.port}\`
					Query Port: \`${data.ip}:${data.portQuery}\`
					Location: ${data.location}
					`,
			inline: true,
		});

	// Return the embed
	return embed;
};

const STATS_EMBED = (duration, version) => {
	const embed = format.embed()
		.setTitle('Statistics')
		.addField('Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
		.addField('Uptime', duration, true)
		.addField('\u200b', '\u200b', true)
		.addField('Users', client.users.cache.size.toLocaleString(), true)
		.addField('Servers', client.guilds.cache.size.toLocaleString(), true)
		.addField('Channels', client.channels.cache.size.toLocaleString(), true)
		.addField('Running on', `Discord.js v${version}\nNode ${process.version}`)
		.addField('Documentation', '[Click to visit](https://github.com/ALCHElVlY/hlna/blob/main/README.md)', true)
		.addField('Support Discord', '[Click to visit](#)', true)
		.setFooter('Developed by: Alchemy#1990');

	// Return the embed
	return embed;
};

const ADD_ROLE_EMBED = (member, role) => {
	const embed = format.embed()
		.setColor('#B3FFB3')
		.setDescription([
			`${client.findEmoji('greenCheckBox')}`,
			`${role} has been added to ${member}.`,
		].join(' '))
		.setFooter([
			'“You should be proud, the whole point of this',
			'simulation is to identify the very best survivors.”',
		].join(' '));

	// Return the embed
	return embed;
};

const REMOVE_ROLE_EMBED = (member, role) => {
	const embed = format.embed()
		.setColor('#B3FFB3')
		.setDescription([
			`${client.findEmoji('greenCheckBox')}`,
			`${role} has been removed from ${member}.`,
		].join(' '))
		.setFooter('“He’ll get over it. We all do.”');

	// Return the embed
	return embed;
};

const ADD_MUTE_EMBED = (member, time) => {
	switch (time) {
	case null:
		time = '';
		break;
	default:
		time = `Duration: ${highlighted(time)}`;
		break;
	}

	const embed = format.embed()
		.setColor('#B3FFB3')
		.setDescription([
			`${client.findEmoji('greenCheckBox')}`,
			`${member} has been muted. ` + time,
		].join(' '))
		.setFooter('“It fascinates me how you survivors find your own solutions to problems.”');

	// Return the embed
	return embed;
};

const REMOVE_MUTE_EMBED = (member) => {
	const embed = format.embed()
		.setColor('#B3FFB3')
		.setDescription([
			`${client.findEmoji('greenCheckBox')}`,
			`${member} has been unmuted.`,
		].join(' '))
		.setFooter('“Did you feel a bit disjointed when you woke up in the simulation? That’s normal.”');

	// Return the embed
	return embed;
};

// ----------------------------------- Functions -----------------------------------
// The calculateAccAge function converts the account age(in milliseconds)
// to a human readable format
function calculateAccAge(num) {
	const years = Math.floor(num / (1000 * 60 * 60 * 24 * 365));
	const months = Math.floor(num / (1000 * 60 * 60 * 24 * 30) % 12);
	const days = Math.floor(num / (1000 * 60 * 60 * 24) % 30);
	const hours = Math.floor(num / (1000 * 60 * 60) % 24);

	return `${years}Y ${months}M ${days}D ${hours}H`;
}

module.exports = {
	ERROR_EMBED,
	SUCCESS_EMBED,
	HELP_EMBED,
	KICK_DM_EMBED,
	BAN_DM_EMBED,
	// ARK Related Embeds
	CRAFT_EMBED,
	CLONE_EMBED,
	GENERATOR_EMBED,
	TEKGEN_EMBED,
	MILK_EMBED,
	SERVER_EMBED,
	// General Embeds
	STATS_EMBED,
	// ActionLogger Embeds
	MEMBER_JOIN_EMBED,
	MEMBER_LEAVE_EMBED,
	MEMBER_ROLE_ADD,
	MEMBER_ROLE_REMOVE,
	MESSAGE_BULK_DELETE_EMBED,
	ADD_ROLE_EMBED,
	REMOVE_ROLE_EMBED,
	ADD_MUTE_EMBED,
	REMOVE_MUTE_EMBED,
};