// Internal imports
const client = require('../index');

const reg = new RegExp(/\d+/);

// Permissions
const permissions = [
  // Discord User *default role*
  {
    name: 'User',
    check: () => true,
  },
  // Server Moderator
  {
    name: 'Moderator',
    check: (context) => {
      const settings = client.settings.get(context.guild.id);
      // Check if the user running the command has the moderator role
      if (context.guild) {
        const id = reg.exec(settings.roles['mod_role']);
        if (!id) return false;
        const role = context.guild.roles.cache.find((r) => r.id === id[0]);
        return role && context.member.roles.cache.has(role.id);
      }
      return false;
    },
  },
  // Server Administrator
  {
    name: 'Administrator',
    check: (context) => {
      const settings = client.settings.get(context.guild.id);
      // Check if the user running the command has the admin role
      if (context.guild) {
        const id = reg.exec(settings.roles['admin_role']);
        if (!id) return false;
        const role = context.guild.roles.cache.find((r) => r.id === id[0]);
        return role && context.member.roles.cache.has(role.id);
      }
      return false;
    },
  },
  // Server Owner
  {
    name: 'Server Owner',
    check: (context) => {
      // Check if the user running the command is the server owner
      if (context.guild) {
        const serverOwner = context.guild.ownerId;
        if (context.user.id === serverOwner) return true;
      }
      return false;
    },
  },
  // Bot Developer
  {
    name: 'Bot Developer',
    check: (context) => {
      const settings = client.settings.get(context.guild.id);
      // Check if the user running the command has the developer role
      if (context.guild) {
        const id = reg.exec(settings.roles['dev_role']);
        if (!id) return false;
        const role = context.guild.roles.cache.find((r) => r.id === id[0]);
        return role && context.member.roles.cache.has(role.id);
      }
      return false;
    },
  },
];

const reversed = permissions.slice().reverse();
const permLevels = {};
permissions.forEach((p, idx) => (permLevels[p.name] = idx));

module.exports = {
  fromName: (name) => (name ? permLevels[name] : -1),
  fromContext: (context) => {
    const index = reversed.findIndex((p) => p.check(context));
    const adjusted = index < 0 ? 0 : reversed.length - index - 1;
    return adjusted;
  },
  list: permissions,
};
