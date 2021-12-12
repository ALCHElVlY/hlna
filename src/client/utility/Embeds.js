require('dotenv').config();
const client = require('../../client/index');
const format = require('../../client/utility/format.js');

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

const CLONE_EMBED = (creatureName, level, clone_cost, clone_time, mature_rate) => {
	const { highlighted } = format.formatOptions;
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor(`${client.user.username} | Clone Calculator`, client.user.displayAvatarURL())
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
	const { highlighted } = format.formatOptions;
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor(`${client.user.username} | Generator Calculator`, client.user.displayAvatarURL())
		.setThumbnail(process.env.GASOLINE)
		.setDescription([
			`**Fuel Qty**: ${highlighted(fuel_amount)}`,
			'Depleted in: ' + client.calculate(consumption_rate),
		].join('\n'));

	// Return the embed
	return embed;
};

const TEKGEN_EMBED = (element, radius, consumption_rate) => {
	const { highlighted } = format.formatOptions;
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor(`${client.user.username} | Tek Generator Calculator`, client.user.displayAvatarURL())
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
	const { highlighted } = format.formatOptions;
	const embed = format.embed()
		.setColor('#ffffb3')
		.setAuthor(`${client.user.username} | Wyvern Milk Calculator`, client.user.displayAvatarURL())
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

module.exports = {
	ERROR_EMBED,
	SUCCESS_EMBED,
	// ARK Related Embeds
	CLONE_EMBED,
	GENERATOR_EMBED,
	TEKGEN_EMBED,
	MILK_EMBED,
	SERVER_EMBED,
};