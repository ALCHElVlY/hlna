// External imports
import { Invite } from 'discord.js';

// Internal imports
import { DiscordClient, Event } from '../structures';

export default class InviteCreateEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'inviteCreate');
  }

  public async run(invite: Invite): Promise<void> {
    console.log(invite);
  }
}
