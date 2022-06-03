// Built-in imports
const Discord = require('discord.js'); // JSDoc reference only

// Internal imports
const { SUCCESS_EMBED, ERROR_EMBED } = require('../../Embeds');
const format = require('../../format.js');
const { codeBlock } = format.formatOptions;
const { axiosPrivate } = require('../../Axios');

const channelIDRegex = new RegExp(/(\d+)/gm);

const add_log = async (client, interaction) => {
  // The settings for this guild
  const settings = client.settings.get(interaction.guild.id).log_channels;
  const guild = interaction.guild;
  const log_types = [
    // Membmer related
    '`MEMBER_JOINLEAVE`',
    '`MEMBER_BAN`',
    '`MEMBER_UNBAN`',
    '`MEMBER_KICK`',
    '`MEMBER_MUTE_ADD`',
    '`MEMBER_MUTE_REMOVE`',
    // Role related
    '`ROLE_ADD`',
    '`ROLE_REMOVE`',
    // Message related
    '`MESSAGE_DELETE`',
    '`MESSAGE_BULK_DELETE`',
    '`MESSAGE_UPDATE`',
  ];

  // Await for the user response
  const response = await client.awaitReply(
    interaction,
    [
      'Enter a channel and the log type you would like to add',
      `Acceptable log types are: [${log_types.join(', ')}]`,
    ].join('\n'),
  );
  if (!response) return;
  const content = response.content.split(' ');
  const channelID = content[0].match(channelIDRegex)[0];
  const channel = client.channels.cache.get(channelID);
  const logChData = {
    key: 'log_channels_add',
    value: {
      channel_name: channel.name,
      channel_id: channelID,
      log_type: content[1],
    },
  };

  // Validate the log type
  // Prevent adding a log type that doesn't exist
  const formattedLogTypes = log_types.join(',').replace(/(`)/gm, '').split(',');
  if (!formattedLogTypes.includes(content[1].toUpperCase())) {
    return await interaction.channel.send({
      embeds: [
        ERROR_EMBED(`${logChData.value.log_type} is not a valid log type!`),
      ],
    });
  }

  // Check if the channel already exist in the settings
  const channelExists = settings.find((ch) => ch.channel_id === channelID);
  // Check if the log type already exists in the settings
  const logTypeExists = settings.find((ch) => ch.log_type === content[1]);

  // Determine the existence of the channel and log type
  if (!channelExists && !logTypeExists) {
    // Send an API request to update the database
    await axiosPrivate.put(`${process.env.CONFIGURATION}/${guild.id}`,
      {
        key: logChData.key,
        value: logChData.value,
      });

    // Update the key in the guild settings
    await settings.push(logChData.value);

    // send a success message
    return await interaction.channel.send({
      embeds: [
        SUCCESS_EMBED(
          `Added ${logChData.value.channel_name} to your log channel settings!`,
        ),
      ],
    });
  } else if (!channelExists && logTypeExists) {
    return interaction.channel.send({
      embeds: [ERROR_EMBED('Log type already exsits!')],
    });
  } else if (channelExists && !logTypeExists) {
    // Send an API request to update the database
    await axiosPrivate.put(`${process.env.CONFIGURATION}/${guild.id}`,
      {
        key: logChData.key,
        value: logChData.value,
      });

    // Update the key in the guild settings
    await settings.push(logChData.value);

    // send a success message
    return await interaction.channel.send({
      embeds: [
        SUCCESS_EMBED(
          `Added ${logChData.value.channel_name} to your log channel settings!`,
        ),
      ],
    });
  } else {
    return interaction.channel.send({
      embeds: [ERROR_EMBED('Log type & channel already exsits!')],
    });
  }
};
const remove_log = async (client, interaction) => {
  // The settings for this guild
  const settings = client.settings.get(interaction.guild.id).log_channels;
  const guild = interaction.guild;
  const logs = settings.map((log) => `${log.channel_name} - ${log.log_type}`);

  // Handle if there are no log channels to remove
  if (settings.length === 0) {
    return interaction.channel.send({
      embeds: [ERROR_EMBED('There are no log channels to remove!')],
    });
  }

  // Await for the user response
  const response = await client.awaitReply(
    interaction,
    [
      'Enter a channel and the log type you would like to remove',
      `${codeBlock(logs.join('\n'))}`,
    ].join('\n'),
  );

  if (response) {
    const content = response.content.split(' - ');
    const channel = client.channels.cache.find((ch) => ch.name === content[0]);
    const logChData = {
      key: 'log_channels_remove',
      value: {
        channel_name: channel.name,
        channel_id: channel.id,
        log_type: content[1],
      },
    };

    try {
      // Send an API request to update the database
      await axiosPrivate.put(`${process.env.CONFIGURATION}/${guild.id}`,
        {
          key: logChData.key,
          value: logChData.value,
        });

      // Remove the log channel from the settings
      await settings.splice(settings.indexOf(logChData.value), 1);

      // send a success message
      return await interaction.channel.send({
        embeds: [
          SUCCESS_EMBED(
            `Removed ${logChData.value.channel_name} from your log channel settings!`,
          ),
        ],
      });
    } catch (e) {
      console.log(e);
    }
  }
};

/**
 * The settings_logs function handles adding or removing log channels from the
 * guild settings profile in the database.
 * @param {Discord.Client} client The discord client
 * @param {Discord.Interaction} interaction A discord interaction
 * @param {*} response callback function
 */
const settings_logs = async (client, interaction, response) => {
  // Await for the user response
  response = await client.awaitReply(
    interaction,
    'Would you like to `add` or `remove` a log channel?',
  );

  if (response) {
    const action = response.content;
    switch (action) {
      case 'add':
        await add_log(client, interaction);
        break;
      case 'remove':
        await remove_log(client, interaction);
        break;
      default:
        throw new Error('Invalid action!');
    }
  }
};

module.exports = settings_logs;
