// Internal imports
import DiscordClient from './structures/DiscordClient';
import { clientConfig } from '../interfaces/env_config';

export const client = new DiscordClient(
  // Intents
  [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MEMBERS',
    'GUILD_BANS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_INTEGRATIONS',
    'GUILD_PRESENCES',
  ],
  // Allowed mentions
  {
    parse: ['users', 'roles'],
    repliedUser: true,
  },
  // Partials
  ['CHANNEL', 'MESSAGE', 'REACTION', 'GUILD_MEMBER', 'USER'],
);

// Log the client in
client.Login(clientConfig.BOT_TOKEN);