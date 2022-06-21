"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const builders_1 = require("@discordjs/builders");
const functions_1 = tslib_1.__importDefault(require("../client/utils/functions"));
const env_config_1 = require("../interfaces/env_config");
const format_1 = require("../client/utils/format");
const EmbedEnum = {
    MEMBER_JOIN_EMBED: (member) => {
        const createdDate = Date.now() - member.user.createdTimestamp;
        const response = (0, format_1.embed)()
            .setColor('#63CBEB')
            .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({
                dynamic: true,
                size: 512,
            }),
        })
            .setDescription(`
        **Scanning Specimen**: ${(0, builders_1.userMention)(member.user.id)}
        **Survivor ID**: ${member.user.id}
        **Implant Created**: ${functions_1.default.CalculateAccountAge(createdDate)}
              
        \`\`Ready when you are survivor.\`\``)
            .setThumbnail(env_config_1.clientConfig.WELCOME_IMAGE);
        return response;
    },
    MEMBER_LEAVE_EMBED: (member) => {
        const response = (0, format_1.embed)()
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
  
        \`\`Cheers mate, catch you later.\`\``)
            .setThumbnail('https://imgur.com/6axfSUV.gif');
        return response;
    },
    MEMBER_BAN_ENBED: (member, reason) => {
        console.log({
            Member: member,
            Ban_Reason: reason,
        });
        const response = (0, format_1.embed)()
            .setTitle('Member Banned')
            .setDescription([`**Member**: ${member}`, `**Reason**: \`${reason}\``].join('\n'))
            .setTimestamp();
        return response;
    },
    MEMBER_ROLE_ADD: (member, role) => {
        const response = (0, format_1.embed)()
            .setColor('#63CBEB')
            .setAuthor({
            name: 'Role Added',
            iconURL: env_config_1.clientConfig.ROLE_ADDED,
        })
            .setDescription(`${member} gained the role ${role}`)
            .setTimestamp();
        return response;
    },
    MEMBER_ROLE_REMOVE: (member, role) => {
        const response = (0, format_1.embed)()
            .setColor('#63CBEB')
            .setAuthor({
            name: 'Role Removed',
            iconURL: env_config_1.clientConfig.ROLE_REMOVED,
        })
            .setDescription(`${member} lost the role ${role}`)
            .setTimestamp();
        return response;
    },
    MESSAGE_BULK_DELETE_EMBED: (data) => {
        const response = (0, format_1.embed)()
            .setColor('#63CBEB')
            .setTitle('Message Bulk Delete')
            .setDescription([
            `**Amount**: ${data[2]}`,
            `**Deleted by**: ${data[0].tag}`,
            `**Deleted from**: ${(0, builders_1.channelMention)(data[1])}`,
        ].join('\n'))
            .setTimestamp();
        return response;
    },
    ERROR_EMBED: (client, error) => {
        const errorEmoji = functions_1.default.FindEmoji(client, 'redX');
        const response = (0, format_1.embed)()
            .setColor('#ff8b8b')
            .setTitle(errorEmoji + ' Error')
            .setDescription(error)
            .setTimestamp();
        return response;
    },
    SUCCESS_EMBED: (client, message) => {
        const successEmoji = functions_1.default.FindEmoji(client, 'greenCheck');
        const response = (0, format_1.embed)()
            .setColor('#8aff8b')
            .setTitle(successEmoji + ' Success')
            .setDescription(message)
            .setTimestamp();
        return response;
    },
    KICK_DM_EMBED: (guild, reason) => {
        const response = (0, format_1.embed)()
            .setColor('#FF8080')
            .setTitle('Hello, you have been kicked from')
            .setDescription([`Guild: **${guild.name}**`, `Reason: \`${reason}\``].join('\n'))
            .setTimestamp()
            .setFooter({ text: 'goodbye!' });
        return response;
    },
    BAN_DM_EMBED: (guild, reason) => {
        const response = (0, format_1.embed)()
            .setColor('#FF8080')
            .setTitle('Hello, you have been banned from')
            .setDescription([`Guild: **${guild.name}**`, `Reason: \`${reason}\``].join('\n'))
            .setTimestamp()
            .setFooter({ text: 'goodbye!' });
        return response;
    },
    BAN_LIST_EMBED: (guild, bans) => {
        const response = (0, format_1.embed)()
            .setTitle(`${guild.name} ban list`)
            .setDescription(bans
            .map((ban) => {
            const reason = ban.reason ?? 'No reason provided';
            return `${(0, builders_1.userMention)(ban.user.id)} - ${functions_1.default.HighLight(reason)}`;
        })
            .join('\n'));
        return response;
    },
    CRAFT_EMBED: (client, itemData, amount) => {
        const experience = itemData.experienced_gained === null ? 0 : itemData.experienced_gained;
        const level = itemData.req_level ? itemData.req_level : 'None';
        const ingredients = itemData.ingredient_list
            ? itemData.ingredient_list
            : 'None';
        const total_ingredients = ingredients.replace(/(\d+)/gm, (m) => {
            const parsedIngredientQty = parseInt(m);
            return (parsedIngredientQty * amount).toLocaleString();
        });
        const total_exp = experience && experience > 0
            ? (experience * amount).toLocaleString()
            : 'None';
        const response = (0, format_1.embed)()
            .setColor('#ffffb3')
            .setAuthor({
            name: `${client.user?.username} | Craft Calculator`,
            iconURL: client.user?.displayAvatarURL({
                dynamic: true,
                size: 512,
            }),
        })
            .setDescription([
            `**Crafting**: ${functions_1.default.HighLight(itemData.name)}\n` +
                `**Amount**: ${functions_1.default.HighLight(amount.toString())}`,
        ].join('\n'))
            .setThumbnail(itemData.image_url)
            .addFields({
            name: 'Crafting Ingredients',
            value: `${total_ingredients}`
                .replace(/(x\d+,\d+|x\d+)/gm, (d) => {
                return functions_1.default.HighLight(d);
            })
                .replace(/(,\B)/gm, '\n'),
            inline: true,
        }, {
            name: 'Additional Info',
            value: `Required level: ${level}\nExperience points gained: ${total_exp}`,
            inline: false,
        });
        return response;
    },
    CLONE_EMBED: (client, creatureName, level, clone_cost, clone_time, mature_rate) => {
        const response = (0, format_1.embed)()
            .setColor('#ffffb3')
            .setAuthor({
            name: `${client.user?.username} | Clone Calculator`,
            iconURL: client.user?.displayAvatarURL({
                dynamic: true,
                size: 512,
            }),
        })
            .setDescription('**Creature**: ' +
            `${functions_1.default.HighLight(functions_1.default.ToProperCase(creatureName))}` +
            '\n' +
            '**Level**: ' +
            `${functions_1.default.HighLight(level.toString())}`)
            .setThumbnail(env_config_1.clientConfig.CLONING_CHAMBER)
            .setFooter({ text: `Baby Mature Speed Multiplier: ${mature_rate}` })
            .addFields({
            name: 'Total Shard Cost',
            value: `${functions_1.default.FindEmoji(client, 'element_shard')} ${clone_cost.toLocaleString()}`,
            inline: false,
        }, {
            name: 'Total Time',
            value: `${functions_1.default.FindEmoji(client, 'stopwatch1')} ${functions_1.default.Calculate(clone_time)}`,
            inline: false,
        });
        return response;
    },
    GENERATOR_EMBED: (client, fuel_amount, consumption_rate) => {
        const response = (0, format_1.embed)()
            .setColor('#ffffb3')
            .setAuthor({
            name: `${client.user?.username} | Generator Calculator`,
            iconURL: client.user?.displayAvatarURL({
                dynamic: true,
                size: 512,
            }),
        })
            .setThumbnail(env_config_1.clientConfig.GASOLINE)
            .setDescription([
            `**Fuel Qty**: ${functions_1.default.HighLight(fuel_amount.toString())}`,
            'Depleted in: ' + functions_1.default.Calculate(consumption_rate),
        ].join('\n'));
        return response;
    },
    TEKGEN_EMBED: (client, element, radius, consumption_rate) => {
        const response = (0, format_1.embed)()
            .setColor('#ffffb3')
            .setAuthor({
            name: `${client.user?.username} | Tek Generator Calculator`,
            iconURL: client.user?.displayAvatarURL({
                dynamic: true,
                size: 512,
            }),
        })
            .setThumbnail(env_config_1.clientConfig.ELEMENT)
            .setDescription([
            `**Fuel Amount**: ${functions_1.default.HighLight(element.toString())}`,
            `**Radius**: ${functions_1.default.HighLight(radius.toString())}`,
            'Depleted in: ' + functions_1.default.Calculate(consumption_rate),
        ].join('\n'));
        return response;
    },
    MILK_EMBED: (client, food_level, consumption_rate) => {
        const response = (0, format_1.embed)()
            .setColor('#ffffb3')
            .setAuthor({
            name: `${client.user?.username} | Wyvern Milk Calculator`,
            iconURL: client.user?.displayAvatarURL({
                dynamic: true,
                size: 512,
            }),
        })
            .setThumbnail(process.env.WYVERN_MILK)
            .setDescription([
            `**Food Level**: ${functions_1.default.HighLight(food_level.toString())}`,
            'Feed again in: ' + functions_1.default.Calculate(consumption_rate),
        ].join('\n'));
        return response;
    },
    SERVER_EMBED: (client, data) => {
        const status = data.status.includes('offline')
            ? `${functions_1.default.FindEmoji(client, 'redCheckBox')} ${data.status}`
            : data.status.includes('online')
                ? `${functions_1.default.FindEmoji(client, 'greenCheckBox')} ${data.status}`
                : '';
        const country = data.country;
        const response = (0, format_1.embed)()
            .setColor('#ffffb3')
            .setDescription(`
        **› Name:** ${data.name}
        **› ID:** ${data.id}
        **› Status:** ${status}
        **› Player Count:** ${data.players} / ${data.maxPlayers}
        **› In-game Days:** ${data.details.time}`)
            .setFooter({
            text: 'Powered by the Battlemetrics API',
            iconURL: env_config_1.clientConfig.BATTLEMETRICS,
        })
            .addFields({
            name: 'Additional Details',
            value: `
            Map: ${data.details.map}
            Official: ${data.details.official}
            PVE: ${data.details.pve}
            Crossplay: ${data.details.crossplay}`,
            inline: true,
        }, {
            name: '\u200B',
            value: `
            Country: :flag_${country.toLowerCase()}:
            Game Port: \`${data.ip}:${data.port}\`
            Query Port: \`${data.ip}:${data.portQuery}\`
            Location: ${data.location}`,
            inline: true,
        });
        return response;
    },
    STATS_EMBED: (client, duration, version) => {
        const response = (0, format_1.embed)()
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
            .setFooter({ text: 'Developed by: Alchemy#1990' });
        return response;
    },
    ROLE_MENU_EMBED: (guild) => {
        const response = (0, format_1.embed)()
            .setTitle(`${guild.name}'s Role Menu`)
            .setDescription(['Select all roles you wish to assign to yourself.'].join('\n'));
        return response;
    },
    ADD_ROLE_EMBED: (client, member, role) => {
        const response = (0, format_1.embed)()
            .setColor('#B3FFB3')
            .setDescription([
            `${functions_1.default.FindEmoji(client, 'greenCheckBox')}`,
            `${role} has been added to ${member}.`,
        ].join(' '))
            .setFooter({
            text: [
                '“You should be proud, the whole point of this',
                'simulation is to identify the very best survivors.”',
            ].join(' '),
        });
        return response;
    },
    REMOVE_ROLE_EMBED: (client, member, role) => {
        const response = (0, format_1.embed)()
            .setColor('#B3FFB3')
            .setDescription([
            `${functions_1.default.FindEmoji(client, 'greenCheckBox')}`,
            `${role} has been removed from ${member}.`,
        ].join(' '))
            .setFooter({ text: '“He’ll get over it. We all do.”' });
        return response;
    },
    ADD_MUTE_EMBED: (client, member, time) => {
        switch (time) {
            case undefined:
                time = '';
                break;
            default:
                time = `Duration: ${functions_1.default.HighLight(time)}`;
                break;
        }
        const response = (0, format_1.embed)()
            .setColor('#B3FFB3')
            .setDescription([
            `${functions_1.default.FindEmoji(client, 'greenCheckBox')}`,
            `${member} has been muted. ` + time,
        ].join(' '))
            .setFooter({
            text: '“It fascinates me how you survivors find your own solutions to problems.”',
        });
        return response;
    },
    REMOVE_MUTE_EMBED: (client, member) => {
        const response = (0, format_1.embed)()
            .setColor('#B3FFB3')
            .setDescription([
            `${functions_1.default.FindEmoji(client, 'greenCheckBox')}`,
            `${member} has been unmuted.`,
        ].join(' '))
            .setFooter({
            text: '“Did you feel a bit disjointed when you woke up in the simulation? That’s normal.”',
        });
        return response;
    },
    STICKYNOTE_EMBED: (guild, data) => {
        const data_contains_channel = data.find((option) => option.channel)
            ? true
            : false;
        if (data_contains_channel) {
            data.splice(0, 1);
        }
        const response = (0, format_1.embed)();
        let embedColor = data[0] !== undefined ? data[0].value : null;
        const embedTitle = data[1] !== undefined ? data[1].value : null;
        let embedDescription = data[2] !== undefined ? data[2].value : null;
        const embedImage = data[3] !== undefined ? data[3].value : null;
        const embedFooter = data[4] !== undefined ? data[4].value : '';
        if (embedColor !== null) {
            if (embedColor.startsWith('<@&')) {
                const role = guild.roles.cache.get(embedColor.replace(/(\D+)/gm, ''));
                embedColor = role?.color;
            }
        }
        const newLineRegex = /\$nl/gm;
        if (newLineRegex.test(embedDescription)) {
            const formatDescription = embedDescription.replace(/(\$nl\s)/gm, '\n');
            embedDescription = formatDescription;
        }
        response
            .setTitle(embedTitle)
            .setColor(embedColor)
            .setDescription(embedDescription)
            .setImage(embedImage)
            .setFooter({ text: embedFooter });
        return response;
    },
};
exports.default = EmbedEnum;
