// External imports
import { CommandInteraction, GuildChannel } from 'discord.js';
import { codeBlock } from '@discordjs/builders';

// Internal imports
import { AxiosPrivate, DiscordClient } from '../client/structures';
import { EmbedEnum } from '../enums';
import ClientFunctions from '../client/utils/functions';
import { clientConfig } from '../interfaces/env_config';

export const AddLog = async (
  client: DiscordClient,
  interaction: CommandInteraction,
) => {
  const settings = client.settings.get(interaction.guild?.id)?.log_channels;
  const channelIDRegex = new RegExp(/(\d+)/gm);
  const { guild } = interaction;
  const logTypes: string[] = [
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
  const response: any = await ClientFunctions.AwaitReply(
    interaction,
    [
      'Enter a channel and the log type you would like to add',
      `Acceptable log types are: [${logTypes.join(', ')}]`,
    ].join('\n'),
  );

  if (!response) return;
  const content = response.content.split(' ');
  const channelID = content[0].match(channelIDRegex)[0];
  const channel = client.channels.cache.get(channelID) as GuildChannel;
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
  const formattedLogTypes = logTypes.join(',').replace(/(`)/gm, '').split(',');
  if (!formattedLogTypes.includes(content[1].toUpperCase())) {
    return await interaction.channel?.send({
      embeds: [
        EmbedEnum.ERROR_EMBED(
          client,
          `${logChData.value.log_type} is not a valid log type!`,
        ),
      ],
    });
  }

  // Check if the channel already exist in the settings
  const channelExists: boolean = settings.find(
    (ch: any) => ch.channel_id === channelID,
  );
  // Check if the log type already exists in the settings
  const logTypeExists: boolean = settings.find(
    (ch: any) => ch.log_type === content[1],
  );

  // Determine the existence of the channel and log type
  if (!channelExists && !logTypeExists) {
    // Send an API request to update the database
    await AxiosPrivate.put(`${clientConfig.CONFIGURATION}/${guild?.id}`, {
      key: logChData.key,
      value: logChData.value,
    });

    // Update the key in the guild settings
    await settings.push(logChData.value);

    // send a success message
    return await interaction.channel?.send({
      embeds: [
        EmbedEnum.SUCCESS_EMBED(
          client,
          `Added ${logChData.value.channel_name} to your log channel settings!`,
        ),
      ],
    });
  } else if (!channelExists && logTypeExists) {
    return interaction.channel?.send({
      embeds: [EmbedEnum.ERROR_EMBED(client, 'Log type already exsits!')],
    });
  } else if (channelExists && !logTypeExists) {
    // Send an API request to update the database
    await AxiosPrivate.put(`${clientConfig.CONFIGURATION}/${guild?.id}`, {
      key: logChData.key,
      value: logChData.value,
    });

    // Update the key in the guild settings
    await settings.push(logChData.value);

    // send a success message
    return await interaction.channel?.send({
      embeds: [
        EmbedEnum.SUCCESS_EMBED(
          client,
          `Added ${logChData.value.channel_name} to your log channel settings!`,
        ),
      ],
    });
  } else {
    return interaction.channel?.send({
      embeds: [
        EmbedEnum.ERROR_EMBED(client, 'Log type & channel already exsits!'),
      ],
    });
  }
};
export const RemoveLog = async (
  client: DiscordClient,
  interaction: CommandInteraction,
) => {
  // The settings for this guild
  const settings = client.settings.get(interaction.guild?.id).log_channels;
  const guild = interaction.guild;
  const logs = settings.map(
    (log: any) => `${log.channel_name} - ${log.log_type}`,
  );

  // Handle if there are no log channels to remove
  if (settings.length === 0) {
    return interaction.channel?.send({
      embeds: [
        EmbedEnum.ERROR_EMBED(client, 'There are no log channels to remove!'),
      ],
    });
  }

  // Await for the user response
  const response = await ClientFunctions.AwaitReply(
    interaction,
    [
      'Enter a channel and the log type you would like to remove',
      `${codeBlock(logs.join('\n'))}`,
    ].join('\n'),
  );

  if (response) {
    const content = response.content.split(' - ');
    const channel = client.channels.cache.find(
      (ch: any) => ch.name === content[0],
    ) as GuildChannel;
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
      await AxiosPrivate.put(`${clientConfig.CONFIGURATION}/${guild?.id}`, {
        key: logChData.key,
        value: logChData.value,
      });

      // Remove the log channel from the settings
      await settings.splice(settings.indexOf(logChData.value), 1);

      // send a success message
      return await interaction.channel?.send({
        embeds: [
          EmbedEnum.SUCCESS_EMBED(
            client,
            `Removed ${logChData.value.channel_name} from your log channel settings!`,
          ),
        ],
      });
    } catch (e) {
      console.log(e);
    }
  }
};
const GuildSettingsEnum = {
  Roles: async (
    client: DiscordClient,
    interaction: CommandInteraction,
    response: any,
  ) => {},
  Logs: async (
    client: DiscordClient,
    interaction: CommandInteraction,
    response: any,
  ) => {
    // Await for the user response
    response = await ClientFunctions.AwaitReply(
      interaction,
      'Would you like to `add` or `remove` a log channel?',
    );

    if (response) {
      const action = response.content;
      switch (action) {
        case 'add':
          await AddLog(client, interaction);
          break;
        case 'remove':
          await RemoveLog(client, interaction);
          break;
        default:
          throw new Error('Invalid action!');
      }
    }
  },
};
export default GuildSettingsEnum;
