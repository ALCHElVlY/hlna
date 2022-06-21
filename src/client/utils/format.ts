// External imports
import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} from 'discord.js';
import {
  // General formatting
  bold,
  italic,
  strikethrough,
  underscore,
  spoiler,
  quote,
  blockQuote,
  codeBlock,
  inlineCode,
  // Link formatting
  hyperlink,
  hideLinkEmbed,
  // Mention formatting
  userMention,
  channelMention,
  roleMention,
} from '@discordjs/builders';

// Time formatting
export const internal = (i: any) => i.format('HH:mm:ss', { trim: false });

// Centralised scheme for embeds to use in other structures.
export const embed = () => new MessageEmbed().setColor('#9fd1ff');
export const row = () => new MessageActionRow();
export const button = () => new MessageButton().setStyle('PRIMARY');
export const rolemenu = (options: any = []): MessageSelectMenu => {
  const menu = new MessageSelectMenu()
    .setCustomId('role-menu')
    .setPlaceholder('Make a selection...')
    .setMinValues(0)
    .setMaxValues(options.length);

  // Loop through the options and add them to the menu
  for (const option of options) {
    menu.addOptions({
      label: option.role.name,
      description: `Add or remove the ${option.role.name} role`,
      value: option.role.name,
    });
  }

  // Return the menu
  return menu;
};

// Simple human-readable print
export const prettyPrint = (value: any): any => {
  if (value === undefined || value === null) return '`null`';
  if (Array.isArray(value)) return value.join(', ');
  switch (typeof value) {
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'object':
      return JSON.stringify(value, undefined, 2);
    default:
      return value.toString();
  }
};

// Export the builder classes
export const formatOptions = {
  // General formatting
  bold,
  italic,
  strikethrough,
  underscore,
  spoiler,
  quote,
  blockQuote,
  codeBlock,
  inlineCode,
  highlighted: (text: string): string => `\`${text}\``,
  // Link formatting
  hyperlink,
  hideLinkEmbed,
  // Mention formatting
  userMention,
  channelMention,
  roleMention,
};
