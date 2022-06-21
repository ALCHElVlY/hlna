// External imports
import {
  codeBlock,
  hyperlink,
  roleMention,
  SlashCommandBuilder,
} from '@discordjs/builders';
import { CommandInteraction, TextChannel } from 'discord.js';

// Internal imports
import { DiscordClient, SlashCommand } from '../../structures';
import ClientFunctions from '../../utils/functions';
import { clientConfig } from '../../../interfaces/env_config';
import { button, embed, prettyPrint, row } from '../../../client/utils/format';

export default class SettingsCommand extends SlashCommand {
  constructor(client: DiscordClient) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription(
          "View, edit, or restore HLN-A's settings for this Discord.",
        )
        .setDefaultMemberPermissions(null) as SlashCommandBuilder,
      category: 'Configuration',
      permissions: ['Server Owner'],
    });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const settings = this.client.settings.get(interaction.guild?.id);
    const GitHubRepo = hyperlink('GitHub Repo', clientConfig.GITHUB_REPO);
    const devDiscord = hyperlink('Dev Discord', clientConfig.DEV_DISCORD);

    // Build default embed elements
    const response = embed()
      .setTitle('Configuration')
      .setDescription(
        [
          `Welcome ${interaction.user} to your guild settings!`,
          `${GitHubRepo} • ${devDiscord}`,
        ].join('\n'),
      );

    // Set the features display
    response.addField(
      'Features',
      (() => {
        let general_settings = '';
        Object.entries(settings.features).forEach(([key, value]) => {
          // Check if the role settings are empty
          if (value !== false) {
            general_settings += prettyPrint(
              `${key}: ${ClientFunctions.FindEmoji(
                this.client,
                'greenCheckBox',
              )} ${ClientFunctions.HighLight('enabled')},`,
            );
          } else {
            // If the role settings have not be set, display null
            general_settings += prettyPrint(
              `${key}: ${ClientFunctions.FindEmoji(
                this.client,
                'redCheckBox',
              )} ${ClientFunctions.HighLight('disabled')},`,
            );
          }
        });
        return general_settings.split(',').join('\n');
      })(),
      true,
    );

    // Add a blank space between the feature settings and roles
    response.addField('\u200b', '\u200b', true);

    // Set the role settings display
    response.addField(
      'Roles',
      (() => {
        let role_settings = '';
        Object.entries(settings.roles)
          .filter(([key]) => key.includes('role'))
          .forEach(([key, value]) => {
            // Check if the role settings are empty
            if (key.includes('role') && value !== null) {
              role_settings += prettyPrint(
                `${key}: ${roleMention(value as string)},`,
              );
            } else {
              // If the role settings have not be set, display null
              role_settings += prettyPrint(
                `${key}: ${ClientFunctions.HighLight(value as string)},`,
              );
            }
          });
        return role_settings.split(',').join('\n');
      })(),
      true,
    );

    // Add a blank space between the role settings and log channels
    // embed.addField('\u200b', '\u200b', false);

    // Set the log channel settings display
    response.addField(
      'Log Channels',
      (() => {
        let log_channels = '';

        // Handle if the logs channel array is empty
        if (settings.log_channels.length > 0) {
          settings.log_channels.forEach((channel: any) => {
            log_channels += prettyPrint(
              `<#${channel.channel_id}>: ${
                channel.channel_id
              } • ${channel.log_type.toUpperCase()},`,
            );
          });
        } else {
          log_channels += ClientFunctions.HighLight('None');
        }

        return log_channels.split(',').join('\n');
      })(),
      false,
    );

    // Build the embed message components
    const responseRow = row().addComponents(
      // The edit button
      button()
        .setCustomId('settings:_edit')
        .setLabel('Edit')
        .setStyle('SECONDARY')
        .setEmoji(':edit:911734573036109895'),
      // The restore button
      button()
        .setCustomId('settings:_restore')
        .setLabel('Restore')
        .setStyle('SECONDARY')
        .setEmoji(':restore:911737337510252574'),
    );

    try {
      // Send the ineraction response
      await interaction
        .reply({
          embeds: [response],
          components: [responseRow],
        })
        .then(() => {
          // Create a button interaction collector
          // remove the components from the message after 3 minutes
          // if the user does not respond
          const channel = interaction.channel as TextChannel;
          const collector = channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            // filter,
            time: 180000,
          });

          // Handle the collector
          collector.on('end', async () => {
            try {
              // If the collector has ended, remove the message components
              await interaction.editReply({
                embeds: [response],
                components: [],
              });
            } catch (e: any) {
              if (e.message === 'Unknown Message') return;
              console.log(e);
            }
          });
        });
    } catch (e: any) {
      await interaction.reply({
        content: [
          ClientFunctions.FindEmoji(this.client, 'error'),
          'An error occurred while trying to send the settings.',
          `${codeBlock('js', e.message)}`,
        ].join(' '),
        ephemeral: true,
      });
    }
  }
}
