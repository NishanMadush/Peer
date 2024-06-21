// role-rights, against user
const allRoles = {
    user: [],
    admin: ['getUsers', 'manageUsers'],
};
export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
export const allPermissionDetails = {
    beGetUsers: 'get all the users from backend',
    beGetAdmins: 'get all the admins from backend',
    feShowUsers: 'Show users from front end'
};
export const permissions = Object.keys(allPermissionDetails);
//# sourceMappingURL=roles.js.map