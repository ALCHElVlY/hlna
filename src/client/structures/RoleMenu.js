class RoleMenu {
	// eslint-disable-next-line no-empty-function
	constructor() {}


	/**
     * The addRole method adds a role to the member
     * when they select it from the menu.
     * @param {*} member The member to add the role to
     * @param {*} roles The roles to add to the member
     * @returns
     */
	async addRoles(member, roles = []) {
		if (roles.length <= 0) return;
		// Loop through the roles and add them to the member
		// if they don't already have the roles
		for (const role of roles) {
			if (!member.roles.cache.has(role.id)) {
				await member.roles.add(role);
			}
			else {
				await this.removeRole(member, role);
			}
		}

	}


	/**
     * The removeRole method removes a role from the member
     * when they select it from the menu.
     * @param {*} member The member to remove the role from
     * @param {*} role The role to remove from the member
     * @returns
     */
	async removeRole(member, role) {
		// If the member doesn't have the role, return
		if (!member.roles.cache.has(role.id)) return;
		// Remove the role from the member
		await member.roles.remove(role);
	}
}
module.exports = RoleMenu;