// External imports
import { Invite } from 'discord.js';

// Internal imports
import { DiscordClient, Event } from '../structures';

export default class InviteDeleteEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'inviteDelete');
  }

  public async run(invite: Invite): Promise<void> {
    console.log(invite);
  }
}
