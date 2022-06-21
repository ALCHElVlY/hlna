// External imports
import { CommandInteraction } from 'discord.js';

// Internal imports
import { DiscordClient, Permissions, Event } from '../structures';
import { embed } from '../utils/format';
import ClientFunctions from '../utils/functions';

export default class InteractionCreateEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'interactionCreate');
  }

  public async run(interaction: CommandInteraction): Promise<void> {
    const permissions = new Permissions(this.client);

    // Handle if the interaction is a command
    if (interaction.isCommand()) {
      const command = this.client.commands.get(interaction.commandName);
      if (!command) return;

      // Get the users permission level
      const level = permissions.FromContext(interaction);
      const requiredLevel = permissions.FromName(command.info.permissions[0]);
      if (level < requiredLevel) {
        const response = embed()
          .setColor('#ff8b8b')
          .setDescription(
            [
              `${ClientFunctions.FindEmoji(this.client, 'redCheckBox')} `,
              `You do not have permission to use this command.`,
              `Your permission level is ${level} (${permissions.list[level].name})`,
              `This command requires a permission level of ${requiredLevel} (${command.info.permissions[0]})`,
            ].join('\n'),
          );

        return interaction.reply({
          embeds: [response],
          ephemeral: true,
        });
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  }
}
