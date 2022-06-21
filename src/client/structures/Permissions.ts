// External imports
import { CommandInteraction, Guild, User } from 'discord.js';

// Internal imports
import DiscordClient from './DiscordClient';
import { IPermissionsArray } from '../utils/interfaces';

export default class Permissions {
  readonly client: DiscordClient;
  readonly _reg: RegExp = new RegExp(/\d+/);
  private _levels: { [key: string]: number } = {};
  private _perms: Array<IPermissionsArray>;
  private _reversedPerms: Array<IPermissionsArray> = [];
  private _list: Array<IPermissionsArray> = [];

  constructor(client: DiscordClient) {
    this.client = client;
    this._perms = [
      { name: 'USER', check: () => true },
      {
        name: 'MODERATOR',
        check: (context: any) => {
          const guild = context.guild as Guild;
          const settings = client.settings.get(guild.id);
          const id = this.reg.exec(settings.roles['mod_role']);
          if (!guild || !id) return false;
          const role = guild.roles.cache.some((r) => r.id === id[0]);
          if (role) return true;
          return false;
        },
      },
      {
        name: 'ADMINISTRATOR',
        check: (context: any) => {
          const guild = context.guild as Guild;
          const settings = client.settings.get(guild.id);
          const id = this.reg.exec(settings.roles['admin_role']);
          if (!guild || !id) return false;
          const role = guild.roles.cache.some((r) => r.id === id[0]);
          if (role) return true;
          return false;
        },
      },
      {
        name: 'Server Owner',
        check: (context: any) => {
          const guild = context.guild as Guild;
          const user = context.user as User;
          if (!guild) return false;
          const serverOwner = guild.ownerId;
          if (user.id === serverOwner) return true;
          return false;
        },
      },
      {
        name: 'Bot Developer',
        check: (context: any) => {
          const guild = context.guild as Guild;
          const settings = client.settings.get(guild.id);
          const id = this.reg.exec(settings.roles['dev_role']);
          if (!guild || !id) return false;
          const role = guild.roles.cache.find((r) => r.id === id[0]);
          if (role) return true;
          return false;
        },
      },
    ];
    this.init();
  }

  // Setters
  private set levels(args: any | undefined) {
    this._perms.forEach((p, i) => this._levels[p.name] = i);
  }
  private set reversedPerms(args: Array<IPermissionsArray>) {
    this._reversedPerms = args;
  }
  public set list(args: any | undefined) {
    this._list = args;
  }

  // Getters
  private get reg() {
    return this._reg;
  }
  private get levels() {
    return this._levels;
  }
  private get reversedPerms(): Array<IPermissionsArray> {
    return this._reversedPerms;
  }
  public get list(): Array<IPermissionsArray> {
    return this._list;
  }

  private init(): void {
    this.levels;
    this._reversedPerms = this._perms.slice().reverse()
    this._list = this._perms;
  }
  public FromName(name: string): number {
    return name ? this.levels[name] : -1;
  }
  public FromContext(interaction: CommandInteraction): number {
    const reversedPerms = this.reversedPerms;
    const index = reversedPerms.findIndex((p) => p.check(interaction));
    const adjusted = index < 0 ? 0 : reversedPerms.length - index - 1;
    return adjusted;
  }
}
