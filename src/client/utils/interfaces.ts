import {
  MemberMention,
  RoleMention,
  ChannelMention,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export interface ICommandInfo {
  data: SlashCommandBuilder;
  category: string;
  permissions: string[];
}

export interface ICachedSettings {
  features: {
    shop_management: boolean;
    member_welcome: boolean;
    anti_raid: boolean;
    invite_tracking: boolean;
  },
  roles: {
    admin_role: string;
    dev_role: string;
    mod_role: string;
    verified_role: string;
    mute_role: string;
  },
  ark_shop: {
    order_channel: {
      name: string;
      id: string;
    },
    order_key: {
      emoji: string;
      description: string;
    }[],
    shop_status: string,
    accepted_payments: string[],
    items: {
      name: string;
      price: number;
      id: string;
    }[],
  },
  log_channels: {
    channel_id: string;
    channel_name: string;
  }[]
}

export interface IMessageMentions {
  users: MemberMention | null;
  roles: RoleMention | null;
  channels: ChannelMention | null;
}

export interface IPermissionsArray {
  name: string;
  check: (context: any | undefined) => boolean;
}
