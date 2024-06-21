export const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
    }
    return value;
};
export const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message({ custom: 'password must be at least 8 characters' });
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message({ custom: 'password must contain at least 1 letter and 1 number' });
    }
    return value;
};
export const username = (value, helpers) => {
    if (value.length < 6) {
        return helpers.message({ custom: 'Username must be at least 6 characters' }); // Minimum email over the internet is at least 6 characters. Ex: a@b.cd
    }
    // Add username validation if the username is not an email address
    // if (!value.match(/^[a-zA-Z0-9_.@-]*$/)) {
    //   return helpers.message({ custom: 'Username can be alphanumeric or one of _.@- characters' })
    // }
    return value;
};
//# sourceMappingURL=custom.validation.js.map