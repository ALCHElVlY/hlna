"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Permissions {
    client;
    reg = new RegExp(/\d+/);
    _levels = {};
    _perms;
    _reversedPerms = [];
    _list = [];
    constructor(client) {
        this.client = client;
        this._perms = [
            { name: 'USER', check: () => true },
            {
                name: 'MODERATOR',
                check: (context) => {
                    const guild = context.guild;
                    const settings = client.settings.get(guild.id);
                    const id = this.reg.exec(settings.roles['mod_role']);
                    if (!guild || !id)
                        return false;
                    const role = guild.roles.cache.some((r) => r.id === id[0]);
                    if (role)
                        return true;
                    return false;
                },
            },
            {
                name: 'ADMINISTRATOR',
                check: (context) => {
                    const guild = context.guild;
                    const settings = client.settings.get(guild.id);
                    const id = this.reg.exec(settings.roles['admin_role']);
                    if (!guild || !id)
                        return false;
                    const role = guild.roles.cache.some((r) => r.id === id[0]);
                    if (role)
                        return true;
                    return false;
                },
            },
            {
                name: 'Server Owner',
                check: (context) => {
                    const guild = context.guild;
                    const user = context.user;
                    if (!guild)
                        return false;
                    const serverOwner = guild.ownerId;
                    if (user.id === serverOwner)
                        return true;
                    return false;
                },
            },
            {
                name: 'Bot Developer',
                check: (context) => {
                    const guild = context.guild;
                    const settings = client.settings.get(guild.id);
                    const id = this.reg.exec(settings.roles['dev_role']);
                    if (!guild || !id)
                        return false;
                    const role = guild.roles.cache.find((r) => r.id === id[0]);
                    if (role)
                        return true;
                    return false;
                },
            },
        ];
        this.init();
    }
    set levels(args) {
        this._perms.forEach((p, i) => this._levels[p.name] = i);
    }
    set reversedPerms(args) {
        this._reversedPerms = args;
    }
    set list(args) {
        this._list = args;
    }
    get levels() {
        return this._levels;
    }
    get reversedPerms() {
        return this._reversedPerms;
    }
    get list() {
        return this._list;
    }
    init() {
        this.levels;
        this._reversedPerms = this._perms.slice().reverse();
        this._list = this._perms;
    }
    FromName(name) {
        return name ? this.levels[name] : -1;
    }
    FromContext(interaction) {
        const reversedPerms = this.reversedPerms;
        const index = reversedPerms.findIndex((p) => p.check(interaction));
        const adjusted = index < 0 ? 0 : reversedPerms.length - index - 1;
        return adjusted;
    }
}
exports.default = Permissions;
