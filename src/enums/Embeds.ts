// External imports
import { channelMention, userMention } from '@discordjs/builders';
import { Guild, GuildBan, GuildMember, MessageEmbed, Role } from 'discord.js';

// Internal imports
import { DiscordClient } from '../client/structures';
import ClientFunctions from '../client/utils/functions';
import { clientConfig } from '../interfaces/env_config';
import { embed } from '../client/utils/format';

const EmbedEnum = {
  MEMBER_JOIN_EMBED: (member: GuildMember): MessageEmbed => {
    const createdDate = Date.now() - member.user.createdTimestamp;
    const response = embed()
      .setColor('#63CBEB')
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      })
      .setDescription(
        `
        **Scanning Specimen**: ${userMention(member.user.id)}
        **Survivor ID**: ${member.user.id}
        **Implant Created**: ${ClientFunctions.CalculateAccountAge(createdDate)}
              
        \`\`Ready when you are survivor.\`\``,
      )
      .setThumbnail(clientConfig.WELCOME_IMAGE);

    // Return the embed
    return response;
  },
  MEMBER_LEAVE_EMBED: (member: GuildMember): MessageEmbed => {
    const response = embed()
      .setColor('#2F3136')
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      })
      .setDescription(
        `
        **Scanned Specimen**: ${member}
        **Survivor ID**: ${member.user.id}
        **Implant Created**: [Out of range]
  
        \`\`Cheers mate, catch you later.\`\``,
      )
      .setThumbnail('https://imgur.com/6axfSUV.gif');

    // Return the embed
    return response;
  },
  MEMBER_BAN_ENBED: (member: GuildMember, reason?: string): MessageEmbed => {
    console.log({
      Member: member,
      Ban_Reason: reason,
    });
    const response = embed()
      .setTitle('Member Banned')
      .setDescription(
        [`**Member**: ${member}`, `**Reason**: \`${reason}\``].join('\n'),
      )
      .setTimestamp();

    // Return the embed
    return response;
  },
  MEMBER_ROLE_ADD: (member: GuildMember, role: Role): MessageEmbed => {
    const response = embed()
      .setColor('#63CBEB')
      .setAuthor({
        name: 'Role Added',
        iconURL: clientConfig.ROLE_ADDED,
      })
      .setDescription(`${member} gained the role ${role}`)
      .setTimestamp();

    // Return the embed
    return response;
  },
  MEMBER_ROLE_REMOVE: (member: GuildMember, role: Role): MessageEmbed => {
    const response = embed()
      .setColor('#63CBEB')
      .setAuthor({
        name: 'Role Removed',
        iconURL: clientConfig.ROLE_REMOVED,
      })
      .setDescription(`${member} lost the role ${role}`)
      .setTimestamp();

    // Return the embed
    return response;
  },
  MESSAGE_BULK_DELETE_EMBED: (data: any): MessageEmbed => {
    const response = embed()
      .setColor('#63CBEB')
      .setTitle('Message Bulk Delete')
      .setDescription(
        [
          `**Amount**: ${data[2]}`,
          `**Deleted by**: ${data[0].tag}`,
          `**Deleted from**: ${channelMention(data[1])}`,
        ].join('\n'),
      )
      .setTimestamp();

    // Return the embed
    return response;
  },
  ERROR_EMBED: (client: DiscordClient, error: any): MessageEmbed => {
    const errorEmoji = ClientFunctions.FindEmoji(client, 'redX');
    const response = embed()
      .setColor('#ff8b8b')
      .setTitle(errorEmoji + ' Error')
      .setDescription(error)
      .setTimestamp();

    // return the embed
    return response;
  },
  SUCCESS_EMBED: (client: DiscordClient, message: string): MessageEmbed => {
    const successEmoji = ClientFunctions.FindEmoji(client, 'greenCheck');
    const response = embed()
      .setColor('#8aff8b')
      .setTitle(successEmoji + ' Success')
      .setDescription(message)
      .setTimestamp();

    // Return the embed
    return response;
  },
  KICK_DM_EMBED: (guild: Guild, reason: string): MessageEmbed => {
    const response = embed()
      .setColor('#FF8080')
      .setTitle('Hello, you have been kicked from')
      .setDescription(
        [`Guild: **${guild.name}**`, `Reason: \`${reason}\``].join('\n'),
      )
      .setTimestamp()
      .setFooter({ text: 'goodbye!' });

    // Return the embed
    return response;
  },
  BAN_DM_EMBED: (guild: Guild, reason: string): MessageEmbed => {
    const response = embed()
      .setColor('#FF8080')
      .setTitle('Hello, you have been banned from')
      .setDescription(
        [`Guild: **${guild.name}**`, `Reason: \`${reason}\``].join('\n'),
      )
      .setTimestamp()
      .setFooter({ text: 'goodbye!' });

    // Return the embed
    return response;
  },
  BAN_LIST_EMBED: (guild: Guild, bans: Array<any>): MessageEmbed => {
    const response = embed()
      .setTitle(`${guild.name} ban list`)
      .setDescription(
        bans
          .map((ban: GuildBan) => {
            const reason = ban.reason ?? 'No reason provided';
            return `${userMention(ban.user.id)} - ${ClientFunctions.HighLight(reason)}`;
          })
          .join('\n'),
      );

    // Return the embed
    return response;
  },
  CRAFT_EMBED: (
    client: DiscordClient,
    itemData: any,
    amount: number,
  ): MessageEmbed => {
    // Get the experience from the itemData
    const experience =
      itemData.experienced_gained === null ? 0 : itemData.experienced_gained;
    // Get the level from the itemData
    const level = itemData.req_level ? itemData.req_level : 'None';
    // Get the ingredients from the itemData
    const ingredients = itemData.ingredient_list
      ? itemData.ingredient_list
      : 'None';
    // Get the total ingredients from the itemData
    const total_ingredients: string = ingredients.replace(
      /(\d+)/gm,
      (m: string) => {
        const parsedIngredientQty = parseInt(m);
        return (parsedIngredientQty * amount).toLocaleString();
      },
    );
    // Get the total experience from the itemData
    const total_exp: string =
      experience && experience > 0
        ? (experience * amount).toLocaleString()
        : 'None';

    // Build the embed
    const response = embed()
      .setColor('#ffffb3')
      .setAuthor({
        name: `${client.user?.username} | Craft Calculator`,
        iconURL: client.user?.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      })
      .setDescription(
        [
          `**Crafting**: ${ClientFunctions.HighLight(itemData.name)}\n` +
            `**Amount**: ${ClientFunctions.HighLight(amount.toString())}`,
        ].join('\n'),
      )
      .setThumbnail(itemData.image_url)

      .addFields(
        {
          name: 'Crafting Ingredients',
          value: `${total_ingredients}`
            .replace(/(x\d+,\d+|x\d+)/gm, (d) => {
              return ClientFunctions.HighLight(d);
            })
            .replace(/(,\B)/gm, '\n'),
          inline: true,
        },
        {
          name: 'Additional Info',
          value: `Required level: ${level}\nExperience points gained: ${total_exp}`,
          inline: false,
        },
      );

    // Return the embed
    return response;
  },
  CLONE_EMBED: (
    client: DiscordClient,
    creatureName: string,
    level: number,
    clone_cost: number,
    clone_time: number,
    mature_rate: number,
  ): MessageEmbed => {
    const response = embed()
      .setColor('#ffffb3')
      .setAuthor({
        name: `${client.user?.username} | Clone Calculator`,
        iconURL: client.user?.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      })
      .setDescription(
        '**Creature**: ' +
          `${ClientFunctions.HighLight(ClientFunctions.ToProperCase(creatureName))}` +
          '\n' +
          '**Level**: ' +
          `${ClientFunctions.HighLight(level.toString())}`,
      )
      .setThumbnail(clientConfig.CLONING_CHAMBER)
      .setFooter({ text: `Baby Mature Speed Multiplier: ${mature_rate}` })

      .addFields(
        {
          name: 'Total Shard Cost',
          value: `${ClientFunctions.FindEmoji(
            client,
            'element_shard',
          )} ${clone_cost.toLocaleString()}`,
          inline: false,
        },
        {
          name: 'Total Time',
          value: `${ClientFunctions.FindEmoji(
            client,
            'stopwatch1',
          )} ${ClientFunctions.Calculate(clone_time)}`,
          inline: false,
        },
      );

    // Return the embed
    return response;
  },
  GENERATOR_EMBED: (
    client: DiscordClient,
    fuel_amount: number,
    consumption_rate: number,
  ): MessageEmbed => {
    const response = embed()
      .setColor('#ffffb3')
      .setAuthor({
        name: `${client.user?.username} | Generator Calculator`,
        iconURL: client.user?.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      })
      .setThumbnail(clientConfig.GASOLINE)
      .setDescription(
        [
          `**Fuel Qty**: ${ClientFunctions.HighLight(fuel_amount.toString())}`,
          'Depleted in: ' + ClientFunctions.Calculate(consumption_rate),
        ].join('\n'),
      );

    // Return the embed
    return response;
  },
  TEKGEN_EMBED: (
    client: DiscordClient,
    element: number,
    radius: number,
    consumption_rate: number,
  ): MessageEmbed => {
    const response = embed()
      .setColor('#ffffb3')
      .setAuthor({
        name: `${client.user?.username} | Tek Generator Calculator`,
        iconURL: client.user?.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      })
      .setThumbnail(clientConfig.ELEMENT)
      .setDescription(
        [
          `**Fuel Amount**: ${ClientFunctions.HighLight(element.toString())}`,
          `**Radius**: ${ClientFunctions.HighLight(radius.toString())}`,
          'Depleted in: ' + ClientFunctions.Calculate(consumption_rate),
        ].join('\n'),
      );

    // Return the embed
    return response;
  },
  MILK_EMBED: (
    client: DiscordClient,
    food_level: number,
    consumption_rate: number,
  ): MessageEmbed => {
    const response = embed()
      .setColor('#ffffb3')
      .setAuthor({
        name: `${client.user?.username} | Wyvern Milk Calculator`,
        iconURL: client.user?.displayAvatarURL({
          dynamic: true,
          size: 512,
        }),
      })
      .setThumbnail(process.env.WYVERN_MILK)
      .setDescription(
        [
          `**Food Level**: ${ClientFunctions.HighLight(food_level.toString())}`,
          'Feed again in: ' + ClientFunctions.Calculate(consumption_rate),
        ].join('\n'),
      );

    // Return the embed
    return response;
  },
  SERVER_EMBED: (client: DiscordClient, data: any): MessageEmbed => {
    const status = data.status.includes('offline')
      ? `${ClientFunctions.FindEmoji(client, 'redCheckBox')} ${data.status}`
      : data.status.includes('online')
      ? `${ClientFunctions.FindEmoji(client, 'greenCheckBox')} ${data.status}`
      : '';
    const country = data.country;
    const response = embed()
      .setColor('#ffffb3')
      .setDescription(
        `
        **› Name:** ${data.name}
        **› ID:** ${data.id}
        **› Status:** ${status}
        **› Player Count:** ${data.players} / ${data.maxPlayers}
        **› In-game Days:** ${data.details.time}`,
      )
      .setFooter({
        text: 'Powered by the Battlemetrics API',
        iconURL: clientConfig.BATTLEMETRICS,
      })

      .addFields(
        {
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
            Location: ${data.location}`,
          inline: true,
        },
      );

    // Return the embed
    return response;
  },
  STATS_EMBED: (
    client: DiscordClient,
    duration: string,
    version: string,
  ): MessageEmbed => {
    const response = embed()
      .setTitle('Statistics')
      .addField(
        'Memory Usage',
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
        true,
      )
      .addField('Uptime', duration, true)
      .addField('\u200b', '\u200b', true)
      .addField('Users', client.users.cache.size.toLocaleString(), true)
      .addField('Servers', client.guilds.cache.size.toLocaleString(), true)
      .addField('Channels', client.channels.cache.size.toLocaleString(), true)
      .addField('Running on', `Discord.js v${version}\nNode ${process.version}`)
      .addField(
        'Documentation',
        '[Click to visit](https://github.com/ALCHElVlY/hlna/blob/main/README.md)',
        true,
      )
      .addField('Support Discord', '[Click to visit](#)', true)
      .setFooter({ text: 'Developed by: Alchemy#1990' });

    // Return the embed
    return response;
  },
  ROLE_MENU_EMBED: (guild: Guild): MessageEmbed => {
    const response = embed()
      .setTitle(`${guild.name}'s Role Menu`)
      .setDescription(
        ['Select all roles you wish to assign to yourself.'].join('\n'),
      );

    // Return the embed
    return response;
  },
  ADD_ROLE_EMBED: (
    client: DiscordClient,
    member: GuildMember,
    role: Role,
  ): MessageEmbed => {
    const response = embed()
      .setColor('#B3FFB3')
      .setDescription(
        [
          `${ClientFunctions.FindEmoji(client, 'greenCheckBox')}`,
          `${role} has been added to ${member}.`,
        ].join(' '),
      )
      .setFooter({
        text: [
          '“You should be proud, the whole point of this',
          'simulation is to identify the very best survivors.”',
        ].join(' '),
      });

    // Return the embed
    return response;
  },
  REMOVE_ROLE_EMBED: (
    client: DiscordClient,
    member: GuildMember,
    role: Role,
  ): MessageEmbed => {
    const response = embed()
      .setColor('#B3FFB3')
      .setDescription(
        [
          `${ClientFunctions.FindEmoji(client, 'greenCheckBox')}`,
          `${role} has been removed from ${member}.`,
        ].join(' '),
      )
      .setFooter({ text: '“He’ll get over it. We all do.”' });

    // Return the embed
    return response;
  },
  ADD_MUTE_EMBED: (
    client: DiscordClient,
    member: GuildMember,
    time?: string,
  ): MessageEmbed => {
    switch (time) {
      case undefined:
        time = '';
        break;
      default:
        time = `Duration: ${ClientFunctions.HighLight(time)}`;
        break;
    }

    const response = embed()
      .setColor('#B3FFB3')
      .setDescription(
        [
          `${ClientFunctions.FindEmoji(client, 'greenCheckBox')}`,
          `${member} has been muted. ` + time,
        ].join(' '),
      )
      .setFooter({
        text: '“It fascinates me how you survivors find your own solutions to problems.”',
      });

    // Return the embed
    return response;
  },
  REMOVE_MUTE_EMBED: (
    client: DiscordClient,
    member: GuildMember,
  ): MessageEmbed => {
    const response = embed()
      .setColor('#B3FFB3')
      .setDescription(
        [
          `${ClientFunctions.FindEmoji(client, 'greenCheckBox')}`,
          `${member} has been unmuted.`,
        ].join(' '),
      )
      .setFooter({
        text: '“Did you feel a bit disjointed when you woke up in the simulation? That’s normal.”',
      });

    // Return the embed
    return response;
  },
  STICKYNOTE_EMBED: (guild: Guild, data: any): MessageEmbed => {
    // If a channel was passed, remove it from the data
    // array (otherwise this messes up the embed data)
    const data_contains_channel = data.find((option: any) => option.channel)
      ? true
      : false;
    if (data_contains_channel) {
      data.splice(0, 1);
    }

    const response = embed();
    let embedColor = data[0] !== undefined ? data[0].value : null;
    const embedTitle = data[1] !== undefined ? data[1].value : null;
    let embedDescription = data[2] !== undefined ? data[2].value : null;
    const embedImage = data[3] !== undefined ? data[3].value : null;
    const embedFooter = data[4] !== undefined ? data[4].value : '';

    // Check if the embed color is a hex color
    // or if it is a role mention, get the role color
    if (embedColor !== null) {
      if (embedColor.startsWith('<@&')) {
        const role = guild.roles.cache.get(embedColor.replace(/(\D+)/gm, ''));
        embedColor = role?.color;
      }
    }

    // If the embed decription contains , $nl replace it with a new line
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

    // Return the embed
    return response;
  },
};
export default EmbedEnum;
