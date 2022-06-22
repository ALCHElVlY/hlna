// External imports
import {
  CommandInteraction,
  Guild,
  GuildMember,
  User,
} from 'discord.js';

// Internal imports
import { client } from '../bot';
import { IPermissionsArray } from '../utils/interfaces';

export default class Permissions {
  readonly _reg: RegExp = new RegExp(/\d+/);
  private _levels: { [key: string]: number } = {};
  private _perms: Array<IPermissionsArray>;
  private _reversedPerms: Array<IPermissionsArray> = [];
  private _list: Array<IPermissionsArray> = [];

  constructor() {
    this._perms = [
      { name: 'User', check: () => true },
      {
        name: 'Moderator',
        check: (context: any) => {
          const member = context.member as GuildMember;
          const guild = member.guild as Guild;
          const settings = client.settings.get(guild.id);
          const id = this.reg.exec(settings.roles['mod_role']);
          if (!guild || !id) return false;
          const role = guild.roles.cache.find((r) => r.id === id[0]);
          if (role && member.roles.cache.has(role.id)) return true;
          return false;
        },
      },
      {
        name: 'Administrator',
        check: (context: any) => {
          const member = context.member as GuildMember;
          const guild = member.guild as Guild;
          const settings = client.settings.get(guild.id);
          const id = this.reg.exec(settings.roles['admin_role']);
          if (!guild || !id) return false;
          const role = guild.roles.cache.find((r) => r.id === id[0]);
          if (role && member.roles.cache.has(role.id)) return true;
          return false;
        },
      },
      {
        name: 'Server Owner',
        check: (context: any) => {
          const member = context.member as GuildMember;
          const guild = member.guild as Guild;
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
          const member = context.member as GuildMember;
          const guild = member.guild as Guild;
          const settings = client.settings.get(guild.id);
          const id = this.reg.exec(settings.roles['dev_role']);
          if (!guild || !id) return false;
          const role = guild.roles.cache.find((r) => r.id === id[0]);
          if (role && member.roles.cache.has(role.id)) return true;
          return false;
        },
      },
    ];
    this.perms.forEach((p, i) => this.levels[p.name] = i);
    this.init();
  }

  // Setters
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
  private get perms() {
    return this._perms;
  }
  private get reversedPerms(): Array<IPermissionsArray> {
    return this._reversedPerms;
  }
  public get list(): Array<IPermissionsArray> {
    return this._list;
  }

  private init(): void {
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
