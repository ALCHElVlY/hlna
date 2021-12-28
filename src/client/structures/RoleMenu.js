class RoleMenu {
	// eslint-disable-next-line no-empty-function
	constructor() {}


	/**
     * The addRole method adds a role to the member
     * when they select it from the menu.
     * @param {*} member The member to add the role to
     * @param {*} role The role to add to the member
     * @returns
     */
	async addRole(member, role) {
		// Check if the member has the role, if they do, remove it
		if (member.roles.cache.has(role.id)) {
			await this.removeRole(member, role);
		}
		else {
			// Add the role to the member
			return member.roles.add(role);
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
		// Remove the role from the member
		return member.roles.remove(role);
	}
}
module.exports = RoleMenu;