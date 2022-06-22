// External imports
import {
  CommandInteraction,
  GuildMember,
  Message,
  Role,
} from "discord.js";

// Internal imports
import {
  DiscordClient,
  Event,
  Permissions,
  GuildSettings,
  RoleMenu,
} from "../structures";
import { embed } from "../utils/format";
import ClientFunctions from "../utils/functions";

export default class InteractionCreateEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, "interactionCreate");
  }

  public async run(interaction: CommandInteraction): Promise<void> {
    const permissions = new Permissions();
    const guildsettings = new GuildSettings(this.client);
    const rolemenu = new RoleMenu(this.client);

    // Handle if the interaction is a CommandInteraction
    if (interaction.isCommand()) {
      const command = this.client.commands.get(interaction.commandName);
      if (!command) return;

      // Get the users permission level
      const level = permissions.FromContext(interaction);
      const requiredLevel = permissions.FromName(command.info.permissions[0]);
      if (level < requiredLevel) {
        const response = embed()
          .setColor("#ff8b8b")
          .setDescription(
            [
              `${ClientFunctions.FindEmoji(this.client, "redCheckBox")} `,
              `You do not have permission to use this command.`,
              `Your permission level is ${level} (${permissions.list[level].name})`,
              `This command requires a permission level of ${requiredLevel} (${command.info.permissions[0]})`,
            ].join("\n")
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
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }

    // Handle if the interaction is a MessageButton
    if (interaction.isButton()) {
      const { customId } = interaction;
      const message = interaction.message as Message;
      const guild = await interaction.guild?.fetch();
      const guildOwner = guild?.ownerId;

      // Handle the button interactions
      switch (customId) {
        case "settings:_edit":
          // If the user interacting is not the guild owner, ignore
          if (interaction.user.id !== guildOwner) return;

          // Clear the message components
          (async () => {
            try {
              await message.edit({
                embeds: [...interaction.message.embeds],
                components: [],
              });
            } catch (e) {
              console.log(e);
            }
          })();

          // Handle editing the guild settings
          await guildsettings.Edit(interaction);
          break;
        case "settings:_restore":
          // If the user interacting is not the guild owner, ignore
          if (interaction.user.id !== guildOwner) return;

          // Clear the message components
          (async () => {
            await message.edit({
              embeds: [...interaction.message.embeds],
              components: [],
            });
          })();

          // Handle restoring the guild settings
          await guildsettings.Restore(interaction);
          break;
        default:
          break;
      }
    }

    // Handle if the interaction is a SelectMenu
    if (interaction.isSelectMenu()) {
      const { customId, values } = interaction;
      const message = interaction?.message as Message;
      const member = interaction?.member as GuildMember;
      const guild = await interaction.guild?.fetch();
      const roles: Array<Role> = [];
      const currentSelection = values.filter((option) => {
        return !values.includes(option);
      });

      // Loop through the selected menu values and push them to the roles array
      for (const role of currentSelection) {
        const guildRole = guild?.roles.cache.find((r) => r.name === role);
        if (guildRole) roles.push(guildRole);
      }

      switch (customId) {
        case "role-menu":
          // Handle the role menu
          await rolemenu.AddRole(member, roles);
          await interaction
            .update({
              components: [...message.components],
            })
            .then(async () => {
              await interaction.followUp({
                content: "Your roles have been updated!",
                ephemeral: true,
              });
            });
          break;
        default:
          break;
      }
    }
  }
}
