// External imports
import { CommandInteraction, Message } from "discord.js";

// Internal imports
import DiscordClient from "./DiscordClient";
import { AxiosPrivate } from "./Axios";
import { EmbedEnum, GuildSettingsEnum } from "../../enums";
import ClientFunctions from "../utils/functions";
import { clientConfig } from "../../interfaces/env_config";
const { SUCCESS_EMBED, ERROR_EMBED } = EmbedEnum;

const defaultSettings = {
  features: {
    shop_management: false,
    member_welcome: false,
    anti_raid: false,
    invite_tracking: false,
  },
  roles: {
    admin_role: null,
    dev_role: null,
    mod_role: null,
    verified_role: null,
    mute_role: null,
  },
  ark_shop: {
    order_channel: {
      name: null,
      id: null,
    },
    order_key: {
      emoji: null,
      description: null,
    },
    shop_status: "closed",
    accepted_payments: [],
    items: [],
  },
  log_channels: [],
};
export default class GuildSettings {
  private client: DiscordClient;
  private _defaults: { [key: string]: any } = {};

  constructor(client: DiscordClient) {
    this.client = client;
    this.defaults = defaultSettings;
  }

  // Setters
  private set defaults(args: any | undefined) {
    this._defaults = args;
  }
  // Getters
  private get defaults(): { [key: string]: any } {
    return this._defaults;
  }

  /**
   * Get the default guild settings.
   */
  public Defaults(): { [key: string]: any } {
    return this.defaults;
  }

  /**
   * Updates the guild settings.
   * @param interaction The command interaction
   */
  public async Edit(interaction: CommandInteraction) {
    // Prompt the user for the setting they want to edit
    interaction.reply({
      content: "Which setting would you like to edit?",
    });

    // Create a filter for the message collector
    const filter = (m: Message): boolean => {
      if (m.author.id === interaction.user.id) return true;
      return false;
    };

    try {
      // Handle the user response
      const response = await interaction.channel?.awaitMessages({
        filter,
        max: 1,
        time: 30000,
        errors: ["time"],
      });
      if (response) {
        const { content }: any = response.first();
        switch (content) {
          case "roles":
            await GuildSettingsEnum.Roles(this.client, interaction, response);
            break;
          case "log channels":
            await GuildSettingsEnum.Logs(this.client, interaction, response);
            break;
          default:
            throw Error(
              "That setting either does not exist or is not editable."
            );
        }
      }
    } catch (e: any) {
      await interaction.channel?.send({
        embeds: [ERROR_EMBED(this.client, e.message)],
      });
    }
  }

  /**
   * Restore the guild settings to their default values.
   * @param interaction The command interaction
   */
  public async Restore(interaction: CommandInteraction) {
    const { guild } = interaction;

    // Prompt the user to confirm restoring the guild settings
    const response = await ClientFunctions.AwaitConfirmation(
      interaction,
      "Are you sure you want to restore the guild settings to their default values?"
    );

    if (response) {
      // Send an API request to update the database
      await AxiosPrivate.put(`${clientConfig.CONFIGURATION}/${guild?.id}`, {
        key: "restore_settings",
        value: this.defaults,
      });

      // Update the guild settings
      this.client.settings.set(guild?.id, this.defaults);

      // Send a confirmation message
      interaction.channel?.send({
        embeds: [
          SUCCESS_EMBED(
            this.client,
            "Guild settings have been restored to their default values."
          ),
        ],
      });
    }
  }
}
